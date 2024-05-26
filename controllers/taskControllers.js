const { getDate } = require("date-fns");
const Task = require("../db_schemas/tasks");
const { getUserID } = require("./userControllers");
const ACTIONS = require("../data/actions");

// Get tasks for a listID
const getTasksList = async (req, res) => {
  try {
    const listID = req?.query?.listID;
    const data = await Task.find({ listID });
    if (!data) {
      return res.status(200).json([]);
    } else {
      return res.status(200).json(data);
    }
  } catch (err) {
    res.sendStatus(500);
  }
};

const getTasksTaskList = async (req, res) => {
  try {
    const userName = req?.query?.userName;
    if (!userName) return res.sendStatus(400);

    const userID = await getUserID(userName);
    if (!userID) return res.sendStatus(401);

    const listID = "task_list";

    const data = await Task.find({ userID, listID });
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
    res.sendStatus(500);
  }
};

// Get All Tasks
const getTasksAll = async (req, res) => {
  try {
    let userName = req?.body?.userName;
    if (!userName) return res.sendStatus(400);

    const userID = await getUserID(userName);
    if (!userID) return res.sendStatus(401);

    let data = await Task.find({ userID });

    if (!data) return res.json([]);

    return res.json(data);
  } catch (error) {}
};

const createTask = async (req, res) => {
  try {
    const action = req?.body?.action;
    const userName = action?.payload?.userName;
    const { type, payload } = action;

    let userID = await getUserID(userName);
    if (!userID) return res.sendStatus(401);

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
    return res.sendStatus(500);
  }
};

const updateTask = async (req, res) => {
  try {
    const action = req?.body?.action;
    const { type, payload } = action;
    switch (type) {
      case ACTIONS.UPDATE_TASK_TITLE: {
        await editTaskTitle(payload?.task);
        break;
      }
      case ACTIONS.UPDATE_TASK_COMPLETE: {
        await editTaskCompleted(payload?.task);
        break;
      }
      case ACTIONS.UPDATE_TASK_DUEDATE: {
        await editTaskDueDate(payload?.task);
        break;
      }
      case ACTIONS.UPDATE_TASK_DETAILS: {
        await editTaskDetail(payload?.task);
        break;
      }
      case ACTIONS.UPDATE_TASK_PRIORITY: {
        await editTaskPriority(payload?.task);
        break;
      }
      default: {
      }
    }
    return res.status(204);
  } catch (err) {
    return res.sendStatus(500);
  }
};

const deleteTask = async (req, res) => {
  try {
    const action = req?.body?.action;
    const id = action?.payload?.id;

    if (!id) return res.sendStatus(400);

    const response = await Task.deleteOne({ id }).exec();
    return res.sendStatus(204);
  } catch (err) {
    return res.sendStatus(500);
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
    return res.sendStatus(500);
  }
};

const editTaskTitle = async ({ id, title }) => {
  const data = await Task.updateOne({ id }, { $set: { title } }).exec();
  return data?.acknowledged;
};
const editTaskCompleted = async ({ id, completed }) => {
  const data = await Task.updateOne({ id }, { $set: { completed } }).exec();
  return data?.acknowledged;
};
const editTaskDueDate = async ({ id, dueDate }) => {
  const data = await Task.updateOne(
    { id },
    { $set: { dueDate: new Date(dueDate) } }
  ).exec();
  return data?.acknowledged;
};
const editTaskDetail = async ({ id, details }) => {
  const data = await Task.updateOne({ id }, { $set: { details } }).exec();
  return data?.acknowledged;
};
const editTaskPriority = async ({ id, priority }) => {
  const data = await Task.updateOne({ id }, { $set: { priority } }).exec();
  return data?.acknowledged;
};

const deleteTags = async (req, res) => {
  await Task.updateMany({}, { $set: { tags: [] } });
  res.sendStatus(200);
};

module.exports = {
  getTasksTaskList,
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
