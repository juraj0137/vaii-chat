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

        const {conversationType, referenceId, messages, session} = this.props;

        const messageItems = messages.data
            .filter((message) => {
                return (message.referenceType == conversationType && (message.referenceId == referenceId || message.referenceId == session.user._id));
            }).map((message, id) => {
                            //<b className="message-user">{message.author.name} </b>
                return (
                    <li className="message-item" key={id}>
                        <span className="message-info">
                            <i className="message-time">{message.created}</i>
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

export default connect(mapStateToProps)(MessageList);