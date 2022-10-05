# DScript + CoffeeScript + TypeScript ESM Loader for Node.JS

# About
From [Node.JS 18.6.0](https://nodejs.org/en/blog/release/v18.6.0/), Experimental ESM Loader Hook API is released in it. Loaders can be used to preprocess input codes before eventual execution of ESM codes. Refer to [ESM docs](https://nodejs.org/api/esm.html) for details.

Here, I've extract the DScript preprocessor directives mod from my [Node.JS+ mod](https://github.com/sdneon/node), and modified it for use as a custom ESM loader. It's able to be used to handle DScript's preprocessor directives, or to transpile [CoffeeScript](https://coffeescript.org/) or [TypeScript](https://www.typescriptlang.org/) codes.

# Usage
Run it like this:
```
node --loader ./ds_loader.mjs <ESM_code_module>
```

E.g. running a coffeescript file:
```
node --loader ./ds_loader.mjs sample.coffee
```

## Notes
* ESM loaders only works for **ESM** modules! And *not* commonjs modules.
* This loader will try to process inputs as follows:
  * **Transpile DS *before* CS or TS**. Hence, DS preprocessor directives can be used in TS and CS codes.
    * However, owing to major syntactic differences (e.g. CS comment is prefixed by '#', instead of '//') between CS & JS, some directives may not transpile correctly.
    * See simple samples in `test` folder.
  * When transpiling TS, the `{module:'ES2020'}` option is passed to the TS transpiler to force ESM compatible output.
