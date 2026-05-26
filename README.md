[![Node](https://github.com/mapbox/unitbezier/actions/workflows/node.yml/badge.svg)](https://github.com/mapbox/unitbezier/actions/workflows/node.yml)

# unitbezier

Unit bezier interpolation function: a port to JavaScript from Webkit:

http://svn.webkit.org/repository/webkit/trunk/Source/WebCore/platform/graphics/UnitBezier.h

## API

```js
import unitBezier from '@mapbox/unitbezier';

const ease = unitBezier(0.25, 0.1, 0.25, 1); // CSS `ease`
ease(0.5);        // → 0.8024…
ease(0.5, 1e-8);  // tighter precision
```

### `unitBezier(p1x, p1y, p2x, p2y)`

Returns a function that evaluates the cubic bezier curve defined by control points `(0,0)`, `(p1x, p1y)`, `(p2x, p2y)`, `(1,1)`.

### `ease(x, epsilon?)`

Evaluate the curve for `x` (clamped to `[0, 1]`). `epsilon` controls solver precision (default `1e-6`).
