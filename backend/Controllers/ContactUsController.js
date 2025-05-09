const ContactUs = require('../Models/ContactUs');
const nodemailer = require('nodemailer');

exports.createMessage = async (req, res) => {
  try {
    const { fullName, email, message } = req.body;

    if (!fullName || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Save the message to the database
    const newMessage = new ContactUs({ fullName, email, message });
    await newMessage.save();

    // Setup Nodemailer transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
      secure: true, 
    });

    // Email options for user
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank You for Contacting Us',
      text: `Dear ${fullName},\n\nThank you for reaching out to us. We have received your message and will get back to you soon. Here is a copy of your message:\n\n${message}\n\nBest regards,\neSabraHub Team`,
    };

    // Email options for eSabraHub team
    const teamMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Oour team's email address to receive the user's form details
      subject: 'New Contact Us Message Received',
      text: `New message received from ${fullName} (${email}).\n\nMessage:\n\n${message}`,
    };

    // Send email to the user
    transporter.sendMail(userMailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email to user:', error);
        return res.status(500).json({ error: 'Failed to send email to user', details: error.message });
      }
      console.log('Email sent to user:', info.response);

      // Send email to the eSabraHub team
      transporter.sendMail(teamMailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email to eSabraHub team:', error);
          return res.status(500).json({ error: 'Failed to send email to eSabraHub team', details: error.message });
        }
        console.log('Email sent to eSabraHub team:', info.response);
        res.status(201).json({ message: 'Message sent successfully and emails sent' });
      });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
