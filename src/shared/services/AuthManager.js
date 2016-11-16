
import {loginUser, logoutUser} from '../actions/user';

const LOCALSTORAGE_NAMESPACE = 'localUser';

class AuthManager {

    constructor(store) {
        this._store = store;
    }

    login(email, pass, callback) {
        $.ajax({
            type: "POST",
            url: "/api/v1/auth",
            dataType: "json",
            data: {
                email: email,
                pass: pass
            }
        }).done((data)=> {

            let user = {
                user: data.user,
                token: data.token
            };

            localStorage.setItem(LOCALSTORAGE_NAMESPACE, JSON.stringify(user));
            this._store.dispatch(loginUser(data.user, data.token));

            if (callback)
                callback(data);

        }).fail((jqXHR, textStatus) => {

        });
    }

    logout(callback) {
        localStorage.removeItem(LOCALSTORAGE_NAMESPACE);

        if (callback)
            callback();
    }

    isLoggedIn() {
        return localStorage.getItem(LOCALSTORAGE_NAMESPACE) != undefined;
    }

    getUserData(){
        if(!this.isLoggedIn()){
            return null;
        }

        const localstoragedata = JSON.parse(localStorage.getItem(LOCALSTORAGE_NAMESPACE));
        return localstoragedata.user;
    }

    getUserToken(){
        if(!this.isLoggedIn()){
            return null;
        }

        const localstoragedata = JSON.parse(localStorage.getItem(LOCALSTORAGE_NAMESPACE));
        return localstoragedata.token;
    }

}

export default AuthManager;