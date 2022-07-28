const eventModel = require("../models/eventModel")
const userModel = require("../models/userModel")
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

module.exports.invite = async function (req, res) {
    try {
        const { evevntId } = req.params
        const { inviteeId } = req.body
        if (!isValidObjectId(evevntId)) {
            return res.status(400).json({status: false, message: "Invalid evevntId"});
        }
        if (!isValidObjectId(inviteeId)) {
            return res.status(400).json({ status: false, message: "Invalid inviteeId" });
        }
        const event = await eventModel.findById(evevntId);
        if (!event) {
            return res.status(404).json({ status: false, message: "event no longer exists" });
        }
        if (event.createdBy.toString() !== req.user.id.toString()) {
            return res.status(403).json({ status: false, message: "you are not allowed to invite others to this event" });
        }
        const user = await userModel.findById(inviteeId)
        if (!user) {
            return res.status(404).json({ status: false, message: "user no longer exists" });
        }
        event.invitees.push({ invitee: user._id })
        event.save()
        return res.status(200).json({ status: true, message: "invite successfully" });
    } catch (err) { 
        return res.status(500).json({status: false, message: err.message});
    }
} 
//new ObjectId('62e003f4a0eaad58b905e7d5')
module.exports.list = async function (req, res) { 
    try {
        const sort = req.query.sort || 1
        const resultPerPage = 5
        const currentPage = Number(req.query.page) || 1
        const skip = resultPerPage * (currentPage - 1)
        // this.query = this.query.limit(resultPerPage).skip(skip)
        const userId = req.user._id
        const events = await eventModel.aggregate([{
            '$unwind': {
                'path': '$invitees'
            }
        }, {
            '$match': {
                'invitees.invitee': userId
            }
        }, {
            '$project': {
                'invitees': 0,
                '__v': 0,
                '_id': 0
            }
        }, {
            '$limit': resultPerPage
        }, {
            '$skip': skip
        }, {
            '$sort': {
                'createdAt': Number(sort)
            }
        }])
        const createdEvent = await eventModel.find({ createdBy: userId }).limit(resultPerPage).skip(skip).sort({createdAt: Number(sort)}).select({ 'invitees': 0, '__v': 0, '_id': 0 })
        return res.status(200).json({ status: true, invitations: events, createdEvent: createdEvent });
    } catch (err) { 
        return res.status(500).json({status: false, message: err.message});
    }
}



