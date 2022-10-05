/*
Custom ESM loader for transpiling DScript + CoffeeScript + TypesCript.
ESM modules only, as load() does NOT allow returning modified 'source' for 'commonjs' format.
Requires: ds.js (the transpiler itself)

* Tries to transpiles DS directives 1st, then TS or CS.
  * For CS, DS directives may not all work in CS.
    * As CS comment uses '#' prefix and not '//',
      DS error outputs will choke CS compiler!
    * #ds colors, #ifdef and related are probably OK.

Usage example: node --loader ./ds_loader.mjs sample.coffee
*/
import path from 'node:path';

import { default as transpiler } from './ds.js';

const tsExts = new Set([
  '.tsx',
  '.ts',
  '.mts',
  '.cts'
]);

const csExts = new Set([
  '.coffee',
  '.litcoffee',
  '.cs'
]);

const dsExts = new Set([
  '.js',
  '.mjs',
  '.ds'
]);

const formats = new Set([
  'dscript',
  'typescript',
  'coffeescript'
]);

import { cwd } from 'node:process';
import { pathToFileURL } from 'node:url';
const baseURL = pathToFileURL(`${cwd()}/`).href;

export async function resolve(specifier, context, nextResolve) {
    const ext = path.extname(specifier);

    let format;
    if (tsExts.has(ext))
    {
        format = 'typescript';
    }
    else if (csExts.has(ext))
    {
        format = 'coffeescript';
    }
    else if (dsExts.has(ext))
    {
        format = 'dscript';
    }
    if (format)
    {
        const { parentURL = baseURL } = context;
        //const { url } = await nextResolve(specifier); // This can be deduplicated but isn't for simplicity

        return {
            format: format, // Provide a signal to `load`
            shortCircuit: true,
            //url
            url: new URL(specifier, parentURL).href
        };
    }
    return nextResolve(specifier); // File is not supported by us, so step aside
}

export async function load(url, context, nextLoad)
{
    const format = context.format;
    if (!formats.has(format)) { return nextLoad(url); }

    let source = transpiler.dscript.transpile(
        '' + (await nextLoad(url, { ...context, format: 'module' })).source, undefined,
        {
            format,
            esm: true
        });
    if (format === 'typescript')
    {
        source = transpiler.typescript.transpile(source, {module:'ES2020'});
    }
    else if (format === 'coffeescript')
    {
        source = transpiler.coffeescript.compile(source, { bare: true });
    }

    return {
        format: 'module', //cannot be 'commonjs' as cjs ignores source!
        shortCircuit: true,
        source: source
    };
}
