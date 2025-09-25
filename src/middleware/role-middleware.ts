import { Response, NextFunction } from "express";
import { UserRequest } from "../type/user-request";
import { sendError } from "../helper/response-helper";

export const roleMiddleware = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.role && req.role === "admin") {
    return next();
  }

  return sendError(res, 403, "You don't have permission");
};
