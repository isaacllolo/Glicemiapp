import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/js/src/modal';

import Home from './components/home';
import Paciente from './components/Paciente';
import Medicamento from './components/medicamento';
import Diario from './components/diario';
import Login from './components/Login';
import P_reg from './components/P_reg';
import RecuperarContraseña from './components/recuperarContraseña';
import RestablecerContraseña from './components/restablecerContraseña';
import Reg from './components/Reg';
import NavBar from './components/Navbar';
import Retype from './components/Retype';
import P_edit from './components/P_edit';
import ProtectedRoute from './components/ProtectedRoute'; // 👉 Asegúrate de importar esto

import './styles/App.scss';
import swDEV from './swDEV';
import { Outlet } from 'react-router-dom';

const NavLayout = () => (
  <>
    <NavBar />
    <Outlet /> 
  </>
);

function App() {
  useEffect(() => {
    swDEV();
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>

          {/* Rutas protegidas */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <NavLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/p_reg" element={<P_reg />} />
            <Route path="/p_edit/:cedula" element={<P_edit />} />
            <Route path="/paciente/:cedula" element={<Paciente />} />
            <Route path="/medicamento/:cedula" element={<Medicamento />} />
            <Route path="/diario/:cedula" element={<Diario />} />
            <Route path="/Retype" element={<Retype />} />
          </Route>

          {/* Rutas públicas */}
          <Route path="/reg" element={<Reg />} />
          <Route path="/login" element={<Login />} />
          <Route path="/recuperar-contrasena" element={<RecuperarContraseña />} />
          <Route path="/restablecer-contrasena/:token" element={<RestablecerContraseña />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
