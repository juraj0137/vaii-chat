import User from '../../../shared/model/user';
import express from 'express';

const router = express.Router();

router.route('/')
    .post((req, res) => {


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
                res.json({
                    success: false,
                    error: err
                });

            res.json({
                success: true,
                users: users
            });
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

            let {email, name, pass} = req.body;

            if (email)
                user.email = email;
            if (name)
                user.name = name;
            if (email)
                user.pass = user.generateHash(pass);

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
