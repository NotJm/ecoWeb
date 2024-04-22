import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "./components/css/Globals.css";
// Mis componentes
import { Header } from "./components/Header";
import { Home } from "./components/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AcercaDe } from "./components/AcercaDe";
import { Login } from "./components/Login";
import { SignUp } from "./components/SignUp";
import { AuthProvider } from "./components/Auth";
import { Contactanos } from "./components/Contactanos";
import { UserManagementTable } from "./components/Usuarios";
import { ProductsManagementTable, AddProducto } from "./components/Products";
import { EmailForm } from "./components/EmailForm";
import { QuestionForm } from "./components/QuestionForm";
import { VerifyToken } from "./components/Token";
import { UpdatePassword } from "./components/UpdatePassword";
import { Footer } from "./components/Footer";
import { Catalogo, ProductDetailsPage } from "./components/Catalogo";
import { Empresa } from "./components/Empresa";
import { Methods } from "./components/MethodResetPassword";
import { Domicilio } from "./components/Domicilio";
import { AirQualityChart, DeviceHistory, DevicesTable, Dispositivo, HumidityChart, HumidityGraph, TemperatureChart, TemperatureGraph } from "./components/Dispositivo";
import { Preguntas } from "./components/Preguntas";
import { AddPreguntas, PreguntasFrecuentes, PreguntasFrecuentesTable } from "./components/PreguntasFrecuentes";



const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="bg-eggs-secondary">
          <Header />
          <div className="bg-eggs-secondary">
            <Routes>
              <Route path="/" element={<Home />} index />
              <Route path="/acercaDe" element={<AcercaDe />} />
              <Route path="/contactanos" element={<Contactanos />} />
              <Route path="/iniciar-sesion" element={<Login />} />
              <Route path="/registrate" element={<SignUp />} />
              <Route path="/usuarios" element={<UserManagementTable />} />
              <Route path="/productos" element={<ProductsManagementTable />} />
              <Route path="/catalogo" element={<Catalogo />} />
              <Route path="/verifyToken" element={<VerifyToken />} />
              <Route path="/updatePassword" element={<UpdatePassword />} />
              <Route path="/empresa" element={<Empresa />} />
              <Route path="/preguntas" element={<Preguntas />} />
              <Route path="/resetpassword" element={<Methods />} />
              <Route path="/emailform" element={<EmailForm />} />
              <Route path="/questionform" element={<QuestionForm />} />
              <Route path="/domicilio" element={<Domicilio />} />
              <Route path="/dispositivo" element={<Dispositivo />} />
              <Route path="/addProductos" element={<AddProducto />} />
              <Route path="/preguntas-frecuentes" element={<PreguntasFrecuentes/>}/>
              <Route path="/tablepreguntasfrecuentes" element={<PreguntasFrecuentesTable/>}/>
              <Route path="/addpreguntas" element={<AddPreguntas/>} />
              <Route path="/producto/:id" element={<ProductDetailsPage/>} />
              <Route path="/alldevice" element={<DevicesTable/>} />
              <Route path="/temp" element={<TemperatureChart/>}/>
              <Route path="/hum" element={<HumidityChart/>}/>
              <Route path="/mq" element={<AirQualityChart/>}/>
            </Routes>
          </div>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

