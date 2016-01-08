import React from "react";
import {connect} from "react-redux";
import MessageWriter from '../elements/messageWriter';
import MessageList from '../elements/messageList';
import {MESSAGE_CHANNEL} from '../../constants/ModelConstants';

class ChannelConversation extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        const {params, channels} = this.props;

        const channel = channels.data.filter((channel)=> {
            if (channel.id == params.id)
                return true;
        }).pop();

        return (
            <div id="page-wrapper">
                <div className="row row-header">
                    <div className="col-lg-12">
                        <h1 className="page-header">Kanal <b>{channel.name}</b></h1>
                    </div>
                </div>
                <div className="row">
                    <MessageList conversationType={MESSAGE_CHANNEL}
                                 referenceId={channel.id}/>
                </div>
                <div className="row row-writer">
                    <div className="col-lg-12">
                        <MessageWriter conversationType={MESSAGE_CHANNEL}
                                       referenceId={channel.id}/>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        channels: state.channels
    }
}

export default connect(mapStateToProps)(ChannelConversation);