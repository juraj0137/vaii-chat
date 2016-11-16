import React from "react";
import { connect } from 'react-redux'
//import User from "../../../model/User";

class VotingList extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div id="page-wrapper">
                <div className="row">
                    <div className="col-lg-12">
                        <h1 className="page-header">Hlasovanie</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                    </div>
                </div>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {}
        //users: state.users
};
const mapDispatchToProps = (duspatch) => {
    return {}
};

export default connect(mapStateToProps)(VotingList);