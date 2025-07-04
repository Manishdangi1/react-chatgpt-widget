import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  treeshake: true,
  minify: true,
  outDir: 'dist',
  esbuildOptions(options) {
    options.banner = {
      js: '// react-chatgpt-widget v1.0.0\n',
    };
  },
  onSuccess: 'echo "Build completed successfully!"',
}) 