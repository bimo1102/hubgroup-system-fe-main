const { container } = require('webpack');
const webpack = require('webpack');
const federationConfigurations = require('./federation.config');
const WebpackShared = require('./../hubgroup-share-system-fe/tools/webpack.share');

const webpackConfigurations = () => {
    const isDevMfe = process.env.NODE_ENV == 'development_mfe';
    const isProd = !process.env.NODE_ENV;
    let plugins = [];
    let devServerConfigs = {};
    if (isDevMfe || isProd) {
        devServerConfigs = {
            ...devServerConfigs,
            webSocketServer: false,
            // client: {
            //     webSocketURL: {
            //       hostname: '0.0.0.0',
            //       pathname: '/ws',
            //       port: 4401,
            //       protocol: 'ws'
            //     },
            // },
        };
        plugins = [
            ...plugins,
            new container.ModuleFederationPlugin({
                name: federationConfigurations.moduleName,
                exposes: federationConfigurations.exposes,
                remotes: federationConfigurations.remotes,
                filename: 'remoteEntry.js',
                shared: WebpackShared.CommonSharedLibraryAngular({}),
            }),
            new webpack.DefinePlugin({
                ngDevMode: 'undefined',
            }),
        ];
    }
    return {
        name: 'hubgroup-general-angular-system-fe',
        output: {
            publicPath: 'auto',
            environment: {
                asyncFunction: true,
            },
            uniqueName: federationConfigurations.moduleName,
            scriptType: 'text/javascript',
        },
        plugins: plugins,
        devServer: {
            port: 4401,
            host: '0.0.0.0',
            allowedHosts: 'all',
            open: false,
            ...devServerConfigs,
        },
        optimization: {
            runtimeChunk: false,
        },
    };
};

module.exports = webpackConfigurations();
