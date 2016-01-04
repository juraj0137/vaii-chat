import React from "react";
import MessageWriter from '../elements/messageWriter';
import MessageList from '../elements/messageList';
import {MESSAGE_CHANNEL} from '../../constants/ModelConstants';

class ChannelConversation extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        const {params} = this.props;

        return (
            <div id="page-wrapper">
                <div className="row row-header">
                    <div className="col-lg-12">
                        <h1 className="page-header">Kanal <b>{params.name}</b></h1>
                    </div>
                </div>
                <div className="row">
                    <MessageList conversationType={MESSAGE_CHANNEL}
                                 referenceName={params.name}/>
                </div>
                <div className="row row-writer">
                    <div className="col-lg-12">
                        <MessageWriter conversationType={MESSAGE_CHANNEL}
                                       referenceName={params.name}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default ChannelConversation;