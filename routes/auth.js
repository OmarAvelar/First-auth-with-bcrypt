const router = require('express').Router();
const bcrypt = require('bcrypt');
const User   = require('../models/User');

const saltRounds = 10;
 
// todas estás rutas tienen antepuesto /auth 
router.get('/signup', (req, res) => { 
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
  const { email, password1, password2 } = req.body;
  if (email === '' || password1 === '' || password2 === '') {
    return res.render('auth/signup', {
      message: 'Please fill the fields'
    })
  }  
  if (!email.includes('@')) {
    return res.render('auth/signup', {
      message: 'Please input a valid email'
    })
  }
  User.findOne({ email })
  .then(response => {
    if (response === null) {  
      const salt = bcrypt.genSaltSync(saltRounds);
      const password = bcrypt.hashSync(password1, salt);
      User.create({ email, password })
      .then(user => {
        res.send(user);
      })
      .catch(err => {
        console.log(err);
      })
    } else {
      res.render('auth/signup', {
        message: 'This user already exist'
      })
    }
  })
  .catch(err => {
    console.log(err);
  })
});

module.exports = router;