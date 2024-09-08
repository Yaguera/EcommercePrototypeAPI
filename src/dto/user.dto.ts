// src/dto/user.dto.ts

export class UserResponce {
    name: string;
    email: string;
    role: string;
  
  }
  
  // Interface Payload deve ser definida fora da classe UserResponse
  export interface Payload {
    id: string;
    name?: string; // O campo name é opcional
    role?: string; // O campo role é opcional
  }
  