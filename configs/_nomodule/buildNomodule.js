const webpack = require("webpack");
const TerserPlugin = require(
  "terser-webpack-plugin"
);
const licenseHeader = require(
  "../licenseHeader.js"
);


module.exports = (
  inFile,
  outFile,
) => new Promise(
  (res, rej) => webpack(
    {
      entry: (
        inFile
      ),
      mode: "production",
      target: ["web", "es5"],
      output: outFile,
      module: {
        rules: [{
          test: /\.(?:t|j)sx?$/,
          use: {
            loader: 'ts-loader',
            options: {
              onlyCompileBundledFiles: (
                true
              ),
              transpileOnly: true,
            },
          },
          exclude: /node_modules/,
        }],
      },
      optimization: {
        concatenateModules: true,
        providedExports: true,
        minimize: true,
        minimizer: [
          new TerserPlugin({
            minify: TerserPlugin[
              "uglifyJsMinify"
            ],
            extractComments: false,
            terserOptions: {
              output: {
                comments: false,
                preamble: licenseHeader,
              },
              mangle: {
                properties: false,
              },
              ecma: 5,
            },
          }),
        ],
      },
    },
    (err, stats) => {
      const _err = (
        err || stats.hasErrors()
      );
      if (_err) {
        console.log(err);
        console.log(
          stats.compilation.errors
        );
        rej(_err);
      } else {
        res(stats);
      };
    }
  )
);