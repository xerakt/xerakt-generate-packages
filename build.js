const buildXerakt = require(
  "./configs/xerakt/buildXerakt.js"
);
const buildNomodule = require(
  "./configs/_nomodule/buildNomodule.js"
);

const fs = require("node:fs/promises");

const uj = require("uglify-js");

const path = require("node:path");




(
  async function() {
    await buildXerakt(
      "xerakt/src/main.ts",
      "tmp/bundle-esm.js"
    );

    const ujIn = await fs.readFile(
      "tmp/bundle-esm.js",
      {
        encoding: "utf-8",
      }
    );

    let ujOut = ujIn;

    while (true) {

      const result = uj.minify(
        ujOut,
        {
          module: true,
          output: {
            comments: "some",
          },
        }
      ).code;

      if (
        result.length < ujOut.length
      ) {

        ujOut = result;

      } else {

        break;
      };
    };

    await fs.writeFile(
      "tmp/bundle-esm.js",
      ujOut
    );

    await fs.cp(
      "tmp/bundle-esm.js",
      "packages/xerakt/esm.js"
    );




    const exportlessNomoduleJs = (
      await fs.readFile(
        "configs/_nomodule/nomodule.js",
        {
          encoding: "utf-8",
        }
      )
    );

    const exportedNames = [
      ...ujOut.matchAll(
        /export\s*\{\s*((?:(?:\w+\s+as\s+)?\w+\s*,\s*)*(?:(?:\w+\s+as\s+)?\w+)?)\s*\}/g
      ),
    ].map(
      ([, exps]) => exps.split(",").map(
        (exp) => exp.replaceAll(
          /\w+\s+as\s+/g,
          ""
        ).trim()
      )
    ).flat().filter(
      (exp) => exp && exp !== "default"
    );

    const exportfulNomoduleJs = (
      exportlessNomoduleJs.replaceAll(
        "/*@exports*/",
        `${
          exportedNames.join(",\n  ")
        },`
      )
    );

    await fs.writeFile(
      "tmp/nomodule.js",
      exportfulNomoduleJs
    );

    await buildNomodule(
      "./tmp/nomodule.js",
      {
        filename: (
          'bundle-nomodule.js'
        ),
        path: path.resolve(
          __dirname,
          'tmp/'
        ),
      }
    );

    await fs.cp(
      "tmp/bundle-nomodule.js",
      "packages/_nomodule/nomodule.js"
    );









    const srcJson = JSON.parse(
      await fs.readFile(
        "xerakt/package.json",
        {
          encoding: "utf-8",
        }
      )
    );


    const xeraktJson = {
      ...Object.fromEntries(
        Object.entries(
          srcJson
        ).filter(
          (
            [propName]
          ) => (
            propName !== "private"
          )
        )
      ),
      ...{
        name: "xerakt",
        main: "esm.js",
        browser: "esm.js",
      }
    };


    await fs.writeFile(
      "packages/xerakt/package.json",
      JSON.stringify(
        xeraktJson,
        null,
        2
      )
    );


    const nomoduleJson = {
      ...xeraktJson,
      name: "@xerakt/nomodule",
      main: "nomodule.js",
      browser: "nomodule.js",
      sideEffects: true,
    };


    await fs.writeFile(
      "packages/_nomodule/package.json",
      JSON.stringify(
        nomoduleJson,
        null,
        2
      )
    );



    await fs.copyFile(
      "configs/xerakt/README.md",
      "packages/xerakt/README.md"
    );




    const versionlessNomoduleReadme = (
      await fs.readFile(
        "configs/_nomodule/README.md",
        {
          encoding: "utf-8",
        }
      )
    );

    const versionfulNomoduleReadme = (
      (
        versionlessNomoduleReadme
      ).replaceAll(
        "@xerakt/nomodule",
        `$&@${
          srcJson.version
        }`
      )
    );

    await fs.writeFile(
      "packages/_nomodule/README.md",
      versionfulNomoduleReadme
    );
  }
)();