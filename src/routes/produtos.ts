import * as express from "express";
import { ProdutoController } from "../controller/ProdutoController";
import { authentification } from "../middleware/auth.middleware";
import { authorization } from "../middleware/auth.middleware";
const Router = express.Router();

// Rota para criar um novo produto
Router.post(
  "/create",
  authentification,
  authorization(["admin"]),
  ProdutoController.criarProduto
);

// Rota para listar todos os produtos
Router.get(
  "/all",ProdutoController.listarProdutos
);

// Rota para atualizar um produto
Router.put(
  "/update/:id",
  authentification,
  authorization(["admin"]),
  ProdutoController.atualizarProduto
);

// Rota para deletar um produto
Router.delete(
  "/delete/:id",
  authentification,
  authorization(["admin"]),
  ProdutoController.deletarProduto
);

export { Router as produtoRouter };
