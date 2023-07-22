export const handler = async (event) => {
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
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};
