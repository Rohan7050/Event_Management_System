const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "please Enter Title"],
        enum: ["Mr", "Miss", "Mrs"]
    },
    name: {
        type: String,
        required: [true, "please Enter Your Name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [4, "Name should have more than 4 characters"],
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please Enter a valid Email"],
      },
    password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        minLength: [8, "Password should be greater than 8 characters"],
        select: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
      },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
})

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.getJWTtoken = function () {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXP})
}

userSchema.methods.comparePassword = async function (password) { 
    const isMatched = await bcrypt.compare(password, this.password)
    return isMatched
}

function makeRandomStr() {
    const words = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','-','_']
    let id = ""
    let length = Math.floor((Math.random() * 3) + 20)
    for (let i = 0; i < length; i++){
        let idx = Math.floor(Math.random() * words.length)
        let letter = words[idx]
        id = id + letter
    }
    return id
}

userSchema.methods.getResetPasswordToken = async function () {
    const resetToken = makeRandomStr()
    // Hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = resetToken
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;
};

module.exports = mongoose.model("User", userSchema);