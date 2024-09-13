import { Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Usuario } from "./Usuario";
import { Produto } from "./Produto";

@Entity()
export class Pedido {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => Usuario, usuario => usuario.pedidos, { eager: true, nullable: false })
    usuario: Usuario;

    @ManyToMany(() => Produto, { eager: true, cascade: true })
    @JoinTable()
    produtos: Produto[];

    @Column("jsonb")
    quantidadePorProduto: { [produtoId: string]: number }; // Armazena a quantidade de cada produto

    @Column({ type: "varchar", default: "pendente" })
    status: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
