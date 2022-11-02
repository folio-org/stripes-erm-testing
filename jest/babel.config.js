module.exports = {
  presets: [
    '@babel/preset-env',
    ['@babel/preset-react', { 'runtime': 'automatic' }],
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    [
      '@babel/plugin-proposal-decorators',
      { decoratorsBeforeExport: false },
    ],
    '@babel/plugin-transform-runtime',
    // FIXME TRY WITHOUT THIS ??
    'transform-require-context'
  ],
};
