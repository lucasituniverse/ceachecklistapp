import type Loja from "./Loja";

export default interface Srv{
    id: string;
    fabricante: string;
    modelo: string;
    tag: string;
    tamanhoMemoria: string;
    frequencia: string;
    observacao: string;

    status: string;
    tecnico: string;
    dataTroca: Date;
    intercorrencia: string;
    antes: string[];
    depois: string[];

    loja: Loja;
}