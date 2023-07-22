// Updated ECMAScript module code
import AWS from 'aws-sdk';

export const handler = async (event, context) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));
    console.log("event----------------------", event);
    // Configure AWS region and SES
    AWS.config.update({region: 'us-east-1'});
    const ses = new AWS.SES({apiVersion: '2010-12-01'});
    const body = JSON.parse(JSON.parse(event.Records[0].body).Message);
    console.log("body------------------------", body);
    console.log("body------------------------", typeof body);
    try {
        const result = await ses.sendEmail(body).promise();
        console.log('Email-----------:', body.Source, result);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
