import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./page/Home";
import { Toaster } from "sonner";
import FormPdv from "./page/FormPdv";
import FormSrv from "./page/FormSrv";

export default function App() {

    return (
        <>
            <Toaster />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={ <FormSrv /> }/>
                    <Route path="/home" element={ <Home /> }/>
                    <Route path="/pdv" element={ <FormPdv /> }/>
                    <Route path="/srv" element={ <FormSrv /> }/>
                </Routes>
            </BrowserRouter>
        </>
    )

}
