const { getDate } = require("date-fns");
const Task = require("../db_schemas/tasks");
const { getUserID } = require("./userControllers");

// Get tasks for a listID
const getTasksList = async (req, res) => {
  try {
    const action = req?.body?.action;
    const userName = action?.payload?.userName;
    const { type, payload } = action;

    let userID = await getUserID(userName);
    if (!userID) return res.sendStatus(401);

    console.log("Task Request:", type);

    const data = await Task.find({ listID: payload?.listID });
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

// Get User Tasks for Today
const getTasksToday = async (req, res) => {
  try {
    const action = req?.body?.action;
    const userName = action?.payload?.userName;
    const { type, payload } = action;

    let userID = await getUserID(userName);
    if (!userID) return res.sendStatus(401);

    console.log("Task Request:", type);

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
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

// Get User Tasks for 1 week
const getTasksWeek = async (req, res) => {
  try {
    const action = req?.body?.action;
    const userName = action?.payload?.userName;
    const { type, payload } = action;

    let userID = await getUserID(userName);
    if (!userID) return res.sendStatus(401);

    console.log("Task Request:", type);

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
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

// Get User Tasks priority important
const getTasksImportant = async (req, res) => {
  try {
    const action = req?.body?.action;
    const userName = action?.payload?.userName;
    const { type, payload } = action;

    let userID = await getUserID(userName);
    if (!userID) return res.sendStatus(401);

    console.log("Task Request:", type);

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
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

// Get User Tasks overdue
const getTasksOverDue = async (req, res) => {
  try {
    const action = req?.body?.action;
    const userName = action?.payload?.userName;
    const { type, payload } = action;

    let userID = await getUserID(userName);
    if (!userID) return res.sendStatus(401);

    console.log("Task Request:", type);

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
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

// Get All Tasks
const getTasksAll = async (req, res) => {
  try {
    let data = await Task.find({});
    if (data) {
      return res.json(data);
    }
  } catch (error) {
    console.log(error);
  }
};

const createTask = async (req, res) => {
  try {
    const action = req?.body?.action;
    const userName = action?.payload?.userName;
    const { type, payload } = action;

    let userID = await getUserID(userName);
    if (!userID) return res.sendStatus(401);

    console.log("Task Request:", type);

    let { id, listID, title } = payload.newTask;
    const newTask = new Task({
      id,
      userID: userID,
      listID,
      title,
      details: "",
      priority: "low",
      tags: [],
      createDate: new Date(),
      dueDate: new Date(),
      dueTime: "",
      completed: false,
    });
    const data = await newTask.save();
    return res.status(200).json({ status: "success", message: "List created" });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

const updateTask = async (req, res) => {
  try {
    const action = req?.body?.action;
    const userName = action?.payload?.userName;
    const { type, payload } = action;

    let userID = await getUserID(userName);
    if (!userID) return res.sendStatus(401);

    console.log("Task Request:", type);

    await handleUpdateTask(userID, payload.updateData);
    return res.status(204).json({ status: "success", message: "Task updated" });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

const deleteTask = async (req, res) => {
  try {
    const action = req?.body?.action;
    const userName = action?.payload?.userName;
    const { type, payload } = action;

    let userID = await getUserID(userName);
    if (!userID) return res.sendStatus(401);

    console.log("Task Request:", type);

    const response = await Task.deleteOne({
      id: payload.taskID,
    }).exec();
    return res.status(204).json({ status: "success", message: "Task removed" });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

// Get count of tasks (Total & Open) for each list
const getListSummary = async (req, res) => {
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

const handleUpdateTask = async (userID, updateData) => {
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
      default: {
      }
    }
  } catch (error) {
    return "Error: Update Task";
  }
};

const deleteTags = async (req, res) => {
  await Task.updateMany({}, { $set: { tags: [] } });
  console.log("first");
  res.sendStatus(200);
};

module.exports = {
  getTasksList,
  getTasksToday,
  getTasksWeek,
  getTasksImportant,
  getTasksOverDue,
  getTasksAll,
  createTask,
  updateTask,
  deleteTask,
  getListSummary,
  deleteTags,
};
