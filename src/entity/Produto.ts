import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Produto {

    constructor(nome: string, quantidade: number, descricao: string){
        this.nome = nome;
        this.quantidade = quantidade;
        this.descricao = descricao;
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @Column()
    quantidade: number;

    @Column()
    descricao: string;
}
