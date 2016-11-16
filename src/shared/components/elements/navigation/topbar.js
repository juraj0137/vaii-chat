import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as AuthActions from '../../../actions/auth';

class Topbar extends React.Component {

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
            <div>
                <div className="navbar-header">
                    <button type="button" className="navbar-toggle" data-toggle="collapse"
                            data-target=".navbar-collapse">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"/>
                        <span className="icon-bar"/>
                        <span className="icon-bar"/>
                    </button>
                    <Link to="/" className="navbar-brand">VAII chat v0.0.1</Link>
                </div>
                <ul className="nav navbar-top-links navbar-right">
                    <li className="dropdown">
                        <a className="dropdown-toggle" data-toggle="dropdown" href="#">
                            {this.props.session.user.name}<i className="fa fa-user fa-fw"/> <i className="fa fa-caret-down"/>
                        </a>
                        <ul className="dropdown-menu dropdown-user">
                            <li>
                                <a onClick={this.handleLogout.bind(this)}>
                                    <i className="fa fa-sign-out fa-fw"/>Logout
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
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

export default connect(mapStateToProps, mapDispatchToProps)(Topbar);
