
import axios from 'axios';

const baseURL = import.meta.env.VITE_APP_URI ; // Asegúrate de que esta URL sea correcta para tu API

const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        // Si el error es 401 (No autorizado) y no es un reintento
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');

            if (refreshToken) {
                try {
                    //const refreshResponse = await axios.post('/token/refresh/', { refresh: refreshToken }); // Ajusta la URL del endpoint de refresco
                    const refreshResponse = await axios.post(baseURL +'/usuarios/token/refresh/', { refresh: refreshToken });

                    if (refreshResponse.status === 200) {
                        console.log('Token de acceso renovado:', refreshResponse.data.access);
                        const newAccessToken = refreshResponse.data.access;
                        localStorage.setItem('accessToken', newAccessToken);
                        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                        return axiosInstance(originalRequest); // Reintenta la petición original con el nuevo token
                    } else {
                        // Si el refresh falla (el refresh token también puede haber expirado)
                        console.log('El refresh token ha expirado, redirigiendo al login');
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('refreshToken');
                        // Redirige a la página de inicio de sesión (ajusta la ruta según tu aplicación)
                        //window.location.href = '/';
                    }
                } catch (error) {
                    console.error('Error al refrescar el token:', error);
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    // Redirige a la página de inicio de sesión (ajusta la ruta según tu aplicación)
                    //window.location.href = '/';
                }
            } else {
                // No hay refresh token, redirigir al login
                console.log('No hay refresh token, redirigiendo al login');
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
