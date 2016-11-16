export class ApiManager {

    static existsEmail(email, done, fail) {
        if (email.length <= 0)
            return;

        $.ajax({
            type: "POST",
            url: "/api/v1/auth/verifyEmail",
            dataType: "json",
            data: {email: email}
        }).done((data)=> {
            if (typeof done == "function")
                done(data)
        }).fail((jqXHR, textStatus) => {
            if (typeof fail == "function")
                fail(jqXHR, textStatus);
        });
    }

    static existsNick(nick, done, fail) {
        if (nick.length <= 0)
            return;

        $.ajax({
            type: "POST",
            url: "/api/v1/auth/verifyNick",
            dataType: "json",
            data: {nick: nick}
        }).done((data)=> {
            if (typeof done == "function")
                done(data)
        }).fail((jqXHR, textStatus) => {
            if (typeof fail == "function")
                fail(jqXHR, textStatus);
        });
    }

    static registerUser(user, done, fail) {
        $.ajax({
            type: "POST",
            url: "/api/v1/auth/register",
            dataType: "json",
            data: user
        }).done((data)=> {
            if (typeof done == "function")
                done(data)
        }).fail((jqXHR, textStatus) => {
            if (typeof fail == "function")
                fail(jqXHR, textStatus);
        });
    }

    static logError(details) {
        $.ajax({
            type: 'POST',
            url: '/api/v1/logging',
            dataType: "json",
            data: {
                useragent: navigator.userAgent,
                message: details
            }
        });
    }

}