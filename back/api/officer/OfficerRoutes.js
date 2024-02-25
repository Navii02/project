const OfficerSchema = require('../../models/Officer/OfficerSchema');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const emailTransporter = require('../../nodemailer');

router.post('/officerregister', async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password || !name)
    return res.status(400).json({ msg: 'Password and email are required' });

  if (password.length < 8) {
    return res
      .status(400)
      .json({ msg: 'Password should be at least 8 characters long' });
  }

  const user = await OfficerSchema.findOne({ email });
  if (user) return res.status(400).json({ msg: 'User already exists' });

  const newUser = new OfficerSchema({ name, email, password });

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


router.post(`/officerlogin`, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ msg: 'Something missing' });
  }

  const user = await OfficerSchema.findOne({ email: email });
  if (!user) {
    return res.status(400).json({ msg: 'User not found' });
  }

  const matchPassword = await bcrypt.compare(password, user.password);
  if (matchPassword) {
    return res
      .status(200)
      .json({ msg: 'You have logged in successfully', email: user.email });
  } else {
    return res.status(400).json({ msg: 'Invalid credentials' });
  }
});

module.exports = router;
