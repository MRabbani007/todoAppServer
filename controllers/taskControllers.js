const Task = require("../db_schemas/tasks");
const { getUserID } = require("./userControllers");
const ACTIONS = require("../data/actions");
const { getDate } = require("../data/utils");

const getTasks = async (req, res) => {
  try {
    const { type, payload } = req?.body?.action;

    const userName = payload?.userName;
    if (!userName) return res.sendStatus(400);

    const userID = await getUserID(userName);
    if (!userID) return res.sendStatus(401);

    let data = [];
    switch (type) {
      case "ALL": {
        data = await Task.find({ userID });
        break;
      }
      case "TODAY": {
        const day = getDate(); //payload?.day ||

        data = await Task.find({
          userID: userID,
          completed: false,
          dueDate: {
            $gte: new Date(day),
            $lte: new Date(day),
          },
        });

        break;
      }
      case "WEEK": {
        const day = getDate(1);
        const offset = getDate(7);
        data = await Task.find({
          userID: userID,
          completed: false,
          dueDate: {
            $gte: new Date(day),
            $lte: new Date(offset),
          },
        });
        break;
      }
      case "OVERDUE": {
        const offset = getDate(-1);
        data = await Task.find({
          userID: userID,
          completed: false,
          dueDate: {
            $gte: new Date("2000-01-01"),
            $lte: new Date(offset),
          },
        });
        break;
      }
      case "IMPORTANT": {
        data = await Task.find({
          userID: userID,
          completed: false,
          priority: "high",
        });
        break;
      }
      case "LIST": {
        const listID = payload?.listID;
        data = await Task.find({ userID, listID });
        break;
      }
      default: {
        data = [];
      }
    }
    // const listID = "task_list";

    if (!data) {
      return res.status(200).json([]);
    } else {
      return res.status(200).json(data);
    }
  } catch (err) {
    res.sendStatus(500);
  }
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

    const { id, title, details, completed, dueDate, priority } = payload?.task;

    const data = await Task.updateOne(
      { id },
      {
        $set: {
          title,
          details,
          completed,
          dueDate: new Date(dueDate),
          priority,
        },
      }
    ).exec();

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

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getListSummary,
};
