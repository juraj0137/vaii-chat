import React from "react";
import {connect} from "react-redux";
import { bindActionCreators } from 'redux';

import * as UsersActions from '../../actions/users';

import MessageWriter from '../elements/messageWriter';
import MessageList from '../elements/messageList';
import {MESSAGE_USER} from '../../constants/ModelConstants';

class UserConversation extends React.Component {

    constructor(props) {
        super(props);
    }

    getCurrentUser() {
        const {params, users} = this.props;
        return users.data.filter((user)=> {
            if (user.id == params.id)
                return true;
        }).pop();
    }

    loadChannelMessages() {

        const {session} = this.props;
        const user = this.getCurrentUser();
        const lastLoad = user.lastMessagesReload;
        const isLoading = typeof user.loading == "undefined" ? false : user.loading;

        if ( isLoading == false && (typeof lastLoad == "undefined" || (new Date() - new Date(lastLoad)) > 5 * 60 * 1000)) {
            setTimeout(()=>{
                this.props.actions.loadMessagesForUser(user.id, session.user._id);
            }, 50);
        }
    }

    render() {

        this.loadChannelMessages();
        const user = this.getCurrentUser();

        return (
            <div id="page-wrapper">
                <div className="row row-header">
                    <div className="col-lg-12">
                        <h1 className="page-header">Konverzacia s <b>{user.name}</b></h1>
                    </div>
                </div>
                <div className="row">
                    <MessageList conversationType={MESSAGE_USER}
                                 referenceId={user.id}/>
                </div>
                <div className="row row-writer">
                    <div className="col-lg-12">
                        <MessageWriter conversationType={MESSAGE_USER}
                                       referenceId={user.id}/>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        users: state.users,
        session: state.session
    }
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(UsersActions, dispatch)
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(UserConversation);