
const { success, failure } = require('@utils').responseJson;
const commFunc =  require('@utils').commFunc;
const nodemailer = require('nodemailer');
const transporter = require('@app/config/mail.config');
const db = require("@db");

const Note = db.note;

const mailTransporter = nodemailer.createTransport(transporter);

exports.sendNoteMail = (req, res) => {

  Note.findByPk(req.body.noteId)
  .then(details => {
    if (!details) {
      return res.status(200).json(failure('9999', { message: "Not found Note." }));
    }

    let mailDetails = {
        from: req.body.from,
        to: req.body.to,
        subject: `${details.remark.substr(0, 10)}...`,
        html:
        `<h1>내용</h1>
        <p>${details.remark.replace(/\n/g, "<br>")}</p>
        `,
    };
    
    mailTransporter.sendMail(mailDetails, function(err, data) {
      if(err) {
        return res.status(200).json(failure('9999', err));
      } else {
        return res.status(200).json(success('Email sent successfully'));
      }
    });

  })
  .catch(err => {
    res.status(500).send(err.message);
  });

};
