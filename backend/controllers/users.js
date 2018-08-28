const config = require('../config.json');
const UserModel = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
  .then( hash => {
    const user = new UserModel({
      firstName: req.body.firstName,
      email: req.body.email,
      password: hash
    });

    user.save()
      .then(result => {
        res.status(201).json({
          mesage: 'User Created!',
          result: result
        });
      })
      .catch( err => {
        res.status(500).json({
            mesage: 'Invalid authentication credentials'
        });
      });
  });
}

exports.userUpdate = (req, res, next) => {
  const hash = bcrypt.hash(req.body.password, 10);
  const user = new UserModel({
    _id: req.body.id,
    firstName: req.body.firstName,
    email: req.body.email,
    password: hash
  });
  console.log(user);
  UserModel.updateOne({_id: req.params.id}, user).then(result => {
    console.log(result);
    res.status(200).json({ messge: "User Update Succesful!"})
  })
}

exports.getUser = (req, res, next) => {
  console.log("HIT UPDATE USER ENDPOINT");
  UserModel.findById(req.params.id).then( user => {
    if( user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({
        message: 'User not found!'
      });
    }
  })
}

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  UserModel.findOne({email: req.body.email})
  .then(user => {
    if(!user) {
      return res.status(401).json({
        mesage: 'Authentiation Failed: User Not Found'
      })
    }
    fetchedUser = user;
    console.log(fetchedUser);
    return bcrypt.compare(req.body.password,user.password)
  })
  .then(result => {
    if(!result) {
      return res.status(401).json({
        mesage: 'Authentication Failed'
      })
    }

    const token = jwt.sign(
      { email: fetchedUser.email, userId: fetchedUser._id },
      config.hashSecret,
      { expiresIn: '1h' }
    );
    return res.status(200).json({
      token: token,
      expiresIn: 3600,
      userId: fetchedUser._id
    });
  })
  .catch(err => {
    return res.status(401).json({
      mesage: 'Authentication Failed',
      error: err
    });
  });
}

