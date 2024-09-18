import prismaClient from "../../prisma";

interface perfilRequest{
    id:     string,
    image:  string,
}

class PhotoUserServices{
    async execute({ id, image}:perfilRequest){

        if (!id || !image){
            throw new Error('Envie todos os dados!');
        }

        const setPerfil = await prismaClient.user.update({
            where:{
                id:id
            },data:{
                photo:image
            },select:{
                id:true,
                name:true,
                lastname:true,
                photo:true
            }
        })

        return setPerfil
    
        }
    }
export {PhotoUserServices}