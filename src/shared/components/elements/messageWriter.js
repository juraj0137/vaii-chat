import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Input } from 'react-bootstrap';
import {MESSAGE_CHANNEL, MESSAGE_USER} from '../../constants/ModelConstants';
import * as MessageActions from '../../actions/message';


class MessageWriter extends Component {

    constructor(props, context) {
        super(props);
        this.state = {
            text: '',
            typing: false
        };
    }

    handleSubmit(event) {

        const text = event.target.value.trim();

        if (event.which === 13 && text.length > 0) {
            event.preventDefault();
            var newMessage = {
                referenceType: this.props.conversationType,
                referenceId: this.props.referenceId,
                content: text,
                authorId: this.props.session.user.id
            };

            this.props.actions.addMessage(newMessage);
            this.setState({text: '', typing: false});
        }
    }

    handleChange(event) {

        this.setState({text: event.target.value});

        if (event.target.value.length > 0 && !this.state.typing) {
            this.setState({typing: true});
        }

        if (event.target.value.length === 0 && this.state.typing) {
            this.setState({typing: false});
        }
    }

    render() {
        return (
            <div className="writter-wrapper">
                <Input type="textarea"
                       className="writter"
                       name="message"
                       autoFocus="true"
                       placeholder="Tu piste svoju spravu"
                       value={this.state.text}
                       onChange={this.handleChange.bind(this)}
                       onKeyDown={this.handleSubmit.bind(this)}/>
            </div>
        );
    }
}

MessageWriter.propTypes = {
    conversationType: PropTypes.string.isRequired,
    referenceId: PropTypes.string.isRequired
};


/**
 * Mapping state data and actions to component props
 */
function mapStateToProps(state) {
    return {
        session: state.session
    };
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(MessageActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageWriter);