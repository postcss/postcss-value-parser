const { describe, test } = require("node:test");
const { equal, deepEqual } = require("node:assert");
const parser = require("..");

describe("ValueParser", () => {
  test("i/o", () => {
    const tests = [
      " rgba( 34 , 45 , 54, .5 ) ",
      "w1 w2 w6 \n f(4) ( ) () \t \"s't\" 'st\\\"2'",
    ];

    tests.forEach((item) => {
      equal(
        item,
        parser(item)
          .walk(() => {})
          .toString(),
        JSON.stringify(item),
      );
    });
  });

  test("walk should process all functions", () => {
    const result = [];
    parser("fn( ) fn2( fn3())").walk((node) => {
      if (node.type === "function") {
        result.push(node);
      }
    });

    deepEqual(result, [
      {
        type: "function",
        sourceIndex: 0,
        sourceEndIndex: 5,
        value: "fn",
        before: " ",
        after: "",
        nodes: [],
      },
      {
        type: "function",
        sourceIndex: 6,
        sourceEndIndex: 17,
        value: "fn2",
        before: " ",
        after: "",
        nodes: [
          {
            type: "function",
            sourceIndex: 11,
            sourceEndIndex: 16,
            value: "fn3",
            before: "",
            after: "",
            nodes: [],
          },
        ],
      },
      {
        type: "function",
        sourceIndex: 11,
        sourceEndIndex: 16,
        value: "fn3",
        before: "",
        after: "",
        nodes: [],
      },
    ]);
  });

  test("walk shouldn't process functions after falsy callback", () => {
    const result = [];

    parser("fn( ) fn2( fn3())").walk((node) => {
      if (node.type === "function") {
        result.push(node);
        if (node.value === "fn2") {
          return false;
        }
      }
      return true;
    });

    deepEqual(result, [
      {
        type: "function",
        sourceIndex: 0,
        sourceEndIndex: 5,
        value: "fn",
        before: " ",
        after: "",
        nodes: [],
      },
      {
        type: "function",
        sourceIndex: 6,
        sourceEndIndex: 17,
        value: "fn2",
        before: " ",
        after: "",
        nodes: [
          {
            type: "function",
            sourceIndex: 11,
            sourceEndIndex: 16,
            value: "fn3",
            before: "",
            after: "",
            nodes: [],
          },
        ],
      },
    ]);
  });

  test("walk shouldn't process nodes with defined non-function type", () => {
    const result = [];

    parser("fn( ) fn2( fn3())").walk((node) => {
      if (node.type === "function" && node.value === "fn2") {
        node.type = "word";
      }
      result.push(node);
    });

    deepEqual(result, [
      {
        type: "function",
        sourceIndex: 0,
        sourceEndIndex: 5,
        value: "fn",
        before: " ",
        after: "",
        nodes: [],
      },
      { type: "space", sourceIndex: 5, sourceEndIndex: 6, value: " " },
      {
        type: "word",
        sourceIndex: 6,
        sourceEndIndex: 17,
        value: "fn2",
        before: " ",
        after: "",
        nodes: [
          {
            type: "function",
            sourceIndex: 11,
            sourceEndIndex: 16,
            value: "fn3",
            before: "",
            after: "",
            nodes: [],
          },
        ],
      },
    ]);
  });

  test("walk should process all functions with reverse mode", () => {
    const result = [];

    parser("fn2( fn3())").walk((node) => {
      if (node.type === "function") {
        result.push(node);
      }
    }, true);

    deepEqual(result, [
      {
        type: "function",
        sourceIndex: 5,
        sourceEndIndex: 10,
        value: "fn3",
        before: "",
        after: "",
        nodes: [],
      },
      {
        type: "function",
        sourceIndex: 0,
        sourceEndIndex: 11,
        value: "fn2",
        before: " ",
        after: "",
        nodes: [
          {
            type: "function",
            sourceIndex: 5,
            sourceEndIndex: 10,
            value: "fn3",
            before: "",
            after: "",
            nodes: [],
          },
        ],
      },
    ]);
  });
});
