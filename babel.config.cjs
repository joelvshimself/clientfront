// babel.config.js (en la raíz)
module.exports = {
  presets: [
    "@babel/preset-env",
    "@babel/preset-react"
  ],
  plugins: [
    "@babel/plugin-syntax-import-meta",
    [
      "babel-plugin-transform-import-meta",
      {
        rewriteTo: { env: "process.env" }
      }
    ]
  ]
};
