const TutorSchema = require('../../models/Tutor/TutorSchema');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const emailTransporter = require('../../nodemailer');


router.post('/classtutorregister', async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password || !name)
    return res.status(400).json({ msg: 'Password, email, and name are required' });

  if (password.length < 8) {
    return res
      .status(400)
      .json({ msg: 'Password should be at least 8 characters long' });
  }

  const user = await TutorSchema.findOne({ email });

  if (user) return res.status(400).json({ msg: 'User already exists' });

  const newUser = new TutorSchema({ name, email, password });

  // Hashing the password
  bcrypt.hash(password, 7, async (err, hash) => {
    if (err)
      return res.status(400).json({ msg: 'Error while saving the password' });

    newUser.password = hash;

    try {
      const savedUserRes = await newUser.save();

      if (savedUserRes) {
        // Send confirmation email to the user
        const mailOptions = {
          from:  emailTransporter.options.auth.user,
          to: email,
          subject: 'Registration Successful',
          text: 'Thank you for registering. You have successfully signed up!',
        };

        emailTransporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(error);
            return res.status(500).json({ msg: 'Error sending confirmation email' });
          } else {
            console.log('Email sent: ' + info.response);
            return res.status(200).json({ msg: 'User is successfully saved' });
          }
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: 'Error saving user to the database' });
    }
  });
});

router.post(`/classtutorlogin`, async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400).json({ msg: 'Something missing' })
  }

  const user = await TutorSchema.findOne({ email: email }) // finding user in db
  if (!user) {
    return res.status(400).json({ msg: 'User not found' })
  }

  // comparing the password with the saved hash-password
  const matchPassword = await bcrypt.compare(password, user.password)
  if (matchPassword) {
    return res
      .status(200)
      .json({ msg: 'You have logged in successfully' }) 
  } else {
    return res.status(400).json({ msg: 'Invalid credential' })
  }
})


module.exports = router