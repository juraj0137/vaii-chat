import Message from '../../../shared/model/message';

import express from 'express';

const router = express.Router();

router.route('/')
    .post((req, res) => {

        let message = new Message();
        let {name, type} = req.body;

        if (!type) {
            type = CHANNEL_PRIVATE;
        }
        message.type = type;

        if (name)
            message.name = name;


        message.save((err)=> {
            if (err)
                res.send(err);

            res.json({
                message: 'Message created',
                messageObj: message
            })
        });
    })
    .get((req, res)=> {
        Message.find((err, messages) => {
            if (err)
                res.send(err);

            res.json(messages);
        })
    });

router.route('/:messageId')
    .get((req, res) => {

        const {messageId} = req.params;

        Message.findById(messageId, (err, message)=> {
            if (err)
                res.send(err);
            res.json(message);
        });

    })
    .put((req, res) => {

        const {messageId} = req.params;

        Message.findById(messageId, (err, message) => {

            if (err)
                res.send(err);

            const {name, type} = req.body;

            if (type && (type == CHANNEL_PRIVATE || type == CHANNEL_PUBLIC))
                message.type = type;

            if (name)
                message.name = name;

            message.save((err) => {
                if (err) {
                    res.send(err);
                    return;
                }

                res.json({
                    message: 'Message updated!',
                    messageObj: message
                });
            });

        });
    })
    .delete((req, res) => {

        const {messageId} = req.params;

        Message.remove({
            _id: messageId
        }, (err, message) => {
            if (err)
                res.send(err);

            res.json({message: 'Successfully deleted'});
        });
    });

export default router;
