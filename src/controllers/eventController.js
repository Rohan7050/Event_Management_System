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
        const { eventId } = req.params
        const { inviteeId } = req.body
        if (!isValidObjectId(eventId)) {
            return res.status(400).json({status: false, message: "Invalid eventId"});
        }
        if (!isValidObjectId(inviteeId)) {
            return res.status(400).json({ status: false, message: "Invalid inviteeId" });
        }
        const event = await eventModel.findById(eventId);
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

module.exports.updateEvent = async function (req, res) {
    try {
        let { name, description, createdAt } = req.query;
        const { eventId } = req.params;
        const event = await eventModel.findById(eventId)
        if (!event) {
            return res.status(404).json({ status: false, message: "event no longer exists" });
        }
        if (event.createdBy.toString() !== req.user.id.toString()) {
            return res.status(403).json({ status: false, message: "you are not allowed to invite others to this event" });
        }
        const update = {}
        if (name) {
            name = name.trim()
            if (name) {
                update.name = name.trim()
            } 
        }
        if (description) {
            description = description.trim()
            if (description) {
                update.description = description.trim()
            }
        }
        if (createdAt) {
            createdAt = createdAt.trim()
            if (createdAt.match(/^\d{2}-\d{2}-\d{4}$/) === null) {
                return res.status(400).json({ status: false, message: "please enter date in DD-MM-YYYY format" });
            }
            const b = createdAt.split("-").map(Number)
            const date = new Date(b[2], b[1] - 1, b[0] + 1);
            update.createdAt = date
        }
        // event.save()
        const updatedevent = await eventModel.findByIdAndUpdate(eventId, update, { new: true })
        return res.status(200).json({status: true, event: updatedevent});
    } catch (err) { 
        return res.status(500).json({status: false, message: err.message});
    }
}


