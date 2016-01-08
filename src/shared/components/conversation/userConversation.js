import React from "react";
import {connect} from "react-redux";
import MessageWriter from '../elements/messageWriter';
import MessageList from '../elements/messageList';
import {MESSAGE_USER} from '../../constants/ModelConstants';

class UserConversation extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        const {params, users} = this.props;

        const user = users.data.filter((user)=> {
            if (user.id == params.id)
                return true;
        }).pop();

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
        users: state.users
    }
}

export default connect(mapStateToProps)(UserConversation);