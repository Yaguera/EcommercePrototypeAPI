import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Pedido } from "../entity/Pedido";
import { Usuario } from "../entity/Usuario";
import { Produto } from "../entity/Produto";
import { In } from "typeorm";

export class PedidoController {
    // Método para criar um novo pedido
    static async criarPedido(req: Request, res: Response) {
        try {
            const { usuarioId, produtos } = req.body;

            // Validação dos parâmetros de entrada
            if (!usuarioId || !Array.isArray(produtos) || produtos.length === 0) {
                return res.status(400).json({ message: "Usuário e produtos são obrigatórios e devem ser válidos" });
            }

            // Verifica se o usuário existe
            const usuarioRepository = AppDataSource.getRepository(Usuario);
            const usuario = await usuarioRepository.findOne({ where: { id: usuarioId } });

            if (!usuario) {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }

            // Cria o novo pedido
            const pedido = new Pedido();
            pedido.usuario = usuario;

            // Associa os produtos ao pedido
            const produtoRepository = AppDataSource.getRepository(Produto);
            const listaProdutos = await produtoRepository.findBy({
                id: In(produtos)
            });

            if (listaProdutos.length === 0) {
                return res.status(404).json({ message: "Nenhum produto encontrado" });
            }

            pedido.produtos = listaProdutos;

            // Salva o pedido
            const pedidoRepository = AppDataSource.getRepository(Pedido);
            await pedidoRepository.save(pedido);
            return res.status(201).json({ message: "Pedido criado com sucesso", pedido });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao criar pedido CHEGOU AQUI" });
        }
    }

    // Método para listar todos os pedidos
    static async listarPedidos(req: Request, res: Response) {
        try {
            const pedidos = await AppDataSource.getRepository(Pedido).find({
                relations: ["usuario", "produtos"]
            });
            return res.status(200).json({ pedidos });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao listar pedidos" });
        }
    }

    // Método para atualizar um pedido
    static async atualizarPedido(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { usuarioId, produtos } = req.body;

            const pedidoRepository = AppDataSource.getRepository(Pedido);
            const pedido = await pedidoRepository.findOne({
                where: { id:Number(id) },
                relations: ["produtos"]
            });

            if (!pedido) {
                return res.status(404).json({ message: "Pedido não encontrado" });
            }

            // Atualiza o usuário associado ao pedido, se informado
            if (usuarioId) {
                const usuarioRepository = AppDataSource.getRepository(Usuario);
                const usuario = await usuarioRepository.findOne({ where: { id: usuarioId } });

                if (!usuario) {
                    return res.status(404).json({ message: "Usuário não encontrado" });
                }

                pedido.usuario = usuario;
            }

            // Atualiza os produtos do pedido, se informados
            if (produtos && produtos.length > 0) {
                const produtoRepository = AppDataSource.getRepository(Produto);
                const listaProdutos = await produtoRepository.findBy({
                    id: In(produtos)
                });

                if (listaProdutos.length === 0) {
                    return res.status(404).json({ message: "Nenhum produto encontrado" });
                }

                pedido.produtos = listaProdutos;
            }

            // Salva as alterações no pedido
            await pedidoRepository.save(pedido);
            return res.status(200).json({ message: "Pedido atualizado com sucesso", pedido });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao atualizar pedido" });
        }
    }

    // Método para deletar um pedido
    static async deletarPedido(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const pedidoRepository = AppDataSource.getRepository(Pedido);
            const pedido = await pedidoRepository.findOne({ where: { id:Number(id) } });

            if (!pedido) {
                return res.status(404).json({ message: "Pedido não encontrado" });
            }

            // Remove o pedido
            await pedidoRepository.remove(pedido);
            return res.status(200).json({ message: "Pedido removido com sucesso" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao remover pedido" });
        }
    }
}