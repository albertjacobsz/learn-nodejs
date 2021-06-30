const User = require('../models/userModels');
const catchAsync = require("../utils/catchAsync");
exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create(req.body);
    res.status(201).json({
        status: 'succes',
        data: {
            user: newUser
        },
        message: "Passwords are not the same"
    });
});