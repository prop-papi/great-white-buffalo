const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: ["babel-polyfill", path.resolve("./frontend/client/src/index.js")],
  output: {
    path: path.resolve("./frontend/client/public"),
    filename: "bundle.js"
  },

  module: {
    rules: [
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ["env", "react", "es2015", "stage-2"]
        }
      },
      {
        test: /\.(css)$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx"]
  }
};
