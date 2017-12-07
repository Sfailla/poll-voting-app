const mongoose = require('mongoose');

const PollSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user-id',
    },
    options: [{
        option: {
            type: String,
            required: true,
        },
        votes: {
            type: Number,
            default: 0,
        },
    }],
    create_date: {
        type: Date,
        default: Date.now,
    },
}, { collection: 'polls' });

Poll = module.exports = mongoose.model('polls', PollSchema);

module.exports.addPoll = (poll, callback) => {
    Poll.create(poll, callback);
};

module.exports.updatePoll = (id, poll, options, callback) => {
    const query = { _id: id };
    const update = {
        question: poll.question,
        options: poll.option.map(option => ({
            option,
        })),
    };

    Poll.findByIdAndUpdate(query, update, options, callback);
};

module.exports.getPollById = (id, callback) => {
    Poll.findById(id, callback);
};

module.exports.getOptionById = (id, callback) => {
    Poll.findById(id, callback);
};

