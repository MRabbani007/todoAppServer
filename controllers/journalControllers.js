const Journal = require("../db_schemas/journal");
const { getUserID } = require("./userControllers");

const getJournal = async (req, res) => {
  try {
    const action = req?.body?.action;
    const userName = action?.payload?.userName;
    const { type, payload } = action;

    let userID = await getUserID(userName);
    if (!userID) return res.sendStatus(401);

    console.log("Journal Request:", type);

    const data = await Journal.find({ userID });
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

const createJournal = async (req, res) => {
  try {
    const action = req?.body?.action;
    const userName = action?.payload?.userName;
    const { type, payload } = action;

    let userID = await getUserID(userName);
    if (!userID) return res.sendStatus(401);

    console.log("Journal Request:", type);

    let { id, title, detail, planDate, onDate } = payload.journal;
    const newJournal = new Journal({
      id,
      userID,
      title,
      detail,
      onDate,
      planDate,
      timeFrom: "",
      timeTo: "",
      createDate: new Date(),
    });
    const data = await newJournal.save();
    return res.status(200).json({ status: "success", message: "Tag created" });
  } catch (err) {
    console.log(err);
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

    console.log("Journal Request:", type);

    const { id, title, detail } = payload.Journal;

    const data = await Journal.updateOne(
      { id },
      {
        $set: {
          title,
          detail,
        },
      }
    );

    return res
      .status(204)
      .json({ status: "success", message: "Journal updated" });
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

    console.log("Journal Request:", type);

    const response = await Journal.deleteOne({
      id: payload?.journal?.id,
    }).exec();
    return res.status(204).json({ status: "success", message: "Tag removed" });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

module.exports = { getJournal, createJournal, updateJournal, deleteJournal };
