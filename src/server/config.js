/*eslint quotes: [0]*/
'use strict';

const config = {
    'port': process.env.PORT || '8080',
    'mongoDb': {
        'url': 'mongodb://127.0.0.1:27017/vaii-chat'
    },
    'authSecret': 'superauthnenticationsecret'
};

export default config;