import User from '../../../shared/model/user';
import {USER_ACTIVE,USER_NONACTIVE} from '../../../shared/model/user'
import express from 'express';
import jwt from 'jsonwebtoken'; // used to create, sign, and verify tokens
import config from '../../config';

const router = express.Router();

router.route('/').post((req, res) => {

    const {email, pass} = req.body;

    if (!email && !pass) {
        res.json({success: false, message: 'Invalid arguments'});
        return;
    }

    User.findOne({
        "email": email
    }, (err, user)=> {


        if (err) {
            res.json({success: false, message: 'Database error'});
            return;
        }

        if (!user) {
            res.json({success: false, message: 'Uzivatel nenajdeny'});
            return;
        }

        if (!user.validPassword(pass)) {
            res.json({success: false, message: 'Nespravne heslo'});
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

router.route('/verifyEmail').post((req, res) => {
    const {email} = req.body;

    User.findOne({
        "email": email
    }, (err, user)=> {

        let returnMessage = {
            success: false,
            message: 'Email sa pouziva'
        };

        if (!user) {
            returnMessage = {
                success: true,
                message: 'Email je volny'
            };
        }

        res.json(returnMessage);

    });
});

router.route('/verifyNick').post((req, res) => {
    const {nick} = req.body;

    User.findOne({
        "displayName": nick
    }, (err, user)=> {

        let returnMessage = {
            success: false,
            message: 'Nick sa pouziva'
        };

        if (!user) {
            returnMessage = {
                success: true,
                message: 'Nick je volny'
            };
        }

        res.json(returnMessage);

    });
});


router.route('/register').post((req, res) => {

    let user = new User();
    let {email, displayName, pass} = req.body;

    if (email)
        user.email = email;
    if (displayName)
        user.displayName = displayName;
    if (email)
        user.pass = user.generateHash(pass);

    user.save((err)=> {
        if (err)
            res.json({
                success: false,
                error: err
            });

        res.json({
            success: true,
            message: 'User created',
            user: user
        })
    });
});

export default router;
