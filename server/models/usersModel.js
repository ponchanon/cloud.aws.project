const {configObject} = require("./credentials");
//Considering static users DB
// let users = [
//     { id: 1, fullname:'Ponchanon Datta Rone', username: 'ponchanon', password: '615866', accessToken: '' },
//     { id: 2, fullname:'Moynul Islam', username: 'moynul', password: '616161', accessToken: '' },
//     { id: 3, fullname:'Admin User', username: 'admin', password: '1212', accessToken: '' }
// ];

let users = [];

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
        const userIndex = users.findIndex(s => s.username === this.username && s.password === this.password);
        const user = users[userIndex];

        if (user) {
            this.accessToken = `${user.id}-${user.username}-${Date.now().toString()}`;
            this.id = user.id;
            users.splice(userIndex, 1, this);
            return this;
        }

        else return null;
    }

    //token verification
    static verifyToken(accessToken) {
        return users.find(s => s.accessToken === accessToken);
    }
}