import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife', // "Immediately Invoked Function Expression" is common for browser scripts
    sourcemap: true  // optional but often helpful for debugging
  },
  plugins: [
    resolve(),   // Allows Rollup to find "firebase/..." in node_modules
    commonjs()   // Converts CommonJS modules to ES modules
  ]
};
