import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Produto } from "./Produto";

@Entity()
export class Categoria {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: false })
    nome: string;

    @OneToMany(() => Produto, produto => produto.categoria)
    produtos: Produto[];
}
