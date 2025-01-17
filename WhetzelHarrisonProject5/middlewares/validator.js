const {body} = require('express-validator');
const {validationResult} = require('express-validator');

//checks whether the id is valid
exports.validateId = (req, res, next)=>{
    let id = req.params.id;
        //an objectId is a 24-bit Hex string
        if(!id.match(/^[0-9a-fA-F]{24}$/)) {
            let err = new Error('Invalid story id');
            err.status = 400;
            return next(err);
        }else{
            return next();
        }
};

exports.validateSignUp = [body('firstName', 'First name cannot be empty').notEmpty().trim().escape(),
body('lastName', 'Last name cannot be empty').notEmpty().trim().escape(),
body('email', 'Email must be a valid email address').notEmpty().isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be at least 8 characters and at most 64 characters').notEmpty().isLength({min: 8, max: 64}).trim()];

exports.validateLogIn = [body('email', 'Email must be a valid email address').notEmpty().isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be at least 8 characters and at most 64 characters').notEmpty().isLength({min: 8, max: 64}).trim()];

exports.validateResult = (req, res, next)=>{
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        errors.array().forEach(error=>{
            req.flash('error', error.msg);
        });
        return res.redirect('back');
    }else{
        return next();
    }
}

exports.validateEvent = [body('category', 'Category cannot be empty and must be one of the predetermined categories').notEmpty().isIn(['Tournament', 'Meetups', 'Game Creation', 'Costume Contest', 'Other']).trim().escape(),
body('title', 'Title cannot be empty').notEmpty().trim().escape(),
body('hostName', 'Host Name cannot be empty').trim().escape(),
body('location', 'Location cannot be empty').notEmpty().trim().escape(),
body('start', 'Start must be an ISO8601, has to be after today, and/or cannot be empty').notEmpty().isISO8601().isAfter().trim().escape(),
body('end', 'End must be an ISO8601, has to be after start, and/or cannot be empty').notEmpty().isISO8601().trim().escape(),
body('details', 'Details cannot be empty').notEmpty().trim().escape(),
body('image', 'Image cannot be empty').trim().escape()];

exports.validateRsvp = [body('status', 'Status cannot be empty and must be one of the predetermined statuses').notEmpty().isIn(['YES', 'NO', 'MAYBE']).trim().escape()];
