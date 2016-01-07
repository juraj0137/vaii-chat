import React from "react";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import Menu from "./elements/menu.js";

import * as AuthActions from '../actions/auth';

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

class App extends React.Component {


    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Menu {...this.props}/>
                {this.props.children}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);