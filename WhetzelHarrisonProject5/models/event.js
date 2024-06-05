const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    category: {type: String, 
        enum: ['Tournament', 'Meetups', 'Game Creation', 'Costume Contest', 'Other'], 
        required: [true, 'category is required']},
    title: {type: String, required: [true, 'title is required']},
    hostName: {type: Schema.Types.ObjectId, ref: 'User'},
    location: {type: String, required: [true, 'location is required']},
    start: {type: Date, required: [true, 'start date and time is required']},
    end: {type: Date, required: [true, 'end date and time is required']},
    details: {type: String, required: [true, 'details are required'], 
        minLength: [15, 'the details should have at least 15 characters']},
    image: {type: String, required: [true, 'image is required']}
}
);

//collection name is events in database
module.exports = mongoose.model('Event', eventSchema);
    

