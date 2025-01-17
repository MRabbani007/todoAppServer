const user = require("../db_schemas/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ACTIONS } = require("../data/utils");

const handleSignUp = async (req, res) => {
  try {
    // get username and password from client
    let { username, password } = req.body.payload;
    if (!username || !password) {
      res.status(400).json({ message: "Username and Password are required" });
    } else {
      const duplicate = await user.findOne({ username: username }).exec();
      // check if already registered
      if (duplicate) {
        res.status(409).json({
          status: "failed",
          messsage: "username already registered",
        });
      } else {
        // if username not in db register new user

        // encrypt password
        const hashedPwd = await bcrypt.hash(password, 10);

        // save user to DB
        const result = await user.create({
          id: crypto.randomUUID(),
          username: username,
          password: hashedPwd,
          name: "",
          email: "",
          roles: 2001,
          createDate: new Date(),
          active: false,
          lastSigin: new Date("1900-01-01"),
          refreshToken: "",
          accessToken: "",
        });

        res.status(201).json({
          status: "success",
          message: "user registered",
        });
      }
    }
  } catch (error) {
    res.status(500).json({ status: "error", message: "Signup error" });
  }
};

const handleSignIn = async (req, res) => {
  try {
    // get username and password from client
    const payload = req.body.payload;
    let username = payload?.username;
    let password = payload?.password;

    if (!username || !password) {
      return res.status(400).json({
        status: "failed",
        message: "Username and Password are required",
      });
    } else {
      let foundUser = await user.findOne({ username: username });
      if (!foundUser) {
        return res
          .status(401)
          .json({ status: "failed", message: "wrong details" });
      } else {
        if (foundUser.username === username) {
          let match = {};
          const bcryptCompare = async () => {
            return bcrypt.compare(password, foundUser.password);
          };

          // Temporary check if password encrypted
          if (foundUser.password.length < 10) {
            match = foundUser.password === password;
          } else {
            // encrypt password
            match = await bcryptCompare();
          }

          if (match) {
            const roles = Object.values(foundUser.roles).filter(Boolean);
            const accessToken = jwt.sign(
              { username: foundUser.username, roles: roles },
              process.env.ACCESS_TOKEN_SECRET,
              { expiresIn: "1h" }
            );
            const refreshToken = jwt.sign(
              { username: foundUser.username },
              process.env.REFRESH_TOKEN_SECRET,
              { expiresIn: "1d" }
            );

            // Saving refreshToken with current user
            foundUser.refreshToken = refreshToken;
            const result = await foundUser.save();

            res.cookie("jwt", refreshToken, {
              httpOnly: true,
              sameSite: "None",
              secure: true,
              maxAge: 24 * 60 * 60 * 1000,
            });

            return res.status(202).json({
              status: "success",
              message: "signin successful",
              user: foundUser.username,
              roles,
              accessToken,
            });
          } else {
            return res
              .status(401)
              .json({ status: "failed", message: "wrong password" });
          }
        } else {
          return res
            .status(401)
            .json({ status: "failed", message: "wrong password" });
        }
      }
    }
  } catch (error) {
    return res.sendStatus(500);
  }
};

const handleRefreshToken = async (req, res) => {
  try {
    const cookies = req.cookies;
    // const username = req.body.username;
    if (!cookies?.jwt) {
      return res.sendStatus(401); // not authorized
    } else {
      const refreshToken = cookies.jwt;
      const foundUser = await user
        .findOne({
          refreshToken: refreshToken,
        })
        .exec();
      if (!foundUser) {
        return res.sendStatus(403); // forbiden
      } else {
        // evaluate JWT
        jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET,
          (error, decoded) => {
            if (error || foundUser.username !== decoded.username) {
              res.sendStatus(403);
            } else {
              const roles = Object.values(foundUser.roles);
              const accessToken = jwt.sign(
                {
                  username: decoded.username,
                  roles: roles,
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "10m" }
              );
              res
                .status(200)
                .json({ user: foundUser.username, roles, accessToken });
            }
          }
        );
      }
    }
  } catch (e) {
    return res.sendStatus(500);
  }
};

const handleSignOut = async (req, res) => {
  const cookies = req.cookies;
  // const username = req.body.username;
  if (!cookies?.jwt) {
    return res.sendStatus(204); // no content
  } else {
    // check if refresh token in DB
    const refreshToken = cookies.jwt;
    const foundUser = await user
      .findOne({
        refreshToken: refreshToken,
      })
      .exec();
    if (!foundUser) {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
      return res.sendStatus(204); // no content
    } else {
      // Delete refreshToken in db
      foundUser.refreshToken = "";
      const result = await foundUser.save();

      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      }); // secure: true ony serves on https
      res.sendStatus(204);
    }
  }
};

