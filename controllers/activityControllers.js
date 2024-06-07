const Activity = require("../db_schemas/activity");
const { getUserID } = require("./userControllers");

const getActivities = async (req, res) => {
  try {
    const userName = req?.query?.userName;

    let userID = await getUserID(userName);
    if (!userID) return res.sendStatus(401);

    const data = await Activity.find({ userID });
    if (!data) {
      return res.status(200).json([]);
    } else {
      return res.status(200).json(data);
    }
  } catch (err) {
    res.sendStatus(500);
  }
};

const createActivity = async (req, res) => {
  try {
    const action = req?.body?.action;
    const userName = action?.payload?.userName;
    const { type, payload } = action;

    let userID = await getUserID(userName);
    if (!userID) return res.sendStatus(401);

    let { id, title, detail, ownername, color, icon } = payload.activity;
    const newActivity = new Activity({
      id,
      userID,
      ownername,
      shared: false,
      teams: [],
      title,
      detail,
      color,
      icon,
      time: "",
      completed: false,
      createDate: new Date(),
    });
    const data = await newActivity.save();
    console.log(data);
    return res.sendStatus(204);
  } catch (err) {
    res.sendStatus(500);
  }
};

const updateActivity = async (req, res) => {
  try {
    const action = req?.body?.action;
    const userName = action?.payload?.userName;
    const { type, payload } = action;

    let userID = await getUserID(userName);
    if (!userID) return res.sendStatus(401);

    const { id, title, detail, icon, color } = payload.activity;

    const data = await Activity.updateOne(
      { id },
      {
        $set: {
          title,
          detail,
          icon,
          color,
        },
      }
    );

    return res.sendStatus(204);
  } catch (err) {
    res.sendStatus(500);
  }
};

const deleteActivity = async (req, res) => {
  try {
    const action = req?.body?.action;
    const userName = action?.payload?.userName;
    const { type, payload } = action;

    let userID = await getUserID(userName);
    if (!userID) return res.sendStatus(401);

    const response = await Activity.deleteOne({
      id: payload?.activity?.id,
    }).exec();
    return res.sendStatus(204);
  } catch (err) {
    res.sendStatus(500);
  }
};

module.exports = {
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity,
};
