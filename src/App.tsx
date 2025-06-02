import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./page/Home";
import { Toaster } from "sonner";
import Pdv from "./page/pdv";
import Srv from "./page/srv";

export default function App() {

    return (
        <>
            <Toaster />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={ <Srv /> }/>
                    <Route path="/home" element={ <Home /> }/>
                    <Route path="/pdv" element={ <Pdv /> }/>
                    <Route path="/srv" element={ <Srv /> }/>
                </Routes>
            </BrowserRouter>
        </>
    )

}
