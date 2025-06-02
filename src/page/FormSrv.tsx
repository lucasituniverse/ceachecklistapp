import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select"
import {Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useEffect, useState, type FormEvent } from "react";
import { MoonLoader } from "react-spinners";
import itbackground from "../assets/itbackground.png";
import { Separator } from "@/components/ui/separator"
import type Loja from "@/model/Loja"
import { buscar } from "@/service/service"
import { toast } from "sonner"
import type Srv from "@/model/Srv";

export default function FormSrv(){

    const [loader, setLoader] = useState<boolean>(false);
    
    const [uf, setUf] = useState<string>("");
    const [listaLoja, setListaLoja] = useState<Loja[]>([]);
    useEffect(() =>{ if(uf !== "") buscarLojasPeloUf(uf)}, [uf]);
    async function buscarLojasPeloUf(uf: string){
        try{
            await buscar(`/loja/uf/${uf}`, setListaLoja);
        }
        catch(erro: any){
            toast("Erro ao buscar lojas", { description: `${erro}`,
                style: { color: "#FF6347",
                },
            });
        }
    }

    const [lojaSelecionada, setLojaSelecionada] = useState<string>("")
    const [srv, setSrv] = useState<Srv>({} as Srv);
    useEffect(() => { if(lojaSelecionada !== "") buscarSrvPorLoja(lojaSelecionada)},[lojaSelecionada]);
    async function buscarSrvPorLoja(idLoja: string){
        try{
            await buscar(`/srv/loja/${idLoja}`, setSrv);
        }
        catch(erro: any){
            toast("Erro ao buscar SRVs", { description: `${erro}`,
                style: { color: "#FF6347",
                },
            });
        }
    }

    const [srvSelecionado, setSrvSelecionado] = useState<string>("");

    return(
        <>
            <form >
                <div className="h-vh flex justify-center items-center">
                    <Card className="w-screen mx-6 lg:mx-60 xl:mx-110 my-16">
                        <CardHeader>
                            <div className="flex justify-center">
                                <img className="my-5 w-50" src={itbackground} alt="Imagem da IT Universe"/>
                            </div>
                            <CardTitle>Checklist SRVs</CardTitle>
                            <CardDescription>Checklist de projetos da IT Universe feito para C&A</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="uf">Estado</Label>
                                    <Select value={uf} onValueChange={(e) => setUf(e)} required>
                                        <SelectTrigger id="uf">
                                        <SelectValue placeholder="Selecione o Estado" />
                                        </SelectTrigger>
                                        <SelectContent position="popper">
                                            <SelectItem value="AC">Acre</SelectItem>
                                            <SelectItem value="AL">Alagoas</SelectItem>
                                            <SelectItem value="AM">Amazonas</SelectItem>
                                            <SelectItem value="BA">Bahia</SelectItem>
                                            <SelectItem value="CE">Ceará</SelectItem>
                                            <SelectItem value="DF">Distrito Federal</SelectItem>
                                            <SelectItem value="GO">Goiás</SelectItem>
                                            <SelectItem value="MA">Maranhão</SelectItem>
                                            <SelectItem value="MG">Minas Gerais</SelectItem>
                                            <SelectItem value="MT">Mato Grosso</SelectItem>
                                            <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                                            <SelectItem value="PA">Pará</SelectItem>
                                            <SelectItem value="PB">Paraíba</SelectItem>
                                            <SelectItem value="PE">Pernambuco</SelectItem>
                                            <SelectItem value="PI">Piauí</SelectItem>
                                            <SelectItem value="PR">Paraná</SelectItem>
                                            <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                                            <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                                            <SelectItem value="RO">Rondônia</SelectItem>
                                            <SelectItem value="RR">Roraíma</SelectItem>
                                            <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                                            <SelectItem value="SC">Santa Catarina</SelectItem>
                                            <SelectItem value="SE">Sergipe</SelectItem>
                                            <SelectItem value="SP">São Paulo</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="loja" className="mb-2">Loja</Label>
                                    <Select value={lojaSelecionada} onValueChange={setLojaSelecionada} required>
                                        <SelectTrigger id="loja">
                                        <SelectValue placeholder="Selecione uma loja" />
                                        </SelectTrigger>
                                        <SelectContent position="popper">
                                            {listaLoja.map((loja) => (
                                                <SelectItem value={loja.id} key={loja.id}>{loja.id}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>                                                                
                                </div>

                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="srv" className="mb-2">SRV { srvSelecionado ? ` - ${srv.modelo}` : "" }</Label>
                                    <Select value={srvSelecionado} onValueChange={setSrvSelecionado} required>
                                        <SelectTrigger id="srv">
                                        <SelectValue placeholder="Selecione um SRV" />
                                        </SelectTrigger>
                                        <SelectContent position="popper">
                                            <SelectItem value={srv.id} key={srv.id}>{srv.id}</SelectItem>
                                        </SelectContent>
                                    </Select>                                                                
                                </div>

                                <Separator className="my-4"/>

                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end mt-4">
                            <Button type="submit"
                                onClick={() => setLoader(true)}>{ loader ? <MoonLoader color="white" size={17} /> : <span>Enviar</span> }
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </form>
        </>
    );
}