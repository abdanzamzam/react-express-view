const React = require("react");

function Hello(props) {
  return React.createElement("div", null,
    React.createElement("h1", null, props.title),
    React.createElement("p", null, props.message)
  );
}

module.exports = Hello;
