import esbuild from 'rollup-plugin-esbuild';
import { cleandir } from 'rollup-plugin-cleandir';
import dts from 'unplugin-dts/rollup';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/index.es.js',
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      esbuild({ target: 'es2018' }),
      cleandir('dist'),
      dts({ outDirs: ['dist'] }),
    ],
  },
];
