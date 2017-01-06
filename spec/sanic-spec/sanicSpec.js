/*
  lack of tests reeee
*/
var sanic = require("../../lib/sanic.js");
describe("Generator based sanicutine wrapper", () => {
  it("should resolve with return value", () => {
    var val = "returns this";
    var fn = sanic(function* () {
      return val;
    });
    fn().then(a => expect(a).toEqual(val));
  });
  it("should await promises", () => {
    var val = { a: true };
    var fn = sanic(function* () {
      var a = yield Promise.resolve(val);
      expect(a).toEqual(val);
    });
    fn();
  });
  it("should catch throw error", () => {
    var err = new Error();
    var fn = sanic(function* () {
      throw err;
    });
    fn().catch(e => expect(e).toEqual(err));
  });
  it("should catch rejected promise", () => {
    var err = new Error();
    var fn = sanic(function* () {
      yield Promise.reject(err);
    });
    fn().catch(e => expect(e).toEqual(err));
  });
  it("should catch via try", () => {
    var err = new Error();
    var fn = sanic(function* () {
      try {
        yield Promise.reject(err);
      } catch (e) {
        expect(e).toEqual(err);
      }
    });
    fn();
  });
  it("should pass context along", () => {
    var ctx = { a: 10 };
    var fn = sanic(function* () {
      expect(this.a).toEqual(ctx.a); // eslint-disable-line no-invalid-this
    }).bind(ctx);
    fn();
  });
  it("should apply arguments", () => {
    var args = ["a", "b", "c"];
    var fn = sanic(function* (a, b, c) {
      expect(Array.call(undefined, a, b, c)).toEqual(args); // eslint-disable-line no-useless-call
    });
    fn.apply(undefined, args);
  });
  it("should support chained promises", () => {
    var fn = sanic(function* () {
      var a = yield Promise.resolve("first").then(() => Promise.resolve("second"));
      expect(a).toEqual("second");
    });
    fn();
  });
});
