const express = require("express");
const router = express.Router();

// Refer as DB state ( right now it is global state )
const notes = [];

/*
Sample Note Body: 
    {
        id: unique identifier,
        message: long string,
        author: user id,
        createdAt: timestamp,
        updatedAt: timestamp,
        deletedAt: timestamp
    }
*/

// route to get all notes
router.get("/", (req, res) => {
  res.json({ notes });
});

// route to get a single note
router.get("/:id", (req, res) => {
  const noteId = req.params.id;

  const [filteredNote] = notes.filter((note) => note.id === noteId);

  if (!filteredNote) {
    res.statusCode = 404;
    return res.json({ message: `No note found for id : ${noteId}` });
  }

  return res.json({ note: filteredNote });
});

// route to add a note
router.post("/", (req, res) => {
  const { message, author } = req.body;

  if (!message || !author) {
    res.statusCode = 400;
    return res.json({
      message: "Incorrect / missing data",
      payload: {
        message,
        author,
      },
    });
  }

  const timestamp = Date.now();

  const note = {
    author,
    message,
    id: parseInt(Math.random() * 10000000, 10).toString(),
    createdAt: timestamp,
    updatedAt: timestamp,
    deletedAt: undefined,
  };

  notes.push(note);
  return res.sendStatus(201);
});

// route to edit a note
router.put("/:id", (req, res) => {
  const noteId = req.params.id;

  const [filteredNote] = notes.filter((note) => note.id === noteId);

  if (!filteredNote) {
    res.statusCode = 404;
    return res.json({ message: `No note found for id : ${noteId}` });
  }

  const { message } = req.body;

  if (!message) {
    res.statusCode = 400;
    return res.json({
      message: "Incorrect / missing data",
      payload: {
        message,
      },
    });
  }

  const timestamp = Date.now();

  const updatedNote = {
    message,
    updatedAt: timestamp,
    deletedAt: undefined,
    author: filteredNote.author,
    id: filteredNote.id,
    createdAt: filteredNote.createdAt,
  };

  const noteIdx = notes.findIndex((note) => note.id === noteId);

  notes.splice(noteIdx, 1, updatedNote);

  return res.sendStatus(204);
});

// route to soft delete ( marks this entity as deleted )
router.delete("/soft-delete/:id", (req, res) => {
  const noteId = req.params.id;

  const [filteredNote] = notes.filter((note) => note.id === noteId);

  if (!filteredNote) {
    res.statusCode = 404;
    return res.json({ message: `No note found for id : ${noteId}` });
  }

  const timestamp = Date.now();

  const updatedNote = {
    deletedAt: timestamp,
    message: filteredNote.message,
    author: filteredNote.author,
    id: filteredNote.id,
    createdAt: filteredNote.createdAt,
    updatedAt: filteredNote.updatedAt,
  };

  const noteIdx = notes.findIndex((note) => note.id === noteId);

  console.log(updatedNote);

  const deletedNote = notes.splice(noteIdx, 1, updatedNote);

  return res.json({ deleteCount: 1, body: deletedNote });
});

// route to delete a note ( hard delete => actually deletes )
router.delete("/:id", (req, res) => {
  const noteId = req.params.id;

  const [filteredNote] = notes.filter((note) => note.id === noteId);

  if (!filteredNote) {
    res.statusCode = 404;
    return res.json({ message: `No note found for id : ${noteId}` });
  }

  const noteIdx = notes.findIndex((note) => note.id === noteId);

  const deletedNote = notes.splice(noteIdx, 1);

  return res.json({ deleteCount: 1, body: deletedNote });
});

module.exports = router;
