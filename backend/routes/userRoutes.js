const express = require('express');
const router = express.Router();
const connection = require('../database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const generator = require('generate-password');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Webcam = require('node-webcam');




const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'geetanjalib@brightcomgroup.com',
    pass: 'kxah oxvi njke jmuj'
  }
});



//console.log(passowrds)

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
  // { name: 'Akash', email: 'gb11.gpil@gmail.com' },
  // Add more users as needed
];


// Async function to send emails to all users
async function sendEmailsToUsers() {
  for (const user of users) {
    if (user.email) {
      await sendEmail(user);
    }
  }
}


router.get('/getusers', (req, res) => {
  const sql = 'SELECT id, username, email, resumePath FROM users WHERE role = "user"';

  connection.query(sql, (error, results, fields) => {
    if (error) {
      console.error('Error fetching user details:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});


router.post('/save-exam-result', (req, res) => {
  const { userId, userName, score, dateAndTime } = req.body;

  // if (!userId || !userName || !score || !dateAndTime) {
  //   return res.status(400).json({ success: false, error: 'Missing data' });
  // }
  // console.log(req.body)
  // // Assuming you have a database connection called `connection`
  connection.query(
    'INSERT INTO exam_results (user_id, user_name, score, date_and_time) VALUES (?, ?, ?, ?)',
    [userId, userName, score, dateAndTime],
    (error, results, fields) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: 'Error saving data' });
      }

      return res.json({ success: true, userId, userName, score, dateAndTime });
    }
  );
});

router.get('/getresults', (req, res) => {
  const sql = 'SELECT user_id, user_name, score, date_and_time FROM exam_results';

  connection.query(sql, (error, results, fields) => {
    if (error) {
      console.error('Error fetching user details:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});





// Set up multer storage for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the directory where you want to save the uploaded files
  },
  filename: function (req, file, cb) {
    const fileExt = path.extname(file.originalname);
    const fileName = file.originalname; // Save the original filename
    console.log('Generated Filename:', fileName); // Log the generated filename for debugging
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });


// // Set up multer storage for image uploads
// const imageStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'Images/'); // Specify the directory where you want to save the uploaded images
//   },
//   filename: function (req, file, cb) {
//     const fileExt = path.extname(file.originalname);
//     const fileName = file.originalname; // Save the original filename
//     console.log('Generated Filename:', fileName); // Log the generated filename for debugging
//     cb(null, fileName);
//   },
// });

// const imageUpload = multer({ storage: imageStorage });


// // Route for handling image upload
// router.post('/upload-image', upload.single('image'), (req, res) => {
//   // Handle image upload logic here
//   if (!req.file) {
//     return res.status(400).send('No file uploaded.');
//   }
  
//   // File has been uploaded successfully
//   res.status(200).send('Image uploaded successfully.');
// });



router.post('/submit-form', upload.fields([
  { name: 'uploadresume', maxCount: 1 },
  { name: 'uploadphoto', maxCount: 1 },
]), async (req, res) => {
  const {
    first_name,
    last_name,
    gender,
    birth_date,
    phone_number,
    email,
    exam_link,
    city_district,
    state,
    zipcode,
  } = req.body;

  console.log(req.body)

  const { uploadresume, uploadphoto } = req.files;

  // ... rest of your validation and insertion logic remains the same

  const filePathResume = uploadresume ? uploadresume[0].path : '';
  const filePathPhoto = uploadphoto ? uploadphoto[0].path : '';

  // Check if the email already exists in the database
  const checkEmailQuery = `
    SELECT * FROM applications WHERE email = ?
  `;
  connection.query(checkEmailQuery, [email], (checkError, checkResults) => {
    if (checkError) {
      console.error('Error checking email in MySQL:', checkError);
      res.status(500).send('Error checking email in the database');
      return;
    }
  
    if (checkResults.length > 0) {
      // If the email exists, handle accordingly (e.g., send a message indicating duplication)
      res.status(400).send('Email already exists in the database');
      return;
    }

    // If the email doesn't exist, proceed with the insertion
    const formattedBirthDate = new Date(birth_date).toISOString().split('T')[0];
    // const filePath = req.file ? req.file.path : null;
    const filePath = req.file ? req.file.path : ''; // Assign an empty string if filePath is null
    const getLatestRegisterNumberQuery = `
      SELECT MAX(registerNumber) AS maxRegisterNumber FROM applications
    `;
    // const password = generator.generate({
    //   length: 10,
    //   uppercase: true,
    //   numbers: true,
    // });

    connection.query(getLatestRegisterNumberQuery, async (getNumberError, numberResults) => {
      if (getNumberError) {
        console.error('Error retrieving latest register number:', getNumberError);
        res.status(500).send('Error retrieving latest register number');
        return;
      }

      let latestRegisterNumber = numberResults[0].maxRegisterNumber || 499999; // If there are no entries, start from 499999
      latestRegisterNumber++; // Increment the latest register number
      const registerNumber = Math.max(500000, latestRegisterNumber); // Ensure the minimum of 6 digits starting from 500000


      const insertQuery = `
      INSERT INTO applications 
      (registerNumber, firstName, lastName, gender, birthDate, phoneNumber, email, exam_link, cityDistrict, state, zipcode, resumePath,uploadphoto) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
    `;
    connection.query(
      insertQuery,
      [
        registerNumber,
        first_name,
        last_name,
        gender,
        formattedBirthDate,
        phone_number,
        email,
        exam_link,
        city_district,
        state,
        zipcode,
        filePathResume,
        filePathPhoto,

      ],
      async (insertError, results) => {
        if (insertError) {
          console.error('Error inserting data into MySQL:', insertError);
          res.status(500).send('Error inserting data into the database');
          return;
        }

        const exam_link = "http://192.168.30.104:3000/login"

        const mailOptions = {
          from: '"Brightcom Group" <geetanjalib@brightcomgroup.com>',
          template: 'email', // the name of the main template file, without extension
          to: email,
          subject: `Registration Successful`,
          context: {
            name:`${first_name} ${last_name}`,
            company: 'Brightcom Group',
            email: email,
            registernumber: registerNumber,
            exam_link:exam_link
          },
        };
      
        try {
          await transporter.sendMail(mailOptions);
          console.log(`Email sent successfully to ${email}`);
        } catch (error) {
          console.log(`Nodemailer error sending email to ${email}`, error);
        }

        console.log('Form data inserted into MySQL');
        res.status(200).send('Form data received and inserted successfully into the database');
    }
    );
  });
});
});

// Assuming you have already set up your Express app and MySQL connection

// Define your GET endpoint to fetch all applications
router.get('/applications', (req, res) => {
  const getAllApplicationsQuery = `
    SELECT * FROM applications
  `;

  connection.query(getAllApplicationsQuery, (error, results) => {
    if (error) {
      console.error('Error retrieving applications:', error);
      res.status(500).send('Error retrieving applications from the database');
      return;
    }

    // If data is retrieved successfully, send it in the response
    res.status(200).json(results);
  });
});


router.post('/login', async (req, res) => {
  const { email, registerNumber } = req.body;

  try {
    // Validate login based on the provided email or registerNumber
    const loginQuery = `
      SELECT * FROM applications WHERE email = ? AND registerNumber = ?
    `;

    connection.query(loginQuery, [email, registerNumber], (error, results) => {
      if (error) {
        console.error('Error during login:', error);
        res.status(500).send('Error during login');
        return;
      }

      if (results.length === 0) {
        res.status(401).send('Please check your email and registerNumber'); // Use 401 for unauthorized access
        return;
      }

      // Check if the retrieved user matches the provided credentials (email or registerNumber)
      const matchedUser = results.find(user => user.email === email || user.registerNumber === registerNumber);

      if (!matchedUser) {
        res.status(401).send('Please check your email and registerNumber'); // Use 401 for unauthorized access
        return;
      }

      // Extract relevant user information
      const { firstName, lastName, registerNumber } = matchedUser;

      // Here you can handle the login success
      // For example, you might generate a JWT token for authentication
      
      // Send additional user information along with the success response
      res.status(200).json({
        message: 'Login successful',
        firstName,
        lastName,
        registerNumber
      });
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Error during login');
  }
});

// router.get('/exam-link', (req, res) => {
//   const currentDate = new Date();
//   const allowedDate = new Date('2023-12-08'); // Replace with your allowed date
//   const startTime = new Date('2023-12-08T15:42:00'); // Replace with your allowed start time
//   const endTime = new Date('2023-12-08T15:50:00'); // Replace with your allowed end time
  
//   if (
//     currentDate >= allowedDate &&
//     currentDate >= startTime &&
//     currentDate <= endTime
//   ) {
//     // Provide the link if the current date and time are within the allowed range
//     res.status(200).json({ link: 'http://192.168.30.104:3000/login' });
//   } else if (currentDate < startTime) {
//     // If the current time is before the start time, show a message that the link is not available yet
//     res.status(403).json({ message: 'Exam link not available yet' });
//   } else {
//     // If the current time is after the end time, show a message that the link has expired
//     res.status(403).json({ message: 'Exam link expired' });
//   }
// });

// connection.connect((err) => {
//   if (err) {
//     console.error('Error connecting to database:', err);
//     return;
//   }
//   console.log('Connected to database');
// });

// const webcam = Webcam.create({
//   width: 640,
//   height: 480,
//   quality: 100,
//   delay: 0,
//   saveShots: false,
//   output: 'jpeg',
//   device: false,
//   callbackReturn: 'location',
// });

// router.post('/capture', async (req, res) => {
//   try {
//     const { registerNumber, capturedImage } = req.body;

//     if (!capturedImage) {
//       return res.status(400).send('No image data received.');
//     }

//     // Simulating image capture in this example
//     const imageData = capturedImage; // Replace with actual image capture logic

//     // Convert the image data to base64 (this should be adjusted based on actual data)
//     const base64ImageData = Buffer.from(imageData, 'base64');

//     // Insert the image data into the database
//     const insertQuery = 'INSERT INTO images (uploadimages, registerNumber) VALUES (?, ?)';
//     connection.query(insertQuery, [base64ImageData, registerNumber], (insertErr, results) => {
//       if (insertErr) {
//         console.error('Error inserting image into database:', insertErr);
//         return res.status(500).send('Error inserting image into database');
//       }
//       console.log('Image inserted successfully');
//       res.status(200).send('Image inserted successfully');
//     });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).send('Server error');
//   }
// });

// Assuming filePath is the variable containing the image path

 // Destination folder for image uploads

 router.post('/uploadImage', upload.single('image'), (req, res) => {
  console.log('Received file:', req.file);
  const { registerNumber } = req.body; // Ensure 'registerNumber' is correctly sent in req.body
  const imagePath = req.file.path; // Assuming 'path' contains the image file path

  // Define the folder where you'll store the images
  const imageFolder = '/Images'; // Update with your image folder path

  // Generate a unique filename for the image based on registerNumber and timestamp
  const uniqueFilename = registerNumber + '-' + Date.now();
  const newImagePath = path.join("Images/" + registerNumber + '.png');
console.log(newImagePath)

  // Read the uploaded file
  fs.readFile(imagePath, (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      res.status(500).json({ success: false, error: 'Failed to read image' });
      return;
    }

    // Save the image with the unique filename and PNG format
    fs.writeFile(newImagePath, data, (err) => {
      if (err) {
        console.error('Error saving file:', err);
        res.status(500).json({ success: false, error: 'Failed to save image' });
        return;
      }

      // Assuming 'newImagePath' contains the relative path to the image
      // Insert the image path into the database with the corresponding registerNumber
      connection.query('INSERT INTO images (registernumber, captureimage) VALUES (?, ?)', [registerNumber, newImagePath], (err, results) => {
        if (err) {
          console.error('Error inserting image path:', err);
          res.status(500).json({ success: false, error: 'Failed to save image to database' });
        } else {
          console.log('Image path inserted successfully for registerNumber:', registerNumber);
          res.status(200).json({ success: true, message: 'Image uploaded successfully' });
        }
      });
    });
  });
});


module.exports = router;
