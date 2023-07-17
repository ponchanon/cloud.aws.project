//Considering static users DB

const fetchUser = require("../lib/fetchData");
const {Users} = require("../DB");
let users = [];

fetchUser(Users, (data) => {
    users = data;
})

//Creating User Class

module.exports = class User {

    constructor(id, username, password, fullName) {

        this.id = id;

        this.username = username;

        this.password = password;

        this.fullName = fullName;

    }


    //user login method

    login() {

        const userIndex = users.findIndex(s => s.username == this.username && s.password == this.password);

        const user = users[userIndex];

        if (user) {

            this.accessToken = `${user.id}-${user.username}-${Date.now().toString()}`;

            this.id = user.id;

            users.splice(userIndex, 1, this);

            return this;

        } else return null;

    }

    //token verification

    static verifyToken(accessToken) {

        return users.find(s => s.accessToken == accessToken);

    }

}