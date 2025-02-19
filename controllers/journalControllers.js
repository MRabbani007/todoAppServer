const Journal = require("../db_schemas/journal");
const { getUserID } = require("./userControllers");

const getJournal = async (req, res) => {
  try {
    const userName = req?.user?.username;

    let userID = await getUserID(userName);
    if (!userID) return res.sendStatus(401);

    const cat = req?.query?.cat ?? "";

    let filters = {};

    if (cat) {
      filters.title = cat;
    }

    const data = await Journal.find({ userID, ...filters }).sort({
      onDate: -1,
    });

    return res.status(200).json(data);
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

    let { id, title, task, detail, notes, color, planDate, onDate } = journal;
    const data = await Journal.create({
      id,
      userID,
      title,
      task,
      detail,
      notes,
      color,
      onDate,
      planDate,
      timeFrom: "",
      timeTo: "",
      createDate: new Date(),
    });

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

    const { id, title, task, detail, notes, onDate, color } = journal;

    const data = await Journal.updateOne(
      { id },
      {
        $set: {
          title,
          task,
          detail,
          notes,
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
    const userName = req?.user?.username;

    let userID = await getUserID(userName);
    if (!userID) return res.sendStatus(401);

    const data = await Journal.deleteOne({ id, userID });
    return res.sendStatus(204);
  } catch (err) {
    return res.sendStatus(500);
  }
};

const getJournalTitles = async (req, res) => {
  try {
    const userName = req?.user?.username;

    let userID = await getUserID(userName);
    if (!userID) return res.sendStatus(401);

    const data = await Journal.aggregate([
      { $match: { userID } },
      {
        $group: {
          _id: "$title", // Group by the 'title' field
          count: { $sum: 1 }, // Count occurrences of each title
        },
      },
      {
        $sort: { count: -1 }, // Optional: Sort by count in descending order
      },
    ]);

    return res.status(200).json(data);
  } catch (error) {
    return res.sendStatus(500);
  }
};

module.exports = {
  getJournal,
  createJournal,
  updateJournal,
  deleteJournal,
  getJournalTitles,
};
