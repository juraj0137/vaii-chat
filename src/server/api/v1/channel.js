//import Channel from '../../../shared/model/channel';
//import {CHANNEL_PRIVATE,CHANNEL_PUBLIC} from '../../../shared/model/channel';

import express from 'express';

const router = express.Router();
/*
router.route('/')
    .post((req, res) => {

        let channel = new Channel();
        let {name, type} = req.body;

        if (name)
            channel.name = name;


        channel.save((err)=> {
            if (err)
                res.send(err);

            res.json({
                message: 'Channel created',
                channel: channel
            })
        });
    })
    .get((req, res)=> {
        Channel.find((err, channels) => {
            if (err)
                res.send(err);

            res.json(channels);
        })
    });

router.route('/:channelId')
    .get((req, res) => {

        const {channelId} = req.params;

        Channel.findById(channelId, (err, channel)=> {
            if (err)
                res.send(err);
            res.json(channel);
        });

    })
    .put((req, res) => {

        const {channelId} = req.params;

        Channel.findById(channelId, (err, channel) => {

            if (err)
                res.send(err);

            const {name, type} = req.body;

            if (name)
                channel.name = name;

            channel.save((err) => {
                if (err) {
                    res.send(err);
                    return;
                }

                res.json({
                    message: 'Channel updated!',
                    channel: channel
                });
            });

        });
    })
    .delete((req, res) => {

        const {channelId} = req.params;

        Channel.remove({
            _id: channelId
        }, (err, channel) => {
            if (err)
                res.send(err);

            res.json({message: 'Successfully deleted'});
        });
    });
*/
export default router;
