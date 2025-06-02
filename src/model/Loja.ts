import type Pdv from "./Pdv";
import type Servidor from "./Srv";

export default interface Loja{
    id: string ;
    quantidadePdvs: number;
    diaria: number;
    uf: string;

    pdvs: Pdv[];
    servidor: Servidor;
}