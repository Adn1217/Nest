import { users } from 'src/students/models/students.interface';


export const STUDENTS_SEED : users [] = [
    {
    id: "f87b0e98-0846-4b0d-a426-ab85941260b2",
    nombres: "Adrian Alberto",
    apellidos: "Fernández Cabrera",
    usuario: "adn1217",
    edad: 32,
    correo: "adn1217@hotmail.com",
    password: "12345678",
    role: "admin" as const,
    },
    {
    id: "13a607e0-c04d-4353-8f51-10edbfe9e01e",
    nombres: "Alejandra Paola",
    apellidos: "Fernández Castro",
    usuario: "alu2110",
    edad: 31,
    correo: "alufndz_@gmail.com",
    password: "12345678",
    role: "user" as const
    },
    {
    id: "204ec386-83a6-482d-89db-dea2d41d2dd0",
    nombres: "Rupertico Adolfo",
    apellidos: "Herrera Gonzalez",
    usuario: "ruper12",
    edad: 33,
    correo: "raherreraG@gmail.com",
    password: "12345678",
    role: "user" as const,
    },
    {
    id: "5997e7d5-e637-48be-9026-3ed88491d6a8",
    nombres: "Keyner Antonio",
    apellidos: "Fuentes Fontalvo",
    usuario: "adn1217",
    edad: 22,
    correo: "adn1217@hotmail.com",
    password: "11111111",
    role: "user" as const,
    },
    {
    id: "1427c086-7549-43ae-bb04-bf92b59029c2",
    nombres: "Adrian Alberto",
    apellidos: "Fernández Castro",
    usuario: "adn1217",
    edad: 23,
    correo: "adn1219@hotmail.com",
    password: "11111111",
    role: "user" as const,
    },
    {
    id: "a3d87b90-49e3-4e1c-bf2f-569183df8749",
    nombres: "Esmeregildo",
    apellidos: "Segrera fuentes",
    usuario: "esmese",
    edad: 67,
    correo: "esme.segrera@hotmail.com",
    password: "12345678",
    role: "user" as const,
    }
]
