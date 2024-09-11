  import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
  } from "typeorm";
import { Pedido } from "./Pedido";
  
  @Entity({ name: "users" })

  export class Usuario {
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @Column({ nullable: false })
    name: string;
  
    @Column({ nullable: false })
    email: string;
  
    @Column({ nullable: false })
    password: string;
  
    @Column({ default: "user" })
    role: string;

    @OneToMany(() => Pedido, (pedido) => pedido.usuario) // Relacionamento inverso
    pedidos: Pedido[];
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }