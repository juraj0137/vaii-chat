import socketio from 'socket.io';
import socketioJwt from 'socketio-jwt';
import wildcard from 'socketio-wildcard';
import http from 'http';

import config from '../config';
import User from '../../shared/model/user';
import Channel from '../../shared/model/channel';
import * as ioConst from '../../shared/constants/SocketConstants';
import * as actions from '../../shared/constants/ActionTypes';

export default class SocketIO {

    constructor(expressApp) {
        const httpServer = http.Server(expressApp);
        this._io = socketio();
        this._io.use(wildcard());

        this.init();
        this._io.listen(3000)
    }

    init() {

        const io = this._io;

        io.on(ioConst.CONNECTION, socketioJwt.authorize({
                secret: config.authSecret,
                timeout: 15000 // 15 sekund
            }))
            .on(ioConst.AUTHENTICATED, (socket) => {
                console.log('connected & authenticated: ');
                console.log(socket.decoded_token.user.email);

                socket.on('*', (msg)=> {
                    this.processEvent(msg);
                });
            });
    }

    processEvent(msg) {
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
            case actions.CHANNEL_LOAD_START:
                Channel.find({}, (err, channels) => {
                    if (err)
                        ioMsg = {
                            type: actions.CHANNEL_LOAD_FAIL,
                            error: 'Chyba pri nacitani kanalov z DB'
                        };
                    else
                        ioMsg = {
                            type: actions.CHANNEL_LOAD_SUCCESS,
                            channels: channels.map((channel)=> {
                                return {
                                    name: channel.name,
                                    id: channel._id
                                }
                            })
                        };
                    io.emit(ioMsg.type, {data: ioMsg});
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

                    console.log(ioMsg);
                    io.emit(ioMsg.type, {data: ioMsg});
                });
                //User.find({}, (err, users) => {
                //    if (err)
                //        ioMsg = {
                //            type: actions.USERS_LOAD_FAIL,
                //            error: 'Chyba pri nacitani kanalov z DB'
                //        };
                //    else
                //        ioMsg = {
                //            type: actions.USERS_LOAD_SUCCESS,
                //            users: users.map((user)=> {
                //                return {
                //                    name: user.name,
                //                    id: user._id
                //                }
                //            })
                //        };
                //
                //    console.log(ioMsg);
                //    io.emit(ioMsg.type, {data: ioMsg});
                //});
                break;
        }
    }

}

