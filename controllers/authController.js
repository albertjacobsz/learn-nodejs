const jwt = require('jsonwebtoken');
const User = require('../models/userModels');
const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/appError");
const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES
    });
}
exports.signup = catchAsync(async (req, res, next) => {
    
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });
    const token = signToken(newUser._id);
    res.status(201).json({
        status: 'succes',
        token,
        data: {
            user: newUser
        },
        message: "Great Success"
    });
});
exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new AppError("Please provide email or password", 400));
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user || !await user.correctPassword(password, user.password)) {
        return next(new AppError('Incorrect email or password', 401));
    }
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token
    }); 
});
exports.protect = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]; 
    }
    if (!token) {
        return next(new AppError("Youre not logged", 401))
    }
    next();
});