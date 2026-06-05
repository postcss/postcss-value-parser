const { describe, test } = require("node:test");
const { deepEqual } = require("node:assert");
const unit = require("../lib/unit");

const tests = [
  {
    fixture: ".23rem",
    expected: { number: ".23", unit: "rem" },
  },
  {
    fixture: ".2.3rem",
    expected: { number: ".2", unit: ".3rem" },
  },
  {
    fixture: "2.",
    expected: { number: "2", unit: "." },
  },
  {
    fixture: "+2.",
    expected: { number: "+2", unit: "." },
  },
  {
    fixture: "-2.",
    expected: { number: "-2", unit: "." },
  },
  {
    fixture: "+-2.",
    expected: false,
  },
  {
    fixture: ".",
    expected: false,
  },
  {
    fixture: ".rem",
    expected: false,
  },
  {
    fixture: "1e4px",
    expected: { number: "1e4", unit: "px" },
  },
  {
    fixture: "1em",
    expected: { number: "1", unit: "em" },
  },
  {
    fixture: "1e10",
    expected: { number: "1e10", unit: "" },
  },
  {
    fixture: "",
    expected: false,
  },
  {
    fixture: "e",
    expected: false,
  },
  {
    fixture: "e1",
    expected: false,
  },
  {
    fixture: "2rem",
    expected: { number: "2", unit: "rem" },
  },
  {
    fixture: "2.000rem",
    expected: { number: "2.000", unit: "rem" },
  },
  {
    fixture: "+2rem",
    expected: { number: "+2", unit: "rem" },
  },
  {
    fixture: "-2rem",
    expected: { number: "-2", unit: "rem" },
  },
  {
    fixture: "1.1rem",
    expected: { number: "1.1", unit: "rem" },
  },
  {
    fixture: "+1.1rem",
    expected: { number: "+1.1", unit: "rem" },
  },
  {
    fixture: "-1.1rem",
    expected: { number: "-1.1", unit: "rem" },
  },
  {
    fixture: "1.1e1rem",
    expected: { number: "1.1e1", unit: "rem" },
  },
  {
    fixture: "+1.1e1rem",
    expected: { number: "+1.1e1", unit: "rem" },
  },
  {
    fixture: "-1.1e1rem",
    expected: { number: "-1.1e1", unit: "rem" },
  },
  {
    fixture: "1.1e+1rem",
    expected: { number: "1.1e+1", unit: "rem" },
  },
  {
    fixture: "1.1e-1rem",
    expected: { number: "1.1e-1", unit: "rem" },
  },
  {
    fixture: "1.1e1e1rem",
    expected: { number: "1.1e1", unit: "e1rem" },
  },
  {
    fixture: "1.1e-1e",
    expected: { number: "1.1e-1", unit: "e" },
  },
  {
    fixture: "1.1e-1rem",
    expected: { number: "1.1e-1", unit: "rem" },
  },
  {
    fixture: "1.1e--++1e",
    expected: { number: "1.1", unit: "e--++1e" },
  },
  {
    fixture: "1.1e--++1rem",
    expected: { number: "1.1", unit: "e--++1rem" },
  },
  {
    fixture: "100+px",
    expected: { number: "100", unit: "+px" },
  },
  {
    fixture: "100.0.0px",
    expected: { number: "100.0", unit: ".0px" },
  },
  {
    fixture: "100e1epx",
    expected: { number: "100e1", unit: "epx" },
  },
  {
    fixture: "100e1e1px",
    expected: { number: "100e1", unit: "e1px" },
  },
  {
    fixture: "+100.1e+1e+1px",
    expected: { number: "+100.1e+1", unit: "e+1px" },
  },
  {
    fixture: "-100.1e-1e-1px",
    expected: { number: "-100.1e-1", unit: "e-1px" },
  },
  {
    fixture: ".5px",
    expected: { number: ".5", unit: "px" },
  },
  {
    fixture: "+.5px",
    expected: { number: "+.5", unit: "px" },
  },
  {
    fixture: "-.5px",
    expected: { number: "-.5", unit: "px" },
  },
  {
    fixture: ".5e1px",
    expected: { number: ".5e1", unit: "px" },
  },
  {
    fixture: "-.5e1px",
    expected: { number: "-.5e1", unit: "px" },
  },
  {
    fixture: "+.5e1px",
    expected: { number: "+.5e1", unit: "px" },
  },
  {
    fixture: ".5e1e1px",
    expected: { number: ".5e1", unit: "e1px" },
  },
  {
    fixture: ".5.5px",
    expected: { number: ".5", unit: ".5px" },
  },
  {
    fixture: "1e",
    expected: { number: "1", unit: "e" },
  },
  {
    fixture: "1e1",
    expected: { number: "1e1", unit: "" },
  },
  {
    fixture: "1ee",
    expected: { number: "1", unit: "ee" },
  },
  {
    fixture: "1e+",
    expected: { number: "1", unit: "e+" },
  },
  {
    fixture: "1e-",
    expected: { number: "1", unit: "e-" },
  },
  {
    fixture: "1e+1",
    expected: { number: "1e+1", unit: "" },
  },
  {
    fixture: "1e++1",
    expected: { number: "1", unit: "e++1" },
  },
  {
    fixture: "1e--1",
    expected: { number: "1", unit: "e--1" },
  },
  {
    fixture: "+10",
    expected: { number: "+10", unit: "" },
  },
  {
    fixture: "-10",
    expected: { number: "-10", unit: "" },
  },
  {
    fixture: ".2px",
    expected: { number: ".2", unit: "px" },
  },
  {
    fixture: "-.2px",
    expected: { number: "-.2", unit: "px" },
  },
  {
    fixture: "+.2px",
    expected: { number: "+.2", unit: "px" },
  },
  {
    fixture: ".a",
    expected: false,
  },
  {
    fixture: ".",
    expected: false,
  },
  {
    fixture: "+",
    expected: false,
  },
  {
    fixture: "-",
    expected: false,
  },
  {
    fixture: "-a",
    expected: false,
  },
  {
    fixture: "+a",
    expected: false,
  },
  {
    fixture: "+.a",
    expected: false,
  },
  {
    fixture: "-.a",
    expected: false,
  },
  {
    fixture: "",
    expected: false,
  },
];

describe("Unit", () => {
  tests.forEach((item) => {
    test(item.fixture, () => {
      deepEqual(unit(item.fixture), item.expected);
    });
  });
});
