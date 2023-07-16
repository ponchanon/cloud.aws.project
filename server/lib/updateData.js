const AWS = require('aws-sdk');

// Configure the AWS region
const {configObject} = require("../locker/credentials");

AWS.config.update(configObject);

// Create a DynamoDB DocumentClient
const docClient = new AWS.DynamoDB.DocumentClient();

// Function to update an existing user
function updateData(id, updateExpression, expressionAttributeValues, tableName, callback = () => {
}) {
    const params = {
        TableName: tableName,
        Key: {id},
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'UPDATED_NEW'
    };

    docClient.update(params, function (err, data) {
        if (err) {
            console.error('Error updating user:', err);
            callback(err);
        } else {
            console.log('User updated successfully:', data);
            callback(data);
        }
    });
}

// Usage example:
// const userIdToUpdate = 123;
// const updateExpression = 'SET #uname = :newUsername, #pwd = :newPassword';
// const expressionAttributeValues = {
//     ':newUsername': 'updatedUsername',
//     ':newPassword': 'updatedPassword'
// };

module.exports = updateData;
