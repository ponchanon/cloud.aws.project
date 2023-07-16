const AWS = require('aws-sdk');

// Configure the AWS region

// Create a DynamoDB DocumentClient
const {configObject} = require("../locker/credentials");

AWS.config.update(configObject);

const dynamodb = new AWS.DynamoDB();

// Define the table name
const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = "sc-users";
// The primary key value to fetch
const primaryKeyValue = 3;

// Create the parameters object
const params = {
    TableName: tableName,
};

// Fetch the data from DynamoDB
const fetchUser = (callback = () => {
}) => {
    docClient.scan(params, function (err, data) {
        if (err) {
            console.error('Error fetching data:', err);
        } else {
            if (data.Items) {
                // Data retrieved successfully
                callback(data.Items);
                console.log('Data:', data.Items);
            } else {
                // Data not found
                console.log('Item not found.');
            }
        }
    });

}

module.exports = fetchUser;