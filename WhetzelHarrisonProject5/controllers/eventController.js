const model = require('../models/event');
const userModel = require('../models/user');
const rsvpModel = require('../models/rsvp');
const {DateTime} = require("luxon");


//renders the events.ejs file 
exports.index = (req, res, next)=>{
    let userId = req.session.user;
    userModel.findById(userId)
    .then(user=>{
        model.find()
        .then(events=>{
            model.distinct("category")
            .then(categories=>res.render('./event/events', {events, categories, user}))
            .catch(err=>next(err));
        })
        .catch(err=>next(err));
    })
    .catch(err=>next(err));

};

//renders the newEvent.ejs file
exports.new = (req, res)=>{
    let userId = req.session.user;
    userModel.findById(userId)
    .then(user=>{
        res.render('./event/newEvent', {user});
    })
    
};


exports.create = (req, res, next)=>{
    let event = new model(req.body); //create a new story document
    event.hostName = req.session.user;
    event.image = "/images/" + req.file.filename;
    event.save() //insert the document to the database
    .then(event=> {
        req.flash('success', 'You have successfully created an Event');
        res.redirect('/events')
    })
    .catch(err=>{
        if(err.name === 'ValidationError'){
            err.status = 400;
        }
        next(err);
    });
};


exports.show = (req, res, next)=>{
    let id = req.params.id;
    let userId = req.session.user;
    userModel.findById(userId)
    .then(user=>{
        model.findById(id).populate('hostName', 'firstName lastName')
        .then(event=>{
            if(event) {
                rsvpModel.find({event: event, status: 'YES'})
                .then(rsvp=>{
                        //console.log(rsvp);
                        //console.log(event);
                        res.render('./event/event', {event, user, rsvp});
                })
                .catch(err=>next(err));

            } else {
                let err = new Error('Cannot find a event with id ' + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err=>next(err));
    })
    .catch(err=>next(err));


};


exports.edit = (req, res, next)=>{
    let id = req.params.id;
    let userId = req.session.user;
    userModel.findById(userId)
    .then(user=>{
        model.findById(id).lean()
        .then(event=>{
            event.start = DateTime.fromJSDate(event.start).toISO({suppressSeconds: true , includeOffset: false});
            event.end = DateTime.fromJSDate(event.end).toISO({suppressSeconds: true , includeOffset: false});
            res.render('./event/edit', {event, user});
        })
        .catch(err=>next(err));
    })
    .catch(err=>next(err));

};


exports.update = (req, res, next)=>{
    let event = req.body;
    let id = req.params.id;
    if(req.file){
        event.image = "/images/" + req.file.filename;
      }

    model.findByIdAndUpdate(id, event, {useFindAndModify: false, runValidators: true})
    .then(event=>{
        req.flash('success', 'The Event has been updated');
        res.redirect('/events/'+id);
    })
    .catch(err=>{
        if(err.name === 'ValidationError'){
            err.status = 400;
            next(err)
        }
        
    });
};


exports.delete = (req, res, next)=>{
    let id = req.params.id;
    Promise.all([rsvpModel.deleteMany({event: id}), model.findByIdAndDelete(id, {useFindAndModify: false})])
    .then(event=>{
        req.flash('success', 'The Event has been deleted');
        res.redirect('/events');
    })
    .catch(err=>next(err));
};

//rsvpModel
exports.response = (req, res, next)=>{
    let id = req.params.id;
    let userId = req.session.user;
    model.findById(id)
    .then(event=>{
        rsvpModel.findOneAndUpdate({user: userId, event: id}, {status: req.body.status, title: event.title}, {new: true, upsert: true, useFindAndModify: false})
        .then(rsvp=>{
            //console.log(rsvp);
            req.flash('success', 'Successfully created an RSVP for this event');
            res.redirect('/users/profile');
        })
        .catch(err=>next(err));
    })
    .catch(err=>next(err));
};