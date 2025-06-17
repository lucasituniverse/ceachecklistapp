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
import lanterna from "../assets/lantern.png";
import { Separator } from "@/components/ui/separator"
import type Loja from "@/model/Loja"
import { atualizar, buscar, uploadBucketS3 } from "@/service/service"
import type Pdv from "@/model/Pdv"
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { useRef } from "react";
import { useNavigate } from "react-router-dom"

export default function FormPdv() {
    
    const [loader, setLoader] = useState<Boolean>(false);
    const navigate = useNavigate();
    
    const dataAtual: string = new Date().toLocaleString(navigator.language, {
    weekday: 'long',
    month: 'long',   
    day: '2-digit',  
    year: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: true     
    });

    const [uf, setUf] = useState<string>("");
    const [listaLoja, setListaLoja] = useState<Loja[]>([])
    useEffect(() => { if (uf !== "") buscarLojasPeloUf(uf), setLojaSelecionada("") }, [uf]);
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

    const [loja, setLoja] = useState<Loja>({} as Loja);
    const [lojaSelecionada, setLojaSelecionada] = useState<string>("");
    useEffect(() => { if (lojaSelecionada !== "") buscarLoja(lojaSelecionada) }, [lojaSelecionada]);
    async function buscarLoja(loja: string){
        try{
            await buscar(`/loja/${loja}`, setLoja);
        }
        catch(erro: any){
            toast("Erro ao buscar Loja", { description: `${erro}`,
                style: { color: "#FF6347",
                },
            });
        }

    }

    const [listaPdvs, setListaPdvs] = useState<Pdv[]>([]);
    useEffect(() => { if (lojaSelecionada !== "") buscarPdvPorLoja(lojaSelecionada)}, [lojaSelecionada]);
    async function buscarPdvPorLoja(loja: string){
        try{
            await buscar(`/pdv/loja/${loja}`, setListaPdvs);
        }
        catch(erro: any){
            toast("Erro ao buscar PDVs", { description: `${erro}`,
                style: { color: "#FF6347",
                },
            });
        }
    }

    const [idPdv, setIdPdv] = useState<string>("");
    const [pdv, setPdv] = useState<Pdv>({} as Pdv);
    useEffect(() => { if (idPdv !== "") buscarPdvPorId(idPdv) }, [idPdv]);
    async function buscarPdvPorId(id: string){
        try{
            await buscar(`/pdv/${id}`, setPdv);
        }
        catch(erro: any){
            toast("", { description: `Erro: ${erro}` });
            toast("Erro ao buscar PDVs", { description: `${erro}`,
                style: { color: "#FF6347",
                },
            });
        }
    }

    const [pdvExiste, setPdvExiste] = useState<string>("");
    useEffect(() => { if(pdvExiste) atualizarDadosPdv("existe", pdvExiste)}, [pdvExiste]);

    const [data, setData] = useState<Date>();
    useEffect(() => {if(data) atualizarDadosPdv("dataTroca", data.toISOString())}, [data])

    const [tecnico, setTecnico] = useState<string>("");
    useEffect(() => {if(tecnico) atualizarDadosPdv("tecnico", tecnico)}, [tecnico])

    const inputAntesRef = useRef<HTMLInputElement>(null);
    const inputDepoisRef = useRef<HTMLInputElement>(null);
    const [antes, setAntes] = useState<File[]>([]);
    const [depois, setDepois] = useState<File[]>([]);

    const [status, setStatus] = useState<string>("")
    useEffect(() => {if(status) atualizarDadosPdv("status", status)}, [status])

    const [intercorrencia, setIntercorrencia] = useState<string>("")
    useEffect(() => {if(intercorrencia) atualizarDadosPdv("intercorrencia", intercorrencia)}, [intercorrencia]);

    function atualizarDadosPdv(atributo: string, valor: string){
        setPdv({
            ...pdv,
            [atributo]: valor
        });
    }

    async function atualizarPdv(e: FormEvent<HTMLFormElement>){

        e.preventDefault();
        setLoader(true);

        const imagensAntes = await uploadBucketS3(antes);
        const imagensDepois = await uploadBucketS3(depois);

        const pdvFinal: Pdv = {
            ...pdv,
            antes: imagensAntes,
            depois: imagensDepois
        };

        try{
            await atualizar(`/pdv`, pdv);
            toast("Formulário enviado com sucesso", { description: dataAtual,
                style: { color: "#2E8B57",
                },
            });
        }
        catch(erro: any){
            toast("Erro ao enviar o formulário", { description: `Erro: ${erro}` });
        }

        setLoader(false);
        limparFormulario();
    }

    function limparFormulario() {
        setUf("");
        setLojaSelecionada("");
        setListaLoja([]);
        setIdPdv("");
        setPdv({} as Pdv);
        setPdvExiste("");
        setData(undefined);
        setTecnico("");
        setAntes([]);
        setDepois([]);
        setStatus("");
        setIntercorrencia("");

        if (inputAntesRef.current) inputAntesRef.current.value = "";
        if (inputDepoisRef.current) inputDepoisRef.current.value = "";
    }

    function redirecionar(url: string){
        limparFormulario();
        navigate(`${url}`)
    }

    return (
        <>
            <form onSubmit={e => atualizarPdv(e)}>
                <div className="h-vh flex justify-center items-center">
                    <Card className="w-screen mx-6 lg:mx-60 xl:mx-90 my-16">
                        <CardHeader>
                            <div className="flex justify-center">
                                <img className="my-5 w-50" src={itbackground} alt="Imagem da IT Universe"/>
                            </div>
                            <div className="flex justify-between">
                                <div>
                                    <CardTitle>Checklist PDVs</CardTitle>
                                    <CardDescription>Checklist de projetos da IT Universe feito para C&A</CardDescription>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-2">
                                <Button variant="secondary" className="cursor-pointer" onClick={() => redirecionar("/createpdv")}>Criar PDV</Button>
                                <Button variant="secondary" className="cursor-pointer" onClick={() => redirecionar("/srv")}>Checklist SRV</Button>
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
                                    <Label htmlFor="pdv">PDVs {lojaSelecionada ? ` - Qtd: ${loja.quantidadePdvs}` : ""}</Label>
                                    <Select value={idPdv} onValueChange={e => setIdPdv(e)} required>
                                        <SelectTrigger id="pdv">
                                        <SelectValue placeholder="Selecione o PDV" />
                                        </SelectTrigger>
                                        <SelectContent position="popper">
                                            {listaPdvs.map((pdv) => (
                                                <SelectItem value={pdv.id} key={pdv.id}>{pdv.id} {pdv.status}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="existe">O PDV selecionado existe ?</Label>
                                    <Select value={pdvExiste} onValueChange={e => setPdvExiste(e)} required>
                                        <SelectTrigger id="existe">
                                        <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent position="popper">
                                            <SelectItem value="true">Sim</SelectItem>
                                            <SelectItem value="false">Não</SelectItem>
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
                                            <SelectItem value="Rafael Bastos">Adriano Rocha</SelectItem>
                                            <SelectItem value="Caleb Uchoa">Caleb Uchoa</SelectItem>
                                            <SelectItem value="David Santos">David Santos</SelectItem>
                                            <SelectItem value="Rafael Bastos">Enilson Melo</SelectItem>
                                            <SelectItem value="Rafael Bastos">Guilherme Assunção</SelectItem>
                                            <SelectItem value="Jessie Rafael">Jessie Rafael</SelectItem>
                                            <SelectItem value="Rafael Bastos">Rafael Bastos</SelectItem>
                                            <SelectItem value="troubleshoot">Troubleshoot</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <span>{
                                    pdvExiste ? 
                                        <div className="flex flex-col gap-1">
                                            <div className="flex p-0">
                                                <Label htmlFor="observacao">Observação </Label>
                                                <img src={lanterna} alt="" className="w-4"/>
                                            </div>
                                            <p id="observacao" className="text-sm">{pdv.observacao}</p> 
                                        </div>
                                    : 
                                    <p></p>}
                                </span>

                                <div className="flex flex-col space-y-1.5 lg:w-1/2">
                                    <Label htmlFor="antes">PDV Antes *Até 3 imagens</Label>
                                    <Input id="antes" type="file" accept="image/*" multiple ref={inputAntesRef}
                                        onChange={(e) => {
                                            const arquivosSelecionados = Array.from(e.target.files || []);
                                            setAntes((prev) => [...prev, ...arquivosSelecionados].slice(0, 3));
                                        }}/>
                                </div>
                                <div className="flex flex-col space-y-1.5 lg:w-1/2">
                                    <Label htmlFor="depois">PDV Depois *Até 3 imagens</Label>
                                    <Input id="depois" type="file" accept="image/*" multiple ref={inputDepoisRef}
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
                                    <Textarea placeholder="Descreva brevemente o ocorrido, se necessário." value={intercorrencia} onChange={e => setIntercorrencia(e.target.value)} />
                                </div>

                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end mt-4">
                            <Button type="submit" className="cursor-pointer">
                            { loader ? <MoonLoader color="white" size={17} /> : <span>Enviar</span> }</Button>
                        </CardFooter>
                    </Card>
                </div>
            </form>
        </>
    )
}