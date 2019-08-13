const Event = require('../../models/events')
const User = require('../../models/user')
const { dateToString } = require('../../helper/date');

const transformEvent = event => {
    return {
        ...event._doc,
        _id: event.id,
        date: dateToString(event._doc.date),
        creator: user.bind(this, event._doc.creator)
    }
}

const events = async eventIds => {
    try {
        const events = await Event.find({
            _id: {
                $in: eventIds
            }
        });
        events.map(event => {
            return {
                ...event._doc,
                _id: event.id,
                date: dateToString(event._doc.date),
                creator: user.bind(this, event.creator)
            };
        });
        return events;
    } catch (err) {
        throw err;
    }
};


const user = async userId => {
    try {
        const user = await User.findById(userId)
        return {
            ...user._doc,
            _id: user.id,
            createEvents: events.bind(this, user._doc.createEvents)
        };
    } catch (err) {
        throw err;
    }

}



exports.transformEvent = transformEvent;
