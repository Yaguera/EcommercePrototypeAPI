import * as express from "express";
import { CategoriaController } from "../controller/categoriaController";
import { authentification } from "../middleware/auth.middleware";
import { authorization } from "../middleware/auth.middleware";
const Router = express.Router();

// Rota para criar uma nova categoria
Router.post(
  "/create",
  authentification,
  authorization(["admin"]),
  CategoriaController.criarCategoria
);

// Rota para listar todas as categorias
Router.get(
  "/all",
  authentification,
  authorization(["user", "admin"]),
  CategoriaController.listarCategorias
);

// Rota para atualizar uma categoria
Router.put(
  "/update/:id",
  authentification,
  authorization(["admin"]),
  CategoriaController.atualizarCategoria
);

// Rota para deletar uma categoria
Router.delete(
  "/delete/:id",
  authentification,
  authorization(["admin"]),
  CategoriaController.deletarCategoria
);

export { Router as categoriaRouter };
