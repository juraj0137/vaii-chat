import React from "react";
import MessageWriter from '../elements/messageWriter';
import MessageList from '../elements/messageList';
import {MESSAGE_USER} from '../../constants/ModelConstants';

class UserConversation extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        const {params} = this.props;

        return (
            <div id="page-wrapper">
                <div className="row row-header">
                    <div className="col-lg-12">
                        <h1 className="page-header">Konverzacia s <b>{params.name}</b></h1>
                    </div>
                </div>
                <div className="row">
                    <MessageList conversationType={MESSAGE_USER}
                                 referenceName={params.name}/>
                </div>
                <div className="row row-writer">
                    <div className="col-lg-12">
                        <MessageWriter conversationType={MESSAGE_USER}
                                       referenceName={params.name}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default UserConversation;