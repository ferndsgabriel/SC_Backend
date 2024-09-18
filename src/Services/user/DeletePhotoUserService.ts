import prismaClient from "../../prisma";

interface UserProps {
  id: string;
}

class DeletePhotoUserService {
  async execute({ id }: UserProps) {

    if (!id){
        throw new Error('Dados incompletos: Envie todos os campos obrigatórios.');
    }
  
    const deletePhone = await prismaClient.user.update({
      where: {
        id: id,
      },
      data: {
        photo: null
      },
    })
    return {ok: true};
  }
}


export{DeletePhotoUserService}
