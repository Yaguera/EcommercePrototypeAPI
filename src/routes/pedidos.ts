import * as express from "express";
import { PedidoController } from "../controller/PedidoController";
import { authentification } from "../middleware/auth.middleware";
import { authorization } from "../middleware/auth.middleware";
const Router = express.Router();

// Rota para criar um novo pedido
Router.post(
  "/create",
  authentification,
  authorization(["user", "admin"]),
  PedidoController.criarPedido
);

// Rota para listar todos os pedidos
Router.get(
  "/all",
  authentification,
  authorization(["admin"]),
  PedidoController.listarPedidos
);

// Rota para atualizar um pedido
Router.put(
  "/update/:id",
  authentification,
  authorization(["admin"]),
  PedidoController.atualizarPedido
);

// Rota para deletar um pedido
Router.delete(
  "/delete/:id",
  authentification,
  authorization(["admin"]),
  PedidoController.deletarPedido
);

export { Router as pedidoRouter };
