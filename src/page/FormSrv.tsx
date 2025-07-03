import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select"
import {Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle} from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { CalendarIcon } from "lucide-react"
import { useEffect, useState, type FormEvent } from "react";
import { cn } from "@/lib/utils"
import { MoonLoader } from "react-spinners";
import itbackground from "../assets/itbackground.png";
import { Separator } from "@/components/ui/separator"
import type Loja from "@/model/Loja"
import { atualizar, buscar, uploadBucketS3 } from "@/service/service"
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { useRef } from "react";
import type Srv from "@/model/Srv"
import { Link, useNavigate } from "react-router-dom"

export default function FormSrv(){

    const [loader, setLoader] = useState<boolean>(false);
    const navigate = useNavigate();
    
    const [uf, setUf] = useState<string>("");
    const [listaLoja, setListaLoja] = useState<Loja[]>([]);
    useEffect(() =>{ if(uf) buscarLojasPeloUf(uf)}, [uf]);
    async function buscarLojasPeloUf(uf: string){
        try{
            await buscar(`/loja/uf/${uf}`, setListaLoja);
        }
        catch(erro: any){
            const mensagemErro = erro.response?.data?.message || erro.message;
            toast("Erro ao buscar lojas", { description: `${mensagemErro}`,
                style: { color: "#FF6347",
                },
            });
        }
    }

    const [lojaSelecionada, setLojaSelecionada] = useState<string>("")
    const [srvSelecionado, setSrvSelecionado] = useState<string>("");
    const [srv, setSrv] = useState<Srv>({} as Srv);
    useEffect(() => { if(lojaSelecionada) buscarSrvPorLoja(lojaSelecionada)},[lojaSelecionada]);
    async function buscarSrvPorLoja(idLoja: string){
        try{
            await buscar(`/srv/loja/${idLoja}`, setSrv);
        }
        catch(erro: any){
            const mensagemErro = erro.response?.data?.message || erro.message;
            toast("Erro ao buscar SRVs", { description: `${mensagemErro}`,
                style: { color: "#FF6347",
                },
            });
        }
    }

    const [data, setData] = useState<Date>();
    useEffect(() => {if(data) atualizarDadosSrv("dataTroca", data.toISOString().split("T")[0])}, [data])

    const [tecnico, setTecnico] = useState<string>("");
    useEffect(() => {if(tecnico) atualizarDadosSrv("tecnico", tecnico)},[tecnico])

    const inputAntesRef = useRef<HTMLInputElement>(null);
    const inputDepoisRef = useRef<HTMLInputElement>(null);
    const [antes, setAntes] = useState<File[]>([]);
    const [depois, setDepois] = useState<File[]>([]);

    const [status, setStatus] = useState<string>(""); 
    useEffect(() => { if(status) atualizarDadosSrv("status", status)}, [status])

    const [intercorrencia, setIntercorrencia] = useState<string>("");
    useEffect(() => { if(intercorrencia) atualizarDadosSrv("intercorrencia", intercorrencia)}, [intercorrencia]);

    function atualizarDadosSrv(atributo: string, valor: string){
        setSrv({
            ...srv,
            [atributo]: valor
        });
    }

    async function atualizarSrv(e: FormEvent<HTMLFormElement>){
        e.preventDefault();
        setLoader(true);

        const imagensAntes = await uploadBucketS3(antes);
        const imagensDepois = await uploadBucketS3(depois);

        const srvFinal: Srv = {
            ...srv,
            antes: imagensAntes,
            depois: imagensDepois
        }

        try{
            await atualizar(`/srv`, srvFinal);
            toast("Formulário enviado com sucesso", { description: new Date().toLocaleString(navigator.language, {
                    weekday: 'long', month: 'long', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true 
                }),
                style: { color: "#2E8B57",
                },
            });
        }
        catch(erro: any){
            const mensagemErro = erro.response?.data?.message || erro.message;
            toast("Erro ao enviar o formulário", { description: `Erro: ${mensagemErro}` });
        }

        setLoader(false);
        limparFormulario();

    }

    function limparFormulario() {
        setUf("");
        setLojaSelecionada("");
        setListaLoja([]);
        setSrv({} as Srv);
        setSrvSelecionado("");
        setData(undefined);
        setTecnico("");
        setAntes([]);
        setDepois([]);
        setStatus("");
        setIntercorrencia("");

        if (inputAntesRef.current) inputAntesRef.current.value = "";
        if (inputDepoisRef.current) inputDepoisRef.current.value = "";
    }

    function redirecionar(){
        limparFormulario();
        navigate("/pdv")
    }

    return(
        <>
            <form onSubmit={(e) => atualizarSrv(e)}>
                <div className="h-vh flex justify-center items-center">
                    <Card className="w-screen mx-6 lg:mx-60 xl:mx-90 my-16">
                        <CardHeader>
                            <div className="flex justify-center">
                                <img className="my-5 w-50" src={itbackground} alt="Imagem da IT Universe"/>
                            </div>
                            <div className="flex justify-between">
                                <div>
                                    <CardTitle>Checklist SRVs</CardTitle>
                                    <CardDescription>Checklist de projetos da IT Universe feito para C&A</CardDescription>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-2">
                                <Button variant="secondary" className="cursor-pointer" onClick={redirecionar}>Checklist PDV</Button>
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

                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="srv" className="mb-2">SRV { srvSelecionado ? ` - ${srv.modelo}` : "" }</Label>
                                    <Select value={srvSelecionado} onValueChange={setSrvSelecionado} required>
                                        <SelectTrigger id="srv">
                                        <SelectValue placeholder="Selecione o SRV" />
                                        </SelectTrigger>
                                        <SelectContent position="popper">
                                            <SelectItem value={srv.id} key={srv.id}>{srv.id}</SelectItem>
                                        </SelectContent>
                                    </Select>                                                                
                                </div>

                                <Separator className="my-4"/>

                                <div className="flex flex-col space-y-1.5">
                                    <Label>Data da troca</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant={"outline"}
                                                className={cn(
                                                    "w-[150px] justify-start text-left font-normal",
                                                    !data && "text-muted-foreground"
                                                )}>
                                            <CalendarIcon />
                                                {data ? format(data, "dd/MM/yyyy") : <span>Data da visita</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar mode="single" locale={ptBR} selected={data} onSelect={setData} required/>
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="tecnico">Técnico</Label>
                                    <Select value={tecnico} onValueChange={e => setTecnico(e)} required>
                                        <SelectTrigger id="tecnico">
                                        <SelectValue placeholder="Selecione o técnico" />
                                        </SelectTrigger>
                                        <SelectContent position="popper">
                                            <SelectItem value="Adriano Rocha">Adriano Rocha</SelectItem>
                                            <SelectItem value="Caleb Uchoa">Caleb Uchoa</SelectItem>
                                            <SelectItem value="David Santos">David Santos</SelectItem>
                                            <SelectItem value="Enilson Melo">Enilson Melo</SelectItem>
                                            <SelectItem value="Guilherme Assuncao">Guilherme Assunção</SelectItem>
                                            <SelectItem value="Jessie Rafael">Jessie Rafael</SelectItem>
                                            <SelectItem value="Rafael Bastos">Rafael Bastos</SelectItem>
                                            <SelectItem value="Autonomo">Autônomo</SelectItem>
                                            <SelectItem value="Troubleshoot">Troubleshoot</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex flex-col space-y-1.5 lg:w-1/2">
                                    <Label htmlFor="antes">SRV Antes *Até 3 imagens</Label>
                                    <Input id="antes" type="file" accept="image/*" multiple required ref={inputAntesRef}
                                        onChange={(e) => {
                                            const arquivosSelecionados = Array.from(e.target.files || []);
                                            setAntes((prev) => [...prev, ...arquivosSelecionados].slice(0, 3));
                                        }}/>
                                </div>
                                <div className="flex flex-col space-y-1.5 lg:w-1/2">
                                    <Label htmlFor="depois">SRV Depois *Até 3 imagens</Label>
                                    <Input id="antes" type="file" accept="image/*" multiple required ref={inputDepoisRef}
                                        onChange={(e) => {
                                            const arquivosSelecionados = Array.from(e.target.files || []);
                                            setDepois((prev) => [...prev, ...arquivosSelecionados].slice(0, 3));
                                        }}
                                    />
                                </div>

                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="status">Status</Label>
                                        <Select value={status} onValueChange={e => setStatus(e)} required>
                                            <SelectTrigger id="status">
                                            <SelectValue placeholder="Selecione o status" />
                                            </SelectTrigger>
                                            <SelectContent position="popper">
                                                <SelectItem value="Realizado">Realizado</SelectItem>
                                                <SelectItem value="Não realizado">Não realizado</SelectItem>
                                            </SelectContent>
                                        </Select>
                                </div>
                                
                                <div className="flex flex-col space-y-1.5 lg:w-1/2 max-h-40">
                                    <Label htmlFor="intercorrencia">Intercorrências</Label>
                                    <Textarea placeholder="Descreva brevemente o ocorrido, se necessário." value={intercorrencia} onChange={e => setIntercorrencia(e.target.value)} required />
                                </div>

                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end mt-4">
                            <Button type="submit" className="cursor-pointer">
                                { loader ? <MoonLoader color="white" size={17} /> : <span>Enviar</span> }
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </form>
        </>
    );
}