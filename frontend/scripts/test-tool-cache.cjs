const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const { QueryClient } = require('@tanstack/react-query');
const source = ts.transpileModule(fs.readFileSync('src/hooks/use-tools.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
for (const hook of ['useCreateTool', 'useUpdateTool', 'useDeleteTool']) {
  test(`${hook} invalidates catalogue, dashboard and filtered analytics`, async () => {
    const client = new QueryClient();
    const keys = [['tools'], ['tools', 'qa-tool'], ['dashboard', 'admin', true], ['AnalyticsPage'], ['analytics-kpi', 'Engineering']];
    for (const key of keys) client.setQueryData(key, { value: 1 });
    client.setQueryData(['auth', 'me'], { id: 'admin' });
    const module = { exports: {} };
    const dependencies = {
      '@tanstack/react-query': { useQueryClient: () => client, useMutation: options => options },
      sonner: { toast: { success() {}, error() {} } },
      '@/services/tools.service': {},
    };
    new Function('require', 'module', 'exports', source)(name => dependencies[name], module, module.exports);
    const mutation = module.exports[hook]();
    await mutation.onSuccess({}, hook === 'useDeleteTool' ? 'qa-tool' : { id: 'qa-tool' });
    for (const key of keys) assert.equal(client.getQueryState(key).isInvalidated, true, JSON.stringify(key));
    assert.equal(client.getQueryState(['auth', 'me']).isInvalidated, false);
    client.clear();
  });
}
