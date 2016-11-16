import React from "react";
import {connect} from "react-redux";
import { bindActionCreators } from 'redux';

import * as ChannelActions from '../../actions/channels';

import MessageWriter from '../elements/messageWriter';
import MessageList from '../elements/messageList';
import {MESSAGE_CHANNEL} from '../../constants/ModelConstants';

class ChannelConversation extends React.Component {

    constructor(props) {
        super(props);
    }

    getCurrentChannel() {
        const {params, channels} = this.props;
        return channels.data.filter((channel)=> {
            if (channel.id == params.id)
                return true;
        }).pop();
    }

    loadChannelMessages() {

        this._channel = this.getCurrentChannel();

        const channel = this._channel;
        const lastLoad = channel.lastMessagesReload;
        const isLoading = typeof channel.loading == "undefined" ? false : channel.loading;

        if ( isLoading == false && (typeof lastLoad == "undefined" || (new Date() - new Date(lastLoad)) > 5 * 60 * 1000)) {
            setTimeout(()=>{
                this.props.actions.loadMessagesForChannel(channel.id)
            }, 50);
        }
    }

    render() {

        this.loadChannelMessages();
        const channel = this.getCurrentChannel();

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
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(ChannelActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelConversation);