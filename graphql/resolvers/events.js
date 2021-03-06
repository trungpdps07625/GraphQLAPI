const Event = require('../../models/events');
const User = require('../../models/user');
const { transformEvent } = require('./merge')

module.exports = {

    events: async () => {
        try {
            const _events = await Event.find()
            return _events
                .map(event => {
                    return transformEvent(event);
                })
        } catch (err) {
            throw err;
        }
    },
    createEvent: async (args , req) => {
        console.log(req.isAuth);
        if (!req.isAuth){
            throw new Error('Unauthenticated')
        }
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: req.userId
        });
        let createdEvent;
        try {
            const result = await event.save();
            createdEvent = transformEvent(result);
            const creator = await User.findById(req.userId);

            if (!creator) {
                throw new Error('User exists already')
            }
            creator.createEvents.push(event);
            await creator.save();

            return createdEvent;
        } catch (err) {
            throw err;
        }
    },
}
