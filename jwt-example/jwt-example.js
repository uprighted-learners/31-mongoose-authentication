// import depdencies
const jwt = require('jsonwebtoken');
require('dotenv').config(); // allows for the reading of .env file

// create a payload
const payload = {
    "sub": "65461984615631",
    "name": "John Doe",
    "role": "subscriber",
}

console.log("payload: ", payload);

// sign the payload
const signedJWT = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: 2 }); // expires in 1 hour

console.log("signedJWT: ", signedJWT);

// verify the payload
const verified = jwt.verify(signedJWT, process.env.SECRET_KEY);

console.log("verified: ", verified);

setTimeout(() => { console.log(jwt.verify(signedJWT, process.env.SECRET_KEY)) }, 3000); // this will throw an error because the token has expired