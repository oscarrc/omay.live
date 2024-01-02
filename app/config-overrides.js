const webpack = require("webpack");

module.exports = function override(config, env) {
    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, {
        process: require.resolve("process/browser"),
        zlib: require.resolve("browserify-zlib"),
        stream: require.resolve("stream-browserify"),
        util: require.resolve("util"),
        buffer: require.resolve("buffer"),
        asset: require.resolve("assert"),
        path: require.resolve("path-browserify")
    });

    config.resolve.fallback = fallback;
    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer']
        })
    ])

    config.module.rules = [
        {
          test: /\.mdx?$/,
          use: [ { loader: '@mdx-js/loader' } ]
        }
    ]

    return config;
}
