
export type userRol = 'user' | 'admin' | null

export interface newUser {
    nombres: string;
    apellidos: string;
    usuario: string;
    edad: number;
    correo: string;
    password: string;
    role: userRol
  }
export interface users extends newUser {
    id: string;
  }