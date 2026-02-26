// routes/items.js – CRUD routes for items

const router = require('express').Router();
const dao = require('../dao/itemsDao');
const { validateItem } = require('../validation/itemValidation');

// GET /items
router.get('/', (req, res) => {
  const events = dao.all();
  res.json(events);
});

// GET /items/:eventID
router.get('/:eventID', (req, res) => {
  const eventID = Number(req.params.eventID);
  const event = dao.find(eventID);
  if (!event) {
    return res.status(404).json({
      error: { code: 'NOT_FOUND', message: 'Event not found' }
    });
  }
  res.json(event);
});

// POST /items
router.post('/', (req, res) => {
  const { valid, errors } = validateItem(req.body, { partial: false });
  if (!valid) {
    return res.status(422).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input',
        details: errors
      }
    });
  }

  const created = dao.create({
    title: req.body.title,
    description: req.body.description,
    eventDate: req.body.eventDate,
    eventTime: req.body.eventTime,
    venueID: req.body.venueID
  });

  res
    .status(201)
    .location(`/events/${created.eventID}`)
    .json(created);
});

// PUT /items/:eventID
router.put('/:eventID', (req, res) => {
  const eventID = Number(req.params.eventID);
  const { valid, errors } = validateItem(req.body, { partial: false });
  if (!valid) {
    return res.status(422).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input',
        details: errors
      }
    });
  }

  const updated = dao.update(eventID, {
    title: req.body.title,
    description: req.body.description,
    eventDate: req.body.eventDate,
    eventTime: req.body.eventTime,
    venueID: req.body.venueID
  });

  if (!updated) {
    return res.status(404).json({
      error: { code: 'NOT_FOUND', message: 'Event not found' }
    });
  }

  res.json(updated);
});

// DELETE /items/:eventID
router.delete('/:eventID', (req, res) => {
  const eventID = Number(req.params.eventID);
  const ok = dao.destroy(eventID);
  if (!ok) {
    return res.status(404).json({
      error: { code: 'NOT_FOUND', message: 'Event not found' }
    });
  }
  res.status(204).end();
});

module.exports = router;