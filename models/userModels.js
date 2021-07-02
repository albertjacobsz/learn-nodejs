const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User needs a name'],
    },
    password: {
        type: String,
        required: [true, 'User needs a password'],
        minlength: 8,
        trim: true,
        select: false
    },
    email: {
        type: String,
        required: [true, 'User needs an email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    passwordConfirm: {
        type: String,
        required: [true, 'User needs to verify password'],
        validate: {
            validator: function (el) {
                return el === this.password
            }
        }
    },
    photo: {
        type: String
    }
});
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}
const User = mongoose.model('User', userSchema);
module.exports = User;