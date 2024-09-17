import {Channel, connect} from "amqplib"
import { config } from "dotenv"
import * as amqp from "amqplib";
import { Produto } from "../entity/Produto";
import { AppDataSource } from "../data-source";
import { Pedido } from "../entity/Pedido";

export const createMessageChannel = async (): Promise<Channel | null> => {
    config();

    const amqpServer = process.env.AMQP_SERVER;
    const queueName = process.env.QUEUE_NAME;

    if(!amqpServer || !queueName) {
        console.log("AMQP_SERVER or QUEUE_NAME environment variables are not set");
        return null
    }

    try {
        const connection = await connect(amqpServer);
        const channel = await connection.createChannel()
        await channel.assertQueue(queueName);
        console.log("Connected to RabbitMQ")
        return channel;
    } catch(err) {
        console.error("Error while trying to connect to RabbitMQ", err);
        return null;
    }
};


export const consumeMessage = async () => {
  try {
    const connection = await amqp.connect(process.env.AMQP_SERVER);
    const channel = await connection.createChannel();
    const queueName = process.env.QUEUE_NAME;

    await channel.assertQueue(queueName, { durable: true });

    console.log(`Aguardando mensagens na fila ${queueName}...`);

    channel.consume(queueName, async (msg) => {
      if (msg !== null) {
        const { pedidoId, produtos, quantidadePorProduto } = JSON.parse(msg.content.toString());
    
        let estoqueSuficiente = true;
    
        // Primeira passagem: verificar se o estoque é suficiente para todos os produtos
        for (const produtoId of produtos) {
          const produtoRepository = AppDataSource.getRepository(Produto);
          const produto = await produtoRepository.findOne({ where: { id: produtoId } });
    
          if (!produto) {
            console.error(`Produto ${produtoId} não encontrado.`);
            estoqueSuficiente = false;
            break;
          }
    
          // Verifica se a quantidade no estoque é suficiente
          const quantidadeSolicitada = quantidadePorProduto[produtoId];
          if (produto.quantidade < quantidadeSolicitada) {
            estoqueSuficiente = false;
            console.log(`Estoque insuficiente para o produto ${produto.nome}.`);
            break;
          }
        }
    
        // Segunda passagem: se o estoque for suficiente, atualizar as quantidades e salvar os produtos
        if (estoqueSuficiente) {
          for (const produtoId of produtos) {
            const produtoRepository = AppDataSource.getRepository(Produto);
            const produto = await produtoRepository.findOne({ where: { id: produtoId } });
    
            if (produto) {
              const quantidadeSolicitada = quantidadePorProduto[produtoId];
    
              // Subtrai a quantidade solicitada do estoque
              produto.quantidade -= quantidadeSolicitada;
    
              // Salva o produto atualizado no banco de dados
              await produtoRepository.save(produto);
              console.log(`Quantidade do produto ${produto.nome} atualizada para ${produto.quantidade}.`);
            }
          }
    
          // Atualiza o status do pedido para "confirmado"
          const pedidoRepository = AppDataSource.getRepository(Pedido);
          const pedido = await pedidoRepository.findOne({ where: { id: pedidoId } });
    
          if (pedido) {
            pedido.status = "confirmado";
            await pedidoRepository.save(pedido);
            console.log(`Pedido ${pedidoId} foi confirmado.`);
          }
        } else {
          // Se o estoque não for suficiente, cancelar o pedido
          const pedidoRepository = AppDataSource.getRepository(Pedido);
          const pedido = await pedidoRepository.findOne({ where: { id: pedidoId } });
    
          if (pedido) {
            pedido.status = "cancelado";
            await pedidoRepository.save(pedido);
            console.log(`Pedido ${pedidoId} foi cancelado.`);
          }
        }
    
        channel.ack(msg);
      }
    }, { noAck: false });
  } catch (err) {
    console.error("Erro ao consumir mensagem", err);
  }
};
