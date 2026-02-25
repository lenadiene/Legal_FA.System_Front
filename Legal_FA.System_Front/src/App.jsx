import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing/Landing'
import Login from './pages/Login/Login'
import Cadastro from './pages/Cadastro/Cadastro'
import Home from './pages/Home/Home'
import MeusContratos from './pages/Contratos/MeusContratos'
import NovoContrato from './pages/Contratos/NovoContrato'
import VisualizarContrato from './pages/Contratos/VisualizarContrato'
import EditarContrato from './pages/Contratos/EditarContrato'
import ContratoPDF from './pages/Contratos/ContratoPDF' 
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/home" element={<Home />} />
        <Route path="/contratos" element={<MeusContratos />} />
        <Route path="/contratos/novo" element={<NovoContrato />} />
        <Route path="/contratos/:id" element={<VisualizarContrato />} />
        <Route path="/contratos/:id/editar" element={<EditarContrato />} />
        <Route path="/contratos/:id/pdf" element={<ContratoPDF />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App