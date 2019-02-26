var express = require('express');
var router = express.Router();
var bcryptjs = require('bcryptjs')
var jwt = require('jsonwebtoken')
var User = require('../models/users')

router.post('/register', (req, res) => {
  let data = req.body

  let user = new User({
    username: data.username,
    email: data.email,
    password: bcryptjs.hashSync(data.password, bcryptjs.genSaltSync(10))
  })

  user.save()
  .then(usr => {
    if(usr == null){
      return res.status(400).json({
        message: "Failed to register"
      })
    }
    else{
      return res.status(200).json({
        message: "registered successfully"
      })
    }
  })
  .catch(err => {
    return res.status(400).json({
      message: err
    })
  })

})
router.post('/login', function(req, res, next) {
  let data = req.body;

  if(!(data.username || data.email) || !data.password){
    return res.status(400).json({
      message: "Missing required fields"
    })
  }
  else{
    if(data.username){
      User.findOne({ 
        username: data.username
      })
      .then( user => {
        if(user == null){
          return res.status(400).json({
            message: "User not found"
          })
        }
        else{
          comparePass(data.password, user, res)
        }
      })
      .catch(err => {
        return res.status(400).json({
          message: err
        })
      })
    }
    if(data.email){
      User.findOne({ 
        email: data.email
      })
      .then( user => {
        if(user == null){
          return res.status(400).json({
            message: "User not found"
          })
        }
        else{
          comparePass(data.password, user, res)
        }
      })
      .catch(err => {
        return res.status(400).json({
          message: err
        })
      })
    }
    
  }
  
});

let comparePass = (password, user, res) =>{
  console.log(user)
  bcryptjs.compare(password, user.password, (err, match) => {
    if(match){
      var token = jwt.sign(user.toJSON(), process.env.secret)
      res.status(200).json({
        token: token,
        user: user
      })
    }
    else{
      return res.status(400).json({
        message: "Incorrect password"
      })
    }
  })
  // .then( match =>{
  //   if(match){
  //     var token = jwt.sign(user, process.env.secret)
  //     res.status(200).json({
  //       token: token,
  //       user: user
  //     })
  //   }
  //   else{
  //     return res.status(400).json({
  //       message: "Incorrect password"
  //     })
  //   }
  // })
  // .catch(err => {
  //   console.log('hereeee')
  //   return res.status(400).json({
  //     message: err
  //   })
  // })
}
module.exports = router;
