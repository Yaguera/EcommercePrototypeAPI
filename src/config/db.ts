import { AppDataSource } from "../data-source"


export const conectarServidorNoBd = async () =>{
    await AppDataSource.initialize()
    .then(()=>{
        console.log(`Data source has been initialized`);
    })
    .catch((err)=>{
        console.error(`Data source initialization error`, err);       
    })

    process.on('SIGINT', async () => {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
            console.log('Connection with the database has been closed.');
        }
        process.exit(0); // Garantir que o processo seja finalizado
    });

}