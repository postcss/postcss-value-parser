var parse = require("./parse");
var walk = require("./walk");
var stringify = require("./stringify");

function ValueParser(value, options) {
  if (this instanceof ValueParser) {
    this.nodes = parse(value, options);
    return this;
  }
  return new ValueParser(value, options);
}

ValueParser.prototype.toString = function() {
  return Array.isArray(this.nodes) ? stringify(this.nodes) : "";
};

ValueParser.prototype.walk = function(cb, bubble) {
  walk(this.nodes, cb, bubble);
  return this;
};

ValueParser.unit = require("./unit");

ValueParser.walk = walk;

ValueParser.stringify = stringify;

module.exports = ValueParser;
