const express = require('express');
const router = express.Router();
const connection = require('../database');
const bcrypt = require('bcrypt');
// const jwtSecretKey = require('../config');
const jwt = require('jsonwebtoken')
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const XLSX = require('xlsx');
const fs = require('fs');
const util = require('util');
const promisifyQuery = util.promisify(connection.query).bind(connection);
const verifyRole = require('./verifyRole');


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



router.post('/register', async (req, res) => {
  try {
      const { username, email, password, role } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const sqlCheck = `SELECT * FROM users WHERE username = ? OR email = ?`;
      const checkValues = [username, email];

      connection.query(sqlCheck, checkValues, (error, results, fields) => {
          if (error) {
              console.error('Error checking for existing user:', error);
              res.status(500).json({ message: 'Internal Server Error' });
              return;
          }

          if (results.length > 0) {
              // User with the same username or email already exists
              res.status(400).json({ message: 'Username or email already exists. Please choose another.' });
              return;
          }

          const sql = `INSERT INTO users (username, email,  password, role) VALUES (?, ?, ?, ?)`;
          const values = [username, email, hashedPassword, role];

          connection.query(sql, values, (error, results, fields) => {
              if (error) {
                  console.error('Error registering user:', error);
                  res.status(500).json({ message: 'Internal Server Error' });
              } else {
                  console.log('User registered successfully');
                  res.status(201).json({ message: 'User registered successfully' });
              }
          });
      });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

function verifyToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
    req.user = decoded;
    next();
  });
}
// Login endpoint
router.post('/adminlogin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const sql = `SELECT * FROM users WHERE email = ?`;
        connection.query(sql, [email], async (error, results, fields) => {
            if (error) {
                console.error('Error finding user:', error);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                const user = results[0];

                if (!user) {
                    return res.status(401).json({ message: 'Invalid email or password' });
                }

                const isPasswordValid = await bcrypt.compare(password, user.password);

                if (!isPasswordValid) {
                    return res.status(401).json({ message: 'Invalid username or password' });
                }

                const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
                res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 3600000 }); // 1 hour expiration time
                res.json({ token, id: user.id, username: user.username, role: user.role });
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/admin', verifyToken, verifyRole('admin'),(req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Access denied' });
  }
   res.json({ message: 'Admin page accessed successfully' });
});

router.get('/superadmin', verifyToken,  verifyRole('superadmin'),(req, res) => {
  if (req.user.role !== 'superadmin') {
    return res.status(403).json({ message: 'Forbidden: Access denied' });
  }
   res.json({ message: 'Superadmin page accessed successfully' });
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});


