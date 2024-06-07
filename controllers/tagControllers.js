const Tag = require("../db_schemas/tags");
const { getUserID } = require("./userControllers");

const getTagsAll = async (req, res) => {
  try {
    const action = req?.body?.action;
    const userName = action?.payload?.userName;
    const { type, payload } = action;

    let userID = await getUserID(userName);
    if (!userID) return res.sendStatus(401);

    const data = await Tag.find({ userID });
    if (!data) {
      return res.status(200).json([]);
    } else {
      return res.status(200).json(data);
    }
  } catch (err) {
    res.sendStatus(500);
  }
};

const getTagsTask = async (req, res) => {
  try {
    const action = req?.body?.action;
    const userName = action?.payload?.userName;
    const { type, payload } = action;

    const taskID = payload.taskID;

    let userID = await getUserID(userName);
    if (!userID) return res.sendStatus(401);

    console.log("Tag Request:", type);

    const data = await Tag.find({ taskID });
    if (!data) {
      return res.status(200).json([]);
    } else {
      return res.status(200).json(data);
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

const createTag = async (req, res) => {
  try {
    const action = req?.body?.action;
    const userName = action?.payload?.userName;
    const { type, payload } = action;

    let userID = await getUserID(userName);
    if (!userID) return res.sendStatus(401);

    console.log("Tag Request:", type);

    let { id, listID, taskID, name } = payload.tag;
    const newTag = new Tag({
      id,
      userID,
      taskID,
      listID,
      name,
      createDate: new Date(),
    });
    const data = await newTag.save();
    return res.status(200).json({ status: "success", message: "Tag created" });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

const updateTag = async (req, res) => {
  try {
    const action = req?.body?.action;
    const userName = action?.payload?.userName;
    const { type, payload } = action;

    let userID = await getUserID(userName);
    if (!userID) return res.sendStatus(401);

    console.log("Tag Request:", type);

    const data = await Tag.updateOne(
      { id: payload?.tag?.id },
      {
        $set: {
          name: payload?.tag?.name,
        },
      }
    );

    return res.status(204).json({ status: "success", message: "Tag updated" });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

const deleteTag = async (req, res) => {
  try {
    const action = req?.body?.action;
    const userName = action?.payload?.userName;
    const { type, payload } = action;

    let userID = await getUserID(userName);
    if (!userID) return res.sendStatus(401);

    console.log("Task Request:", type);

    const response = await Tag.deleteOne({
      id: payload?.tag?.id,
    }).exec();
    return res.status(204).json({ status: "success", message: "Tag removed" });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

module.exports = { getTagsAll, getTagsTask, createTag, updateTag, deleteTag };
