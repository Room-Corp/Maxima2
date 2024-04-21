const rules = require("./webpack.rules");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

rules.push({
  test: /\.css$/,
  use: [{ loader: "style-loader" }, { loader: "css-loader" }],
});

module.exports = {
  //target: "node",
  // Put your normal webpack config below here
  module: {
    rules,
  },
  plugins: [new MonacoWebpackPlugin()],
};
