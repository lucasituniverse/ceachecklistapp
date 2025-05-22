import type Loja from "./Loja";

export default interface Pdv{
    id: string;
    fabricante: string;
    modelo: string;
    tag: string;
    frequencia: string;
    observacao: string;

    existe: boolean; //Existe PDV ?
    status: string;
    tecnico: string;
    dataTroca: Date;
    intercorrencia: string;
    antes: string[];
    depois: string[];

    loja: Loja;
}