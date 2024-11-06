// services/userService.js
import axios from 'axios';

// Función para obtener la lista de usuarios
export const getUsers = async () => {
    try {
        const response = await axios.get('http://localhost:8000/listUsers');
        return response.data; // Devuelve los datos obtenidos
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error; // Lanza el error para manejarlo en el componente
    }
};
