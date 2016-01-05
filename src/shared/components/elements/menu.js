'use strict';
import React from 'react';

import Sidebar from './navigation/sidebar';
import Topbar from './navigation/topbar';

class Menu extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <nav className="navbar navbar-default navbar-static-top" role="navigation">
                <Topbar {...this.props}/>
                <Sidebar/>
            </nav>
        );
    }
}

export default Menu;
