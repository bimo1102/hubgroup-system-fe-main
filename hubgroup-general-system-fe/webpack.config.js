const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { container } = require('webpack');
const ExternalRemotesPlugin = require('external-remotes-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');
const webpack = require('webpack');
const federationConfig = require('./federation.config');
const WebpackShared = require('./../hubgroup-share-system-fe/tools/webpack.share');
const DotEnvWebpackPlugin = require('dotenv-webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ExternalRemotesWebpackPlugin = require('external-remotes-plugin');

// =============================
// 🧱 DEV SERVER
// =============================
/**@returns {Configuration['devServer']} */
const devServerConfigurations = () => {
    return {
        host: '0.0.0.0',
        port: 4400,
        allowedHosts: 'all',
        open: false,
        client: {
            progress: false,
            logging: 'info',
            overlay: {
                errors: true,
                runtimeErrors: false,
                warnings: false,
            },
        },
        static: [
            {
                directory: path.resolve(__dirname, './src/modules'),
                publicPath: '/',
                watch: true,
                // staticOptions: {}
            },
            {
                directory: path.resolve(__dirname, '../hubgroup-share-system-fe/plugins'),
                publicPath: '/assets/plugins',
                watch: true,
                // staticOptions: {}
            },
        ],
        hot: true,
        historyApiFallback: true,
        webSocketServer: 'ws',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
        },
    };
};

/**
 *
 * @param {*} env
 * @param {{
 *      mode: 'development' | 'production ',
 *      staging: boolean,
 *      production: boolean
 * }} args
 * @returns {Configuration}
 */

