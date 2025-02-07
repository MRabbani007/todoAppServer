const Task = require("../db_schemas/tasks");
const { getUserID } = require("./userControllers");
const ACTIONS = require("../data/actions");
const { getDate } = require("../data/utils");

const getTasks = async (req, res) => {
  try {
    const userName = req?.user?.username;
    if (!userName) return res.sendStatus(401);

    const userID = await getUserID(userName);
    if (!userID) return res.sendStatus(401);

    let data = [];
    let count = 0;

    const type = req?.query?.type || "ALL";
    const completed = req?.query?.comp ?? false;
    const page = req?.query?.page ?? 1;
    const ipp = req?.query?.ipp ?? 10;

    const filters = { userID };
    if (completed !== "true") {
      filters.completed = false;
    }

    if (type === "TODAY") {
      const day = getDate();
      filters.dueDate = {
        $gte: new Date(day),
        $lte: new Date(day),
      };
    }
    if (type === "WEEK") {
      const day = getDate(1);
      const offset = getDate(7);
      filters.dueDate = {
        $gte: new Date(day),
        $lte: new Date(offset),
      };
    }
    if (type === "OVERDUE") {
      const day = getDate(1);
      const offset = getDate(-1);
      filters.dueDate = {
        $gte: new Date("2000-01-01"),
        $lte: new Date(offset),
      };
    }
    if (type === "IMPORTANT") {
      filters.priority = { $in: ["high", "important"] };
    }
    if (type === "LIST") {
      const listID = req?.query?.listID;
      if (listID) {
        filters.listID = listID;
      }
    }

    const itemsPerPage = type === "PLANNER" ? 300 : ipp;

    data = await Task.find(filters)
      .sort({
        updatedAt: -1,
      })
      .limit(itemsPerPage)
      .skip(itemsPerPage * (page - 1));

    count = await Task.countDocuments(filters);
    // const listID = "task_list";

    return res.status(200).json({ data, count });
  } catch (err) {
    res.sendStatus(500);
  }
};

const createTask = async (req, res) => {
  try {
    const userName = req?.user?.username;

    let userID = await getUserID(userName);
    if (!userID) return res.sendStatus(401);

    const task = req?.body?.newTask;
    if (!task?.id) return res.sendStatus(400);

    let { id, listID, title, details, sortIndex } = task;
    const newTask = new Task({
      id,
      userID,
      listID,
      title,
      details,
      priority: "low",
      priorityLevel: 1,
      sortIndex,
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
    const task = req?.body?.task;

    const {
      id,
      listID,
      title,
      details,
      completed,
      status,
      dueDate,
      priority,
      priorityLevel,
      sortIndex,
    } = task;

    const data = await Task.updateOne(
      { id },
      {
        $set: {
          title,
          details,
          listID,
          completed,
          status,
          dueDate: new Date(dueDate),
          priority,
          priorityLevel,
          sortIndex,
        },
      }
    );

    return res.sendStatus(204);
  } catch (error) {
    return res.sendStatus(500);
  }
};

const deleteTask = async (req, res) => {
  try {
    const id = req?.body?.id;
    if (!id) return res.sendStatus(400);

    const response = await Task.deleteOne({ id }).exec();
    return res.sendStatus(204);
  } catch (err) {
    return res.sendStatus(500);
  }
};

const sortTasks = async (req, res) => {
  try {
    let tasks = req?.body?.payload;
    if (!tasks || !tasks?.length || tasks?.length === 0)
      return res.sendStatus(400);

    const bulkOperations = tasks.map(({ id, sortIndex }) => {
      return {
        updateOne: {
          filter: { id },
          update: { sortIndex },
        },
      };
    });

    const data = await Task.bulkWrite(bulkOperations);

    return res.sendStatus(204);
  } catch (err) {
    return res.sendStatus(500);
  }
};

const sortTasksPlanner = async (req, res) => {
  try {
    const moveItem = req?.body?.moveItem;
    const { id, plannerSortIndex, status } = moveItem;
    const tasks = req?.body?.payload ?? [];

    const itemData = await Task.updateOne(
      { id },
      { $set: { plannerSortIndex, status } }
    );

    // if (!tasks || !tasks?.length) return res.sendStatus(400);

    const bulkOperations = tasks.map(({ id, plannerSortIndex }) => {
      return {
        updateOne: {
          filter: { id },
          update: { plannerSortIndex },
        },
      };
    });

    const data = await Task.bulkWrite(bulkOperations);

    return res.sendStatus(204);
  } catch (err) {
    return res.sendStatus(500);
  }
};

const addTaskTag = async (req, res) => {
  try {
    const tag = req?.body?.tag;
    if (!tag?.name)
      return res.status(400).json({ message: "missing tag details" });

    const data = await Task.updateOne(
      { id: tag.taskID },
      { $push: { tags: tag } }
    ).exec();

    return res.status(204);
  } catch (err) {
    res.sendStatus(500);
  }
};

const updateTaskTag = async (req, res) => {
  try {
    const tag = req?.body?.tag;
    if (!tag?._id)
      return res.status(400).json({ message: "missing tag details" });

    let { _id, name, taskID } = payload.tag;

    const data = await Task.updateOne(
      { id: taskID, "tags._id": _id },
      { $set: { "tags.$.name": name } }
    ).exec();

    return res.status(204);
  } catch (err) {
    res.sendStatus(500);
  }
};

const deleteTaskTag = async (req, res) => {
  try {
    const tag = req?.body?.tag;
    if (!tag?._id)
      return res.status(400).json({ message: "missing tag details" });

    let { _id, taskID, name } = tag;

    const data = await Task.updateOne(
      { id: taskID },
      { $pull: { tags: { _id } } }
    ).exec();

    return res.status(204);
  } catch (err) {
    res.sendStatus(500);
  }
};

// Get count of tasks (Total & Open) for each list
const getListSummary = async (req, res) => {
  try {
    const userName = req?.user?.username;
    if (!userName) return res.sendStatus(400);

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

const getTaskSummary = async (req, res) => {
  try {
    const userName = req?.user?.username;

    let userID = await getUserID(userName);
    if (!userID) return res.sendStatus(400);

    const day = getDate();
    const yesterday = getDate(-1);
    const weekStart = getDate(1);
    const weekEnd = getDate(7);

    const data = await Task.aggregate([
      {
        $match: { userID: userID },
      },
      {
        $group: {
          _id: "$userID",
          total: { $count: {} },
          completed: {
            $sum: { $cond: [{ $eq: ["$completed", true] }, 1, 0] },
          },
          pending: {
            $sum: { $cond: [{ $eq: ["$completed", false] }, 1, 0] },
          },
          today: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ["$dueDate", new Date(day)] },
                    { $lte: ["$dueDate", new Date(day)] },
                    { $eq: ["$completed", false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          week: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ["$dueDate", new Date(weekStart)] },
                    { $lte: ["$dueDate", new Date(weekEnd)] },
                    { $eq: ["$completed", false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          overdue: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ["$dueDate", new Date("2000-01-01")] },
                    { $lte: ["$dueDate", new Date(yesterday)] },
                    { $eq: ["$completed", false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          important: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$priority", "high"] },
                    { $eq: ["$completed", false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);
    return res.status(200).json(data[0]);
  } catch (err) {
    return res.sendStatus(500);
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  sortTasks,
  sortTasksPlanner,
  getListSummary,
  getTaskSummary,
  addTaskTag,
  updateTaskTag,
  deleteTaskTag,
};
