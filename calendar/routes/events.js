// routes/items.js – CRUD routes for items

const router = require('express').Router();
const dao = require('../dao/itemsDao');
const { validateItem } = require('../validation/itemValidation');

// GET /items
router.get('/', (req, res) => {
  const events = dao.all();
  res.json(events);
});

// GET /items/:id
router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const event = dao.find(id);
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
    eventName: req.body.eventName,
    performers: req.body.performers ?? null,
    eventDate: req.body.eventDate,
    eventTime: req.body.eventTime
  });

  res
    .status(201)
    .location(`/events/${created.id}`)
    .json(created);
});

// PUT /items/:id
router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
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

  const updated = dao.update(id, {
    eventName: req.body.eventName,
    performers: req.body.performers ?? null,
    eventDate: req.body.eventDate,
    eventTime: req.body.eventTime
  });

  if (!updated) {
    return res.status(404).json({
      error: { code: 'NOT_FOUND', message: 'Movie not found' }
    });
  }

  res.json(updated);
});

// DELETE /items/:id
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const ok = dao.destroy(id);
  if (!ok) {
    return res.status(404).json({
      error: { code: 'NOT_FOUND', message: 'Movie not found' }
    });
  }
  res.status(204).end();
});

module.exports = router;
