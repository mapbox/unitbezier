import test from 'node:test';
import assert from 'node:assert/strict';
import UnitBezier from './index.js';

test('unit bezier', () => {
    const u = new UnitBezier(0, 0, 1, 1);
    assert.equal(u.sampleCurveY(1), 1, 'sampleCurveY');
    assert.equal(u.sampleCurveX(1), 1, 'sampleCurveX');
    assert.equal(u.sampleCurveDerivativeX(0.1), 0.54, 'sampleCurveDerivativeX');
    assert.equal(u.solveCurveX(0), 0, 'solveCurveX');
    assert.equal(u.solveCurveX(1), 1, 'solveCurveX');
    assert.equal(u.solveCurveX(1.25552, 1.e-8), 1, 'solveCurveX');
    assert.equal(u.solveCurveX(1, 1e-8), 1, 'solveCurveX');
    assert.equal(u.solveCurveX(0.5), 0.5, 'solveCurveX');
    assert.equal(u.solve(0.5), 0.5, 'solve');
});
