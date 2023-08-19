const typescript = require('rollup-plugin-typescript2');
const clear = require('rollup-plugin-clear');
const terser = require('@rollup/plugin-terser');
const pkg = require('./package.json');

module.exports = [
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
      },
      {
        file: pkg.module,
        format: 'es',
      },
      {
        file: 'dist/index.umd.js',
        name: 'Mobxact',
        format: 'umd',
        globals: {
          mobx: 'mobx',
          mobxact: 'Mobxact',
        },
      },
    ],
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ],
    plugins: [
      typescript(),
      clear({
        targets: ['dist'],
      }),
      terser(),
    ],
  },
];
