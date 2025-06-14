import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select"
import {Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle} from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { MoonLoader } from "react-spinners";
import itbackground from "../assets/itbackground.png";
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"
import { useEffect, useState, type FormEvent } from "react"
import type Loja from "@/model/Loja"
import { buscar, criar } from "@/service/service"
import { toast } from "sonner"
import type Pdv from "@/model/Pdv"

export default function FormCreatePdv(){

    const navigate = useNavigate();
    const [loader, setLoader] = useState<boolean>(false);

    const [uf, setUf] = useState<string>("");
    useEffect(() => { if(uf) buscarLojasPorUf(uf)}, [uf]);
    const [listaLoja, setListaLoja] = useState<Loja[]>([]);
    async function buscarLojasPorUf(uf: string){
        try{
            await buscar(`/loja/uf/${uf}`, setListaLoja);
        } catch(erro: any){
            toast("Erro ao buscar lojas", { description: `Erro: ${erro}` });
        }
    }

    const [lojaSelecionada, setLojaSelecionada] = useState<string>("");
    const [loja, setLoja] = useState<Loja>({} as Loja);
    async function buscarLoja(idLoja: string){
        try{
            await buscar(`/loja/${idLoja}`, setLoja);
        }catch(erro: any){
            toast("Erro ao buscar loja selecionada", { description: `Erro: ${erro}` });
        };
    }
    useEffect(() => { 
        if(lojaSelecionada){
            buscarLoja(lojaSelecionada);
            setIdPdv(`${lojaSelecionada}-PDV-`);
        } 
    }, [lojaSelecionada]);

    const [pdv, setPdv] = useState<Pdv>({} as Pdv);
    const [idPdv, setIdPdv] = useState<string>("");
    const [fabricante, setFabricante] = useState<string>("");
    const [modelo, setModelo] = useState<string>("");
    const [tag, setTag] = useState<string>("");
    const [frequencia, setFrequencia] = useState<string>("");

    function atualizarDadosPdv(atributo: string, valor: string){
        setPdv({
            ...pdv,
            [atributo]: valor
        });
    }

    async function criarPdv(event: FormEvent<HTMLFormElement>){
        event.preventDefault();
        setLoader(true);

        const pdvFinal: Pdv = {
            ...pdv,
            loja: loja
        };

        console.log(pdvFinal);

        try{
            await criar("/pdv", pdvFinal);
        }
        catch(erro: any) {
            toast("Erro ao enviar ao criar PDV", { description: `Erro: ${erro}` });
        }

        setLoader(false);
        limparDados();
    }

    function limparDados(){
        setUf("");
        setListaLoja([]);
        setLojaSelecionada("");
        setLoja({} as Loja);
        setPdv({} as Pdv);
        setIdPdv("");
        setFabricante("");
        setModelo("");
        setTag("");
        setFrequencia("");
    }
    return(
        <>
            <form onSubmit={(e) => {criarPdv(e)}}>
                <div className="h-vh flex justify-center items-center">
                    <Card className="w-screen mx-6 lg:mx-60 xl:mx-90 my-16">
                        <CardHeader>
                            <div className="flex justify-center">
                                <img className="my-5 w-50" src={itbackground} alt="Imagem da IT Universe"/>
                            </div>
                            <div className="flex justify-between">
                                <div>
                                    <CardTitle>Criação de PDVs</CardTitle>
                                    <CardDescription>Checklist de projetos da IT Universe feito para C&A</CardDescription>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-2">
                                <Button variant="secondary" className="cursor-pointer" onClick={() => navigate("/pdv")}>Checklist PDV</Button>
                                <Button variant="secondary" className="cursor-pointer" onClick={() => navigate("/srv")}>Checklist SRV</Button>
                            </div>
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

                                <Separator className="my-4"/>
                                <div className="flex flex-col space-y-1.5 lg:w-48">
                                    <Label htmlFor="idPdv" className="mb-2">Nome PDV</Label>
                                    <Input id="idPdv" type="text" value={idPdv} onChange={(e) => { setIdPdv(e.target.value), atualizarDadosPdv("id", e.target.value) } } placeholder="LOJA-PDV-000" required></Input>
                                </div>

                                <div className="flex flex-col space-y-1.5 lg:w-42">
                                    <Label htmlFor="fabricante" className="mb-2">Fabricante</Label>
                                    <Select value={fabricante} onValueChange={ (e) => {setFabricante(e), atualizarDadosPdv("fabricante", e)} } required>
                                        <SelectTrigger id="fabricante">
                                        <SelectValue placeholder="Selecione o fabricante" />
                                        </SelectTrigger>
                                        <SelectContent position="popper">
                                            <SelectItem value="Dell" >Dell</SelectItem>
                                            <SelectItem value="Lenovo" >Lenovo</SelectItem>
                                            <SelectItem value="HP" >HP</SelectItem>
                                            <SelectItem value="Sweda" >Sweda</SelectItem>
                                        </SelectContent>
                                    </Select>                     
                                </div>
                                
                                <div className="flex flex-col space-y-1.5 lg:w-48">
                                    <Label htmlFor="modelo" className="mb-2">Modelo PDV</Label>
                                    <Input id="modelo" type="text" value={modelo} onChange={(e) => {setModelo(e.target.value), atualizarDadosPdv("modelo", e.target.value)}} placeholder="HP ProDesk 400 G4 DM" required></Input>
                                </div>

                                <div className="flex flex-col space-y-1.5 lg:w-48">
                                    <Label htmlFor="tag" className="mb-2">Service Tag</Label>
                                    <Input id="tag" type="text" value={tag} onChange={(e) => {setTag(e.target.value), atualizarDadosPdv("tag", e.target.value)}} placeholder="ABC1234" required></Input>
                                </div>

                                <div className="flex flex-col space-y-1.5 lg:w-42">
                                    <Label htmlFor="frequencia" className="mb-2">Frequência da Memória</Label>
                                    <Select value={frequencia} onValueChange={ (e) => {setFrequencia(e), atualizarDadosPdv("frequencia", e)} } required>
                                        <SelectTrigger id="frequencia">
                                        <SelectValue placeholder="Selecione a frequência" />
                                        </SelectTrigger>
                                        <SelectContent position="popper">
                                            <SelectItem value="2400 Mhz" >2400 Mhz</SelectItem>
                                            <SelectItem value="2666 Mhz" >2666 Mhz</SelectItem>
                                            <SelectItem value="2667 Mhz" >2667 Mhz</SelectItem>
                                            <SelectItem value="3200 Mhz" >3200 Mhz</SelectItem>
                                        </SelectContent>
                                    </Select>                     
                                </div>

                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end mt-4">
                            <Button type="submit" className="cursor-pointer">
                                { loader ? <MoonLoader color="white" size={17} /> : <span>Criar PDV</span> }
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </form>
        </>
    );
}