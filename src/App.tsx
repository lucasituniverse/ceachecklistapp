import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "sonner";
import FormPdv from "./page/FormPdv";
import FormSrv from "./page/FormSrv";
import FormCreatePdv from "./page/FormCreatePdv";

export default function App() {

    return (
        <>
            <Toaster />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={ <FormPdv /> }/>
                    <Route path="/pdv" element={ <FormPdv /> }/>
                    <Route path="/srv" element={ <FormSrv /> }/>
                    <Route path="/createpdv" element={ <FormCreatePdv /> }/>
                </Routes>
            </BrowserRouter>
        </>
    )

}
