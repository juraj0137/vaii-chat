import React from "react";
import ReactDOM from "react-dom";
import { connect } from 'react-redux';

class NotFound extends React.Component {

    constructor(props) {
        super(props);
    }


    render() {

        return (
            <div className="notfound-page">
                <h1>Stranka sa nenasla</h1>
            </div>
        );
    }
}

export default connect()(NotFound);