import { toJSX } from "../src";

test('toJSX', () => {
  expect(toJSX({ plugin: "Foo", state: null})).toEqual("");
})
