import { Produto } from "../entity/Produto";
import { AppDataSource } from "../data-source";

export class ProdutoController {
    
    private produtosRepository = AppDataSource.getRepository(Produto)
    // Método para salvar um novo produto
    async salvar(produto: Produto) {
        const produtoRepo = AppDataSource.manager.save(Produto);
        return produtoRepo;
    }

    // Método para listar todos os produtos
    async listarTodos() {
        return await this.produtosRepository.find();
    }
}
