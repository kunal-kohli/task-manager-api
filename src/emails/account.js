const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY)


const sendWelcomeEmail = (email, name) => {

    sgMail.send({
        to: email,
        from: 'toyboxtb001@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`,
    })
}

const sendCancelEmail = (email, name) => {

    sgMail.send({
        to: email,
        from: 'toyboxtb001@gmail.com',
        subject: 'Thanks for using our APP!',
        text: `Good Bye, ${name}. Is there anything we could have done to kept you onboard.`,
    })
}


module.exports ={
    sendWelcomeEmail,
    sendCancelEmail
    
}