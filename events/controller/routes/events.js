// routes/items.js – CRUD routes for items

const express = require('express');
const router = express.Router();
const dao = require('../dao/itemsDao');

// GET all events
router.get('/', async (req, res) => {
  try {
    const events = await dao.all();
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// POST new event
router.post('/', async (req, res) => {
  console.log('POST /events hit', req.body); // check if data is coming in
  try {
    const { title, description, eventdate, eventtime, venueid } = req.body;

    if (!title || !eventdate || !eventtime || isNaN(venueid)) {
      return res.status(422).json({ error: 'Missing required fields' });
    }

    const event = await dao.create({ title, description, eventdate, eventtime, venueid });
    console.log('Inserted event:', event);

   res.status(201).json({ success: true, event });

  } catch (err) {
    console.error('Insert error:', err);
    res.status(500).json({ error: 'Database insert failed' });
  }
});

router.put('/:id', async (req, res) => {
  const id = req.params.id;

  console.log("Updating event:", id);

try {
    const { title, description, eventdate, eventtime, venueid } = req.body;

    if (!title || !eventdate || !eventtime || isNaN(venueid)) {
      return res.status(422).json({ error: 'Missing required fields' });
    }

    const event = await dao.update(id, { title, description, eventdate, eventtime, venueid });
    console.log('Updated event:', event);

    res.status(200).json({ success: true, event });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Database update failed' });
  }

});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  console.log("Deleting event:", id);

  try {
    const event = await dao.deleteEvent(id);
    console.log('Deleted event:', event);

    res.status(200).json({ success: true, event });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Database delete failed' });
  }
});

module.exports = router;