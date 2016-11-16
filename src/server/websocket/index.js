import socketio from 'socket.io';
import socketioJwt from 'socketio-jwt';
import wildcard from 'socketio-wildcard';
import http from 'http';

import config from '../config';
import User from '../../shared/model/user';
import Channel from '../../shared/model/channel';
import Message from '../../shared/model/message';
import * as ioConst from '../../shared/constants/SocketConstants';
import * as modelConst from '../../shared/constants/ModelConstants';
import * as actions from '../../shared/constants/ActionTypes';

class SocketIO {

    constructor(expressApp) {
        const httpServer = http.Server(expressApp);
        this._io = socketio();
        this._io.use(wildcard());

        this.initWS();
        this._io.listen(3000)
    }

    initWS() {

        const io = this._io;

        io.on(ioConst.CONNECTION, socketioJwt.authorize({
                secret: config.authSecret,
                timeout: 15000 // 15 sekund
            }))
            .on(ioConst.AUTHENTICATED, (socket) => {
                console.log('connected: ' + socket.decoded_token.user.email);
                io.emit(actions.REGISTERED_NEW_USER_RELOAD, {data: ''});

                socket.on('*', (msg)=> {
                    this.processEvent(msg, socket);
                });
            });
    }

    processEvent(msg, userConn) {
        const io = this._io;
        const data = msg.data[1];
        let ioMsg = {};
        console.log(data.type);
        switch (data.type) {
            case actions.CHANNEL_ADD_START:
                const channel = new Channel();
                channel.name = data.channel.name;
                channel.save((err, channel) => {
                    if (err)
                        ioMsg = {
                            type: actions.CHANNEL_ADD_FAIL,
                            error: 'Chyba pri zapisovani do DB'
                        };
                    else
                        ioMsg = {
                            type: actions.CHANNEL_ADD_SUCCESS,
                            channel: {
                                name: channel.name,
                                id: channel._id
                            }
                        };
                    io.emit(ioMsg.type, {data: ioMsg});
                });
                break;
            case actions.CHANNELS_LOAD_START:
                Channel.find({}, (err, channels) => {
                    if (err)
                        ioMsg = {
                            type: actions.CHANNELS_LOAD_FAIL,
                            error: 'Chyba pri nacitani kanalov z DB'
                        };
                    else
                        ioMsg = {
                            type: actions.CHANNELS_LOAD_SUCCESS,
                            channels: channels.map((channel)=> {
                                return {
                                    name: channel.name,
                                    id: channel._id
                                }
                            })
                        };
                    userConn.emit(ioMsg.type, {data: ioMsg});
                });
                break;
            case actions.USERS_LOAD_START:
                User.find({}, (err, users)=> {
                    if (err)
                        ioMsg = {
                            type: actions.USERS_LOAD_FAIL,
                            error: 'Chyba pri nacitani kanalov z DB'
                        };
                    else
                        ioMsg = {
                            type: actions.USERS_LOAD_SUCCESS,
                            users: users.map((user)=> {
                                return {
                                    name: user.name,
                                    id: user._id
                                }
                            })
                        };

                    userConn.emit(ioMsg.type, {data: ioMsg});
                });
                break;

            case actions.MESSAGE_ADD_START:
                const message = new Message();
                const {referenceType, referenceId, content, authorId } = data.message;
                const date = new Date();
                message.created = date;
                message.content = content;
                message.referenceId = referenceId;
                message.referenceType = referenceType;
                message.author = authorId;
                message.save((err, message) => {
                    if (err) {

                        ioMsg = {
                            type: actions.MESSAGE_ADD_FAIL,
                            error: 'Chyba pri zapisovani do DB'
                        };
                        userConn.emit(ioMsg.type, {data: ioMsg});
                    }
                    else {
                        User.findOne({'_id': message.author}, (err, user)=> {
                            if (err) {
                                ioMsg = {
                                    type: actions.MESSAGE_ADD_FAIL,
                                    error: 'Chyba pri zapisovani do DB'
                                };
                                userConn.emit(ioMsg.type, {data: ioMsg});
                            } else {
                                ioMsg = {
                                    type: actions.MESSAGE_ADD_SUCCESS,
                                    message: {
                                        id: message._id,
                                        created: message.created,
                                        content: message.content,
                                        referenceId: message.referenceId,
                                        referenceType: message.referenceType,
                                        author: user
                                    }
                                };
                                io.emit(ioMsg.type, {data: ioMsg});
                            }
                        });
                    }
                });
                break;

            case actions.CHANNEL_MSG_LOAD_START:
                Message.find({
                        referenceId: data.channelId,
                        referenceType: modelConst.MESSAGE_CHANNEL
                    })
                    .populate('author')
                    .exec((err, messages)=> {
                        if (err) {

                            ioMsg = {
                                type: actions.CHANNEL_MSG_LOAD_FAIL,
                                error: 'Nastala chyba pri nacitani sprav'
                            };
                        } else {
                            const msgs = messages.map((message)=> {
                                return {
                                    id: message._id,
                                    created: message.created,
                                    content: message.content,
                                    referenceId: message.referenceId,
                                    referenceType: message.referenceType,
                                    author: message.author
                                }
                            });
                            ioMsg = {
                                type: actions.CHANNEL_MSG_LOAD_SUCCESS,
                                messages: msgs,
                                channelId: data.channelId
                            };
                        }
                        userConn.emit(ioMsg.type, {data: ioMsg});
                    });
                break;

            case actions.USER_MSG_LOAD_START:
                Message.find()
                    .or([
                        {
                            author: data.userId_1,
                            referenceId: data.userId_2,
                            referenceType: modelConst.MESSAGE_USER
                        }, {
                            author: data.userId_2,
                            referenceId: data.userId_1,
                            referenceType: modelConst.MESSAGE_USER
                        }
                    ])
                    .populate('author')
                    .exec((err, messages)=> {
                        if (err) {

                            ioMsg = {
                                type: actions.USER_MSG_LOAD_FAIL,
                                error: 'Nastala chyba pri nacitani sprav'
                            };
                        } else {
                            const msgs = messages.map((message)=> {
                                return {
                                    id: message._id,
                                    created: message.created,
                                    content: message.content,
                                    referenceId: message.referenceId,
                                    referenceType: message.referenceType,
                                    author: message.author
                                }
                            });
                            ioMsg = {
                                type: actions.USER_MSG_LOAD_SUCCESS,
                                messages: msgs,
                                userId_1: data.userId_1,
                                userId_2: data.userId_2
                            };
                        }
                        userConn.emit(ioMsg.type, {data: ioMsg});
                    });
                break;
            case actions.REGISTERED_NEW_USER:
                io.emit(actions.REGISTERED_NEW_USER_RELOAD, {data: ''});

        }
    }

}

export default SocketIO;
