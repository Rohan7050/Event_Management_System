module.exports.isValidObject = (data) => {
    if (Object.keys(data).length === 0){
        return false
    }
    return true
}

module.exports.isValid = (value) => {
    if (typeof (value) == "undefined" || value == null) {
        return false
    }
    if (typeof (value) == "string" && value.trim().length === 0) {
        return false
    }
    return true
}

module.exports.isValidEmail = (value) => {
    return /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(value.trim())
}

module.exports.isValidPW = (value) => {
    return value.trim().length >= 8
}


module.exports.isValidObjectId = (value) => {
    return mongoose.Types.ObjectId.isValid(value)

}

module.exports.isValidTitle = function (title) {
    return ["Mr", "Miss", "Mrs"].indexOf(title) !== -1
}