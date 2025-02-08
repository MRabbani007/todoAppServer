const Journal = require("../db_schemas/journal");
const { getUserID } = require("./userControllers");

const getJournal = async (req, res) => {
  try {
    const userName = req?.user?.username;

    let userID = await getUserID(userName);
    if (!userID) return res.sendStatus(401);

    const data = await Journal.find({ userID });
    if (!data) {
      return res.status(200).json([]);
    } else {
      return res.status(200).json(data);
    }
  } catch (err) {
    return res.sendStatus(500);
  }
};

const createJournal = async (req, res) => {
  try {
    const userName = req?.user?.username;
    const journal = req?.body?.payload;

    let userID = await getUserID(userName);
    if (!userID) return res.sendStatus(401);

    let { id, title, detail, color, planDate, onDate } = journal;
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
    return res.sendStatus(500);
  }
};

const updateJournal = async (req, res) => {
  try {
    const userName = req?.user?.username;
    const journal = req?.body?.payload;

    let userID = await getUserID(userName);
    if (!userID) return res.sendStatus(401);

    const { id, title, detail, onDate, color } = journal;

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

    return res.sendStatus(204);
  } catch (err) {
    return res.sendStatus(500);
  }
};

const deleteJournal = async (req, res) => {
  try {
    const id = req?.body?.payload;

    const response = await Journal.deleteOne({ id }).exec();
    return res.sendStatus(204);
  } catch (err) {
    return res.sendStatus(500);
  }
};

module.exports = { getJournal, createJournal, updateJournal, deleteJournal };
