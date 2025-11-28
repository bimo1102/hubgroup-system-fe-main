const params = `?version=${new Date().getTime()}`;
require('dotenv').config({ path: './.env.development' });

module.exports = {
    moduleName: 'GeneralReactModule',
    exposes: {
        './service-category': './src/modules/service-category/app.tsx',
    },

    remotes:
        process.env.STANDALONE === 'true'
            ? {}
            : {
                  GeneralApplication: `GeneralApplication@${process.env.GeneralApplicationModuleUrl}/remoteEntry.js`,
              },
};
