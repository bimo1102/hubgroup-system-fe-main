const params = `?version=${new Date().getTime()}`;
require('dotenv').config({ path: './.env.development' });

module.exports = {
    moduleName: 'GeneralApplication',
    remotes: {
        GeneralReactModule: `GeneralReactModule@${process.env.GeneralReactModuleUrl}/remoteEntry.js${params}`,
    },
    exposes: {
        './commonActions': '@hubgroup-share-system-fe/react/providers/context/common.reducer.tsx',
        './store': './src/shareds/providers/redux',
    },
};
