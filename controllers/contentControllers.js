const TaskList = require("../db_schemas/lists");
const Task = require("../db_schemas/tasks");
const { getUserID } = require("./userControllers");
const ACTIONS = require("../data/actions");
const { getDate } = require("../data/utils");

const handleLists = async (req, res) => {
  try {
    const action = req?.body?.action;
    const userName = action?.payload?.userName;
    const { type, payload } = action;

    let userID = await getUserID(userName);
    if (!userID) return res.sendStatus(401);

    console.log("List Request:", type);
    switch (type) {
      case ACTIONS.GET_LISTS: {
        const data = await TaskList.find({ userID: userID });
        if (!data) {
          return res.status(200).json([]);
        } else {
          return res.status(200).json(data);
        }
      }
      case ACTIONS.CREATE_LIST: {
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
        return res
          .status(200)
          .json({ status: "success", message: "List created" });
      }
      case ACTIONS.UPDATE_LIST: {
        let { listID, updateItem, newValue } = payload;
        await updateList(listID, updateItem, newValue);
        return res
          .status(204)
          .json({ status: "success", message: "List updated" });
      }
      case ACTIONS.REMOVE_LIST: {
        const data = await TaskList.deleteOne({
          userID: userID,
          id: payload.listID,
        }).exec();
        return res
          .status(204)
          .json({ status: "success", message: "List removed" });
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

const handleListSummary = async (req, res) => {
  try {
    const action = req?.body?.action;
    const userName = action?.payload?.userName;
    const { type, payload } = action;

    let userID = await getUserID(userName);
    if (!userID) return res.sendStatus(401);

    let data = await Task.aggregate([
      {
        $match: { userID: userID },
      },
      {
        $group: {
          _id: "$listID",
          total: { $count: {} },
          completed: {
            $sum: { $cond: [{ $eq: ["$completed", true] }, 1, 0] },
          },
          pending: {
            $sum: { $cond: [{ $eq: ["$completed", false] }, 1, 0] },
          },
        },
      },
    ]);

    return res.json(data);
  } catch (error) {
    console.log(error);
  }
};

const updateList = async (listID, updateItem, newValue) => {
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

const handleTasks = async (req, res) => {
  try {
    const action = req?.body?.action;
    const userName = action?.payload?.userName;
    const { type, payload } = action;

    let userID = await getUserID(userName);
    if (!userID) return res.sendStatus(401);

    console.log("Task Request:", type);
    switch (type) {
      case ACTIONS.GET_TASKS_LIST: {
        const data = await Task.find({ listID: payload?.listID });
        if (!data) {
          return res.status(200).json([]);
        } else {
          return res.status(200).json(data);
        }
      }
      case ACTIONS.GET_TASKS_TODAY: {
        const day = payload?.day || getDate();
        const data = await Task.find({
          userID: userID,
          completed: false,
          dueDate: {
            $gte: new Date(payload?.day),
            $lte: new Date(payload?.day),
          },
        });
        if (!data) {
          return res.status(200).json([]);
        } else {
          return res.status(200).json(data);
        }
      }
      case ACTIONS.GET_TASKS_WEEK: {
        const data = await Task.find({
          userID: userID,
          completed: false,
          dueDate: {
            $gte: new Date(payload?.day),
            $lte: new Date(payload?.offset),
          },
        });
        if (!data) {
          return res.status(200).json([]);
        } else {
          return res.status(200).json(data);
        }
      }
      case ACTIONS.GET_TASKS_IMPORTANT: {
        const data = await Task.find({
          userID: userID,
          completed: false,
          priority: "high",
        });
        if (!data) {
          return res.status(200).json([]);
        } else {
          return res.status(200).json(data);
        }
      }
      case ACTIONS.GET_TASKS_OVERDUE: {
        const data = await Task.find({
          userID: userID,
          completed: false,
          dueDate: {
            $gte: new Date("2000-01-01"),
            $lte: new Date(payload?.offset),
          },
        });
        if (!data) {
          return res.status(200).json([]);
        } else {
          return res.status(200).json(data);
        }
      }
      case ACTIONS.CREATE_TASK: {
        let { id, listID, title } = payload.newTask;
        const newTask = new Task({
          id,
          userID: userID,
          listID,
          title,
          details: "",
          priority: "normal",
          tags: [],
          createDate: new Date(),
          dueDate: new Date(),
          dueTime: "",
          completed: false,
        });
        const data = await newTask.save();
        return res
          .status(200)
          .json({ status: "success", message: "List created" });
      }
      case ACTIONS.UPDATE_TASK: {
        await updateTask(userID, payload.updateData);
        return res
          .status(204)
          .json({ status: "success", message: "Task updated" });
      }
      case ACTIONS.REMOVE_TASK: {
        // TODO: send listID
        const response = await Task.deleteOne({
          id: payload.taskID,
        }).exec();
        return res
          .status(204)
          .json({ status: "success", message: "Task removed" });
      }
      default: {
        return res
          .status(204)
          .json({ status: "failed", message: "action not found" });
      }
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

const updateTask = async (userID, updateData) => {
  try {
    switch (updateData.updateItem) {
      // listID: updateData.listID,
      case "task_title": {
        Task.updateOne(
          { id: updateData.taskID },
          { $set: { title: updateData.newValue } }
        ).exec();
        break;
      }
      case "task_complete": {
        Task.updateOne(
          { id: updateData.taskID },
          { $set: { completed: updateData.newValue } }
        ).exec();
        break;
      }
      case "due_date": {
        Task.updateOne(
          { id: updateData.taskID },
          { $set: { dueDate: new Date(updateData.newValue) } }
        ).exec();
        break;
      }
      case "detail": {
        Task.updateOne(
          { id: updateData.taskID },
          { $set: { details: updateData.newValue } }
        ).exec();
        break;
      }
      case "priority": {
        Task.updateOne(
          { id: updateData.taskID },
          { $set: { priority: updateData.newValue } }
        ).exec();
        break;
      }
      case "add_tag": {
        Task.updateOne(
          { id: updateData.taskID },
          { $push: { tags: updateData.newValue } }
        ).exec();
        break;
      }
      default: {
      }
    }
  } catch (error) {
    return "Error: Update Task";
  }
};

const tasksGetAll = async (req, res) => {
  try {
    let data = await Task.find({});
    if (data) {
      return res.json(data);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  handleLists,
  handleTasks,
  handleListSummary,
  tasksGetAll,
};
