import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken'; // used to verify tokens
import config from '../config';

import user_v1 from './v1/user';
import channel_v1 from './v1/channel';
import message_v1 from './v1/message';
import conversation_v1 from './v1/conversation';
import auth_v1 from './v1/auth';

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/v1/auth', auth_v1);

app.use('/v1', (req, res, next) => {

    // check header or url parameters or post parameters for token
    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, config.authSecret, function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }
});

app.use('/v1/user', user_v1);
app.use('/v1/channel', channel_v1);
app.use('/v1/message', message_v1);
app.use('/v1/conversation', conversation_v1);

export default app;
