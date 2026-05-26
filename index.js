
export default class UnitBezier {
    constructor(p1x, p1y, p2x, p2y) {
        // Calculate the polynomial coefficients, implicit first and last control points are (0,0) and (1,1).
        this.cx = 3 * p1x;
        this.bx = 3 * (p2x - p1x) - this.cx;
        this.ax = 1 - this.cx - this.bx;

        this.cy = 3 * p1y;
        this.by = 3 * (p2y - p1y) - this.cy;
        this.ay = 1 - this.cy - this.by;
    }

    solve(x, epsilon = 1e-6) {
        if (x <= 0) return 0;
        if (x >= 1) return 1;

        const {ax, bx, cx, ay, by, cy} = this;
        let t = x;

        // First try a few iterations of Newton's method - normally very fast.
        // `ax t^3 + bx t^2 + cx t` expanded using Horner's rule.
        for (let i = 0; i < 8; i++) {
            const x2 = ((ax * t + bx) * t + cx) * t - x;
            if (Math.abs(x2) < epsilon) return ((ay * t + by) * t + cy) * t;

            const d2 = (3 * ax * t + 2 * bx) * t + cx;
            if (Math.abs(d2) < 1e-6) break;

            t -= x2 / d2;
        }

        // Fall back to the bisection method for reliability.
        let t0 = 0;
        let t1 = 1;
        t = x;

        for (let i = 0; i < 20; i++) {
            const x2 = ((ax * t + bx) * t + cx) * t;
            if (Math.abs(x2 - x) < epsilon) break;

            if (x > x2) t0 = t;
            else t1 = t;

            t = (t0 + t1) * 0.5;
        }

        return ((ay * t + by) * t + cy) * t;
    }
}
