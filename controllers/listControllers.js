const TaskList = require("../db_schemas/lists");
const { getUserID } = require("./userControllers");

const getLists = async (req, res) => {
  try {
    const action = req?.body?.action;
    const userName = action?.payload?.userName;
    const { type, payload } = action;

    console.log("List Request:", type);

    let userID = await getUserID(userName);
    if (!userID) return res.sendStatus(401);

    const data = await TaskList.find({ userID: userID });
    if (!data) {
      return res.status(200).json([]);
    } else {
      return res.status(200).json(data);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", message: "Server Error" });
  }
};

const createList = async (req, res) => {
  try {
    const action = req?.body?.action;
    const userName = action?.payload?.userName;
    const { type, payload } = action;

    console.log("List Request:", type);

    let userID = await getUserID(userName);
    if (!userID) return res.sendStatus(401);

    let { id, title, icon } = payload.newList;
    const newTaskList = new TaskList({
      id,
      userID,
      title,
      icon,
      createDate: new Date(),
      trash: false,
      tasks: [],
    });
    const data = await newTaskList.save();
    return res.status(200).json({ status: "success", message: "List created" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", message: "Server Error" });
  }
};

const updateList = async (req, res) => {
  try {
    const action = req?.body?.action;
    const userName = action?.payload?.userName;
    const { type, payload } = action;

    console.log("List Request:", type);

    let userID = await getUserID(userName);
    if (!userID) return res.sendStatus(401);

    let { listID, updateItem, newValue } = payload;
    const data = await handleUpdate(listID, updateItem, newValue);
    return res.status(204).json({ status: "success", message: "List updated" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", message: "Server Error" });
  }
};

const deleteList = async (req, res) => {
  try {
    const action = req?.body?.action;
    const userName = action?.payload?.userName;
    const { type, payload } = action;

    console.log("List Request:", type);

    let userID = await getUserID(userName);
    if (!userID) return res.sendStatus(401);

    const data = await TaskList.deleteOne({
      userID: userID,
      id: payload.listID,
    }).exec();
    return res.status(204).json({ status: "success", message: "List removed" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", message: "Server Error" });
  }
};

const handleUpdate = async (listID, updateItem, newValue) => {
  try {
    switch (updateItem) {
      case "list_title": {
        TaskList.updateOne(
          { id: listID },
          { $set: { title: newValue } }
        ).exec();
        break;
      }
      case "list_icon": {
        TaskList.updateOne({ id: listID }, { $set: { icon: newValue } }).exec();
        break;
      }
      case "trash": {
        const response = await TaskList.updateOne(
          { id: listID },
          { $set: { trash: true } }
        ).exec();
        break;
      }
      case "un_trash": {
        const response = await TaskList.updateOne(
          { id: listID },
          { $set: { trash: false } }
        ).exec();
        break;
      }
      // case "due_date": {
      //   TaskList.updateOne(
      //     { listID: updateData.listID, id: updateData.taskID },
      //     { $set: { dueDate: new Date(updateData.newValue) } }
      //   ).exec();
      //   break;
      // }
      default: {
      }
    }
    return "Updated";
  } catch (error) {
    return "Error: Update Task";
  }
};

module.exports = { getLists, createList, updateList, deleteList };