module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
    ['@babel/preset-env', {
      useBuiltIns: 'usage',
      corejs: 3 // ou qualquer outra versão que você esteja usando
    }]

  ],
  plugins: [ "@babel/plugin-proposal-private-methods", "@babel/plugin-proposal-object-rest-spread"]
}
