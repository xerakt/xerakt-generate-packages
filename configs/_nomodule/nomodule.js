import {
  /*@exports*/
} from "./bundle-esm.js";

const exported = {
  /*@exports*/
};

for (
  const propName
  in
  exported
) {

  window[
    propName
  ] = exported[
    propName
  ];
};