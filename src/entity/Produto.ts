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

    @Column({ nullable: false})
    imageUrl: string;

    @ManyToOne(() => Categoria, categoria => categoria.produtos, { eager: true, nullable: false })
    categoria: Categoria;

    constructor(nome: string, quantidade: number, imageUrl: string , categoria: Categoria) {
        this.nome = nome;
        this.quantidade = quantidade;
        this.categoria = categoria;
        this.imageUrl = imageUrl;
    }

}


