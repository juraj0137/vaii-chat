import User from '../../../shared/model/user';
import {USER_ACTIVE,USER_NONACTIVE} from '../../../shared/model/user'
import express from 'express';

const router = express.Router();

function setLocalData(user, local) {

    if (local.email)
        user.local.email = local.email;

    if (local.pass)
        user.local.pass = user.generateHash(local.pass);

    if (local.status && (local.status == USER_ACTIVE || local.status == USER_NONACTIVE))
        user.local.status = local.status;

    if (local.displayName)
        user.local.displayName = local.displayName;

    return user;
}

router.route('/')
    .post((req, res) => {

        let user = new User();
        let {local} = req.body;

        if (local) {
            local.status = USER_ACTIVE;
            user = setLocalData(user, local);
        }

        user.save((err)=> {
            if (err)
                res.send(err);

            res.json({
                message: 'User created',
                user: user
            })
        });
    })
    .get((req, res)=> {
        User.find((err, users) => {
            if (err)
                res.send(err);

            res.json(users);
        })
    });

router.route('/:userId')
    .get((req, res) => {

        const {userId} = req.params;

        User.findById(userId, (err, user)=> {
            if (err)
                res.send(err);
            res.json(user);
        });

    })
    .put((req, res) => {

        const {userId} = req.params;

        User.findById(userId, (err, user) => {

            if (err)
                res.send(err);

            const {local} = req.body;

            if (local)
                user = setLocalData(user, local);

            user.save((err) => {
                if (err) {
                    res.send(err);
                    return;
                }

                res.json({
                    message: 'User updated!',
                    user: user
                });
            });

        });
    })
    .delete((req, res) => {

        const {userId} = req.params;

        User.remove({
            _id: userId
        }, (err, user) => {
            if (err)
                res.send(err);

            res.json({message: 'Successfully deleted'});
        });
    });

export default router;
