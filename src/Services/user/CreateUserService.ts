import prismaClient from "../../prisma";
import { SendEmail } from "../../utils/SendEmail";
import { hash } from "bcryptjs";
import { FormatPhone } from "../../utils/FormatPhone";
import { Capitalize } from "../../utils/Capitalize";
import { FormatEmail } from "../../utils/FormatEmail";
import { randomUUID } from "crypto";

interface UserRequest {
  name: string;
  lastname: string;
  cpf: string;
  email: string;
  pass: string;
  apartament_id: string;
  phone_number: string;
}

class CreateUserService {
  async execute({ email, name, apartament_id, cpf, pass, lastname, phone_number,}: UserRequest) {

  function onlyString(string:string){
    if (!/^[a-zA-Z]+$/.test(string)) {
        return false;
    }
    return true;
  }

    if (!email ||  !name ||  !apartament_id ||  !cpf || !pass ||  !lastname || !phone_number){
      throw new Error('Dados incompletos: Envie todos os campos obrigatórios.');
    }
    if (name.length < 3 || lastname.length < 4){
      throw new Error('Nome inválido.');
    }

    if (!onlyString(name) || !onlyString(lastname)){
      throw new Error('Nome inválido.');
    }

    const cpfExist = await prismaClient.user.findFirst({
      where: {
        cpf: cpf,
      },
    });

    if (cpfExist) {
      throw new Error("CPF já vinculado a outra conta.");
    }

    const emailExist = await prismaClient.user.findFirst({
      where: {
        email: FormatEmail(email),
      },
    });

    if (emailExist) {
      throw new Error("Email já existente.");
    }


    const numberExist = await prismaClient.user.findFirst({
      where:{
        phone_number:FormatPhone(phone_number)
      }
    })

    if (numberExist){
      throw new Error('Telefone já vinculado a outra conta.');
    }

    const aptExist = await prismaClient.apartment.findFirst({
      where:{
        id:apartament_id,
      }
    })

    if (!aptExist){
      throw new Error ("Este apartamento não existe.")
    }

    const hashPass = await hash(pass, 8);

    const uuid = randomUUID();

    const user = await prismaClient.user.create({
      data: {
        name: Capitalize(name),
        lastname: Capitalize(lastname),
        email: FormatEmail(email),
        cpf: cpf,
        pass: hashPass,
        apartment_id: apartament_id,
        phone_number:FormatPhone(phone_number),
        accountStatus: null,  
        sessionToken:uuid
      },
      select: {
        name: true,
        lastname: true,
        email: true,
        cpf: true,
        id: true,
        accountStatus: true,
        phone_number:true,
        apartment:{
          select:{
            numberApt:true,
            tower_id:true,
            id:true,
          }
        }
      },
    });

      const admEmail = await prismaClient.adm.findMany({
        select:{
            email:true
        }
    });
    

    const message = `
    <div style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
        <p><strong>🌟 SalãoCondo: Novo usuário cadastrado 🌟</strong></p>
        <p>Um novo usuário se cadastrou no SalãoCondo.</p>
        <p>Por favor, seja rápido e valide ou recuse o novo morador cadastrado.</p>
    </div>
`;

    for (var x = 0; x < admEmail.length; x++) {
        const getEmail = admEmail[x].email; 
        SendEmail(getEmail, message);
    }  
    return user;
  }
}

export { CreateUserService };
