import User from '../../../shared/model/user';
import {USER_ACTIVE,USER_NONACTIVE} from '../../../shared/model/user'
import express from 'express';
import jwt from 'jsonwebtoken'; // used to create, sign, and verify tokens
import config from '../../config';

const router = express.Router();

router.route('/').post((req, res) => {

    const {email, pass} = req.body;

    User.findOne({
        "local.email": email
    }, (err, user)=> {

        if (!email && !pass) {
            res.json({success: false, message: 'Invalid arguments'});
            return;
        }


        if (err) {
            res.json({success: false, message: 'Database error'});
            return;
        }

        if (!user) {
            res.json({success: false, message: 'User not found'});
            return;
        }

        if (!user.validPassword(pass)) {
            res.json({success: false, message: 'Wrong pass'});
            return;
        }

        const token = jwt.sign({user: user}, config.authSecret, {
            expiresIn: '24h' // 24 hours
        });

        res.json({
            success: true,
            message: 'Auth success',
            token: token,
            user: user
        });

    });

});

export default router;
