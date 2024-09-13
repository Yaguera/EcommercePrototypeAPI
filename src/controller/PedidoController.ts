import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Pedido } from "../entity/Pedido";
import { Usuario } from "../entity/Usuario";
import { Produto } from "../entity/Produto";
import { In } from "typeorm";
import { createMessageChannel } from "../messages/messageChannel";

export class PedidoController {
    // Método para criar um novo pedido
    static async criarPedido(req: Request, res: Response) {
        try {
            const { usuarioId, produtos, quantidadePorProduto } = req.body;

            // Validação dos parâmetros de entrada
            if (!usuarioId || !Array.isArray(produtos) || produtos.length === 0 || !quantidadePorProduto) {
                return res.status(400).json({ message: "Usuário, produtos e quantidades são obrigatórios" });
            }
            // Verifica se o usuário existe
            const usuarioRepository = AppDataSource.getRepository(Usuario);
            const usuario = await usuarioRepository.findOne({ where: { id: usuarioId } });

            if (!usuario) {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }

            // Associa os produtos ao pedido
            const produtoRepository = AppDataSource.getRepository(Produto);
            const listaProdutos = await produtoRepository.findBy({
                id: In(produtos)
            });

            if (listaProdutos.length === 0) {
                return res.status(404).json({ message: "Nenhum produto encontrado" });
            }
            
            // Cria o novo pedido
            const pedido = new Pedido();
            pedido.usuario = usuario;
            pedido.produtos = listaProdutos;
            pedido.quantidadePorProduto = quantidadePorProduto;
            pedido.status = "pendente";

            // Salva o pedido
            const pedidoRepository = AppDataSource.getRepository(Pedido);
            await pedidoRepository.save(pedido);
            
            // Envia a mensagem para a fila após o pedido ser criado
            const channel = await createMessageChannel();
            if (channel) {
                const message = {
                    pedidoId: pedido.id,
                    usuarioId: usuario.id,
                    produtos: produtos,
                    quantidadePorProduto: quantidadePorProduto
                };

                // Envia a mensagem para a fila
                const queueName = process.env.QUEUE_NAME;
                channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
                persistent: true,
                });

                console.log(`Mensagem enviada para a fila ${queueName}:`, message);
            }

            return res.status(201).json({ message: "Pedido criado e será processado", pedido });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao criar pedido" });
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
                where: { id },
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
            const pedido = await pedidoRepository.findOne({ where: { id } });

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
