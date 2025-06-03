import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "sonner";
import FormPdv from "./page/FormPdv";
import FormSrv from "./page/FormSrv";

export default function App() {

    return (
        <>
            <Toaster />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={ <FormPdv /> }/>
                    <Route path="/pdv" element={ <FormPdv /> }/>
                    <Route path="/srv" element={ <FormSrv /> }/>
                </Routes>
            </BrowserRouter>
        </>
    )

}
