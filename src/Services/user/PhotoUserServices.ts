import prismaClient from "../../prisma";

interface perfilRequest{
    perfil: string
    id:     string,
    foto:    Buffer
}

class PhotoUserServices{
    async execute({perfil, id, foto}:perfilRequest){

        if (!id || !perfil || !foto){
            throw new Error('Envie todos os dados!');
        }

        try{
            const Google_api_folder = '1YoQJQhslYWYgf2hOGER3u7yL3-4CSv2w';
            const { Readable } =  require('stream')
            const {google} = require('googleapis');

            const auth = new google.auth.GoogleAuth({
            keyFile: "./googleapi.json",
            scopes:['https://www.googleapis.com/auth/drive']
            })

            const driveService = google.drive({
            version: 'v3',
            auth
            })
            const fileMetaData = {
            'name':'snowplace.jpg',
            "parents":[Google_api_folder]
            }

            const media = {
            mimeType: 'image/jpg',
            body: Readable.from(foto)
            }

            const response = await driveService.files.create({
            resource:fileMetaData,
            media:media,
            fields:'id'
            })
            console.log('foto enviada com sucesso')
            console.log(response.data.id)

            const setPerfil = await prismaClient.user.update({
                where:{
                    id:id
                },data:{
                    photo:response.data.id
                },select:{
                    id:true,
                    name:true,
                    lastname:true,
                    photo:true
                }
            })

            return setPerfil


            }catch(err){
            return (`Erro ao enivar a fota: ${err}`);
        }



        
    }
}

export {PhotoUserServices}