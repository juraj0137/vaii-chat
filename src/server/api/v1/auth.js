import User from '../../../shared/model/user';
import express from 'express';
import jwt from 'jsonwebtoken'; // used to create, sign, and verify tokens
import config from '../../config';

const router = express.Router();

router.route('/connectCredentials').post((req, res) => {

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

router.route('/connectToken').post((req, res) => {

    const {token} = req.body;

    if (!token) {
        res.json({success: false, message: 'Invalid arguments'});
        return;
    }

    jwt.verify(token, config.authSecret, function(err, decoded) {
        if (err) {
            res.json({ success: false, message: 'Failed to authenticate token.' });
        } else {
            // if everything is good, save to request for use in other routes
            const {user} = decoded;
            res.json({
                success: true,
                message: 'Auth success',
                token: token,
                user
            });
        }
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
        "name": nick
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
    let {email, name, pass} = req.body;

    if (email)
        user.email = email;
    if (name)
        user.name = name;
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
