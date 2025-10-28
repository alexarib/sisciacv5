import axios from 'axios';

const API_BASE = '/api/locations';

class LocationService {
    // Obtener todas las ubicaciones con filtros
    async getLocations(filters = {}) {
        try {
            const params = new URLSearchParams();

            if (filters.search) params.append('search', filters.search);
            if (filters.type) params.append('type', filters.type);
            if (filters.status) params.append('status', filters.status);
            if (filters.producer_id) params.append('producer_id', filters.producer_id);
            if (filters.crop_id) params.append('crop_id', filters.crop_id);
            if (filters.latitude && filters.longitude && filters.radius) {
                params.append('latitude', filters.latitude);
                params.append('longitude', filters.longitude);
                params.append('radius', filters.radius);
            }
            if (filters.bounds) {
                params.append('bounds', JSON.stringify(filters.bounds));
            }
            if (filters.page) params.append('page', filters.page);

            const response = await axios.get(`${API_BASE}?${params.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching locations:', error);
            throw error;
        }
    }

    // Obtener ubicación por ID
    async getLocation(id) {
        try {
            const response = await axios.get(`${API_BASE}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching location:', error);
            throw error;
        }
    }

    // Crear nueva ubicación
    async createLocation(locationData) {
        try {
            const response = await axios.post(API_BASE, locationData);
            return response.data;
        } catch (error) {
            console.error('Error creating location:', error);
            throw error;
        }
    }

    // Actualizar ubicación
    async updateLocation(id, locationData) {
        try {
            const response = await axios.put(`${API_BASE}/${id}`, locationData);
            return response.data;
        } catch (error) {
            console.error('Error updating location:', error);
            throw error;
        }
    }

    // Eliminar ubicación
    async deleteLocation(id) {
        try {
            const response = await axios.delete(`${API_BASE}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting location:', error);
            throw error;
        }
    }

    // Obtener estadísticas
    async getStats() {
        try {
            const response = await axios.get(`${API_BASE}/stats`);
            return response.data;
        } catch (error) {
            console.error('Error fetching stats:', error);
            throw error;
        }
    }

    // Obtener datos GeoJSON
    async getGeoJSON(filters = {}) {
        try {
            const params = new URLSearchParams();

            if (filters.type) params.append('type', filters.type);
            if (filters.producer_id) params.append('producer_id', filters.producer_id);
            if (filters.status) params.append('status', filters.status);

            const response = await axios.get(`${API_BASE}/geojson?${params.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching GeoJSON:', error);
            throw error;
        }
    }

    // Buscar ubicaciones cercanas
    async getNearby(latitude, longitude, radius = 10) {
        try {
            const response = await axios.post(`${API_BASE}/nearby`, {
                latitude,
                longitude,
                radius
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching nearby locations:', error);
            throw error;
        }
    }

    // Obtener ubicaciones por productor
    async getByProducer(producerId) {
        try {
            const response = await axios.get(`${API_BASE}/by-producer/${producerId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching locations by producer:', error);
            throw error;
        }
    }

    // Obtener ubicaciones por tipo
    async getByType(type) {
        try {
            const response = await axios.get(`${API_BASE}/by-type/${type}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching locations by type:', error);
            throw error;
        }
    }

    // Obtener estadísticas de área
    async getAreaStats() {
        try {
            const response = await axios.get(`${API_BASE}/area-stats`);
            return response.data;
        } catch (error) {
            console.error('Error fetching area stats:', error);
            throw error;
        }
    }

    // Obtener datos de clustering para mapas
    async getClustering(bounds, gridSize = 0.01) {
        try {
            const response = await axios.post(`${API_BASE}/clustering`, {
                bounds,
                grid_size: gridSize
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching clustering data:', error);
            throw error;
        }
    }

    // Crear ubicación rápida (desde coordenadas del mapa)
    async createQuickLocation(coordinates, type = 'marker') {
        const locationData = {
            name: `Ubicación ${new Date().toLocaleString()}`,
            description: 'Ubicación creada desde el mapa',
            type: type === 'marker' ? 'field' : type,
            latitude: coordinates.lat,
            longitude: coordinates.lng,
            status: 'active'
        };

        return this.createLocation(locationData);
    }

    // Validar coordenadas
    validateCoordinates(latitude, longitude) {
        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);

        if (isNaN(lat) || isNaN(lng)) {
            return { valid: false, error: 'Las coordenadas deben ser números válidos' };
        }

        if (lat < -90 || lat > 90) {
            return { valid: false, error: 'La latitud debe estar entre -90 y 90' };
        }

        if (lng < -180 || lng > 180) {
            return { valid: false, error: 'La longitud debe estar entre -180 y 180' };
        }

        return { valid: true };
    }

    // Calcular distancia entre dos puntos
    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // Radio de la Tierra en kilómetros
        const dLat = this.deg2rad(lat2 - lat1);
        const dLng = this.deg2rad(lng2 - lng1);
        const a =
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    deg2rad(deg) {
        return deg * (Math.PI/180);
    }
}

export default new LocationService();
