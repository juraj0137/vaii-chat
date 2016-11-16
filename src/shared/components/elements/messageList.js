import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as modelConst from '../../constants/ModelConstants';
import Utils from '../../utils';
import {markReadedMessages} from '../../actions/message';

class MessageList extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.setMessageListHeight();
        this.scrollToBottom();
        this.markReadedMessages();
    }

    componentDidUpdate() {
        this.scrollToBottom();
        this.markReadedMessages();
    }

    setMessageListHeight() {
        const window = $('body').height();
        const navbar = $('.navbar').height();
        const writter = $('.row-writer').height();
        const header = $('.row-header').height();
        const height = window - (navbar + writter + header + 20);
        $('.messages-wrapper').css({height: height + 'px'});
    }

    scrollToBottom() {
        const messageList = this.refs.messageList;
        messageList.scrollTop = messageList.scrollHeight;
    }

    filterMessages() {

        const {conversationType, referenceId, messages, session} = this.props;

        this._messages = messages.data
            .filter((message) => {

                if (message.referenceType != conversationType)
                    return false;

                if (conversationType == modelConst.MESSAGE_CHANNEL) {
                    return (message.referenceId == referenceId);
                } else if (conversationType == modelConst.MESSAGE_USER) {
                    const user1 = message.author._id;
                    const user2 = message.referenceId;
                    return ((user1 == session.user._id && user2 == referenceId) || (user1 == referenceId && user2 == session.user._id));
                } else {
                    return false
                }

            });
    }

    markReadedMessages() {
        const messageIds = this._messages.
            filter((message)=> {
                const readed = typeof message.readed != "undefined" ? message.readed : true;

                return readed == false;
            })
            .map((message) => {
                return message.id
            });
        if (messageIds.length > 0)
            this.props.markReadedMessages(messageIds);

    }


    render() {

        this.filterMessages();

        const messageItems = this._messages.map((message, id) => {

            const author = message.author != null ? message.author.name : '';
            const userColor = Utils.generateUserColor(author);
            return (
                <li className="message-item" key={id}>
                        <span className="message-info">
                            <b className="message-user" style={{color: userColor}}>{author} </b>
                            <i className="message-time">{Utils.formatMessageDate(message.created)}</i>
                        </span>
                    <div className="message-text">{message.content}</div>
                </li>
            );
        });

        return (
            <ul className="messages-wrapper" ref="messageList">
                {messageItems}
            </ul>
        );
    }
}

MessageList.propTypes = {
    conversationType: PropTypes.string.isRequired,
    referenceId: PropTypes.string.isRequired
};

/**
 * Mapping state data and actions to component props
 */
function mapStateToProps(state) {
    return {
        messages: state.messages,
        session: state.session
    };
}
function mapDispatchToProps(dispatch) {
    return {
        markReadedMessages: bindActionCreators(markReadedMessages, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(MessageList);