const express = require('express');
const Note = require('../models/Note');
const router = express.Router();

// POST /notes - Create note
router.post('/', async (req, res) => {
  const { title } = req.body;
  const note = new Note({ title, content: '' });
  await note.save();
  res.json(note);
});

// GET /notes/:id - Get note
router.get('/:id', async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) return res.status(404).json({ error: 'Note not found' });
  res.json(note);
});

// PUT /notes/:id - Update note

router.put('/:id', async (req, res) => {
  const { content } = req.body;
  const note = await Note.findById(req.params.id);
  if (!note) return res.status(404).json({ error: 'Note not found' });
  // Push current content to history before updating
  note.history.push({ content: note.content, updatedAt: note.updatedAt });
  note.content = content;
  note.updatedAt = new Date();
  await note.save();
  res.json(note);
});

// GET /notes/:id/history - Get note history
router.get('/:id/history', async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) return res.status(404).json({ error: 'Note not found' });
  res.json(note.history);
});

module.exports = router;