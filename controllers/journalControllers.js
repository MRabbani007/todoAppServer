const Journal = require("../db_schemas/journal");
const { getUserID } = require("./userControllers");

const getJournal = async (req, res) => {
  try {
    const userName = req?.query?.userName;

    let userID = await getUserID(userName);
    if (!userID) return res.sendStatus(401);

    const data = await Journal.find({ userID });
    if (!data) {
      return res.status(200).json([]);
    } else {
      return res.status(200).json(data);
    }
  } catch (err) {
    res.sendStatus(500);
  }
};

const createJournal = async (req, res) => {
  try {
    const action = req?.body?.action;
    const userName = action?.payload?.userName;
    const { type, payload } = action;

    let userID = await getUserID(userName);
    if (!userID) return res.sendStatus(401);

    let { id, title, detail, color, planDate, onDate } = payload.journal;
    const newJournal = new Journal({
      id,
      userID,
      title,
      detail,
      color,
      onDate,
      planDate,
      timeFrom: "",
      timeTo: "",
      createDate: new Date(),
    });
    const data = await newJournal.save();
    return res.sendStatus(204);
  } catch (err) {
    res.sendStatus(500);
  }
};

const updateJournal = async (req, res) => {
  try {
    const action = req?.body?.action;
    const userName = action?.payload?.userName;
    const { type, payload } = action;

    let userID = await getUserID(userName);
    if (!userID) return res.sendStatus(401);

    const { id, title, detail, onDate, color } = payload.journal;

    console.log(payload.journal);
    const data = await Journal.updateOne(
      { id },
      {
        $set: {
          title,
          detail,
          onDate: new Date(onDate),
          color,
        },
      }
    );
    console.log(data);

    return res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

const deleteJournal = async (req, res) => {
  try {
    const action = req?.body?.action;
    const userName = action?.payload?.userName;
    const { type, payload } = action;

    let userID = await getUserID(userName);
    if (!userID) return res.sendStatus(401);

    const response = await Journal.deleteOne({
      id: payload?.journal?.id,
    }).exec();
    return res.sendStatus(204);
  } catch (err) {
    res.sendStatus(500);
  }
};

module.exports = { getJournal, createJournal, updateJournal, deleteJournal };
