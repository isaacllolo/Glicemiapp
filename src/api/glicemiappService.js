import axiosInstance from "./axiosConfig";


export const CambiarTipo = async (tipo) => {
    try {
        const response = await axiosInstance.put(`${import.meta.env.VITE_APP_URI}/cambiarTipo`, { tipo });
        return response.data;
    } catch (error) {
        console.error('Error al cambiar tipo:', error);
        throw error;
    }
}

export const ObtenerPacientes = async () => {
    try {
        const response = await axiosInstance.get(`${import.meta.env.VITE_APP_URI}/pacientes`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener pacientes:', error);
        throw error;
    }
}
export const ObtenerPaciente = async (cedula) => {
    try {
        const response = await axiosInstance.get(`${import.meta.env.VITE_APP_URI}/paciente/${cedula}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener paciente:', error);
        throw error;
    }
}
export const RegistrarPaciente = async (paciente) => {
    try {
        const response = await axiosInstance.post(`${import.meta.env.VITE_APP_URI}/pacientes`, paciente);
        return response.data;
    } catch (error) {
        console.error('Error al registrar paciente:', error);
        throw error;
    }

}
export const EditarPaciente = async (id, paciente) => {
    try {
        const response = await axiosInstance.put(`${import.meta.env.VITE_APP_URI}/pacientes/${id}`, paciente);
        return response.data;
    } catch (error) {
        console.error('Error al editar paciente:', error);
        throw error;
    }
}
export const EliminarPaciente = async (id) => {
    try {
        const response = await axiosInstance.delete(`${import.meta.env.VITE_APP_URI}/pacientes/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar paciente:', error);
        throw error;
    }
}
export const ObtenerMedicamentos = async (cedula) => {
    try {
        const response = await axiosInstance.get(`${import.meta.env.VITE_APP_URI}/medicamentos/${cedula}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener medicamentos:', error);
        throw error;
    }
}
export const EliminarMedicamento = async (id) => {
    try {
        const response = await axiosInstance.delete(`${import.meta.env.VITE_APP_URI}/medicamentos/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar medicamento:', error);
        throw error;
    }
}
export const AgregarMedicamento = async (medicamento) => {
    try {
        const response = await axiosInstance.post(`${import.meta.env.VITE_APP_URI}/medicamentos`, medicamento);
        return response.data;
    } catch (error) {
        console.error('Error al agregar medicamento:', error);
        throw error;
    }
}
export const ActualizarMedicamento = async (id, medicamento) => {
    try {
        const response = await axiosInstance.put(`${import.meta.env.VITE_APP_URI}/medicamentos/${id}`, medicamento);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar medicamento:', error);
        throw error;
    }
}
export const ActualizarCheck = async (hora, id, check) => {
    try {
        const response = await axiosInstance.put(`${import.meta.env.VITE_APP_URI}/medicamentos/${id}`, { hora, check });
        return response.data;
    } catch (error) {
        console.error('Error al actualizar check:', error);
        throw error;
    }
}
export const ObtenerDiario = async() => { 
    try {
        const response = await axiosInstance.get(`${import.meta.env.VITE_APP_URI}/diario`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener diario:', error);
        throw error;
    }
}

export const GuardarDiario = async (cedula, datos) => {
    try {
        const response = await axiosInstance.post(`${import.meta.env.VITE_APP_URI}/diario`, { cedula, datos });
        return response.data;
    } catch (error) {
        console.error('Error al guardar diario:', error);
        throw error;
    }
}
export const LoginService = async (email, password) => {
    try {
        const response = await axiosInstance.post(`${import.meta.env.VITE_APP_URI}/login`, { email, password });
        return response.data;
    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        throw error;
    }
}
export const RecuperarContraseña = async (email) => {
    try {
        const response = await axiosInstance.post(`${import.meta.env.VITE_APP_URI}/recuperar`, { email });
        return response.data;
    } catch (error) {
        console.error('Error al recuperar contraseña:', error);
        throw error;
    }
}
export const Registro = async (user) => {
    try {
        const response = await axiosInstance.post(`${import.meta.env.VITE_APP_URI}/registro`, user);
        return response.data;
    } catch (error) {
        console.error('Error en el registro:', error);
        throw error;
    }
}

export const LogOut = async () => {
    try {
        const response = await axiosInstance.get(`${import.meta.env.VITE_APP_URI}/logout`);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return response.data;
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        throw error;
    }
}