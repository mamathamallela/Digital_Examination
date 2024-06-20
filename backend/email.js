const hbs = require('nodemailer-express-handlebars');
const nodemailer = require('nodemailer');
const path = require('path');
const  generator = require('generate-password');


// Initialize nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'geetanjalib@brightcomgroup.com',
    pass: 'kxah oxvi njke jmuj'
  }
});


const passowrds = generator.generate({
	length: 10,
	uppercase: true,
  numbers:true,
  
});
console.log(passowrds)

// Point to the template folder
const handlebarOptions = {
  viewEngine: {
    partialsDir: path.resolve('./views/email.handlebars'),
    defaultLayout: false,
  },
  viewPath: path.resolve('./views/'),
};

// Use a template file with nodemailer
transporter.use('compile', hbs(handlebarOptions));

// Sample users array (replace this with your actual array of users)
const users = [
  { name: 'Digital Examination', email: 'geetanjalib@brightcomgroup.com' },
  // { name: 'mamta', email: 'mamatham@brightcomgroup.com' },
  // Add more users as needed
];

// Asynchronous function to send emails
async function sendEmail(user) {
  const mailOptions = {
    from: '"Brightcom Group" <geetanjalib@brightcomgroup.com>',
    template: 'email', // the name of the main template file, without extension
    to: user.email,
    subject: `Registration Successful`,
    context: {
      name: user.name,
      company: 'Brightcom Group',
      userId:0,
      pass:passowrds
    },
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${user.email}`);
  } catch (error) {
    console.log(`Nodemailer error sending email to ${user.email}`, error);
  }
}

// Async function to send emails to all users
async function sendEmailsToUsers() {
  for (const user of users) {
    if (user.email) {
      await sendEmail(user);
    }
  }
}



// Call the async function to send emails
sendEmailsToUsers();


