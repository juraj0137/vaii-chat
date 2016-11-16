import React from "react";
import ReactDOM from "react-dom";
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as AuthActions from './../../actions/auth';

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

class Login extends React.Component {

    constructor(props, context) {
        super(props);

        if(this.props.session.errorMessage == 'Boli ste uspesne odhlaseny'){
            setTimeout(()=>{
                this.props.actions.setErrorMessage(null);
            }, 1500);
        }
    }

    redirectAfterLogin() {
        const {history, location} = this.props;
        if (location.state && location.state.nextPathname)
            history.pushState(null,location.state.nextPathname);
        else
            history.pushState(null,'/');
    }

    formSubmit(e) {

        e.preventDefault();

        const email = this.refs.email.value;
        const pass = this.refs.pass.value;

        if (email && pass) {
            this.props.actions.connect({
                email: email,
                pass: pass
            }, ()=> {
                this.redirectAfterLogin()
            });
        } else {
            this.props.actions.connectError("Vyplnte prosim vsetky udaje")
        }
    }


    render() {

        let errorMsg = '';
        if (this.props.session.errorMessage != null) {
            errorMsg = (
                <div className="error-message">
                    {this.props.session.errorMessage}
                </div>
            );
        }

        return (
            <div className="top-content login">

                <div className="inner-bg">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-8 col-sm-offset-2 text">
                                <h1><strong>VAII chat login</strong></h1>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-6 col-sm-offset-3 form-box">
                                <div className="form-top">
                                    <div className="form-top-left">
                                        <h3>Prihlaste sa</h3>
                                        <p>Na vyuzivanie sluzieb komunikacneho nastroja VAII chat sa musite
                                            prihlasit</p>
                                        <p>Pre prihlasenie zadajte svoj registracny email a heslo:</p>
					<p>Test users:</p>
					<p>user: <b>john@demo.com</b> pass: <b>pass123</b></p>
					<p>user: <b>nick@demo.com</b> pass: <b>pass123</b></p>
                                    </div>
                                    <div className="form-top-right">
                                        <i className="fa fa-lock"/>
                                    </div>
                                </div>
                                <div className="form-bottom">
                                    {errorMsg}
                                    <form role="form" method="post" className="login-form"
                                          onSubmit={this.formSubmit.bind(this)}>
                                        <div className="form-group">
                                            <label className="sr-only" htmlFor="form-username">Email</label>
                                            <input type="text" name="form-email" placeholder="Email..." ref="email"
                                                   className="form-username form-control" id="form-email" autoComplete="off"/>
                                        </div>
                                        <div className="form-group">
                                            <label className="sr-only" htmlFor="form-password">Heslo</label>
                                            <input type="password" name="form-password" placeholder="Heslo..."
                                                   ref="pass"
                                                   className="form-password form-control" id="form-password"/>
                                        </div>
                                        <button type="submit" className="btn">Prihlasit sa
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-6 col-sm-offset-3 social-login">
                                <h3>Ak nemate vytvoreny ucet, <Link to="/register">zaregistrujte sa</Link></h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Login.contextTypes = {
    history: React.PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
