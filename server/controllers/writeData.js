const AWS = require('aws-sdk');

// Configure the AWS region
const {configObject} = require("../locker/credentials");

AWS.config.update(configObject);

// Create a DynamoDB DocumentClient
const docClient = new AWS.DynamoDB.DocumentClient();

// Write the data to DynamoDB

const writeData = (tableName, itemData, callback = () => {
}) => {
    // Create the parameters object for put operation
    const params = {
        TableName: tableName,
        Item: itemData
    };
    docClient.put(params, function (err, data) {
        const params = {
            TableName: tableName,
            Item: itemData
        };
        if (err) {
            console.error('Error writing data:', err);
        } else {
            callback(data);
            console.log('Data written successfully:', data);
        }
    });

}

module.exports = writeData;