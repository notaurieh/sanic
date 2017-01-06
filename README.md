# Sanic - a coroutine wrapper
[![Build Status](https://travis-ci.com/aurieh/sanic.svg?token=EAx6eCrkYNcVTTEG4DY5&branch=master)](https://travis-ci.com/aurieh/sanic)

```js
const sanic = require("sanic");
var fn = sanic(function* () {
  try {
    const response = yield makeAWebRequest();
    console.log(response.body);
  } catch (e) {
    console.error("Wooops\n", e);
  }
});

fn();
```
Just like that, did I mention its fast? How fast, you may ask.. Well
```
sanic x 503,384 ops/sec ±0.60% (84 runs sampled)
babel x 450,866 ops/sec ±0.50% (88 runs sampled)
typescript x 436,633 ops/sec ±2.27% (83 runs sampled)
bluebird.coroutine x 7,969 ops/sec ±1.15% (84 runs sampled)
co.wrap x 386,493 ops/sec ±0.79% (83 runs sampled)
q.async x 25,756 ops/sec ±3.14% (79 runs sampled)
asyncawait x 159,716 ops/sec ±1.17% (85 runs sampled)
Fastest is sanic
```
And all that for a fraction of memory (benchmark runs used ~20MB, for sanic)
