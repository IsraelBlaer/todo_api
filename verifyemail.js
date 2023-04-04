const nodemailer =  require('nodemailer')


  function sendMail(recieveremail, verObj ){
   try{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'amuneisrael224@gmail.com',
          pass: 'tdpmkubyowcmimiw'
        }
      });
       
    const mailOptions = {
        from: 'amuneisrael224@gmail.com',
        to: recieveremail,
        subject: 'Verification mail',
        text: `http://localhost:3000/api/user/verify/${verObj.userId}/${verObj.token}`,
      };
       
      transporter.sendMail(mailOptions)
      console.log('email sent sucessfully')

   }catch(error){
        console.log("email not sent");
        console.log(error);
   }

  }
   
  //module.exorts.SendMail = sendMail
  module.exports.SendMail = sendMail