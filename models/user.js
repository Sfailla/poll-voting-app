const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    create_date: {
        type: Date,
        default: Date.now,
    },
});

// bcrypt function to hash and salt password
UserSchema.pre('save', function(next) {
    const user = this;
    console.log('this user', user);
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
    
});

module.exports = mongoose.model('user', UserSchema);
