// Local integration check: inserts and removes only its own temporary session.
require('dotenv').config({ quiet: true });
const assert = require('node:assert/strict');
const { randomBytes, createHash } = require('node:crypto');
const { PrismaClient } = require('@prisma/client');
const { JwtService } = require('@nestjs/jwt');
const db = new PrismaClient();
const jwt = new JwtService({ secret: process.env.JWT_SECRET });
const base = process.env.SESSION_CHECK_API_URL || `http://localhost:${process.env.PORT || 3000}/api`;
let sessionId;
(async () => {
  try {
    const user = await db.user.findFirst({ where: { status: 'ACTIVE' }, select: { id: true, email: true, role: true } });
    assert.ok(user, 'An active local account is needed');
    const secret = randomBytes(32).toString('base64url');
    const session = await db.authSession.create({ data: { userId: user.id, refreshHash: createHash('sha256').update(secret).digest('hex'), expiresAt: new Date(Date.now() + 60000) } });
    sessionId = session.id;
    const claims = { sub: user.id, sid: session.id, email: user.email, role: user.role };
    const expired = jwt.sign(claims, { expiresIn: -1 });
    const call = (path, cookie, method = 'GET') => fetch(base + path, { method, headers: { Cookie: cookie, 'X-CSRF-Protection': '1' } });
    assert.equal((await call('/auth/me', `techcorp_session=${expired}`)).status, 401);
    const refreshed = await call('/auth/refresh', `techcorp_refresh=${secret}`, 'POST');
    assert.equal(refreshed.status, 201);
    const body = await refreshed.json();
    assert.ok(body.user);
    assert.equal(body.access_token, undefined);
    const accessCookie = refreshed.headers.getSetCookie().find(value => value.startsWith('techcorp_session=')).split(';')[0];
    assert.equal((await call('/auth/me', accessCookie)).status, 200);
    assert.equal((await call('/auth/logout', `${accessCookie}; techcorp_refresh=${secret}`, 'POST')).status, 201);
    assert.ok((await db.authSession.findUnique({ where: { id: sessionId } })).revokedAt);
    assert.equal((await call('/auth/me', accessCookie)).status, 401);
    assert.equal((await call('/auth/refresh', `techcorp_refresh=${secret}`, 'POST')).status, 401);
    console.log('PASS: expired access -> refresh -> authenticated request -> logout -> old access and refresh rejected.');
  } finally {
    if (sessionId) await db.authSession.delete({ where: { id: sessionId } });
    await db.$disconnect();
  }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
