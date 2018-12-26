const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
let Schema = mongoose.Schema;



var userSchema = new Schema({
    "user": {
        "type": String,
        "unique": true
    },
    "password": String
});


let User;


function initialize() {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection('mongodb://MusaddiqurRahman:asdasd123@ds263989.mlab.com:63989/web322')
        db.on('error', function (err) {
            reject(err);
        })
        db.once('open', function () {
            User = db.model('users', userSchema);
            resolve();
        })
    })
}


function registerUser(data) {
    return new Promise(function (resolve, reject) {
        if (data.password != data.password2) {
            reject("Passwords do not match");
        } else {
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(data.password, salt, function (err, hash) {
                    if (err) {
                        reject("error hashing password!");
                    } else {
                        data.password = hash;
                        let newUser = new User({user: data.userName, password: data.password});
                        newUser.save(function (err) {
                            if (err) {
                                if (err.code == 11000) {
                                    reject("Username already taken");
                                } else {
                                    console.log(err);
                                    reject(`There was an error creating the user: ${err}`);
                                }
                            } else {
                                resolve();
                            }
                        })
                    }
                })
            })
        }
    })
}


function checkUser(data) {
    return new Promise(function (resolve, reject) {
        console.log(User);
        User.find({
                "user": data.userName
            })
            .then(function (users) {
                if (users.length == 0) {
                    reject("Unable to find user: ", data.userName);
                } else {
                    bcrypt.compare(data.password, users[0].password)
                        .then(function (res) {
                            if (res) {
                                resolve(users[0]);
                            } else{
                                reject(`Incorrect Password for user: ${data.userName}`);
                            }
                        })
                }
            })
            .catch(function (err) {
                reject(`Unable to find user: ${data.userName}`);
            })
    })
}



module.exports = {
    initialize: initialize,
    registerUser: registerUser,
    checkUser: checkUser
}