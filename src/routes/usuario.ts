import * as express from "express";
import { authentification } from "../middleware/auth.middleware";
import { UsuarioController } from "../controller/UsuarioController";
import { authorization } from "../middleware/auth.middleware";
import { AuthController } from "../controller/authControler";
const Router = express.Router();

Router.get(
  "/users",
  authentification,
  authorization(["admin"]),
  UsuarioController.getUsers
);

Router.get(
  "/profile",
  authentification,
  authorization(["user", "admin"]),
  AuthController.getProfile
);

Router.post("/signup", UsuarioController.signup);

Router.post("/login", AuthController.login);

Router.put(
  "/update/:id",
  authentification,
  authorization(["user", "admin"]),
  UsuarioController.updateUser
);

Router.delete(
  "/delete/:id",
  authentification,
  authorization(["admin"]),
  UsuarioController.deleteUser
);

export { Router as userRouter };