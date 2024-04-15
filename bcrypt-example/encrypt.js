const bcrypt = require('bcrypt');
const saltRounds = 10;
const plainTextPassword = 'mymomluvsme';

bcrypt.hash(plainTextPassword, saltRounds, (err, hash) => {
    if (err) {
        console.log(err);
    } else {
        console.log("plain text: ", plainTextPassword);
        console.log("hashed password: ", hash);
    }

    // compare the plain text password with the hashed password
    bcrypt.compare(plainTextPassword, hash, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log("unhashed password matches: ", result);
        }
    });
});

