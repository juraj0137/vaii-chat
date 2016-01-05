import React from 'react';
import ChannelList from '../channellist';
import UserList from '../userlist';

class SideBar extends React.Component {

    constructor(props) {
        super(props);
    }

    /**
     * fix - nemenilo activne linky v menu
     */
    handleLinkClick(e) {
        this.forceUpdate();
    }

    render() {
        return (
            <div>
                <div className="navbar-default sidebar" role="navigation">
                    <div className="sidebar-nav navbar-collapse">
                        <ChannelList onLinkClick={this.handleLinkClick.bind(this)}/>
                        <UserList onLinkClick={this.handleLinkClick.bind(this)}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default SideBar