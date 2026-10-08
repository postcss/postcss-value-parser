const { test } = require("node:test");
const { deepEqual, strictEqual } = require("node:assert");
const valueParser = require("../lib");

for (const whitespace of [" ", "\t", "\n", "\r", "\f", "\r\n"]) {
  test(`hex escape consumes its whitespace terminator ${JSON.stringify(whitespace)}`, () => {
    const value = "fo\\a" + whitespace + "o";
    const parsed = valueParser(value);
    deepEqual(parsed.nodes, [
      { type: "word", sourceIndex: 0, sourceEndIndex: value.length, value },
    ]);
    strictEqual(parsed.toString(), value);
  });
}

test("hex escape consumes only one whitespace terminator", () => {
  deepEqual(valueParser("fo\\a  o").nodes, [
    { type: "word", sourceIndex: 0, sourceEndIndex: 5, value: "fo\\a " },
    { type: "space", sourceIndex: 5, sourceEndIndex: 6, value: " " },
    { type: "word", sourceIndex: 6, sourceEndIndex: 7, value: "o" },
  ]);
});

test("hex escape stops after six digits", () => {
  const value = "\\123456a o";
  deepEqual(valueParser(value).nodes, [
    { type: "word", sourceIndex: 0, sourceEndIndex: 8, value: "\\123456a" },
    { type: "space", sourceIndex: 8, sourceEndIndex: 9, value: " " },
    { type: "word", sourceIndex: 9, sourceEndIndex: 10, value: "o" },
  ]);
});

test("hex escape preserves a following divider", () => {
  deepEqual(valueParser("\\41 ,x").nodes, [
    { type: "word", sourceIndex: 0, sourceEndIndex: 4, value: "\\41 " },
    {
      type: "div",
      sourceIndex: 4,
      sourceEndIndex: 5,
      value: ",",
      before: "",
      after: "",
    },
    { type: "word", sourceIndex: 5, sourceEndIndex: 6, value: "x" },
  ]);
});
