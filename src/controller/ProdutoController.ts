import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Produto } from "../entity/Produto";
import { Categoria } from "../entity/Categoria";

export class ProdutoController {
  // Método para criar um novo produto
  static async criarProduto(req: Request, res: Response) {
    try {
      const { nome, quantidade, imageUrl, categoriaId } = req.body;

      // Validação dos parâmetros de entrada
      if (!nome || quantidade === undefined || !categoriaId || !imageUrl) {
        return res.status(400).json({ message: "Nome, quantidade e categoria são obrigatórios" });
      }

      // Verifica se a categoria existe
      const categoriaRepository = AppDataSource.getRepository(Categoria);
      const categoria = await categoriaRepository.findOne({ where: { id: categoriaId } });

      if (!categoria) {
        return res.status(404).json({ message: "Categoria não encontrada" });
      }

      // Cria o novo produto
      const produto = new Produto(nome, quantidade, imageUrl, categoria);

      // Salva o produto
      const produtoRepository = AppDataSource.getRepository(Produto);
      await produtoRepository.save(produto);

      
      return res.status(201).json({ message: "Produto criado com sucesso", produto });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao criar produto" });
    }
  }

  // Método para listar todos os produtos
  static async listarProdutos(req: Request, res: Response) {
    try {
      const produtos = await AppDataSource.getRepository(Produto).find({
        relations: ["categoria"]
      });
      return res.status(200).json({ produtos });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao listar produtos" });
    }
  }

  // Método para atualizar um produto
  static async atualizarProduto(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nome, quantidade, imageUrl, categoriaId } = req.body;

      const produtoRepository = AppDataSource.getRepository(Produto);
      const produto = await produtoRepository.findOne({ where: { id} });

      if (!produto) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }

      // Atualiza o nome e a quantidade do produto
      if (nome) produto.nome = nome;
      if (quantidade !== undefined) produto.quantidade = quantidade;
      if (imageUrl) produto.imageUrl = imageUrl;

      // Atualiza a categoria do produto, se informada
      if (categoriaId) {
        const categoriaRepository = AppDataSource.getRepository(Categoria);
        const categoria = await categoriaRepository.findOne({ where: { id: categoriaId } });

        if (!categoria) {
          return res.status(404).json({ message: "Categoria não encontrada" });
        }

        produto.categoria = categoria;
      }

      // Salva as alterações no produto
      await produtoRepository.save(produto);
      return res.status(200).json({ message: "Produto atualizado com sucesso", produto });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao atualizar produto" });
    }
  }

  // Método para deletar um produto
  static async deletarProduto(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const produtoRepository = AppDataSource.getRepository(Produto);
      const produto = await produtoRepository.findOne({ where: { id } });

      if (!produto) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }

      // Remove o produto
      await produtoRepository.remove(produto);
      return res.status(200).json({ message: "Produto removido com sucesso" });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao remover produto" });
    }
  }
}
