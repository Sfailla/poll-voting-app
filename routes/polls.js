const express = require('express');

const Polls = express.Router();
// Bring in the Poll Schema
const Poll = require('../models/poll');

// Route for Polls Page
Polls.get('/', (req, res) => {   
    Poll.find()
        .exec((err, poll) => {
            if (err) return console.error(err);
        res.render('pollsPage', { title: 'Poll Page', hasSession: req.isAuthenticated(), poll } );
    });
}); 
// Route for Getting Single Poll to vote on
Polls.get('/:id', (req, res) => {
    const id = req.params.id;
    
    Poll.findById(id, (err, poll) => {
        let options = poll.options.map(function(item) {
            return `'${item.option}'`;
        });
        let data = poll.options.map(function(item) {
        return item.votes;
        });
        Poll.getPollById(id, (err, poll) => {
            if (err) console.error(err);
            
            res.render('singleView', {
                title: 'Please Vote Below!',
                hasSession: req.isAuthenticated(),
                route: id,
                poll,
                options,
                data
            });
        });
    });
});
// Put Route to increment votes in the database
Polls.put('/:id/votes/:option_id', (req, res) => {       
    Poll.findOneAndUpdate(
        { _id: req.params.id, 'options._id': req.params.option_id },
        { $inc: { 'options.$.votes': 1} },
        { new: true }, (err) => {
            if (err) console.error(err);
            res.redirect(`/polls/${req.params.id}`);
        },
    );
});


module.exports = Polls;