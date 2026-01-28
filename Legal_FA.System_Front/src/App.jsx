import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing/Landing'
import Login from './pages/Login/Login'
import Cadastro from './pages/Cadastro/Cadastro'
import Home from './pages/Home/Home'
import MeusContratos from './pages/Contratos/MeusContratos'
import NovoContrato from './pages/Contratos/NovoContrato'

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
      </Routes>
    </BrowserRouter>
  )
}

export default App