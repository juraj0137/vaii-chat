import React from "react";
import ReactDOM from "react-dom";
import { Link } from 'react-router';
import { Input } from 'react-bootstrap';
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

class Register extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            emailValidation: null,
            emailValue: '',
            emailHelp: '',
            passValidation: null,
            passValue: '',
            passHelp: '',
            passCheckValidation: null,
            passCheckValue: '',
            passCheckHelp: '',
            nickValidation: null,
            nickValue: '',
            nickHelp: ''
        };

        this.timer = null;

        // vymazanie chybovej spravy
        if (this.props.session.errorMessage != null) {
            this.props.actions.setErrorMessage(null);
        }
    }

    formSubmit(e) {
        e.preventDefault();
        const {emailValidation, passValidation, passCheckValidation, nickValidation} = this.state;
        const {emailValue, passValue, nickValue} = this.state;

        // ak nepresli vsetky validacie
        let success = true;
        success &= emailValidation == 'success';
        success &= passValidation == 'success';
        success &= passCheckValidation == 'success';
        success &= nickValidation == 'success';

        if (success == false) {
            this.props.actions.setErrorMessage('Mate chybu/y v registracnom formulari');
            return;
        }

        $.ajax({
            type: "POST",
            url: "/api/v1/auth/register",
            dataType: "json",
            data: {
                email: emailValue,
                pass: passValue,
                displayName: nickValue
            }
        }).done((data)=> {
            if(data.success == true){
                this.props.actions.setErrorMessage('Zaregistrovali ste sa uspesne, za 3 sekundy budete automaticky prihlaseny');
                setTimeout(()=>{
                    this.props.actions.connect({
                        email: emailValue,
                        pass: passValue
                    }, ()=>{
                        this.redirectAfterLogin();
                    })}, 3000)
            }else{
                this.props.actions.setErrorMessage('Nastala chyba pri vytvarani uzivatela');
            }
            console.log(data);
        }).fail((jqXHR, textStatus) => {
            console.log(jqXHR);
            console.log(textStatus);
        });

    }

    redirectAfterLogin() {
        const {history, location} = this.props;
        if (location.state && location.state.nextPathname)
            history.replaceState(null, location.state.nextPathname);
        else
            history.replaceState(null, '/');
    }

    handleEmailChange() {

        const inputVal = this.refs.email.getValue(),
            msgEmpty = 'Email nemoze ostat prazdny',
            msgWrong = 'Zadali ste email v nespravnej podobe',
            msgUsage = 'Zadany email sa uz pouziva',
            msgVerify = 'Overujem zadany email',
            msgFree = 'Lucky day, tento email je volny :)',
            msgError = 'Vyskytol sa problem pri overovani',
            ERROR = 'error',
            SUCCESS = 'success',
            WARNING = 'warning';

        let msg = '';
        let icon = '';

        // kontrola emailu
        if (inputVal.length > 0) {

            if (this.isValidEmail(inputVal)) {
                msg = msgVerify;
                icon = WARNING;

                clearTimeout(this.timer);
                this.timer = setTimeout(()=>{
                    $.ajax({
                        type: "POST",
                        url: "/api/v1/auth/verifyEmail",
                        dataType: "json",
                        data: {email: inputVal}
                    }).done((data)=> {
                        this.setState({
                            emailValidation: (data.success == true) ? SUCCESS : ERROR,
                            emailHelp: (data.success == true) ? msgFree : msgUsage
                        });
                    }).fail((jqXHR, textStatus) => {
                        this.setState({
                            emailValidation: ERROR,
                            emailHelp: msgError
                        });
                    });
                }, 800);
            } else {
                msg = msgWrong;
                icon = ERROR;
            }
        } else {
            msg = msgEmpty;
            icon = ERROR;
        }

        this.setState({
            emailValue: inputVal,
            emailValidation: icon,
            emailHelp: msg
        });

    }

    isValidEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    handlePassChange() {

        const inputVal = this.refs.pass.getValue(),
            MIN_LENGTH_OF_PASS = 6,
            msgEmpty = 'Heslo nemoze ostat prazdne',
            msgShort = 'Heslo musi mat aspon ' + MIN_LENGTH_OF_PASS + ' znakov',
            ERROR = 'error',
            SUCCESS = 'success';

        this.setState({
            passValue: inputVal,
            passValidation: SUCCESS,
            passHelp: ''
        });

        if (inputVal.length < MIN_LENGTH_OF_PASS) {
            this.setState({
                passValidation: ERROR,
                passHelp: msgShort
            });
        }

    }

    handlePassCheckChange() {

        const inputVal = this.refs.passCheck.getValue(),
            msgNotEqual = 'Hesla sa nezhoduju',
            ERROR = 'error',
            SUCCESS = 'success';

        this.setState({
            passCheckValue: inputVal,
            passCheckValidation: SUCCESS,
            passCheckHelp: ''
        });

        if (this.state.passValue != inputVal) {
            this.setState({
                passCheckValidation: ERROR,
                passCheckHelp: msgNotEqual
            });
        }

    }

    handleNickChange() {
        const inputVal = this.refs.nick.getValue(),
            msgUsage = 'Nick sa uz pouziva',
            msgVerify = 'Overujem nick',
            msgEmpty = 'Nick nemoze ostat prazdny',
            msgError = 'Vyskytol sa problem pri overovani',
            ERROR = 'error',
            SUCCESS = 'success',
            WARNING = 'warning';

        if (inputVal.length > 0) {

            this.setState({
                nickValidation: WARNING,
                nickHelp: msgVerify
            });

            clearTimeout(this.timer);
            this.timer = setTimeout(()=>{
                $.ajax({
                    type: "POST",
                    url: "/api/v1/auth/verifyNick",
                    dataType: "json",
                    data: {nick: inputVal}
                }).done((data)=> {
                    this.setState({
                        nickValidation: (data.success == true) ? SUCCESS : ERROR,
                        nickHelp: (data.success == true) ? '' : msgUsage
                    });
                }).fail((jqXHR, textStatus) => {
                    this.setState({
                        nickValidation: ERROR,
                        nickHelp: msgError
                    });
                });
            }, 800);
        } else {
            this.setState({
                nickValidation: ERROR,
                nickHelp: msgEmpty
            });
        }

        this.setState({nickValue: inputVal});

    }

    render() {

        let self = this;

        let errorMsg = '';
        if (self.props.session.errorMessage != null) {
            errorMsg = (
                <div className="error-message">
                    {self.props.session.errorMessage}
                </div>
            );
        }

        return (
            <div className="top-content login">

                <div className="inner-bg">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-8 col-sm-offset-2 text">
                                <h1><strong>VAII chat registracia</strong></h1>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-6 col-sm-offset-3 form-box">
                                <div className="form-top">
                                    <div className="form-top-left">
                                        <h3>Zaregistrujte sa</h3>
                                        <p>Vylpnte prosim prihlasovaci email, heslo a meno, ktore sa bude zobrazovat
                                            uzivatelom:</p>
                                    </div>
                                    <div className="form-top-right">
                                        <i className="fa fa-lock"/>
                                    </div>
                                </div>
                                <div className="form-bottom">
                                    {errorMsg}
                                    <form role="form" method="post" className="login-form"
                                          onSubmit={this.formSubmit.bind(this)}>
                                        <Input type="text"
                                               value={this.state.emailValue}
                                               placeholder="Email..."
                                               label="Prihlasovaci email"
                                               help={this.state.emailHelp}
                                               bsStyle={this.state.emailValidation}
                                               hasFeedback
                                               ref="email"
                                               groupClassName="group-class"
                                               labelClassName="label-class"
                                               onChange={this.handleEmailChange.bind(this)}/>

                                        <div className="form-group">
                                            <Input type="password"
                                                   value={this.state.passValue}
                                                   placeholder="Heslo..."
                                                   label="Heslo"
                                                   help={this.state.passHelp}
                                                   bsStyle={this.state.passValidation}
                                                   hasFeedback
                                                   ref="pass"
                                                   groupClassName="group-class"
                                                   labelClassName="label-class"
                                                   onChange={this.handlePassChange.bind(this)}/>
                                            <Input type="password"
                                                   value={this.state.passCheckValue}
                                                   placeholder="Zopakuj heslo..."
                                                   label="Zopakuj heslo"
                                                   help={this.state.passCheckHelp}
                                                   bsStyle={this.state.passCheckValidation}
                                                   hasFeedback
                                                   ref="passCheck"
                                                   groupClassName="group-class"
                                                   labelClassName="label-class"
                                                   onChange={this.handlePassCheckChange.bind(this)}/>
                                        </div>
                                        <div className="form-group">
                                            <Input type="text"
                                                   value={this.state.nickValue}
                                                   placeholder="Nick..."
                                                   label="Nick"
                                                   help={this.state.nickHelp}
                                                   bsStyle={this.state.nickValidation}
                                                   hasFeedback
                                                   ref="nick"
                                                   groupClassName="group-class"
                                                   labelClassName="label-class"
                                                   onChange={this.handleNickChange.bind(this)}/>
                                        </div>
                                        <button type="submit" className="btn">Registruj sa</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-6 col-sm-offset-3 social-login">
                                <h3>Ak uz mate vytvoreny ucet, <Link to="/login">prihlaste sa</Link></h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);