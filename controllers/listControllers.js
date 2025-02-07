const TaskList = require("../db_schemas/lists");
const Task = require("../db_schemas/tasks");
const { getUserID } = require("./userControllers");

const getLists = async (req, res) => {
  try {
    const userName = req?.user?.username;

    let userID = await getUserID(userName);
    if (!userID) return res.sendStatus(401);

    const data = await TaskList.find({ userID: userID }).sort({
      updatedAt: -1,
    });

    if (!data) {
      return res.status(200).json([]);
    } else {
      return res.status(200).json(data);
    }
  } catch (error) {
    return res.sendStatus(500);
  }
};

const createList = async (req, res) => {
  try {
    const userName = req?.user?.username;
    const list = req?.body?.payload;

    let userID = await getUserID(userName);
    if (!userID) return res.sendStatus(401);

    let { id, title, subTitle, detail, icon, sortIndex } = list;
    const newTaskList = new TaskList({
      id,
      userID,
      title,
      subTitle,
      detail,
      icon,
      trash: false,
      sortIndex,
    });

    const data = await newTaskList.save();

    return res.status(200).json(data);
  } catch (error) {
    return res.sendStatus(500);
  }
};

const updateList = async (req, res) => {
  try {
    const taskList = req?.body?.taskList;

    let { id, title, subTitle, detail, icon, pinned, sortIndex, trash } =
      taskList;

    const data = await TaskList.updateOne(
      { id },
      { $set: { title, subTitle, detail, icon, pinned, sortIndex, trash } }
    );

    return res.sendStatus(204);
  } catch (error) {
    return res.sendStatus(500);
  }
};

const deleteList = async (req, res) => {
  try {
    const userName = req?.user?.username;
    let userID = await getUserID(userName);
    if (!userID) return res.sendStatus(401);

    const id = req?.body?.id;
    if (!id) {
      return res.sendStatus(400);
    }

    const data = await TaskList.deleteOne({ id, userID });

    return res.status(204);
  } catch (error) {
    return res.sendStatus(500);
  }
};

const sortLists = async (req, res) => {
  try {
    let lists = req?.user?.lists;

    const bulkOperations = lists.map(({ id, sortIndex }) => {
      return {
        updateOne: {
          filter: { id },
          update: { sortIndex },
        },
      };
    });

    const data = await TaskList.bulkWrite(bulkOperations);

    return res.sendStatus(204);
  } catch (err) {
    return res.sendStatus(500);
  }
};

module.exports = { getLists, createList, updateList, deleteList, sortLists };
