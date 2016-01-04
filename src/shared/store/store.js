import { createStore } from 'redux';
let store = createStore(counterApp);

//import User from '../../model/User';

export default store;


//console.log(store.getState());
//let unsubscribe = store.subscribe(() =>
//    console.log(store.getState())
//);

//let numOfIteration = 10;
//var timeCounter = 0;
//
//for (let j = 0; j < numOfIteration; j++) {
//
//    let numOfUser = 10;
//    let numOfIncrementation = 10000;
//
//    for (let i = 0; i < numOfUser; i++) {
//        let user = new User(i, 'Fero');
//        store.dispatch(actions.addNewUser(user));
//    }
//
//    let start = new Date().getTime();
//    for (let i = 0; i < numOfIncrementation; i++) {
//        let userId = Math.round(Math.random() * numOfUser) % numOfUser;
//        store.dispatch(actions.incrementCounter(userId));
//    }
//    let end = new Date().getTime();
//    timeCounter += (end - start)
//}
//
//console.log('avg time:' + (timeCounter / numOfIteration));
//store.dispatch(actions.incrementCounter(0));



