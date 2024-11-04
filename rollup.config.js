import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import babel from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss'
import json from '@rollup/plugin-json';
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      sourcemap: true,
      inlineDynamicImports:true,
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
      inlineDynamicImports:true,
    },
  ],

  plugins: [
    resolve({
      extensions: ['.js', '.jsx', '.ts', '.tsx'], // Add the required extensions
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
    }),
    babel({
      babelHelpers: 'bundled',
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      presets: ['@babel/preset-react'],
    }),
    postcss(),
    json()
  ],
  external: ['react', 'react-dom', 'next'],
};
