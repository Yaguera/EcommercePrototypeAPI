import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Categoria } from "../entity/Categoria";

export class CategoriaController {
  // Método para criar uma nova categoria
  static async criarCategoria(req: Request, res: Response) {
    try {
      const { nome } = req.body;
      // Validação dos parâmetros de entrada
      if (!nome) {
        return res.status(400).json({ message: "Nome da categoria é obrigatório" });
      }

      // Cria a nova categoria
      const categoria = new Categoria();
      categoria.nome = nome;

      // Salva a categoria
      const categoriaRepository = AppDataSource.getRepository(Categoria);
      await categoriaRepository.save(categoria);

      return res.status(201).json({ message: "Categoria criada com sucesso", categoria });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao criar categoria" });
    }
  }

  // Método para listar todas as categorias
  static async listarCategorias(req: Request, res: Response) {
    try {
      const categorias = await AppDataSource.getRepository(Categoria).find();
      return res.status(200).json({ categorias });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao listar categorias" });
    }
  }

  // Método para atualizar uma categoria
  static async atualizarCategoria(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nome } = req.body;

      const categoriaRepository = AppDataSource.getRepository(Categoria);
      const categoria = await categoriaRepository.findOne({ where: { id: String(id) } });

      if (!categoria) {
        return res.status(404).json({ message: "Categoria não encontrada" });
      }

      // Atualiza o nome da categoria, se fornecido
      if (nome) {
        categoria.nome = nome;
      }

      // Salva as alterações na categoria
      await categoriaRepository.save(categoria);
      return res.status(200).json({ message: "Categoria atualizada com sucesso", categoria });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao atualizar categoria" });
    }
  }

  // Método para deletar uma categoria
  static async deletarCategoria(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const categoriaRepository = AppDataSource.getRepository(Categoria);
      const categoria = await categoriaRepository.findOne({ where: { id: String(id) } });

      if (!categoria) {
        return res.status(404).json({ message: "Categoria não encontrada" });
      }

      // Remove a categoria
      await categoriaRepository.remove(categoria);
      return res.status(200).json({ message: "Categoria removida com sucesso" });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao remover categoria" });
    }
  }
}
