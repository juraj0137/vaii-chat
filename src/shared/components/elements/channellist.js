'use strict';
import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal, Input, Button, Badge } from 'react-bootstrap';
import * as ChannelActions from '../../actions/channels';
import {CHANNEL_PUBLIC,CHANNEL_PRIVATE} from '../../constants/ModelConstants';

class ChannelList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            addChannelModal: false,
            moreChannelsModal: false,
            removeChannelModal: false,
            channelName: '',
            searchChannel: '',
            removeChannel: ''
        };
        this.numberOfVisibleChannels = 5;
    }

    /**
     * Add new channel modal functions
     */
    addChannelModalOpen(event) {
        event.preventDefault();
        this.setState({addChannelModal: true});
    }

    addChannelModalClose(event) {
        event.preventDefault();
        this.setState({addChannelModal: false});
    }

    addChannelHandleChange(event) {
        this.setState({channelName: event.target.value});
    }

    addChannelModalSubmit(event) {

        event.preventDefault();

        const { channels, actions } = this.props;

        if (this.state.channelName.length < 1) {
            this.refs.channelName.getInputDOMNode().focus();
        }

        if (this.state.channelName.length > 0 && this.existChannel(this.state.channelName.trim()) == false) {

            const newChannel = {
                name: this.state.channelName.trim()
            };

            actions.addChannel(newChannel);
            this.setState({channelName: ''});
            this.addChannelModalClose(event);
        }
    }

    /**
     * Show all channels modal functions
     */
    moreChannelsModalOpen(event) {
        event.preventDefault();
        this.setState({moreChannelsModal: true});
    }

    moreChannelsModalClose(event) {
        event.preventDefault();
        this.setState({moreChannelsModal: false});
    }

    /**
     * Check if exist channel with name
     * @returns {error|success}
     */
    validateChannelName() {
        return this.existChannel(this.state.channelName.trim()) ? 'error' : 'success';
    }

    /**
     * Check if exist channel with specific name
     * @param name
     * @returns {boolean}
     */
    existChannel(name) {
        return this.props.channels.data.filter(channel => {
                return channel.name === name;
            }).length > 0;
    }

    /**
     * Function for handling search value in seach input
     * @param event
     */
    seachChannelHandleChange(event) {
        this.setState({searchChannel: event.target.value.trim()});
    }

    removeChannelModalOpen(name) {
        this.setState({removeChannelModal: true, removeChannel: name});
    }

    removeChannelModalClose() {
        this.setState({removeChannelModal: false, removeChannel: ''});
    }

    removeChannelModalSubmit() {
        //@todo doriesit
        //if (this.state.removeChannel.length > 0) {
        //    this.props.actions.removeChannel({name: this.state.removeChannel});
        //}
        this.removeChannelModalClose();
    }

    render() {
        const newChannelModal = (
            <div>
                <Modal key={1} show={this.state.addChannelModal} onHide={this.addChannelModalClose.bind(this)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Pridat novy kanal na chatovanie</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={this.addChannelModalSubmit.bind(this)}>
                            <Input ref="channelName"
                                   type="text"
                                   help={this.validateChannelName() === 'error' && 'Takyto kanal uz existuje'}
                                   bsStyle={this.validateChannelName()}
                                   hasFeedback
                                   name="channelName"
                                   autoFocus="true"
                                   placeholder="Nazov chatovacieho kanala"
                                   value={this.state.channelName}
                                   onChange={this.addChannelHandleChange.bind(this)}/>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.addChannelModalClose.bind(this)}>Zrusit</Button>
                        <Button disabled={this.validateChannelName() === 'error' && true}
                                onClick={this.addChannelModalSubmit.bind(this)}
                                type="submit">Vytvorit kanal</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );

        const moreChannelsModal = (
            <div style={{background: 'grey'}}>
                <Modal key={2} show={this.state.moreChannelsModal} onHide={this.moreChannelsModalClose.bind(this)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Vsetky kanale</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ul style={{height: 'auto', margin: '0', overflowY: 'auto', padding: '0'}}>
                            {this.props.channels.data.map((channel, id) => {
                                const link = '/channel/' + channel.id;
                                return (
                                    <li key={id} onClick={this.moreChannelsModalClose.bind(this)}>
                                        <Link to={link} activeClassName="active">{channel.name}</Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.moreChannelsModalClose.bind(this)}>Cancel</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );

        const removeChannelModal = (
            <div style={{background: 'grey'}}>
                <Modal key={3} show={this.state.removeChannelModal} onHide={this.removeChannelModalClose.bind(this)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Vsetky kanale</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Naozaj chcete odstranit kanal <b>{this.state.removeChannel}</b>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.removeChannelModalClose.bind(this)}>Zrusit</Button>
                        <Button onClick={this.removeChannelModalSubmit.bind(this)}>Odstranit</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );

        const channels = this.props.channels.data
            .filter((channel) => {
                if (this.state.searchChannel.length < 1) {
                    return channel;
                } else if (channel.name.toLowerCase().indexOf(this.state.searchChannel.toLowerCase()) != -1) {
                    return channel;
                }

            })
            .map((channel, id) => {

                const unreadedMsgCount = this.props.messages.data.filter((message)=>{

                    const refferenceId = message.referenceId;
                    const readed = typeof message.readed != "undefined" ? message.readed : true;

                    return (refferenceId == channel.id && readed == false);

                }).length;

                const badge = unreadedMsgCount > 0 ? (
                    <Badge pullRight={true}>{unreadedMsgCount}</Badge>
                ) : '';

                return (
                    <li key={id}>
                        <Link to={`/channel/${channel.id}`} activeClassName="active" onClick={this.props.onLinkClick}>
                            <i className="fa fa-users fa-fw"/> {channel.name}{badge}
                        </Link>
                    </li>
                )
            })
            .slice(0, this.numberOfVisibleChannels);

        const channelCount = this.props.channels.data.length;
        const moreChannelsButton = channelCount > this.numberOfVisibleChannels ?
            (
                <li>
                    <a onClick={this.moreChannelsModalOpen.bind(this)}>Vsetky kanale ({channelCount})</a>
                </li>
            ) : '';

        const navStyle = {
            paddingTop: '20px'
        };

        return (
            <div>
                <ul className="nav" style={navStyle}>
                    <li className="sidebar-static-item"><span>CHATOVE KANALE</span></li>
                    <li className="sidebar-static-item">
                        <Input ref="channelSearch"
                               type="text"
                               name="channelSearch"
                               placeholder="Hladaj kanal"
                               value={this.state.searchChannel}
                               onChange={this.seachChannelHandleChange.bind(this)}/>
                    </li>
                    <li>
                        <a onClick={this.addChannelModalOpen.bind(this)}>
                            <i className="fa fa-plus fa-fw"/>Novy kanal
                        </a>
                    </li>
                    {channels}
                    {moreChannelsButton}
                </ul>
                {removeChannelModal}
                {moreChannelsModal}
                {newChannelModal}
            </div>
        );
    }
}

/**
 * Mapping state data and actions to component props
 */
function mapStateToProps(state) {
    return {
        channels: state.channels,
        messages: state.messages
    };
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(ChannelActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelList);
