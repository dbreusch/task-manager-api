const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email,name) => {
    sgMail.send({
            to: email,
            from: 'dbreusch@me.com',
            subject: 'Thanks for joining the app!',
            text: `Welcome to the app, ${name}.  Let me know how you get along with the app.`
        }).then( () => {
            // console.log('Success')
        }).catch((e) => {
            // console.log(e.response.body)
        })
}

const sendGoodbyeEmail = (email,name) => {
    sgMail.send({
            to: email,
            from: 'dbreusch@me.com',
            subject: 'Sorry to see you go!',
            text: `Sorry to see you leaving ${name}.  Hope to see you again soon!`
        }).then( () => {
            return
        }).catch((e) => {
            throw new Error()
        })
}

module.exports = {
    sendWelcomeEmail,
    sendGoodbyeEmail
}