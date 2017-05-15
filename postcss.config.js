var path = require('path')
var resolveId = require('resolve')

function resolveModule(id, opts)
{
  return new Promise((resolve, reject) =>
  {
    resolveId(id, opts, (err, path) =>
      err ? reject(err) : resolve(path)
    )
  })
}

function customResolve(id, base, options) {
  var paths = options.path

  var resolveOpts = {
    basedir: base,
    moduleDirectory: ['node_modules'],
    paths: paths,
    extensions: [ ".css" ],
    packageFilter: function processPackage(pkg)
    {
      if (pkg.style) {
        pkg.main = pkg.style
      }
      else if (pkg.browser) {
        pkg.main = pkg.browser
      }
      else if (!pkg.main || !(/\.css$/).test(pkg.main)) {
        pkg.main = "index.css"
      }
      return pkg
    }
  }

  return resolveModule("./" + id, resolveOpts)
    .catch(() => {
      return resolveModule(id, resolveOpts)}
    )
    .catch(() => {
      if (!includes(paths, base)) {
        paths.unshift(base)
      }

      throw new Error([
        "Failed to find '" + id + "'",
        "in [ ",
        "    " + paths.join(",\n        "),
        "]"
      ].join("\n    "))
    })
}

module.exports = {
  parser: 'sugarss',
  map: false,
  plugins: [
    require('postcss-smart-import')({
      resolve: function (id, baseDir, importOptions) {
        const theme = process.env.npm_package_config_theme
        const newId = id === 'theme' ?
          path.resolve(__dirname, `src/themes/${theme}/theme`) :
          id

        return customResolve(newId, baseDir, importOptions)
      }
    }),
    require('precss')({ /* ...options */ }),
    require('autoprefixer')({ /* ...options */ })
  ]
}
