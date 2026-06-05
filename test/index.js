var test = require("tape");
var parser = require("..");

test("ValueParser", function(tp) {
  tp.test("i/o", function(t) {
    var tests = [
      " rgba( 34 , 45 , 54, .5 ) ",
      "w1 w2 w6 \n f(4) ( ) () \t \"s't\" 'st\\\"2'"
    ];
    t.plan(tests.length);

    tests.forEach(function(item) {
      t.equal(
        item,
        parser(item)
          .walk(function() {})
          .toString(),
        JSON.stringify(item)
      );
    });
  });

  tp.test("walk", function(t) {
    t.plan(7);
    var result;

    result = [];

    parser("fn( ) fn2( fn3())").walk(function(node) {
      if (node.type === "function") {
        result.push(node);
      }
    });

    t.deepEqual(
      result,
      [
        {
          type: "function",
          sourceIndex: 0,
          sourceEndIndex: 5,
          value: "fn",
          before: " ",
          after: "",
          nodes: []
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
              nodes: []
            }
          ]
        },
        {
          type: "function",
          sourceIndex: 11,
          sourceEndIndex: 16,
          value: "fn3",
          before: "",
          after: "",
          nodes: []
        }
      ],
      "should process all functions"
    );

    result = [];

    parser("fn( ) #{fn2( fn3())}", { interpolationPrefix: "#" }).walk(function(
      node
    ) {
      if (node.type === "interpolation") {
        result.push(node);
      }
    });

    t.deepEqual(
      result,
      [
        {
          type: "interpolation",
          sourceIndex: 6,
          value: "#",
          before: "",
          after: "",
          nodes: [
            {
              type: "function",
              sourceIndex: 8,
              value: "fn2",
              before: " ",
              after: "",
              nodes: [
                {
                  type: "function",
                  sourceIndex: 13,
                  value: "fn3",
                  before: "",
                  after: "",
                  nodes: []
                }
              ]
            }
          ]
        }
      ],
      "should process all interpolations"
    );

    result = [];

    parser("fn( ) --#{fn2( fn3())}", { interpolationPrefix: "#" }).walk(
      function(node) {
        if (node.type === "interpolation") {
          result.push(node);
        }
      }
    );

    t.deepEqual(
      result,
      [
        {
          type: "interpolation",
          sourceIndex: 8,
          value: "#",
          before: "",
          after: "",
          nodes: [
            {
              type: "function",
              sourceIndex: 10,
              value: "fn2",
              before: " ",
              after: "",
              nodes: [
                {
                  type: "function",
                  sourceIndex: 15,
                  value: "fn3",
                  before: "",
                  after: "",
                  nodes: []
                }
              ]
            }
          ]
        }
      ],
      "should process all interpolations with word"
    );

    result = [];

    parser("fn( ) /#{fn2( fn3())}", { interpolationPrefix: "#" }).walk(function(
      node
    ) {
      if (node.type === "interpolation") {
        result.push(node);
      }
    });

    t.deepEqual(
      result,
      [
        {
          type: "interpolation",
          sourceIndex: 7,
          value: "#",
          before: "",
          after: "",
          nodes: [
            {
              type: "function",
              sourceIndex: 9,
              value: "fn2",
              before: " ",
              after: "",
              nodes: [
                {
                  type: "function",
                  sourceIndex: 14,
                  value: "fn3",
                  before: "",
                  after: "",
                  nodes: []
                }
              ]
            }
          ]
        }
      ],
      "should process all interpolations with divider (/)"
    );

    result = [];

    parser("fn( ) fn2( fn3())").walk(function(node) {
      if (node.type === "function") {
        result.push(node);
        if (node.value === "fn2") {
          return false;
        }
      }
      return true;
    });

    t.deepEqual(
      result,
      [
        {
          type: "function",
          sourceIndex: 0,
          sourceEndIndex: 5,
          value: "fn",
          before: " ",
          after: "",
          nodes: []
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
              nodes: []
            }
          ]
        }
      ],
      "shouldn't process functions after falsy callback"
    );

    result = [];

    parser("fn( ) fn2( fn3())").walk(function(node) {
      if (node.type === "function" && node.value === "fn2") {
        node.type = "word";
      }
      result.push(node);
    });

    t.deepEqual(
      result,
      [
        {
          type: "function",
          sourceIndex: 0,
          sourceEndIndex: 5,
          value: "fn",
          before: " ",
          after: "",
          nodes: []
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
              nodes: []
            }
          ]
        }
      ],
      "shouldn't process nodes with defined non-function type"
    );

    result = [];

    parser("fn2( fn3())").walk(function(node) {
      if (node.type === "function") {
        result.push(node);
      }
    }, true);

    t.deepEqual(
      result,
      [
        {
          type: "function",
          sourceIndex: 5,
          sourceEndIndex: 10,
          value: "fn3",
          before: "",
          after: "",
          nodes: []
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
              nodes: []
            }
          ]
        }
      ],
      "should process all functions with reverse mode"
    );
  });
});
