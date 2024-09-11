import "reflect-metadata"
import { DataSource } from "typeorm"
import { Usuario } from "./entity/Usuario"
import { Pedido } from "./entity/Pedido"
import { Produto } from "./entity/Produto"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "ecommerce",
    synchronize: true,
    logging: false,
    entities: [Usuario,Pedido,Produto],
    migrations: [],
    subscribers: [],
})
