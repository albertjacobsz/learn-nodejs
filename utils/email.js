const nodemailer = require('nodemailer');
const pug = require('pug')
const htmlToText = require('html-to-text')
module.exports = class Email {
    constructor(user,url) {
        this.to = user.email
        this.firstName = user.name.split(' ')[0]
        this.url = url
        this.from = `Bertje san <${process.env.EMAIL_FROM}>`
    }
    newTransport() {
        if (process.env.NODE_ENV === 'production') {
            return 1
        }
        //else
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }
    async send(template,subject) {
        //send the email
        const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
            firstName: this.firstName,
            url: this.url
        })

        // 
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText.fromString(html),
            //html:
        }
        await this.newTransport().sendMail(mailOptions)
        //await transporter.sendMail(mailOptions);
    }
    async  sendWelcome() {
       await this.send('welcome', "Welcome to the natours family")
    }
    async sendPasswordReset() {
        await this.send('passwordReset', 'Your password reset token (valid for only 10 minutes)')
    }
}
