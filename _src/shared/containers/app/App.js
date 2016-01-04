import './App.styl';
import React, {PropTypes} from 'react';
//import {connect} from 'react-redux';

class App extends React.Component {

    static propTypes = {
        children: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        msg: PropTypes.object.isRequired,
        users: PropTypes.object.isRequired
    };

    render() {
        return (
            <div>
                Hello svete
            </div>
        );
    }

}

// // logRenderTime is useful for app with huge UI to check render performance.
// import logRenderTime from '../lib/logRenderTime';
// App = logRenderTime(App)

//export default connect(mapStateToProps, mapDispatchToProps)(App);
export default App;