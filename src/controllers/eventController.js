const eventModel = require("../models/eventModel")
const { isValid, isValidEmail, isValidObject, isValidPW, isValidObjectId, isValidTitle } = require("../validator/validator")

module.exports.createEvent = async function (req, res) {
    try {
        const { name, description } = req.body
        if (!isValid(name)) {
            return res.status(400).json({status: false, message: "Invalid name"});
        }
        if (!isValid(description)) {
            return res.status(400).json({status: false, message: "Invalid description"});
        }
        const creatorId = req.user.id
        const event = await eventModel.create({
            name,
            description,
            createdBy: creatorId,
            invitees: [
                {
                    invitee: creatorId
                }
            ]
        })
        return res.status(201).json({status: true, data: event})
    } catch (err) { 
        return res.status(500).json({status: false, message: err.message});
    }
}