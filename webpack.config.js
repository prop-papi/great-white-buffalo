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
<<<<<<< dabafde5f6d5ff7e60221b9ece99933e11460f99
          presets: ["env", "react"]
=======
          presets: ["env", "react", "es2015"]
>>>>>>> Can now pull user data and all there bets
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
<<<<<<< dabafde5f6d5ff7e60221b9ece99933e11460f99
};
=======
};
>>>>>>> Can now pull user data and all there bets
