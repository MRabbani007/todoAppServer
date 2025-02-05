const ACTIONS = require("../data/actions");
const Note = require("../db_schemas/notes");
const { getUserID } = require("./userControllers");

const getNotes = async (req, res) => {
  try {
    const userName = req?.user?.username;

    const userID = await getUserID(userName);
    if (!userID) return res.sendStatus(401);

    const data = await Note.find({ userID: userID });
    if (!data) {
      return res.status(200).json([]);
    } else {
      return res.status(200).json(data);
    }
  } catch (err) {
    return res.sendStatus(500);
  }
};

const createNote = async (req, res) => {
  try {
    const userName = req?.user?.username;
    const note = req?.body?.newNote;

    let userID = await getUserID(userName);
    if (!userID) return res.sendStatus(401);

    let { title, details, sortIndex } = note;

    const newNote = new Note({
      id: crypto.randomUUID(),
      userID,
      title,
      details,
      sortIndex,
      tags: [],
      pinned: false,
      trash: false,
    });

    const data = await newNote.save();
    return res.sendStatus(204);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};

const editNote = async (req, res) => {
  try {
    const newNote = req?.body?.newNote;

    let { id, title, details, priority, tags, trash, sortIndex, pinned } =
      newNote;

    let data = await Note.updateOne(
      { id },
      {
        $set: {
          title,
          details,
          priority,
          tags,
          trash,
          sortIndex,
          pinned,
          updateDate: new Date(),
        },
      }
    );
    return res.sendStatus(204);
  } catch (err) {
    return res.sendStatus(500);
  }
};

const deleteNote = async (req, res) => {
  try {
    const id = req?.body?.id;

    const data = await Note.deleteOne({
      id: payload.noteID,
    }).exec();
    return res.sendStatus(204);
  } catch (err) {
    return res.sendStatus(500);
  }
};

const sortNotes = async (req, res) => {
  try {
    const action = req?.body?.action;
    const { type, payload } = action;

    let notes = payload?.notes;
    if (!notes || !notes?.length || notes?.length === 0)
      return res.sendStatus(400);

    const bulkOperations = notes.map(({ id, sortIndex }) => {
      return {
        updateOne: {
          filter: { id },
          update: { sortIndex },
        },
      };
    });

    const data = await Note.bulkWrite(bulkOperations);

    return res.sendStatus(204);
  } catch (err) {
    return res.sendStatus(500);
  }
};

const handleNotesAdmin = async (req, res) => {
  try {
    const action = req?.body?.action;
    const userName = action?.payload?.userName;
    const user = action?.payload?.user;
    const { type, payload } = action;

    let userID = await getUserID(user);
    if (!userID) return res.sendStatus(401);

    switch (type) {
      case ACTIONS.NOTES_GET_ALL: {
        const data = await Note.find({});
        if (!data) {
          return res.status(200).json([]);
        } else {
          return res.status(200).json(data);
        }
      }
      case ACTIONS.NOTES_GET_USER: {
        const data = await Note.find({ userID: userID });
        if (!data) {
          return res.status(200).json([]);
        } else {
          return res.status(200).json(data);
        }
      }
      case ACTIONS.NOTES_CREATE: {
        let { id, title } = payload.newNote;
        const newNote = new Note({
          id,
          userID,
          title,
          createDate: new Date(),
          trash: false,
        });
        const data = await newTaskList.save();
        return res
          .status(200)
          .json({ status: "success", message: "Note created" });
      }
      case ACTIONS.NOTES_UPDATE: {
        let { id, title, detail } = payload.newNote;
        let data = await Note.updateOne(
          { id: id },
          { $set: { title: title, detail: detail } }
        );
        return res
          .status(204)
          .json({ status: "success", message: "Note updated" });
      }
      case ACTIONS.NOTES_REMOVE: {
        const data = await Note.deleteOne({
          userID: userID,
          id: payload.id,
        }).exec();
        return res
          .status(204)
          .json({ status: "success", message: "Note removed" });
      }
      default: {
        return res
          .status(204)
          .json({ status: "failed", message: "action not found" });
      }
    }
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Server Error" });
  }
};

module.exports = { getNotes, createNote, editNote, deleteNote, sortNotes };
