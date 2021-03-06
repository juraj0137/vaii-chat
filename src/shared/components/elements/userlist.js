'use strict';
import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Modal, Input, Button, Badge } from 'react-bootstrap';

const NUMBER_OF_VISIBLE_USERS = 5;

class UserList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            moreUsersModal: false,
            searchUser: ''
        };
    }

    /**
     * Show all users modal functions
     */
    moreUsersModalOpen(event) {
        event.preventDefault();
        this.setState({moreUsersModal: true});
    }

    moreUsersModalClose() {
        this.setState({moreUsersModal: false});
    }

    /**
     * fix - nemenilo activne linky v menu
     */
    handleLinkClick(e) {
        this.forceUpdate();
    }

    /**
     * Function for handling search value in seach input
     * @param event
     */
    seachUserHandleChange(event) {
        this.setState({searchUser: event.target.value.trim()});
    }

    render() {

        const moreUsersModal = (
            <div style={{background: 'grey'}}>
                <Modal key={1} show={this.state.moreUsersModal} onHide={this.moreUsersModalClose.bind(this)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Vsetci pouzivatelia</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ul style={{height: 'auto', margin: '0', overflowY: 'auto', padding: '0'}}>
                            {this.props.users.data.map((user, id) => {
                                return (
                                    <li key={id} onClick={this.moreUsersModalClose.bind(this)}>
                                        <Link to={`/user/${user.id}`} activeClassName="active">{user.name}</Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.moreUsersModalClose.bind(this)}>Zavriet</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );

        const users = this.props.users.data
            .filter((user) => {
                if (typeof user == "undefined" || user.name == this.props.session.user.name)
                    return false;

                if (this.state.searchUser.length < 1) {
                    return true;
                } else if (user.name.toLowerCase().indexOf(this.state.searchUser.toLowerCase()) != -1) {
                    return true;
                }

            })
            .map((user, id) => {

                const unreadedMsgCount = this.props.messages.data.filter((message)=>{
                    const myId = this.props.session.user._id;
                    const refferenceId = message.referenceId;
                    const authorId = typeof message.author != "undefined" ? message.author._id : -1;
                    const readed = typeof message.readed != "undefined" ? message.readed : true;

                    return (myId == refferenceId && authorId == user.id && readed == false);

                }).length;

                const badge = unreadedMsgCount > 0 ? (
                    <Badge pullRight={true}>{unreadedMsgCount}</Badge>
                ) : '';

                return (
                    <li key={id}>
                        <Link to={`/user/${user.id}`} activeClassName="active" onClick={this.props.onLinkClick}>
                            <i className="fa fa-user fa-fw"/> {user.name}{badge}
                        </Link>
                    </li>
                )
            })
            .slice(0, NUMBER_OF_VISIBLE_USERS);

        const usersCount = this.props.users.data.length;
        const moreUsersButton = usersCount > NUMBER_OF_VISIBLE_USERS ?
            (
                <li>
                    <a onClick={this.moreUsersModalOpen.bind(this)}>Vsetci pouzivatelia ({usersCount})</a>
                </li>
            ) : null;

        const navStyle = {
            paddingTop: '20px'
        };

        return (
            <div>
                <ul className="nav" style={navStyle}>
                    <li className="sidebar-static-item"><span>POUZIVATELIA</span></li>
                    <li className="sidebar-static-item">
                        <Input ref="userSearch"
                               type="text"
                               name="userSearch"
                               placeholder="Hladaj pouzivatela"
                               value={this.state.searchUser}
                               onChange={this.seachUserHandleChange.bind(this)}/>
                    </li>
                    {users}
                    {moreUsersButton}
                </ul>
                {moreUsersModal}
            </div>
        );
    }
}

/**
 * Mapping state data and actions to component props
 */
function mapStateToProps(state) {
    return {
        users: state.users,
        messages: state.messages,
        session: state.session
    };
}

export default connect(mapStateToProps)(UserList);
