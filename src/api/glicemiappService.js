import axiosInstance from "./axiosConfig";
import moment from 'moment';


export const CambiarTipo = async (tipo) => {
    try {
        const response = await axiosInstance.patch(`${import.meta.env.VITE_APP_URI}/usuarios/usuario/cambiar-tipo/`, { tipo });
        return response.data;
    } catch (error) {
        console.error('Error al cambiar tipo:', error.response?.data || error.message);
        throw error;
    }
}
export const ObtenerUsuario = async () => {
    try {
        const response = await axiosInstance.get(`${import.meta.env.VITE_APP_URI}/usuarios/usuario/`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener el usuario', error.response?.data || error.message);
        throw error;
    }
}
export const ObtenerPacientes = async () => {
    try {
        const response = await axiosInstance.get(`${import.meta.env.VITE_APP_URI}/pacientes/pacientes/mi-paciente/`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener pacientes:', error);
        throw error;
    }
}
export const ObtenerPaciente = async (cedula) => {
    try {
        const response = await axiosInstance.get(`${import.meta.env.VITE_APP_URI}/pacientes/pacientes/${cedula}/`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener paciente:', error);
        throw error;
    }
}
export const RegistrarPaciente = async (paciente) => {
    try {
        const response = await axiosInstance.post(`${import.meta.env.VITE_APP_URI}/pacientes/pacientes/`, paciente);
        return response.data;
    } catch (error) {
        console.error('Error al registrar paciente:', error);
        throw error;
    }

}
export const EditarPaciente = async (cedula, paciente) => {
    try {
        const response = await axiosInstance.put(`${import.meta.env.VITE_APP_URI}/pacientes/pacientes/${cedula}/`, paciente);
        return response.data;
    } catch (error) {
        console.error('Error al editar paciente:', error);
        throw error;
    }
}
export const EliminarPaciente = async (id) => {
    try {
        const response = await axiosInstance.delete(`${import.meta.env.VITE_APP_URI}/pacientes/pacientes/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar paciente:', error);
        throw error;
    }
}
export const Obtenermedicamento = async (cedula) => {
    try {
        const response = await axiosInstance.get(`${import.meta.env.VITE_APP_URI}/diario/medicamento/por-cedula/?cedula=${cedula}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener medicamento:', error);
        throw error;
    }
}

export const EliminarMedicamento = async (id) => {
    try {
        const response = await axiosInstance.delete(`${import.meta.env.VITE_APP_URI}/diario/medicamento/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar medicamento:', error);
        throw error;
    }
}
export const EliminarAplicacionMedicamento = async (id) => {
    try {
        const response = await axiosInstance.delete(`${import.meta.env.VITE_APP_URI}/diario/aplicacion_medicamento/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar medicamento:', error);
        throw error;
    }
}
export const AgregarMedicamento = async (medicamento) => {
    try {
        const response = await axiosInstance.post(`${import.meta.env.VITE_APP_URI}/diario/medicamento/`, medicamento);
        return response.data;
    } catch (error) {
        console.error('Error al agregar medicamento:', error.response?.data || error.message);
        throw error;
    }
};

export const AgregarAplicacion = async (aplicacion) => {
    try {
        const response = await axiosInstance.post(`${import.meta.env.VITE_APP_URI}/diario/aplicacionmedicamento/`, aplicacion);
        return response.data;
    } catch (error) {
        console.error('Error al agregar aplicación:', error.response?.data || error.message);
        throw error;
    }
};



export const ActualizarMedicamento = async (id, medicamento) => {
    try {
        const response = await axiosInstance.put(`${import.meta.env.VITE_APP_URI}/diario/medicamento/${id}`, medicamento);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar medicamento:', error);
        throw error;
    }
}
export const ActualizarCheck = async (id, hora, tomado) => {
    try {
        const response = await axiosInstance.patch(
            `${import.meta.env.VITE_APP_URI}/diario/aplicacion_medicamento/${id}/`,
            {
                hora,
                tomado,
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error al actualizar check:', error?.response?.data || error.message);
        throw error;
    }
};

export const ObtenerDiario = async(cedula) => { 
    try {
        const response = await axiosInstance.get(`${import.meta.env.VITE_APP_URI}/diario/registros_glucosa/por-cedula/?cedula=${cedula}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener diario:', error);
        throw error;
    }
}

export const GuardarDiario = async (cedula, datos) => {
    try {
        const payload = {
            cedula: cedula,
            glucosa: parseInt(datos.glucosa),  // aseguramos que es entero
            insulina: parseInt(datos.insulina),
            fecha: moment().format("YYYY-MM-DD"),
            hora: moment().format("HH:mm:ss"),
        };

        const response = await axiosInstance.post(
            `${import.meta.env.VITE_APP_URI}/diario/registros_glucosa/`,
            payload
        );
        return response.data;
    } catch (error) {
        console.error('Error al guardar diario:', error.response?.data || error);
        throw error;
    }
};

export const LoginService = async (email, password) => {
    try {
        const response = await axiosInstance.post(`${import.meta.env.VITE_APP_URI}/usuarios/login/`, { email, password });
        return response;
    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        throw error;
    }
}
export const RecuperarContraseña = async (email) => {
    try {
        const response = await axiosInstance.post(`${import.meta.env.VITE_APP_URI}/recuperar/`, { email });
        return response.data;
    } catch (error) {
        console.error('Error al recuperar contraseña:', error);
        throw error;
    }
}
export const Registro = async (user) => {
    try {
        const response = await axiosInstance.post(`${import.meta.env.VITE_APP_URI}/usuarios/registro/`, user);
        return response.data;
    } catch (error) {
        console.error('Error en el registro:', error);
        throw error;
    }
}

