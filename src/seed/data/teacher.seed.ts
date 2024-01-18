
export const TEACHERS_SEED = [
    {
      id: "c8c86505-4656-41b6-8877-2290a5751ac8",
      nombres: "Sebastián Andrés2",
      apellidos: "Castañeda Rosales",
      usuario: "scastaneda",
      edad: 58,
      nivelAcademico: "Maestría",
      materias: [
        "Cálculo I",
        "Cálculo II",
        "Cálculo III"
      ],
      correo: "scastaneda@hotmail.com",
      password: "12345678",
      role: "user" as const,
    },
    {
      id: "fb46a61e-d3fb-4585-8034-f55479b45aad",
      nombres: "Eric Danilo",
      apellidos: "Vallejo Fontanarrosa",
      usuario: "alu2110",
      edad: 47,
      nivelAcademico: "Doctorado",
      materias: [
        "Máquinas Eléctricas I",
        "Máquinas Eléctricas II"
      ],
      correo: "evftrsa_@gmail.com",
      password: "12345678",
      role: "user" as const,
    },
    {
      id: "6bddd68b-c593-4391-b59c-551ee913dd64",
      nombres: "Libardo Antonio",
      apellidos: "Ruz Ruiz",
      usuario: "libardoRuzRuiz",
      edad: 65,
      correo: "lrruiz@gmail.com",
      password: "12345678",
      role: "admin" as const,
      materias: [
        "Algebra"
      ],
      nivelAcademico: "Especialización"
    },
    {
      id: "ff425e66-2d24-4ffc-bc08-7da34a4eb48f",
      nombres: "Javier Arnoldo2",
      apellidos: "Bermejo Salinas",
      usuario: "basalinas",
      edad: 44,
      correo: "jaberm@gmail.com",
      password: "222222232",
      role: "admin" as const,
      materias: [
        "Etica"
      ],
      nivelAcademico: "Maestría"
    },
    {
      id: "4bf159b5-c8f9-444f-979d-168a88dcf698",
      nombres:"Jairo",
      apellidos: "Cardona",
      usuario: "jcardona",
      edad: 45,
      correo: "j.cardona83@uninorte.edu.co",
      password: "12345678",
      role: "admin" as const,
      nivelAcademico: "Maestría",
      materias: ["Lógica Digital"]
    }
  ]