
export const authorization = (accessRoles = []) => {
  return (req, res, next) => {
    const userRole = req?.user?.role;
    if (!userRole || !accessRoles.includes(userRole)) {
      return res.status(403).json({ message: "User not authorized" });
    }
    return next();
  };
};