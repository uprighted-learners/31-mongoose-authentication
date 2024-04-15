// import depdencies
const jwt = require('jsonwebtoken');
require('dotenv').config(); // allows for the reading of .env file

// create a payload
const payload = {
    "sub": "65461984615631",
    "name": "John Doe",
    "admin": true
}

console.log("payload: ", payload);

// sign the payload
const signedJWT = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: 2 });

console.log("signedJWT: ", signedJWT);

// verify the payload
const verified = jwt.verify(signedJWT, process.env.SECRET_KEY);

console.log("verified: ", verified);