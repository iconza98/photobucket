const config = require('../config.json');
const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, config.hashSecret);
    console.log("VERIFIED TOKEN");
    next();
  } catch( error ) {
    res.status(401).json({
      message: 'Unauthorized'
    });
  }

};
