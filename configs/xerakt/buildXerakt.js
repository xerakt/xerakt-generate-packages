const esbuild = require("esbuild");
const licenseHeader = require(
  "../licenseHeader.js"
);

const fs = require("node:fs/promises");


module.exports = build;




async function build(
  inFile,
  outFile,
) {

  await esbuild.build({
    entryPoints: [inFile],
    bundle: true,
    format: "esm",
    target: "es6",
    outfile: outFile,
    inject: [
      "configs/xerakt/injected.js",
    ],
    minify: false,
    plugins: [
      plugin,
    ],
  });

  const result = await esbuild.build({
    entryPoints: [outFile],
    allowOverwrite: true,
    bundle: true,
    format: "esm",
    target: "es6",
    outfile: outFile,
    minify: true,
    mangleProps: /.*/,
    mangleQuoted: false,
    mangleCache: Object.fromEntries(
      [
        "keys",
        "indexOf",
        "replace",
        "map",
        "reduce",
        "split",
        "join",
      ].map(
        (prop) => [prop, false]
      )
    ),
    banner: {
      js: licenseHeader,
    },
  });

  //const {mangleCache: cache} = result;
  //console.log(cache);
  //console.log(Object.keys(cache).length);
};


const plugin = {
  name: "buildXerakt-replace",
  setup(build) {

    build.onLoad(
      {
        filter: /\.ts$/,
      },
      pluginCallback
    );
  },
};



async function pluginCallback(args) {

  const input = await fs.readFile(
    args.path,
    {
      encoding: "utf-8",
    }
  );

  const output = patterns.reduce(
    (
      pre,
      [regex, replacement]
    ) => pre.replaceAll(
      regex,
      replacement
    ),
    input
  );

  return {
    contents: output,
    loader: "ts",
  };
};

const patterns = [
  [
    /(?:.*@bundle-ignore-line.*\n.*\n?)|(?:.*@bundle-ignore-start(?:(?!@bundle-ignore-end)(?:.|\n))*@bundle-ignore-end.*\n?)|(?:.*@bundle-uncomment.*\n((?:(?!\/\/|\/\*).)*)(?:(?:\/\*((?:(?!\*\/)(?:.|\n))*)\*\/)|(?:\/\/(.*))))/g,
    "$1$2$3"
  ],
  [
    new RegExp(
      `\\.(${
        [
          "length",
          "call",
          "push",
          "toLowerCase",
          "slice",
        ].join("|")
      })\\b`,
      "g"
    ),
    "[$$$1]"
  ],
];