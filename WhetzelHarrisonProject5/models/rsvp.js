const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rsvpSchema = new Schema({
    //associated with a user and an event
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    event: {type: Schema.Types.ObjectId, ref: 'Event', required: true},
    status: {type: String, enum: ['YES', 'NO', 'MAYBE'], required: [true, 'status is required']},
    title: {type: String, required: true}
}
);



//collection name is rsvps in database
module.exports = mongoose.model('Rsvp', rsvpSchema);