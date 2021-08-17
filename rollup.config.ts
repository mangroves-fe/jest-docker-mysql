import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'

export default defineConfig({
  input: [
    'src/index.ts',
    'src/setup.ts',
    'src/teardown.ts',
  ],
  output: {
    dir: 'lib',
    format: 'cjs',
    entryFileNames: '[name].js',
  },
  plugins: [
    typescript({
      declaration: true,
      declarationDir: 'lib',
      rootDir: './src',
      outDir: './lib',
    }),
    nodeResolve(),
    commonjs(),
  ],
})
