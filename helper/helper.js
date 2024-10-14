const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

function verifyPassword(password){

        // // Check for minimum length of 6 characters
        // const minLength = password.length >= 6;

        // Check for at least one special character
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);
    
        return hasSpecialChar;


}

let sendemail=(otp)=>{
        const transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false, // true for port 465, false for other ports
                auth: {
                  user: process.env.EMAIL_USER,
                  pass: process.env.EMAIL_PASS,
                },
              });
              
              // async..await is not allowed in global scope, must use a wrapper
              async function main() {
                // send mail with defined transport object
                const info = await transporter.sendMail({
                  from: '"Noorul Khan 👻" <salimkhan668580s@gmail.com>', // sender address
                  to: "khannoorul1365@gmail.com", // list of receivers
                  subject: "Node mailer test", // Subject line
                  text: `please do not share anyone ${otp}`, // plain text body
                  html: "<b>Hello world?</b>", // html body
                });
              
                console.log("Message sent: %s", info.messageId);
                // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
              }
              
              main().catch(console.error);
}

let sendmessage=(email, message)=>{
  const transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false, // true for port 465, false for other ports
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });
        
        // async..await is not allowed in global scope, must use a wrapper
        async function main() {
          // send mail with defined transport object
          const info = await transporter.sendMail({
            from: '"Noorul Khan 👻" <salimkhan668580s@gmail.com>', // sender address
            to: "khannoorul1365@gmail.com", // list of receivers
            subject: "Password updated", // Subject line
            text: `Password changed`, // plain text body
            html: `<b> Message = ${message}</b>`
          });
        
          console.log("Message sent: %s", info.messageId);
          // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
        }
        
        main().catch(console.error);
}

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
  });
};

module.exports = {verifyPassword, sendemail, authenticateToken, sendmessage};