import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { AppDataSource } from "../data-source";
import { Usuario } from "../entity/Usuario";

dotenv.config();

export const authentification = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = header.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const decode = jwt.verify(token, process.env.JWT_SECRET);
  if (!decode) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  req[" currentUser"] = decode;
  next();
};

export const authorization = (roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      const userRepo = AppDataSource.getRepository(Usuario);
      const user = await userRepo.findOne({
        where: { id: req[" currentUser"].id },
      });
      console.log(user);
      if (!roles.includes(user.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }
      next();
    };
  };