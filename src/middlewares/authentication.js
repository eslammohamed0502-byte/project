import revokeTokenModel from "../DB/models/revoke-token.model.js";
import userModel from "../DB/models/user.model.js";
import { verifytoken } from "../utils/index.js";

export const authentication = (accessRoles = []) => {
  return async (req, res, next) => {
    try {
      const { authorization } = req.headers;
      const [prefix, token] = authorization?.split(" ") || [];

      if (!prefix || !token) {
        return res.status(404).json({ message: "token not exist" });
      }

      let signature = "";
      if (prefix === "bearer") {
        signature = process.env.ACCESS_TOKEN_USER;
      } else if (prefix === "admin") {
        signature = process.env.ACCESS_TOKEN_ADMIN;
      } else {
        return res.status(404).json({ message: "wrong prefix" });
      }
      const decoded = await verifytoken({ token, SIGNATURE: signature });
       if (!decoded?.email) {
        throw new Error("Invaild Token",{cause:403});
        }
        const revoked = await revokeTokenModel.findOne({tokenId:decoded.jti});
      if (revoked) {
        return res.status(409).json({ message: "log in again" });
        }
      const user = await userModel.findOne({email:decoded.email});
      if (!user) {
        return res.status(409).json({ message: "user not exist" });
      }
      req.user = user;
      req.decoded=decoded
      return next();
    } catch (error) {
      return res.status(409).json({ message: "Jwt Expired", error });
    }
  };
};
