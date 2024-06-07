const ActivityTask = require("../db_schemas/activityTask");
const { getUserID } = require("./userControllers");

const getActivityTasks = async (req, res) => {
  try {
    const activityID = req?.query?.activityID;

    if (!activityID) return res.sendStatus(400);

    const data = await ActivityTask.find({ activityID });
    if (!data) {
      return res.status(200).json([]);
    } else {
      return res.status(200).json(data);
    }
  } catch (err) {
    res.sendStatus(500);
  }
};

const createActivityTask = async (req, res) => {
  try {
    const action = req?.body?.action;
    const userName = action?.payload?.userName;
    const { type, payload } = action;

    let userID = await getUserID(userName);
    if (!userID) return res.sendStatus(401);

    let { id, activityID, title, detail, responsible } = payload.activityTask;
    const newActivityTask = new ActivityTask({
      id,
      activityID,
      userID,
      title,
      detail,
      responsible,
      completed: false,
      createDate: new Date(),
    });
    const data = await newActivityTask.save();
    console.log(data);
    return res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

const updateActivityTask = async (req, res) => {
  try {
    const action = req?.body?.action;
    const userName = action?.payload?.userName;
    const { type, payload } = action;

    let userID = await getUserID(userName);
    if (!userID) return res.sendStatus(401);

    const { id, title, detail, responsible, dueDate, time } =
      payload.activityTask;

    const data = await ActivityTask.updateOne(
      { id },
      {
        $set: {
          title,
          detail,
          responsible,
          dueDate,
          time,
        },
      }
    );

    return res.sendStatus(204);
  } catch (err) {
    res.sendStatus(500);
  }
};

const deleteActivityTask = async (req, res) => {
  try {
    const action = req?.body?.action;
    const userName = action?.payload?.userName;
    const { type, payload } = action;

    let userID = await getUserID(userName);
    if (!userID) return res.sendStatus(401);

    const response = await ActivityTask.deleteOne({
      id: payload?.activityTask?.id,
    }).exec();
    return res.sendStatus(204);
  } catch (err) {
    res.sendStatus(500);
  }
};

module.exports = {
  getActivityTasks,
  createActivityTask,
  updateActivityTask,
  deleteActivityTask,
};
