import socketio from 'socket.io';
import socketioJwt from 'socketio-jwt';
import wildcard from 'socketio-wildcard';
import http from 'http';

import config from '../config';
import * as ioConst from '../../shared/constants/SocketConstants';

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
                console.log(socket.decoded_token);

                socket.on('*', (msg)=>{
                    this.processEvent(msg);
                });
            });
    }

    processEvent(msg) {
        console.log(msg);
    }

}

