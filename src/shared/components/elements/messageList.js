import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class MessageList extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.setMessageListHeight();
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    setMessageListHeight(){
        const window = $('body').height();
        const navbar = $('.navbar').height();
        const writter = $('.row-writer').height();
        const header = $('.row-header').height();
        const height = window - (navbar + writter + header + 20);
        $('.messages-wrapper').css({height: height + 'px'});
    }

    scrollToBottom(){
        const messageList = this.refs.messageList;
        messageList.scrollTop = messageList.scrollHeight;
    }

    render() {

        const {conversationType, referenceName, messages} = this.props;

        const messageItems = messages.data
            .filter((message) => {
                return (message.messageType == conversationType && message.referenceName == referenceName);
            }).map((message, id) => {
                return (
                    <li className="message-item" key={id}>
                        <span className="message-info">
                            <b className="message-user">{message.user} </b>
                            <i className="message-time">{message.time}</i>
                        </span>
                        <div className="message-text">{message.text}</div>
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
    referenceName: PropTypes.string.isRequired
};

/**
 * Mapping state data and actions to component props
 */
function mapStateToProps(state) {
    return {
        messages: state.messages
    };
}

export default connect(mapStateToProps)(MessageList);