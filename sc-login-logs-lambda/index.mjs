// Updated ECMAScript module code
import AWS from 'aws-sdk';

export const handler = (event, context) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));
    console.log(event.Records[0].dynamodb);
    // Configure AWS region and SES
    AWS.config.update({region: 'us-east-1'});
    const ses = new AWS.SES({apiVersion: '2010-12-01'});

    try {
        // Extract necessary data from the event (DynamoDB record)
        const {id, logintime, success, username} = event.Records[0].dynamodb.NewImage;
        console.log("event data", event.Records[0].dynamodb.NewImage);
        // Send the email using SES

        const docClient = new AWS.DynamoDB.DocumentClient();

        const paramsDB = {
            TableName: 'sc-users',
            KeyConditionExpression: 'username = :usernameValue',
            ExpressionAttributeValues: {
                ':usernameValue': username.S, // Replace 'YOUR_USERNAME' with the username you want to filter on
            },
            ProjectionExpression: 'fullname, email', // This specifies that we only want to retrieve the 'email' attribute
        };

        docClient.query(paramsDB, function (err, data) {
            console.log('Fetch users data :', data);
            if (err) {
                console.error('Error fetching data:', err);
            } else {
                if (data.Items.length === 0) {
                    console.log('User not found');
                } else {
                    const user = data.Items[0];
                    if (err) {
                        console.error('Error fetching data:', err);
                    } else {
                        if (data.Items.length === 0) {
                            console.log('User not found');
                        } else {
                            const email = data.Items[0].email; // Assuming 'email' is the attribute name for the email address
                            const fullname = data.Items[0].fullname; // Assuming 'fullname' is the attribute name for the email address
                            // Specify the recipient email address

                            // Compose the email message
                            const emailSubject = `Login Alert for User ${username.S}`;
                            const emailMessage = `Hi ${fullname}, Username ${username.S} logged in at ${logintime.S} with success: ${success.BOOL}`;

                            // Define the email parameters
                            const params = {
                                Source: 'mdrana.hossain@miu.edu', // Replace with your verified sender email address in SES
                                Destination: {
                                    ToAddresses: [email],
                                },
                                Message: {
                                    Subject: {
                                        Data: emailSubject,
                                    },
                                    Body: {
                                        Text: {
                                            Data: emailMessage,
                                        },
                                    },
                                },
                            };
                            console.log('Email data : ', email);
                            ses.sendEmail(params).promise().then(result => {
                                console.log('Email-----------:', email, result);
                            });
                        }
                    }
                    console.log('Full Name:', user.fullname);
                    console.log('Email:', user.email);
                }
            }
        });
        console.log('Email sent');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
