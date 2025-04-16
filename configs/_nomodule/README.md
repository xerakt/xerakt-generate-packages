<article style="font-family: monospace">

# xerakt (nomodule bundle)

DOM rendering library

![logo](https://github.com/xerakt/xerakt-branding/raw/main/xeraktLogo.svg)

<br>

> [!NOTE]  
> this is nomodule bundle;
>
> the ES module bundle is here: https://www.npmjs.com/package/xerakt

<br>

---

<br>


this is a package that adds [xerakt](https://www.npmjs.com/package/xerakt) exports as window properties;

this package's main script (`nomodule.js` - specified in the `"main"` field in the `package.json`) is a single file bundle and doesn't use [ES modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), so it can be used (as `<script src="path/to/this/package/nomodule.js"></script>`) for supporting old browsers;

e. g.:

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="https://unpkg.com/@xerakt/nomodule/nomodule.js"></script>
  </head>
  <body>
    <div id="root"></div>
    <script>

      var root = document.getElementById("root");

      function MyApp() {

        var stateHookArr = useState(true);
        var state = stateHookArr[0];
        var setState = stateHookArr[1];

        useEffect(
          function () {
            setInterval(
              function () {
                setState(
                  function (oldState) {

                    return !oldState;
                  }
                )
              },
              200
            );
          }
        );

        return {
          tag: "h1",
          style: {
            backgroundColor: "#f7df1e",
          },
          child: "Hello, world" + (state ? "!" : ""),
        };
      };

      var docFragment = xerakt(MyApp);

      root.appendChild(docFragment);

    </script>
  </body>
</html>
```

<br>

readme of xerakt: https://github.com/xerakt/xerakt#readme

source code of xerakt: https://github.com/xerakt/xerakt

bundled with: https://github.com/xerakt/xerakt-generate-packages

</article>