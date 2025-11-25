const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { container } = require('webpack');
const ExternalRemotesPlugin = require('external-remotes-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');
const webpack = require('webpack');
const federationConfig = require('./federation.config');

module.exports = {
    mode: 'development',
    name: 'hubgroup-general-system-fe',
    entry: './src/index.tsx',

    output: {
        publicPath: 'auto',
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        clean: true,
    },

    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },

    // =============================
    // 🧱 DEV SERVER
    // =============================
    devServer: {
        port: 4000,
        historyApiFallback: true,
        hot: true,
        host: '0.0.0.0',
        allowedHosts: 'all',
    },

    // =============================
    // 🧱 LOADERS
    // =============================
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },

    // =============================
    // 🧱 PLUGINS
    // =============================
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
        }),

        // 🧱 Module Federation HOST
        new container.ModuleFederationPlugin({
            name: federationConfig.moduleName,
            filename: 'remoteEntry.js',
            remotes: federationConfig.remotes,
            shared: WebpackShared.CommonSharedLibraryAngular({}),
        }),

        // 🧱 Cho phép dynamic remote URL
        new ExternalRemotesPlugin(),

        // 🧱 Define môi trường
        new webpack.DefinePlugin({
            'process.env.MFE_CACHE_VERSION': JSON.stringify(Date.now()),
        }),

        // =============================
        // 🧱 WORKBOX SERVICE WORKER
        // =============================
        new GenerateSW({
            swDest: 'sw.js',
            skipWaiting: true,
            clientsClaim: true,
            cleanupOutdatedCaches: true,
            inlineWorkboxRuntime: true,

            runtimeCaching: [
                {
                    urlPattern: ({ url }) =>
                        url.pathname.endsWith('.woff') ||
                        url.pathname.endsWith('.woff2') ||
                        url.pathname.endsWith('.ttf'),
                    handler: 'CacheFirst',
                    options: {
                        cacheName: 'fonts-cache',
                        expiration: {
                            maxAgeSeconds: 60 * 60 * 24,
                        },
                    },
                },
                {
                    urlPattern: ({ url }) => url.pathname.endsWith('.css'),
                    handler: 'StaleWhileRevalidate',
                    options: {
                        cacheName: 'css-cache',
                    },
                },
                {
                    urlPattern: ({ request }) => request.destination === 'document',
                    handler: 'StaleWhileRevalidate',
                    options: {
                        cacheName: 'html-cache',
                    },
                },
                {
                    urlPattern: ({ url }) => url.pathname.endsWith('.js'),
                    handler: 'StaleWhileRevalidate',
                    options: {
                        cacheName: 'js-cache',
                    },
                },
            ],

            exclude: ['assets', /\.(woff2|woff|ttf|eot|svg|css|js)$/],
            maximumFileSizeToCacheInBytes: 4097152,
        }),
    ],

    // =============================
    // 🧱 TỐI ƯU BUILD
    // =============================
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
        runtimeChunk: false,
    },
};