// TODO: Implement updates to user
const handleUserUpdate = async (req, res) => {
  const action = req?.body?.action;
  const { type, payload } = action;
  switch (type) {
    case ACTIONS.USER_UPDATE_NAME: {
      break;
    }
    case ACTIONS.USER_UPDATE_EMAIL: {
      break;
    }
    case ACTIONS.USER_UPDATE_PASSWORD: {
      break;
    }
  }
  res.json("update user");
};

const handleUserPassword = async (req, res) => {
  try {
    let { type, payload } = req.body.action;
    let { username, password, newPassword } = payload;
    if (!username || !password || !newPassword) {
      return res
        .status(400)
        .json({ message: "Username and Password are required" });
    } else {
      const foundUser = await user.findOne({ username: username }).exec();
      if (foundUser.username === username) {
        let match = {};
        const bcryptCompare = async () => {
          return bcrypt.compare(password, foundUser.password);
        };

        // Temporary check if password encrypted
        if (foundUser.password.length < 10) {
          match = foundUser.password === password;
        } else {
          // encrypt password
          match = await bcryptCompare();
        }
        if (match) {
          // encrypt password
          const hashedPwd = await bcrypt.hash(newPassword, 10);
          foundUser.password = hashedPwd;
          let result = await foundUser.save();
          return res
            .status(200)
            .json({ status: "success", message: "changed" });
        } else {
          return res.status(400).json({ message: "Wrong Password" });
        }
      }
    }
  } catch (error) {
    return res.sendStatus(500);
  }
};

const getUserID = async (username) => {
  try {
    const data = await user.find({ username: username });
    if (data.length !== 0) {
      return data[0].id;
    } else {
      return null;
    }
  } catch (error) {}
};

// Get user details for admin
const handleGetUsers = async (req, res) => {
  try {
    const data = await user.find(
      {},
      { password: 0, accessToken: 0, refreshToken: 0 }
    );
    if (data.length !== 0) {
      return res.status(200).json(data);
    } else {
      return res.sendStatus(204);
    }
  } catch (error) {}
};

// Get settings for user
const handleUserGetSettings = async (req, res) => {
  try {
    const username = req?.body?.username;

    const data = await user
      .findOne(
        { username: username },
        { name: 1, email: 1, theme: 1, descriptions: 1 }
      )
      .exec();
    if (data.length !== 0) {
      return res.status(200).json(data);
    } else {
      return res.sendStatus(204);
    }
  } catch (error) {
    res.sendStatus(500);
  }
};

const handleUserEditSettings = async (req, res) => {
  try {
    const action = req?.body?.action;
    const { type, payload } = action;
    switch (type) {
      case "EDIT_NAME": {
        if (!payload?.name) {
          return res
            .status(200)
            .json({ status: "failed", message: "name not found" });
        } else {
          const data = await user
            .updateOne(
              { username: payload?.username },
              { $set: { name: payload?.name } }
            )
            .exec();
          return res.status(200).json({ status: "success", message: "added" });
        }
      }
      case "EDIT_EMAIL": {
        if (!payload?.email) {
          return res
            .status(200)
            .json({ status: "failed", message: "email not found" });
        } else {
          const data = await user
            .updateOne(
              { username: payload?.username },
              { $set: { email: payload?.email } }
            )
            .exec();
          return res.status(200).json({ status: "success", message: "added" });
        }
      }
      case "EDIT_THEME": {
        if (!payload?.theme) {
          return res
            .status(200)
            .json({ status: "failed", message: "theme not found" });
        } else {
          const data = await user
            .updateOne(
              { username: payload?.username },
              { $set: { theme: payload?.theme } }
            )
            .exec();
          return res.status(200).json({ status: "success", message: "added" });
        }
      }
      // TODO: add edit currency
      case "EDIT_ROLES": {
        if (!payload?.roles) {
          return res
            .status(200)
            .json({ status: "failed", message: "roles not found" });
        } else {
          const data = await user
            .updateOne(
              { username: payload?.editUser },
              { $set: { roles: payload?.roles } }
            )
            .exec();
          return res.status(200).json({ status: "success", message: "added" });
        }
      }
      default: {
        res.sendStatus(204);
      }
    }
  } catch (error) {
    res.sendStatus(500);
  }
};

module.exports = {
  handleSignUp,
  handleSignIn,
  handleSignOut,
  handleUserUpdate,
  handleRefreshToken,
  handleGetUsers,
  handleUserGetSettings,
  handleUserEditSettings,
  handleUserPassword,
  getUserID,
};
