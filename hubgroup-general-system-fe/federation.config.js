const params = `?version=${new Date().getTime()}`;
require('dotenv').config({ path: './.env.development' });

module.exports = {
    moduleName: 'GeneralApplication',
    remotes: {
        GeneralApplication: `GeneralApplication@${process.env.GeneralApplicationUrl}/remoteEntry.js`,
        GeneralReactModule: `GeneralReactModule@${process.env.GeneralReactModuleUrl}/remoteEntry.js${params}`,
    },
    exposes: {
        './commonActions': '@hubgroup-share-system-fe/react/providers/context/common.reducer.tsx',
        './store': '@shareds/providers/redux/store.tsx',
    },
};