router.post('/login', async (req, res) => {
  const { email, registerNumber } = req.body;
  try {
    const loginQuery = 'SELECT * FROM applications WHERE email = ? AND registerNumber = ?';
    const [user] = await promisifyQuery(loginQuery, [email, registerNumber]);

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const userId = user.registerNumber;
    const examSubmissionQuery = 'SELECT * FROM exam_results WHERE user_id = ?';
    const examSubmissionResults = await promisifyQuery(examSubmissionQuery, [userId]);

    if (examSubmissionResults.length > 0) {
      res.status(401).json({ error: 'User has already submitted the exam' });
      return;
    }

    const { firstName, lastName } = user;
    const token = jwt.sign({ userId: registerNumber }, process.env.JWT_SECRET_KEY);

    res.status(200).json({
      message: 'Login successful',
      firstName,
      lastName,
      registerNumber,
      token,
      role: user.role, // Include the user's role in the response
      alreadySubmittedExam: false, // Indicate whether the user has already submitted an exam
    });
    
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/add-notification', (req, res) => {
  const { userId, notificationText } = req.body;

  const sql = 'INSERT INTO notifications (user_id, notification_text) VALUES (?, ?)';
  const values = [userId, notificationText];

  connection.query(sql, values, (error, results, fields) => {
    if (error) {
      console.error('Error adding notification:', error);
      res.status(500).json({ success: false, error: 'Error adding notification' });
    } else {
      res.json({ success: true, message: 'Notification added successfully' });
    }
  });
});

router.get('/get-notifications-admin', (req, res) => {
  const sql = 'SELECT * FROM notifications ;';

  connection.query(sql, (error, results, fields) => {
    if (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});

router.get('/get-notifications', (req, res) => {
  const sql = 'SELECT * FROM notifications where qpaperpath is not NULL and exam_date is not NULL and EndTime is not NULL and uploadlogo is not NULL;';

  connection.query(sql, (error, results, fields) => {
    if (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});

// In notifications.js or your server-side route file
router.delete('/delete-notification/:id', (req, res) => {
  const notificationId = req.params.id;

  const sql = 'DELETE FROM notifications WHERE id = ?';

  connection.query(sql, [notificationId], (error, results, fields) => {
    if (error) {
      console.error('Error deleting notification:', error);
      res.status(500).json({ success: false, error: 'Error deleting notification' });
    } else {
      res.json({ success: true, message: 'Notification deleted successfully' });
    }
  });
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../frontend/public/uploads'); // Change the destination path
  },
 
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post('/upload-questionpaper/', upload.single('file'), (req, res) => {
  const { notificationId } = req.body;
  const filePath = req.file.path;
  let newPath = filePath.replace("..\\frontend\\public", "");
 
  
  console.log("notificationId:", notificationId);

  const sql = 'UPDATE notifications SET qpaperpath = ? WHERE id = ?';

  connection.query(sql, [newPath, notificationId], (error, results, fields) => {
    if (error) {
      console.error('Error uploading question paper:', error);
      res.status(500).json({ success: false, error: 'Error uploading question paper' });
    } else {
      res.json({ success: true, message: 'Question Paper Uploaded Successfully' });
    }
  });
});


router.post('/getusers', (req, res) => {
  const userId = req.body.userId; // Assuming the user ID is sent in the request body
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required in the request body.' });
  }

  const sql = `
    SELECT a.registerNumber, a.firstName, a.lastName, a.phoneNumber, a.email, a.resumePath, a.notificationId, n.notification_text
    FROM applications AS a
    LEFT JOIN notifications AS n ON a.notificationId = n.id
    WHERE a.notificationId IS NOT NULL AND n.user_id = ?
  `;

  connection.query(sql, [userId], (error, results, fields) => {
    if (error) {
      console.error('Error fetching user details:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});

router.get('/admins', async (req, res) => {
  const sql = 'SELECT * FROM users';

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

router.get('/getusers', (req, res) => {
  const sql = 'SELECT registerNumber, firstName, lastName, phoneNumber, email, resumePath FROM applications';

  connection.query(sql, (error, results, fields) => {
    if (error) {
      console.error('Error fetching user details:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});

const convertDateTime = (dateTime) => {
  const [date, time] = dateTime.split(', ');
  const [day, month, year] = date.split('/');
  const formattedDate = `${year}-${month}-${day}T${time}`;
  return new Date(formattedDate);
};

router.get('/getresults', (req, res) => {
  const sql = 'SELECT user_id, user_name, score, date_and_time FROM exam_results';
  connection.query(sql, (error, results, fields) => {
      if (error) {
          console.error('Error fetching user details:', error);
          res.status(500).json({ message: 'Internal Server Error' });
      } else {
          // Convert date and time format before sending the response
          const formattedResults = results.map(result => ({
              ...result,
              date_and_time: convertDateTime(result.date_and_time)
          }));
          res.json(formattedResults);
      }
  });
});


// router.get('/getresults', (req, res) => {
//   // Assuming you receive the current user id from the frontend body
//   const userId = req.query.userId;

//   if (!userId) {
//     return res.status(400).json({ message: 'User ID is required in the request parameters.' });
//   }
//   const sql = `
//     SELECT 
//       er.user_id, 
//       er.user_name, 
//       er.score, 
//       er.date_and_time,
//       a.notificationId
//     FROM 
//       exam_results er
//     INNER JOIN 
//       applications a ON er.user_id = a.registerNumber
//     INNER JOIN
//       notifications n ON a.notificationId = n.id
//     WHERE
//       n.user_id = ?
//   `;

//   connection.query(sql, [userId], (error, results, fields) => {
//     if (error) {
//       console.error('Error fetching user details:', error);
//       res.status(500).json({ message: 'Internal Server Error' });
//     } else {
//       res.json(results);
//     }
//   });
// });

router.get('/getquestionpaper', (req, res) => {
  const { userId } = req.query;

  // Assuming you have a database connection object named `db`
  connection.query('SELECT notificationId FROM applications WHERE registerNumber = ?', [userId], (error, results) => {
    if (error) {
      console.error('Error fetching notificationId:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.length === 0) {
      // User not found in applications table
      console.error('User not found for userId:', userId);
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const notificationId = results[0].notificationId;

    // Now fetch qpaperpath using notificationId from the notification table
    connection.query('SELECT qpaperpath FROM notifications WHERE id = ?', [notificationId], (err, qpaperResults) => {
      if (err) {
        console.error('Error fetching qpaperpath:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      if (qpaperResults.length === 0) {
        // Notification not found in the notification table
        console.error('Notification not found for notificationId:', notificationId);
        res.status(404).json({ error: 'Notification not found' });
        return;
      }

      const qpaperpath = qpaperResults[0].qpaperpath;
      
      console.log('notificationId:', notificationId);
      console.log('qpaperpath:', qpaperpath);

      // Dynamically generate the file name based on qpaperpath
      const fileName = `..\\frontend\\public\\${qpaperpath}`;

      // Read the file asynchronously
      fs.readFile(fileName, (readErr, fileContent) => {
        if (readErr) {
          console.error('Error reading file:', readErr);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }

        const workbook = XLSX.read(fileContent, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const arrayData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const convertToQuestionsFormat = (arrayData) => {
          const categories = {};
        
          for (let i = 1; i < arrayData.length; i++) {
            const [category, id, question, options, answer] = arrayData[i];
        
            if (!categories[category]) {
              categories[category] = {
                category,
                questions: [],
              };
            }
        
            // Check if options is defined before splitting
            const optionsArray = options ? options.split(', ').map(option => option.trim()) : [];
        
            categories[category].questions.push({
              id,
              question,
              options: optionsArray,
              answer,
            });
          }
        
          return Object.values(categories);
        };
        
        
        const questions = convertToQuestionsFormat(arrayData);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(questions));
      });
    });
  });
});

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
    notificationId,
    notificationText,
  } = req.body;

  console.log(req.body)

  const { uploadresume, uploadphoto } = req.files;

  // ... rest of your validation and insertion logic remains the same

  const filePathResume = uploadresume ? uploadresume[0].path : '';
  const filePathPhoto = uploadphoto ? uploadphoto[0].path : '';

  // Check if the email already exists in the database
  const checkEmailQuery = `
    SELECT * FROM applications WHERE email = ? and notificationid=?
  `;
  connection.query(checkEmailQuery, [email, notificationId], (checkError, checkResults) => {
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
      (registerNumber, firstName, lastName, gender, birthDate, phoneNumber, email, exam_link, cityDistrict, state, zipcode, resumePath,photopath,notificationId) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)
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
          notificationId,


        ],
        async (insertError, results) => {
          if (insertError) {
            console.error('Error inserting data into MySQL:', insertError);
            res.status(500).send('Error inserting data into the database');
            return;
          }

          let exam_date, startTime, endTime;

          connection.query(`select exam_date,StartTime,EndTime from notifications where  id =?`, [notificationId], async (error, results) => {
            if (error) return res.status(500).send('Error occures');
            else {
              if (results.length !== 0) {
                console.log(results)
                const { exam_date, StartTime, EndTime } = results[0]
                const exam_link = "https://b683-183-82-100-222.ngrok-free.app/login"

                const mailOptions = {
                  from: '"Brightcom Group" <geetanjalib@brightcomgroup.com>',
                  template: 'email', // the name of the main template file, without extension
                  to: email,
                  subject: `Registration Successful`,
                  context: {
                    name: `${first_name} ${last_name}`,
                    company: 'Brightcom Group',
                    email: email,
                    registernumber: registerNumber,
                    exam_link: exam_link,
                    notificationText: notificationText,
                    exam_date: exam_date,
                    StartTime: StartTime,
                    EndTime: EndTime
                  },
                }


                try {
                  await transporter.sendMail(mailOptions);
                  console.log(`Email sent successfully to ${email}`);
                } catch (error) {
                  console.log(`Nodemailer error sending email to ${email}`, error);
                }

                console.log('Form data inserted into MySQL');
                res.status(200).send('Form data received and inserted successfully into the database');

              }
              else{
                return res.status(500).send('Contact admin notification not valid');
              }

            }
          })


        }
      );
    });
  });
});

// Nodemailer Transporter Configuration for Forgot Password
const forgotPasswordTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'geetanjalib@brightcomgroup.com',
    pass: 'kxah oxvi njke jmuj'
  }
});

// Route to handle sending OTP and storing email and OTP in separate tables
router.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000); // Generate OTP

  // Check if the email exists in the database
  const checkEmailSql = `SELECT * FROM users WHERE email = ?`;
  connection.query(checkEmailSql, [email], (checkErr, checkResult) => {
      if (checkErr) {
          console.error('Error checking email:', checkErr);
          res.status(500).json({ message: 'Error checking email' });
      } else {
          if (checkResult.length > 0) {
              // Email exists, proceed to insert email and OTP into the 'otps' table
              const insertOtpSql = `INSERT INTO otps (email, otp) VALUES (?, ?)`;
              connection.query(insertOtpSql, [email, otp], (insertOtpErr, insertOtpResult) => {
                  if (insertOtpErr) {
                      console.error('Error storing email and OTP:', insertOtpErr);
                      res.status(500).json({ message: 'Error storing OTP' });
                  } else {
                      // Send OTP to the user's email
                      const mailOptions = {
                          from: 'your_email@gmail.com',
                          to: email,
                          subject: 'Password Reset OTP',
                          text: `Your OTP for password reset is: ${otp}`
                      };

                      forgotPasswordTransporter.sendMail(mailOptions, (error, info) => {
                          if (error) {
                              console.error('Error sending email:', error);
                              res.status(500).json({ message: 'Error sending email' });
                          } else {
                              res.status(200).json({ message: 'OTP sent to your email' });
                          }
                      });
                  }
              });
          } else {
              // Email does not exist in the database
              res.status(404).json({ message: 'Email not found' });
          }
      }
  });
});

router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  // Check if the provided OTP matches the stored OTP in the database
  const sql = `SELECT otp FROM otps WHERE email = ?`;
  connection.query(sql, [email], (err, result) => {
      if (err) {
          console.error('Error retrieving OTP:', err);
          res.status(500).json({ message: 'Error verifying OTP' });
      } else {
          if (result.length > 0) {
              const storedOTP = result[0].otp;
              if (otp === storedOTP) {
                  // If OTP is verified successfully, you can proceed with further actions like allowing the user to reset their password
                  res.status(200).json({ message: 'OTP verified successfully' });
              } else {
                  res.status(400).json({ message: 'Invalid OTP' });
              }
          } else {
              res.status(404).json({ message: 'Email not found' });
          }
      }
  });
});


router.post('/validateOldPasswordAndRole', (req, res) => {
  const { oldPassword, userId } = req.body;
  connection.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    const user = results[0];
    bcrypt.compare(oldPassword, user.password, (bcryptErr, bcryptResult) => {
      if (bcryptErr) {
        console.error('Error comparing passwords:', bcryptErr);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      if (bcryptResult && user.role === 'admin') {
        res.json({ valid: true, role: 'admin' });
      } else {
        res.status(401).json({ valid: false });
      }
    });
  });
});

router.post('/updatePassword', (req, res) => {
  const { newPassword, userId } = req.body;
  bcrypt.hash(newPassword, 10, (hashErr, hashedPassword) => {
    if (hashErr) {
      console.error('Error hashing password:', hashErr);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    connection.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId], (updateErr, results) => {
      if (updateErr) {
        console.error('Error updating password:', updateErr);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      res.sendStatus(200); // Password updated successfully
    });
  });
});


router.post('/reset-password', (req, res) => {
  const { email, newPassword } = req.body;

  // Hash the new password
  bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }

    const updatePasswordQuery = 'UPDATE users SET password = ? WHERE email = ?';
    connection.query(updatePasswordQuery, [hashedPassword, email], (error, results) => {
      if (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
      }

      if (results.affectedRows === 0) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      // Delete records from otps table
      const deleteOTPsQuery = 'DELETE FROM otps WHERE email = ?';
      connection.query(deleteOTPsQuery, [email], (deleteError, deleteResults) => {
        if (deleteError) {
          console.error('Error deleting OTP records:', deleteError);
          res.status(500).json({ message: 'Internal server error' });
          return;
        }

        res.status(200).json({ message: 'Password reset successfully' });
      });
    });
  });
});

router.post('/uploadCameraImage', upload.single('image'), (req, res) => {
  console.log('Received file:', req.file);
  const { registerNumber } = req.body; 
  const imagePath = req.file.path; 

  const newImagePath = path.join("..\\frontend\\public\\Images\\" + registerNumber + '.png');
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

// Route to fetch notification text for a user
router.get('/notification/:registerNumber', (req, res) => {
  const registerNumber = req.params.registerNumber;

  // Query to fetch notification text for the given user's register number
  const query = `
    SELECT a.firstName, a.lastName, n.notification_text, uploadlogo
    FROM applications AS a
    JOIN notifications AS n ON a.notificationId = n.id
    WHERE a.registerNumber = ?
  `;

  // Execute the query
  connection.query(query, [registerNumber], (error, results) => {
    if (error) {
      console.error('Error fetching notification text:', error);
      res.status(500).send('Internal Server Error');
      return;
    }

    if (results.length === 0) {
      res.status(404).send('Notification not found for the provided register number');
      return;
    }

    // Send the notification text in the response
    res.json(results[0]);
  });
});


// Backend API route to fetch user details
router.get('/user-details/:registerNumber', async (req, res) => {
  const registerNumber = req.params.registerNumber;

  // Query to fetch user details based on the register number
  const getUserDetailsQuery = `SELECT gender, birthDate FROM applications WHERE registerNumber = ?`;

  connection.query(getUserDetailsQuery, [registerNumber], (error, results) => {
    if (error) {
      console.error('Error fetching user details:', error);
      res.status(500).send('Error fetching user details');
      return;
    }

    if (results.length === 0) {
      res.status(404).send('User not found');
      return;
    }

    const userDetails = {
      gender: results[0].gender,
      birthDate: results[0].birthDate
    };

    res.status(200).json(userDetails);
  });
});

// For uploading logo with notificationId
router.post('/upload-logo/:notificationId', upload.single('file'), (req, res) => {
  const { notificationId } = req.params;
  const filePath = req.file.path;
  const newPath = filePath.replace("..\\frontend\\public", ""); // Adjust path as needed

  console.log("notificationId:", notificationId);

  const sql = 'UPDATE notifications SET uploadlogo = ? WHERE id = ?';

  connection.query(sql, [newPath, notificationId], (error, results, fields) => {
    if (error) {
      console.error('Error uploading logo:', error);
      res.status(500).json({ success: false, error: 'Error uploading logo' });
    } else {
      res.json({ success: true, message: 'Logo Uploaded Successfully' });
    }
  });
});

// updateExamDate.js

router.post('/update-exam-date/:notificationId', async (req, res) => {
  const { notificationId } = req.params;
  const { examDate } = req.body;

  try {
    const sql = 'UPDATE notifications SET exam_date = ? WHERE id = ?';
    connection.query(sql, [examDate, notificationId], (error, results, fields) => {
      if (error) {
        console.error('Error updating exam date:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
      } else {
        console.log('Exam date updated successfully');
        res.status(200).json({ success: true, message: 'Exam date updated successfully' });
      }
    });
  } catch (error) {
    console.error('Error updating exam date:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.post('/update-start-time/:notificationId', async (req, res) => {
  const { notificationId } = req.params;
  const { startTime } = req.body;

  try {
    const sql = 'UPDATE notifications SET StartTime = ? WHERE id = ?';
    connection.query(sql, [startTime, notificationId], (error, results, fields) => {
      if (error) {
        console.error('Error updating start exam time:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
      } else {
        res.status(200).json({ success: true, message: 'Start exam time updated successfully' });
      }
    });
  } catch (error) {
    console.error('Error updating start exam time:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.post('/update-end-time/:notificationId', async (req, res) => {
  const { notificationId } = req.params;
  const { endTime } = req.body;

  try {
    const sql = 'UPDATE notifications SET EndTime = ? WHERE id = ?';
    connection.query(sql, [endTime, notificationId], (error, results, fields) => {
      if (error) {
        console.error('Error updating end exam time:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
      } else {
        res.status(200).json({ success: true, message: 'End exam time updated successfully' });
      }
    });
  } catch (error) {
    console.error('Error updating end exam time:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});



module.exports = router;