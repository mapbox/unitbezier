import test from 'node:test';
import assert from 'node:assert/strict';
import UnitBezier from './index.js';

const close = (a, b, eps = 1e-6) => Math.abs(a - b) < eps;

test('clamps x outside [0, 1]', () => {
    const u = new UnitBezier(0.25, 0.1, 0.25, 1);
    assert.equal(u.solve(-1), 0);
    assert.equal(u.solve(0), 0);
    assert.equal(u.solve(1), 1);
    assert.equal(u.solve(2), 1);
});

test('linear curve is identity', () => {
    const u = new UnitBezier(0, 0, 1, 1);
    for (const x of [0.1, 0.25, 0.5, 0.75, 0.9]) {
        assert.ok(close(u.solve(x), x));
    }
});

test('symmetric ease-in-out maps midpoint to midpoint', () => {
    const u = new UnitBezier(0.42, 0, 0.58, 1);
    assert.ok(close(u.solve(0.5), 0.5));
});

test('CSS ease curve matches known values', () => {
    const u = new UnitBezier(0.25, 0.1, 0.25, 1);
    assert.ok(close(u.solve(0.25), 0.4085, 1e-4), `got ${u.solve(0.25)}`);
    assert.ok(close(u.solve(0.5),  0.8024, 1e-4), `got ${u.solve(0.5)}`);
    assert.ok(close(u.solve(0.75), 0.9605, 1e-4), `got ${u.solve(0.75)}`);
});

test('output is monotonic for a monotonic curve', () => {
    const u = new UnitBezier(0.4, 0, 0.6, 1);
    let prev = -Infinity;
    for (let i = 0; i <= 100; i++) {
        const y = u.solve(i / 100);
        assert.ok(y >= prev, `non-monotonic at ${i}: ${y} < ${prev}`);
        prev = y;
    }
});

test('custom epsilon is honored', () => {
    const u = new UnitBezier(0.25, 0.1, 0.25, 1);
    // Looser epsilon should still produce a near-correct result.
    const loose = u.solve(0.5, 1e-2);
    const tight = u.solve(0.5, 1e-10);
    assert.ok(close(loose, tight, 1e-2));
});

test('handles curves with zero derivative at the endpoints (bisection fallback)', () => {
    // p1x = 0 → cx = 0, so sampleCurveDerivativeX(0) = 0, forcing Newton to bail
    // out for x near 0 and the bisection path to take over.
    const u = new UnitBezier(0, 0.5, 1, 0.5);
    assert.ok(close(u.solve(1e-8), u.solve(1e-8), 1e-6)); // doesn't throw / loop
    // Endpoints still correct.
    assert.equal(u.solve(0), 0);
    assert.equal(u.solve(1), 1);
    // Monotonic across the range.
    let prev = -Infinity;
    for (let i = 0; i <= 50; i++) {
        const y = u.solve(i / 50);
        assert.ok(y >= prev);
        prev = y;
    }
});
