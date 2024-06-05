const express = require('express');
const controller = require('../controllers/eventController');
const {fileUpload} = require('../middlewares/fileUpload.js');
const {isLoggedIn} = require('../middlewares/auth.js');
const {isHost, isNotHost} = require('../middlewares/auth.js');
const {validateId, validateEvent, validateRsvp, validateResult} = require('../middlewares/validator.js');

const router = express.Router();

//GET /events - send all events to the user
router.get('/', controller.index);

//GET /events/newEvent - send html form for creating a new event
router.get('/newEvent', isLoggedIn, controller.new);

//POST /events: create a new event
router.post('/', fileUpload, isLoggedIn, validateEvent, validateResult, controller.create);

//GET /events/:id - send details of event identified by id
router.get('/:id', validateId, controller.show);

//GET /events/:id/edit - send html form for editing an existing event
router.get('/:id/edit', isLoggedIn, isHost, validateId, controller.edit);

//PUT /events/:id - will update the event identified by id
router.put('/:id', fileUpload, isLoggedIn, isHost, validateId, validateEvent, validateResult, controller.update);

//DELETE /events/:id - delete the event identified by id
router.delete('/:id', isLoggedIn, isHost, validateId, controller.delete);

//route to the event route module to route the rsvp request 
//(when any of the RSVPs are clicked)
router.post('/:id/rsvp', isLoggedIn, isNotHost, validateId, validateRsvp, controller.response);

module.exports = router;