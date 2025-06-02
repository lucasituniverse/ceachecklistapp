import Formulario from "./page/pdv";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./page/Home";
import { Toaster } from "sonner";

export default function App() {

    return (
        <>
            <Toaster />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={ <Formulario /> }/>
                    <Route path="/home" element={ <Home /> }/>
                </Routes>
            </BrowserRouter>
        </>
    )

}