const webpackConfigurations = (env, args) => {
    const isDev = args.mode === 'development';
    let mainPlugins = [
        new webpack.ProgressPlugin({}),
        new DotEnvWebpackPlugin({
            allowEmptyValues: true,
            prefix: 'process.env.',
            path: (() => {
                const isDevelopmentProcess = !args.production && !args.staging && args.mode == 'development';
                const isStagingProgess = args.staging == true;
                if (isDevelopmentProcess) return path.resolve(__dirname, './.env.development');
                if (isStagingProgess) return path.resolve(__dirname, './.env.staging');
                return path.resolve(__dirname, './.env.production');
            })(),
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].bundle.css',
            chunkFilename: 'css/[name].chunks.bundle.css',
        }),
        new ExternalRemotesWebpackPlugin(),
    ];
    if (!isDev) {
        mainPlugins = [
            ...mainPlugins,
            new CleanWebpackPlugin({}),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: path.resolve(__dirname, '../hubgroup-share-system-fe/plugins/'),
                        to: 'assets/plugins/',
                        filter: (filepath) => {
                            if (filepath.includes('keenicons')) return false;
                            return true;
                        },
                    },
                ],
                options: {},
            }),
        ];
    }
    //use eval-source-map or cheap-source-map
    return {
        name: 'hubgroup-general-system-fe',
        devtool: isDev ? 'cheap-source-map' : false,
        target: 'web',
        mode: args.mode,
        entry: './src/index.tsx',
        devServer: devServerConfigurations(),
        output: {
            path: path.resolve(__dirname, './dist'),
            publicPath: 'auto',
            filename: '[name].bundle.js',
            chunkFilename: 'js/chunks/[name].[contenthash:6].chunks.bundle.js',
            scriptType: 'text/javascript',
            environment: {
                asyncFunction: false,
                arrowFunction: false,
                bigIntLiteral: false,
                const: false,
                destructuring: false,
                document: false,
                optionalChaining: false,
                templateLiteral: false,
            },
            uniqueName: federationConfig.moduleName,
            chunkFormat: 'array-push',
            chunkLoadTimeout: 12000,
            asyncChunks: true,
            charset: true,
            chunkLoading: 'jsonp',
            auxiliaryComment: {
                root: 'power_by_levanlam',
                amd: 'contact_levanlam_0799188772',
                commonjs: `lastest-build-time: ${new Date().getMilliseconds()}`,
            },
            iife: true,
            pathinfo: false,
            hashDigest: 'hex',
            hashFunction: 'md4',
            hashDigestLength: 20,
            compareBeforeEmit: true,
        },
        // =============================
        // 🧱 TỐI ƯU BUILD
        // =============================
        optimization: {
            minimize: isDev ? false : true,
            minimizer: ['...', new CssMinimizerWebpackPlugin({})],
            splitChunks: {
                chunks: 'async',
                filename: 'js/chunks/[name].[contenthash:6].chunks.bundle.js',
            },
            runtimeChunk: false,
        },
        // =============================
        // 🧱 PLUGINS
        // =============================
        plugins: [
            new HtmlWebpackPlugin({
                template: 'src/index.html',
            }),

            // 🧱 Module Federation HOST
            new container.ModuleFederationPlugin({
                name: federationConfig.moduleName,
                filename: 'remoteEntry.js',
                remotes: federationConfig.remotes,
                exposes: federationConfig.exposes,
                shared: WebpackShared.CommonSharedLibrary({ eager: true }),
            }),

            // 🧱 Cho phép dynamic remote URL
            new ExternalRemotesPlugin(),

            // 🧱 Define môi trường
            new webpack.DefinePlugin({
                'process.env.MFE_CACHE_VERSION': JSON.stringify(Date.now()),
                'process.env.BASE_API_URL': JSON.stringify(process.env.BASE_API_URL),
                'process.env.PREFIX_CLASS': JSON.stringify(process.env.PREFIX_CLASS),
                'process.env.MODULE_NAME': JSON.stringify(process.env.MODULE_NAME),
                'process.env.APP_VERSION': JSON.stringify(process.env.APP_VERSION),
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
        resolve: {
            extensions: ['.tsx', '.ts', '.jsx', '.js'],
            alias: {
                '@hubgroup-share-system-fe': path.resolve(__dirname, '../hubgroup-share-system-fe'),
                '@shareds': path.resolve(__dirname, './src/app/shareds'),
                '@modules': path.resolve(__dirname, './src/app/modules'),
                '@routing': path.resolve(__dirname, './src/app/routing'),
                '@app': path.resolve(__dirname, './src/app'),
                '@_metronic': ['./src/_metronic'],
            },
            modules: [path.resolve(__dirname, 'node_modules')],
        },
        // =============================
        // 🧱 LOADERS
        // =============================
        module: {
            rules: [
                {
                    test: /\.(tsx|ts|jsx|js|mjs)$/i,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['@babel/preset-env', {}],
                                ['@babel/preset-typescript', {}],
                                ['@babel/preset-react', {}],
                            ],
                            plugins: ['@babel/plugin-transform-runtime'],
                        },
                    },
                    exclude: [/node_modules/, path.resolve(__dirname, '../hubgroup-share-system-fe/external-libs')],
                },
                {
                    test: /\.(scss|sass|css)/i,
                    use: [
                        // {
                        //     loader: MiniCssExtractPlugin.loader,
                        //     options: {}
                        // },
                        {
                            loader: 'style-loader',
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1,
                                sourceMap: isDev,
                            },
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                postcssOptions: {
                                    plugins: [
                                        ['tailwindcss', {}],
                                        !isDev && [
                                            'postcss-preset-env',
                                            {
                                                browsers: 'last 2 versions',
                                                autoprefixer: {
                                                    flexbox: 'no-2009',
                                                    grid: 'autoplace',
                                                },
                                            },
                                        ],
                                        !isDev && [
                                            'postcss-prefix-selector',
                                            {
                                                prefix: `.${gennerateRuntime}`,
                                                transform(prefix, selector, prefixedSelector, filePath, rule) {
                                                    // console.log(filePath);
                                                    // const splitPath = filePath.split('\\');
                                                    return selector;
                                                    if (filePath.match(/node_modules/) || filePath.match(/tailwind/)) {
                                                        return selector;
                                                    }
                                                    // console.log(splitPath);
                                                    // console.log(splitPath[splitPath.indexOf('modules') + 1]);
                                                    // console.log(prefixedSelector + splitPath[splitPath.includes('modules') + 1]);
                                                    // return  `.${gennerateRuntime}${splitPath[splitPath.indexOf('modules') + 1]}` + prefixedSelector;
                                                    return prefixedSelector;
                                                },
                                            },
                                        ],
                                    ],
                                },
                            },
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: isDev,
                                additionalData: (content, loaderContext) => {
                                    // More information about available properties https://webpack.js.org/api/loaders/
                                    const { resourcePath, rootContext } = loaderContext;
                                    const relativePath = path.relative(rootContext, resourcePath);
                                    if (
                                        relativePath.includes('hubgroup-share-system-fe') &&
                                        relativePath.includes('global-styles.scss')
                                    ) {
                                        return isDev ? content : '';
                                    }
                                    return content;
                                },
                            },
                        },
                    ],
                },
            ],
        },
        snapshot: {
            managedPaths: [
                path.resolve(__dirname, 'node_modules'),
                path.resolve(__dirname, '../hubgroup-share-system-fe/external-libs'),
            ],
        },
    };
};

module.exports = webpackConfigurations;
