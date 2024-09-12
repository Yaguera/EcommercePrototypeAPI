import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Categoria } from "./Categoria"; // Assumindo que você tenha uma entidade de Categoria

@Entity()
export class Produto {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: false })
    nome: string;

    @Column({ type: "int", nullable: false })
    quantidade: number;

    @ManyToOne(() => Categoria, categoria => categoria.produtos, { eager: true, nullable: false })
    categoria: Categoria;

    constructor(nome: string, quantidade: number, categoria: Categoria) {
        this.nome = nome;
        this.quantidade = quantidade;
        this.categoria = categoria;
    }

}


