/* eslint-disable prefer-arrow-callback */
const sanic = require("..");
const chai = require("chai");
chai.use(require("chai-as-promised"));
chai.should();

describe("Sanic, a coroutine wrapper", function() {
  it("should resolve with return value", function() {
    const thing = [0, 1, 2];
    sanic(function*() {
      return thing;
    })().should.eventually.equal(thing);
  });

  it("should wait for promises", function(done) {
    const thing = [3, 4, 5];
    sanic(function*() {
      const retThing = yield Promise.resolve(thing);
      retThing.should.equal(thing);
    })().then(() => done(), done);
  });

  it("should catch thrown errors", function() {
    const err = new Error("spooky error");
    sanic(function*() {
      throw err;
    })().should.be.rejectedWith(err);
  });

  it("should catch thrown promise rejections", function() {
    const err = new Error("spooky async error");
    sanic(function*() {
      yield Promise.reject(err);
    })().should.be.rejectedWith(err);
  });

  it("should send rejections to enclosing try/catch", function(done) {
    const err = new Error("spooky async error");
    sanic(function*() {
      try {
        yield Promise.reject(err);
      } catch (e) {
        e.should.equal(err);
      }
    })().then(() => done(), done);
  });

  it("should pass context along", function(done) {
    const ctx = { a: 0 };
    sanic(function*() { // eslint-disable-line no-unused-expressions
      this.should.equal(ctx);
    }).bind(ctx)().then(() => done(), done); // couldn't use chai-as-promised because it did a bad
  });

  it("should pass arguments", function(done) {
    const args = ["a", "b"];

    sanic(function*() {
      Array.from(arguments).should.deep.equal(args);
    })(...args).then(() => done(), done);
  });

  it("should support delegated generator return values", function(done) {
    const ret_ = ["a", "b"];
    function* genA() {
      return ret_;
    }
    function* genB() {
      const ret = yield* genA();
      ret.should.equal(ret_);
    }
    sanic(genB)().then(() => done(), done);
  });

  it("should support delegated generator yield", function(done) {
    const ret_ = ["a", "b"];
    function* genA() {
      const ret = yield Promise.resolve(ret_);
      ret.should.equal(ret_);
    }
    function* genB() {
      yield* genA();
    }
    sanic(genB)().then(() => done(), done);
  });

  it("should support delegated generator error", function() {
    const err = new Error("spoopy error");
    function* genA() {
      throw err;
    }
    function* genB() {
      yield* genA();
    }
    sanic(genB)().should.be.rejectedWith(err);
  });

  it("should support delegated generator error try/catch", function(done) {
    const err = new Error("spoopy async error");
    function* genA() {
      throw err;
    }
    function* genB() {
      try {
        yield* genA();
      } catch (e) {
        e.should.equal(err);
      }
    }
    sanic(genB)().then(() => done(), done);
  });

  it("should support delegated generator rejection", function() {
    const err = new Error("spoopy async error");
    function* genA() {
      yield Promise.reject(err);
    }
    function* genB() {
      yield* genA();
    }
    sanic(genB)().should.be.rejectedWith(err);
  });

  it("should support delegated generator rejection try/catch", function(done) {
    const err = new Error("spoopy async error");
    function* genA() {
      yield Promise.reject(err);
    }
    function* genB() {
      try {
        yield* genA();
      } catch (e) {
        e.should.equal(err);
      }
    }
    sanic(genB)().then(() => done(), done);
  });
});
