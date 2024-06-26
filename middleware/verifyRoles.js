const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.user?.roles) {
      // console.log("Failed: No Roles");
      return res.sendStatus(401);
    }
    const rolesArray = [...allowedRoles];
    const result = req?.user?.roles
      .map((role) => rolesArray.includes(role))
      .find((val) => val === true);
    if (!result) {
      // console.log("Failed: Roles not authorized");
      return res.sendStatus(401);
    }
    // console.log("Roles Passed");
    next();
  };
};

module.exports = verifyRoles;
