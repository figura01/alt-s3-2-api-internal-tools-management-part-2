const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const source = ts.transpileModule(fs.readFileSync('src/lib/api.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
function setup(fetch) {
  const events = [];
  const context = { exports: {}, process: { env: { NEXT_PUBLIC_API_URL: 'http://api.test' } }, Headers, Event, window: { dispatchEvent: e => events.push(e.type) }, fetch };
  vm.runInNewContext(source, context);
  return { api: context.exports.api, events };
}
const response = (status, body = {}) => ({ status, ok: status >= 200 && status < 300, json: async () => body });
test('concurrent 401s share a refresh and retry once with cookies', async () => {
  const calls = [];
  let ready = false;
  const { api } = setup(async (url, options) => {
    calls.push(url);
    assert.equal(options.credentials, 'include');
    if (url.endsWith('/auth/refresh')) {
      await new Promise(resolve => setTimeout(resolve, 10));
      ready = true;
      return response(201);
    }
    return response(ready ? 200 : 401, { ok: true });
  });
  const result = await Promise.all([api('/tools'), api('/analytics')]);
  assert.equal(result[0].ok, true);
  assert.equal(calls.filter(url => url.endsWith('/auth/refresh')).length, 1);
  assert.equal(calls.length, 5);
});
test('failed refresh ends the session without retry loops', async () => {
  let calls = 0;
  const { api, events } = setup(async () => { calls++; return response(401); });
  await assert.rejects(api('/tools'), e => e.status === 401);
  assert.equal(calls, 2);
  assert.deepEqual(events, ['auth:expired']);
});
test('network/server refresh errors do not log out the user', async () => {
  const { api, events } = setup(async url => response(url.endsWith('/auth/refresh') ? 503 : 401));
  await assert.rejects(api('/tools'), e => e.status === 503);
  assert.deepEqual(events, []);
});
test('auth mutations and forbidden requests never attempt refresh', async () => {
  const calls = [];
  const { api } = setup(async url => { calls.push(url); return response(url.endsWith('/tools') ? 403 : 401); });
  for (const path of ['/auth/login', '/auth/register', '/auth/logout', '/auth/refresh', '/tools']) await assert.rejects(api(path));
  assert.equal(calls.length, 5);
});
test('aborted request is not replayed after shared refresh', async () => {
  const controller = new AbortController();
  let calls = 0;
  const { api } = setup(async url => {
    calls++;
    if (url.endsWith('/auth/refresh')) { controller.abort(); return response(201); }
    return response(401);
  });
  await assert.rejects(api('/tools', { signal: controller.signal }), e => e.name === 'AbortError');
  assert.equal(calls, 2);
});
