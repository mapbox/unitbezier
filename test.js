import test from 'node:test';
import assert from 'node:assert/strict';
import unitBezier from './index.js';

const close = (a, b, eps = 1e-6) => Math.abs(a - b) < eps;

test('clamps x outside [0, 1]', () => {
    const ease = unitBezier(0.25, 0.1, 0.25, 1);
    assert.equal(ease(-1), 0);
    assert.equal(ease(0), 0);
    assert.equal(ease(1), 1);
    assert.equal(ease(2), 1);
});

test('linear curve is identity', () => {
    const ease = unitBezier(0, 0, 1, 1);
    for (const x of [0.1, 0.25, 0.5, 0.75, 0.9]) {
        assert.ok(close(ease(x), x));
    }
});

test('symmetric ease-in-out maps midpoint to midpoint', () => {
    const ease = unitBezier(0.42, 0, 0.58, 1);
    assert.ok(close(ease(0.5), 0.5));
});

test('CSS ease curve matches known values', () => {
    const ease = unitBezier(0.25, 0.1, 0.25, 1);
    assert.ok(close(ease(0.25), 0.4085, 1e-4), `got ${ease(0.25)}`);
    assert.ok(close(ease(0.5),  0.8024, 1e-4), `got ${ease(0.5)}`);
    assert.ok(close(ease(0.75), 0.9605, 1e-4), `got ${ease(0.75)}`);
});

test('output is monotonic for a monotonic curve', () => {
    const ease = unitBezier(0.4, 0, 0.6, 1);
    let prev = -Infinity;
    for (let i = 0; i <= 100; i++) {
        const y = ease(i / 100);
        assert.ok(y >= prev, `non-monotonic at ${i}: ${y} < ${prev}`);
        prev = y;
    }
});

test('custom epsilon is honored', () => {
    const ease = unitBezier(0.25, 0.1, 0.25, 1);
    const loose = ease(0.5, 1e-2);
    const tight = ease(0.5, 1e-10);
    assert.ok(close(loose, tight, 1e-2));
});

test('handles curves with zero derivative at the endpoints (bisection fallback)', () => {
    // p1x = 0 → cx = 0, so the x-derivative is 0 at t = 0, forcing Newton to
    // bail out for x near 0 and the bisection path to take over.
    const ease = unitBezier(0, 0.5, 1, 0.5);
    assert.ok(Number.isFinite(ease(1e-8)));
    assert.equal(ease(0), 0);
    assert.equal(ease(1), 1);
    let prev = -Infinity;
    for (let i = 0; i <= 50; i++) {
        const y = ease(i / 50);
        assert.ok(y >= prev);
        prev = y;
    }
});
