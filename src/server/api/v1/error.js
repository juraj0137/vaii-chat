import Error from '../../../shared/model/error';
import express from 'express';

const router = express.Router();

router.route('/')
    .post((req, res) => {

        const {useragent, message} = req.body;

        if (!useragent && !message) {
            res.json({
                message: 'Error not logged'
            });
            return;
        }

        let error = new Error();
        error.useragent = useragent;
        error.message = message;

        error.save((err)=> {
            if (err)
                res.send(err);

            res.json({
                message: 'Error logged'
            })
        });

    })
    .get((req, res)=> {
        Error.find((err, users) => {
            if (err)
                res.send(err);

            res.json(users);
        })
    });
export default router;