// Updated ECMAScript module code
import AWS from 'aws-sdk';

export const handler = async (event, context) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));
    console.log("dynamodb -------------------------------", event.Records[0].dynamodb);
    // Configure AWS region and SES
    AWS.config.update({region: 'us-east-1'});
    const userId = event.Records[0].dynamodb.NewImage.userId.N;
    const userData = [
        {
            "username": "615866",
            "email": "pronecse@gmail.com",
            "fullname": "Ponchanon Datta Rone",
            "id": "1"
        },
        {
            "username": "103177",
            "email": "rick.rudloff@miu.edu",
            "fullname": "Rick Rudloff",
            "id": "4"
        },
        {
            "username": "615869",
            "email": "mail2moynul@gmail.com",
            "fullname": "Md Moynul Islam",
            "id": "2"
        },
        {
            "username": "616065",
            "email": "md.masum.work@gmail.com",
            "fullname": "Md Masum",
            "id": "5"
        },
        {
            "username": "616047",
            "email": "ranasl62@gmail.com",
            "fullname": "Md Rana Hossain",
            "id": "3"
        }
    ];
    try {

        const filteredItems = userData.filter((item) => item.id == userId);
        const email = filteredItems[0].email; // Assuming 'email' is the attribute name for the email address
        const fullname = filteredItems[0].fullname; // Assuming 'fullname' is the attribute name for the email address
        // Specify the recipient email address

        // Compose the email message
        const emailSubject = `Order Place Alert for User ${fullname}`;
        // Keys to ignore
        const ignoreKeys = new Set(["productId", "ipAddress", "id", "userId"]);
        let emailMessage = `Hi ${fullname} \n`;


// Helper function to extract the value from the DynamoDB attribute object
        function getAttributeValue(attribute) {
            const key = Object.keys(attribute)[0];
            return attribute[key];
        }

// Process each record and extract the required information
        const extractedData = event.Records.map((record) => {
            const newImage = record.dynamodb.NewImage;
            const status = newImage.status.S;
            const total = getAttributeValue(newImage.total);
            const quantity = getAttributeValue(newImage.quantity);
            const productName = getAttributeValue(newImage.productName);
            return {
                status, total, quantity, productName,
            };
        });

        emailMessage += `
                                        <!DOCTYPE html>
                                        <html>
                                        <head>
                                          <title>Order details</title>
                                          <style>
                                            table {
                                              border-collapse: collapse;
                                              width: 100%;
                                            }
                                        
                                            th, td {
                                              border: 1px solid black;
                                              padding: 8px;
                                              text-align: left;
                                            }
                                        
                                            th {
                                              background-color: #f2f2f2;
                                            }
                                          </style>
                                        </head>
                                        <body>
                                          <h1>Order details</h1>
                                          <table>
                                            <tr>
                                             <th>Product Name</th>
                                              <th>Quantity</th>
                                              <th>Total</th>
                                              <th>Status</th>
                                            </tr>
                                            ${extractedData.map((data) => `
                                              <tr>
                                                <td>${data.productName}</td>
                                                <td>${data.quantity}</td>
                                                <td>${data.total}</td>                                         
                                                <td>${data.status}</td>
                                              </tr>
                                            `).join('')}
                                          </table>
                                        </body>
                                        </html>
                                        `;
        // Build the HTML table using template literals and a loop


        const topicArn = 'arn:aws:sns:us-east-1:603576858557:sc-order-data'; // Replace with the ARN of your SNS topic

        const sns = new AWS.SNS();
        const params = {
            TopicArn: topicArn,
            Message: JSON.stringify({
                Source: 'mdrana.hossain@miu.edu', // Replace with your verified sender email address in SES
                Destination: {
                    ToAddresses: [email], // Replace with the recipient email address
                },
                Message: {
                    Subject: {
                        Data: emailSubject, // Email subject
                        Charset: 'UTF-8',
                    },
                    Body: {
                        Html: {
                            Data: emailMessage,
                            Charset: 'UTF-8',
                        },
                        Text: {
                            Data: 'Your order is confirmed:\n',
                            Charset: 'UTF-8',
                        },
                    },
                },
            })
        };
        console.log("params -------------------------", params);
        try {
            await sns.publish(params).promise();
            console.log(`Published message:`, params);
        } catch (error) {
            console.error('Error publishing message:', error);
        }

    } catch (error) {
        console.error('Error sending email:', error);
    }
};
