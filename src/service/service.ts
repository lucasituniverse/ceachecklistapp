import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: false,
})

export const buscar = async (url: string, setDados: Function) => {
    const resposta = await api.get(url);
    setDados(resposta.data);
}

export const criar = async (url: string, dados: object) => {
    await api.post(url, dados);
}

export const atualizar = async (url: string, dados: object) => {
    await api.put(url, dados)
}

const bucket = import.meta.env.VITE_BUCKET_NAME
const bucketUrl = `https://${bucket}.s3.amazonaws.com/imagens`;

export const uploadBucketS3 = async (files: File[]) => {
    
    const urls: string[] = [];

    for (const file of files) {
        const fileName = `${Date.now()}-${file.name}`;
        const s3Url = `${bucketUrl}/${fileName}`;
        try{
            await axios.put(s3Url, file, {
                headers: {
                    "Content-Type": file.type,
                },
            });
        }
        catch(erro: any){
            toast("Erro ao fazer o upload das imagens", { description: `Erro: ${erro}` });
        }
        urls.push(s3Url); //URL pública permanente
    }
    return urls;
};