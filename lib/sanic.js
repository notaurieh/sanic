function sanic(generator) {
  return function () {
    return new Promise((resolve, reject) => {
      var gen = generator.apply(this, arguments);
      var i;
      var step = (s, v) => {
        i = gen[s](v);
        if (i.done) return resolve(i.value);
        Promise.resolve(i.value).then(val => {
          step("next", val);
        }, err => {
          step("throw", err);
        });
      };
      step("next")
    });
  }
}

module.exports = sanic;
