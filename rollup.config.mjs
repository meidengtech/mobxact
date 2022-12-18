import typescript from 'rollup-plugin-typescript2';
import clear from 'rollup-plugin-clear';
import terser from '@rollup/plugin-terser';
import pkg from './package.json' assert { type: 'json' };

export default [
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
