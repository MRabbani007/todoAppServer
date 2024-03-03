const ACTIONS = require("../data/actions");
const Note = require("../db_schemas/notes");
const { getUserID } = require("./userControllers");

const handleNotes = async (req, res) => {
  try {
    const action = req?.body?.action;
    const userName = action?.payload?.userName;
    const { type, payload } = action;

    let userID = await getUserID(userName);
    if (!userID) return res.sendStatus(401);

    console.log("Request Notes:", type);
    switch (type) {
      case ACTIONS.NOTES_GET_USER: {
        const data = await Note.find({ userID: userID });
        if (!data) {
          return res.status(200).json([]);
        } else {
          return res.status(200).json(data);
        }
      }
      case ACTIONS.NOTES_CREATE: {
        let { id, title, details } = payload.newNote;
        const newNote = new Note({
          id,
          userID,
          title,
          details,
          tags: [],
          createDate: new Date(),
          trash: false,
        });
        const data = await newNote.save();
        return res
          .status(200)
          .json({ status: "success", message: "Note created" });
      }
      case ACTIONS.NOTES_UPDATE: {
        let { id, title, details, priority, tags, trash } = payload.newNote;
        let data = await Note.updateOne(
          { id: id },
          {
            $set: {
              title: title,
              details: details,
              priority: priority,
              tags: tags,
              trash: trash,
            },
          }
        );
        return res
          .status(204)
          .json({ status: "success", message: "Note updated" });
      }
      case ACTIONS.NOTES_REMOVE: {
        const data = await Note.deleteOne({
          userID: userID,
          id: payload.noteID,
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
    console.log(error);
    return res.status(500).json({ status: "error", message: "Server Error" });
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

    console.log("Request Notes:", type);
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
    console.log(error);
    return res.status(500).json({ status: "error", message: "Server Error" });
  }
};

module.exports = { handleNotes };
