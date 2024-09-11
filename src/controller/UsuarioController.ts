import { Usuario } from "../entity/Usuario";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import { encrypt } from "../helpers/encrypt";
import { UserResponce } from "../dto/user.dto";
import * as cache from "memory-cache";

export class UsuarioController {

    static async signup(req: Request, res: Response) {
        const { name, email, password, role } = req.body;
        const encryptedPassword = await encrypt.encryptpass(password);
        const user = new Usuario();
        user.name = name;
        user.email = email;
        user.password = encryptedPassword;
        user.role = role;
    
        const userRepository = AppDataSource.getRepository(Usuario);
        await userRepository.save(user);
        // Use the UserResponse DTO to structure the data being sent in the response
        const userDataSent = new UserResponce()
        userDataSent.name = user.name;
        userDataSent.email= user.email;
        userDataSent.role = user.role;
        
    
        
        const token = encrypt.generateToken({ id: user.id });
    
        return res
          .status(200)
          .json({ message: "User created successfully", token, userDataSent });
      }

    static async getUsers(req: Request, res: Response) {
    const data = cache.get("data");
    if (data) {
        console.log("serving from cache");
        return res.status(200).json({
        data,
        });
    } else {
        console.log("serving from db");
        const userRepository = AppDataSource.getRepository(Usuario);
        const users = await userRepository.find();

        cache.put("data", users, 6000);
        return res.status(200).json({
        data: users,
        });
    }
    }
    static async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const { name, email } = req.body;
    const userRepository = AppDataSource.getRepository(Usuario);
    const user = await userRepository.findOne({
        where: { id },
    });
    user.name = name;
    user.email = email;
    await userRepository.save(user);
    res.status(200).json({ message: "udpdate", user });
    }

    static async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    const userRepository = AppDataSource.getRepository(Usuario);
    const user = await userRepository.findOne({
        where: { id },
    });
    await userRepository.remove(user);
    res.status(200).json({ message: "ok" });
    }


}