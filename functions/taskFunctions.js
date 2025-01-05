const TaskList = require("../db_schemas/lists");
const Task = require("../db_schemas/tasks");
const { getDate } = require("../data/utils");

const getUserLists = async (userID) => {
  try {
    const data = await TaskList.find({ userID: userID });
    return data;
  } catch (error) {
    return "Error: Get Lists";
  }
};

// Create New Product
const createList = async (userID, list) => {
  try {
    const newTaskList = new TaskList({
      id: crypto.randomUUID(),
      userID: userID,
      title: list.title,
      icon: list.icon,
      tasks: [],
    });
    await newTaskList.save();
    return "List Created";
  } catch (error) {
    return "Error: Create List";
  }
};

const updateList = async (userID, listID, updateData) => {
  try {
    switch (updateData.updateItem) {
      case "list_title": {
        TaskList.updateOne(
          { id: listID },
          { $set: { title: updateData.newValue } }
        ).exec();
        break;
      }
      case "list_icon": {
        TaskList.updateOne(
          { id: listID },
          { $set: { icon: updateData.newValue } }
        ).exec();
        break;
      }
      case "trash": {
        const response = await TaskList.updateOne(
          { id: listID },
          { $set: { trash: true } }
        ).exec();
        break;
      }
      case "un_trash": {
        const response = await TaskList.updateOne(
          { id: listID },
          { $set: { trash: false } }
        ).exec();
        break;
      }
      // case "due_date": {
      //   TaskList.updateOne(
      //     { listID: updateData.listID, id: updateData.taskID },
      //     { $set: { dueDate: new Date(updateData.newValue) } }
      //   ).exec();
      //   break;
      // }
      default: {
      }
    }
    return "Updated";
  } catch (error) {
    return "Error: Update Task";
  }
};

const removeList = async (userID, listID) => {
  try {
    const response = await TaskList.deleteOne({
      userID: userID,
      id: listID,
    }).exec();
    return "List Removed";
  } catch (error) {
    return "Error: Create List";
  }
};

const addTask = async (userID, listID, taskTitle) => {
  try {
    const newTask = new Task({
      id: crypto.randomUUID(),
      userID: userID,
      listID: listID,
      title: taskTitle,
      details: "",
      priority: "normal",
      tags: [],
      createDate: new Date(),
      dueDate: new Date(),
      dueTime: "",
      completed: false,
    });
    await newTask.save();
    return "Task Added";
  } catch (error) {
    return "Error: Add Task";
  }
};

const removeTask = async (userID, listID, taskID) => {
  try {
    const response = await Task.deleteOne({
      listID: listID,
      id: taskID,
    }).exec();
    return "Task Removed";
  } catch (error) {
    return "Error: Remove Task";
  }
};

const getListTasks = async (userID, listID) => {
  try {
    const data = await Task.find({ listID: listID });
    return data;
  } catch (error) {
    return "Error: Get Tasks List";
  }
};

const getTasksToday = async (userID, day) => {
  try {
    const data = await Task.find({
      userID: userID,
      completed: false,
      dueDate: { $gte: new Date(day), $lte: new Date(day) },
    });
    return data;
  } catch (error) {
    return "Error: Get Tasks Day";
  }
};

const getTasksWeek = async (userID, day, offset) => {
  try {
    const data = await Task.find({
      userID: userID,
      completed: false,
      dueDate: { $gte: new Date(day), $lte: new Date(offset) },
    });
    return data;
  } catch (error) {
    return "Error: Get Tasks Week";
  }
};

const fixdate = async () => {
  try {
    Task.updateMany({}, { $set: { dueDate: new Date("1900-01-01") } }).exec();
  } catch (error) {}
};

const updateTask = async (userID, updateData) => {
  try {
    switch (updateData.updateItem) {
      case "task_title": {
        Task.updateOne(
          { listID: updateData.listID, id: updateData.taskID },
          { $set: { title: updateData.newValue } }
        ).exec();
        break;
      }
      case "task_complete": {
        Task.updateOne(
          { listID: updateData.listID, id: updateData.taskID },
          { $set: { completed: updateData.newValue } }
        ).exec();
        break;
      }
      case "due_date": {
        Task.updateOne(
          { listID: updateData.listID, id: updateData.taskID },
          { $set: { dueDate: new Date(updateData.newValue) } }
        ).exec();
        break;
      }
      case "detail": {
        Task.updateOne(
          { listID: updateData.listID, id: updateData.taskID },
          { $set: { details: updateData.newValue } }
        ).exec();
        break;
      }
      case "priority": {
        Task.updateOne(
          { listID: updateData.listID, id: updateData.taskID },
          { $set: { priority: updateData.newValue } }
        ).exec();
        break;
      }
      case "add_tag": {
        Task.updateOne(
          { listID: updateData.listID, id: updateData.taskID },
          { $push: { tags: updateData.newValue } }
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

module.exports = {
  fixdate,
  createList,
  updateList,
  removeList,
  getUserLists,
  addTask,
  removeTask,
  getListTasks,
  getTasksToday,
  getTasksWeek,
  updateTask,
};
