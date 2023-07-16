const { configObject } = require("../locker/credentials");
var AWS = require("aws-sdk");
AWS.config.update(configObject);

const dynamodb = new AWS.DynamoDB();
const fetchUsersFromDynamoDB = () => {
    const params = {
      TableName: "sc-users"
    };
  
    return new Promise((resolve, reject) => {
      dynamodb.scan(params, (err, data) => {
        if (err) {
          console.error("Error retrieving data from DynamoDB:", err);
          reject(err);
        } else {
          const users = data.Items.map((item) => ({
            id: item.id.N,
            fullname: item.fullname.S,
            username: item.username.S,
            password: item.password.S,
            accessToken: item.accessToken.S
          }));
          resolve(users);
        }
      });
    });
  };
let users = [];
console.log(users);

fetchUsersFromDynamoDB()
  .then((fetchedUsers) => {
    console.log(fetchedUsers);

    // Replace the existing users array with the fetched users
    users = fetchedUsers.map(
      (user) =>
        new User(user.id, user.username, user.password, user.fullname)
    );
    console.log(users);

    // Additional code here to use the updated users array
  })
  .catch((err) => {
    // Handle the error if any
    console.error("Error:", err);
  });

//Considering static users DB
//  let users = [
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
    const userIndex = users.findIndex(
      (s) => s.username === this.username && s.password === this.password
    );
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
    return users.find((s) => s.accessToken === accessToken);
  }
};

