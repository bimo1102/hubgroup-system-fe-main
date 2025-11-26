const webpack = require('webpack');
const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DotEnvWebpackPlugin = require('dotenv-webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { Configuration } = require('webpack');
const ExternalRemotesWebpackPlugin = require('external-remotes-plugin');
const { v4: uuid } = require('uuid');
const federationConfigurations = require('./federation.config');
const package = require('./package.json');
const WebpackShared = require('./../hubgroup-share-system-fe/tools/webpack.share');
const gennerateRuntime = getLettersOnlyUUID();
const CopyWebpackPlugin = require('copy-webpack-plugin');

/**@returns {Configuration['devServer']} */
const devServerConfigurations = (isDev) => {
    return {
        host: '0.0.0.0',
        port: 4406,
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
        historyApiFallback: false,
        webSocketServer: 'ws',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
        },
    };
};

function getLettersOnlyUUID() {
    const instance = uuid();
    const lettersOnly = instance.replace(/[^a-zA-Z]/g, '');
    // return package.name + lettersOnly;
    return federationConfigurations.moduleName;
}

const getModulesFile = (isDev) => {
    /**@type {Configuration['entry']} */
    const entrypoints = {};
    const chunks = {};
    const moduleLists = glob.sync(path.resolve(__dirname, './src/modules/*/index.tsx'));
    moduleLists.forEach((modulePath) => {
        const splitModule = modulePath.split('/');
        const moduleName = splitModule[splitModule.length - 2];
        const keyDefine = `js/${moduleName}`;
        const libraryName = moduleName + 'Module';
        entrypoints[keyDefine] = {
            import: modulePath,
            library: {
                type: 'umd',
                umdNamedDefine: true,
                export: 'default',
                name: libraryName,
            },
        };
    });
    return { entrypoints, chunks };
};

const getPluginsTemplateFile = (isDev) => {
    /**@type {Configuration['plugins']} */
    const pluginTemplates = [];
    const moduleLists = glob.sync(path.resolve(__dirname, './src/modules/*/index.html'));
    moduleLists.forEach((modulePath) => {
        const splitModule = modulePath.split('/');
        const moduleName = splitModule[splitModule.length - 2];
        const libraryName = `${moduleName}.html`;
        const chunksData = `js/${moduleName}`;
        pluginTemplates.push(
            new HtmlWebpackPlugin({
                filename: isDev ? moduleName + '/index.html' : libraryName,
                cache: true,
                publicPath: 'auto',
                inject: 'body',
                minify: false,
                title: moduleName,
                template: modulePath,
                chunks: [chunksData],
                scriptLoading: 'defer',
                templateParameters: {
                    // gennerateRuntime: gennerateRuntime + moduleName,
                    gennerateRuntime: gennerateRuntime,
                },
            })
        );
    });
    return pluginTemplates;
};

const getProgressCompiler = () => {};

const getExposeFederationModules = (isDev) => {
    const exposeLists = {};
    // const moduleLists = glob.sync(path.resolve(__dirname,'./src/exposes/*.{ts,tsx,js,jsx}'));
    // moduleLists.forEach(modulePath => {
    //     const splitModule = modulePath.split('/');
    //     const moduleName = splitModule[splitModule.length - 1];
    //     exposeLists[`./${moduleName.split('.')[0]}`] = modulePath;
    // });
    return new webpack.container.ModuleFederationPlugin({
        // shareScope: 'default',
        filename: 'remoteEntry.js',
        name: federationConfigurations.moduleName,
        exposes: federationConfigurations.exposes,
        shared: WebpackShared.CommonSharedLibrary({}),
        remotes: federationConfigurations.remotes,
    });
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
        new webpack.DefinePlugin({
            'process.env.MFE_CACHE_VERSION': JSON.stringify(Date.now()),
            'process.env.BASE_API_URL': JSON.stringify(process.env.BASE_API_URL),
            'process.env.PREFIX_CLASS': JSON.stringify(process.env.PREFIX_CLASS),
            'process.env.MODULE_NAME': JSON.stringify(process.env.MODULE_NAME),
            'process.env.APP_VERSION': JSON.stringify(process.env.APP_VERSION),
        }),
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
    return {
        // context: path.resolve(__dirname,'../'),
        name: 'tyt-reception-system-fe',
        devtool: isDev ? 'cheap-source-map' : false,
        target: 'web',
        mode: args.mode,
        entry: getModulesFile(isDev).entrypoints,
        devServer: devServerConfigurations(isDev),
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
            uniqueName: federationConfigurations.moduleName,
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
        optimization: {
            minimize: isDev ? false : true,
            minimizer: ['...', new CssMinimizerWebpackPlugin({})],
            splitChunks: {
                chunks: 'async',
                filename: 'js/chunks/[name].[contenthash:6].chunks.bundle.js',
            },
            runtimeChunk: false,
        },
        plugins: [...mainPlugins, ...getPluginsTemplateFile(isDev), getExposeFederationModules(isDev)],
        resolve: {
            extensions: ['.tsx', '.ts', '.jsx', '.js'],
            plugins: [
                new TsconfigPathsPlugin({
                    // baseUrl: __dirname
                }),
            ],
            modules: [path.resolve(__dirname, 'node_modules')],
        },
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
