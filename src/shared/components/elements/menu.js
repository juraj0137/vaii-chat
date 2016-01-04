'use strict';
import React from 'react';
import { Link } from 'react-router';
import * as AuthActions from '../../actions/auth';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ChannelList from './channellist';

class NavTop extends React.Component {

    constructor(props) {
        super(props);
    }

    handleLogout(e) {
        e.preventDefault();
        this.props.actions.disconnect("Boli ste uspesne odhlaseny", ()=> {
            this.redirectAfterLogout()
        });
    }

    redirectAfterLogout() {
        const {history, location} = this.props;
        history.replaceState(null, '/login');
    }

    render() {
        return (
            <ul className="nav navbar-top-links navbar-right">
                <li className="dropdown">
                    <a className="dropdown-toggle" data-toggle="dropdown" href="#">
                        <i className="fa fa-user fa-fw"/> <i className="fa fa-caret-down"/>
                    </a>
                    <ul className="dropdown-menu dropdown-user">
                        <li><a href="#"><i className="fa fa-gear fa-fw"/> Settings</a></li>
                        <li className="divider"/>
                        <li><a onClick={this.handleLogout.bind(this)}><i className="fa fa-sign-out fa-fw"/> Logout</a>
                        </li>
                    </ul>
                </li>
            </ul>
        );
    }
}

class NavHeader extends React.Component {

    constructor() {
        super();
    }

    render() {
        return (
            <div className="navbar-header">
                <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                    <span className="sr-only">Toggle navigation</span>
                    <span className="icon-bar"/>
                    <span className="icon-bar"/>
                    <span className="icon-bar"/>
                </button>
                <a className="navbar-brand" href="index.html">VAII chat v0.0.1</a>
            </div>
        );
    }
}

class SideMenu extends React.Component {

    constructor(props) {
        super(props);
        this._users = [
            {
                text: "Juraj Kubala",
                href: "/message/1325649321",
                icon: "user"
            },
            {
                text: "Ferko Mrkva",
                href: "/message/1325649321",
                icon: "user"
            },
            {
                text: "Kacer Donald",
                href: "/message/1325649321",
                icon: "user"
            }
        ];

    }

    render() {

        var channels = '',
            users = '';

        var mapMenuItem = function (item, id) {
            if (item.text.length > 0) {
                let iconClassName = ['fa', 'fa-' + item.icon, 'fa-fw'].join(' ');
                return (
                    <li key={id}>
                        <Link to={item.href} activeClassName="active">
                            <i className={iconClassName}/> {item.text}
                        </Link>
                    </li>
                )
            }
        };

        users = this._users.map(mapMenuItem);

        return (
            <div>
                <div className="navbar-default sidebar" role="navigation">
                    <div className="sidebar-nav navbar-collapse">
                        <ChannelList/>
                        <ul className="nav">
                            <li className="sidebar-empty-item"/>
                            <li className="sidebar-static-item"><span>POUZIVATELIA</span></li>
                            {users}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

class Menu extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {


        return (
            <div>
                <nav className="navbar navbar-default navbar-static-top" role="navigation"
                     style={{marginBottom: 0 + 'px'}}>
                    <NavHeader/>
                    <NavTop {...this.props}/>
                    <SideMenu/>
                </nav>
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        session: state.session
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(AuthActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
