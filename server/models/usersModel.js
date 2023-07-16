const {configObject} = require("../locker/credentials");
var AWS = require("aws-sdk");
AWS.config.update(configObject);

const dynamodb = new AWS.DynamoDB();
let fetchOneByKey = function (userLoginId) {
    let userInfo;
    const params = {
        TableName: 'sc-users'
      };
      
      return dynamodb.scan(params, (err, data) => {
        if (err) {
          console.error('Error retrieving data from DynamoDB:', err);
        } else {
          const users = data.Items.map(item => ({
            id: item.id.N,
            fullname: item.fullname.S,
            username: item.username.S,
            password: item.password.S,
            accessToken: item.accessToken.S
          }));
          userInfo = users;
          //return users;
          console.log('Users:', users);
        }
    });
};
let users = Object.values(fetchOneByKey('615866'));
console.log(users);

// //Considering static users DB
//  users = [
//     { id: 1, fullname:'Ponchanon Datta Rone', username: 'ponchanon', password: '615866', accessToken: '' },
//     { id: 2, fullname:'Moynul Islam', username: 'moynul', password: '616161', accessToken: '' },
//     { id: 3, fullname:'Admin User', username: 'admin', password: '1212', accessToken: '' }
// ];



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