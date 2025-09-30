import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, FlatList, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as Camera from 'expo-camera';
import * as FileSystem from 'expo-file-system';

const Stack = createNativeStackNavigator();

function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    const demoUsers = {
      'admin': { id: 1, name: 'Administrador SISCIAC', role: 'admin', password: 'admin123' },
      'juan.perez': { id: 2, name: 'Juan Pérez', role: 'producer', password: 'password123' }
    };
    const found = demoUsers[username];
    if (found && found.password === password) {
      const { password: _, ...user } = found;
      await AsyncStorage.setItem('sisciac_user', JSON.stringify(user));
      navigation.replace('Dashboard');
    } else {
      setError('Credenciales inválidas. Usa admin/admin123 o juan.perez/password123');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SISCIAC Móvil</Text>
      <TextInput placeholder="Usuario" style={styles.input} value={username} onChangeText={setUsername} />
      <TextInput placeholder="Contraseña" secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />
      {!!error && <Text style={styles.error}>{error}</Text>}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>
    </View>
  );
}

function DashboardScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [coords, setCoords] = useState(null);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('sisciac_user');
      if (saved) setUser(JSON.parse(saved));
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setCoords({ lat: loc.coords.latitude, lng: loc.coords.longitude });
      }
      const savedPhotos = await AsyncStorage.getItem('sisciac_photos');
      if (savedPhotos) setPhotos(JSON.parse(savedPhotos));
    })();
  }, []);

  const takePhoto = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== 'granted') return;
    // Simple capture via Camera API is more involved; simulate by saving a placeholder
    const placeholderUri = 'https://via.placeholder.com/300x200.png?text=SISCIAC';
    const name = `photo_${Date.now()}.png`;
    const filePath = `${FileSystem.documentDirectory}${name}`;
    const downloaded = await FileSystem.downloadAsync(placeholderUri, filePath);
    const newPhotos = [{ uri: downloaded.uri, ts: Date.now(), coords }, ...photos];
    setPhotos(newPhotos);
    await AsyncStorage.setItem('sisciac_photos', JSON.stringify(newPhotos));
  };

  const logout = async () => {
    await AsyncStorage.removeItem('sisciac_user');
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hola, {user?.name}</Text>
      <Text style={styles.subtitle}>Rol: {user?.role}</Text>
      <Text style={styles.subtitle}>Ubicación: {coords ? `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}` : 'Obteniendo...'}</Text>
      <View style={{ height: 12 }} />
      <TouchableOpacity style={styles.button} onPress={takePhoto}>
        <Text style={styles.buttonText}>Tomar Foto (simulada)</Text>
      </TouchableOpacity>
      <View style={{ height: 12 }} />
      <TouchableOpacity style={styles.secondary} onPress={logout}>
        <Text style={styles.secondaryText}>Cerrar Sesión</Text>
      </TouchableOpacity>
      <View style={{ height: 20 }} />
      <Text style={styles.sectionTitle}>Fotos Offline</Text>
      <FlatList
        data={photos}
        keyExtractor={(item) => String(item.ts)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.uri }} style={{ width: '100%', height: 120, borderRadius: 8 }} />
            <Text style={styles.caption}>{new Date(item.ts).toLocaleString()}</Text>
            {item.coords && <Text style={styles.caption}>({item.coords.lat.toFixed(5)}, {item.coords.lng.toFixed(5)})</Text>}
          </View>
        )}
      />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 80, backgroundColor: '#f8fafc' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 12 },
  subtitle: { fontSize: 14, color: '#374151' },
  input: { backgroundColor: '#fff', borderColor: '#e5e7eb', borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 8 },
  button: { backgroundColor: '#16a34a', padding: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  secondary: { padding: 12, borderRadius: 8, alignItems: 'center', borderColor: '#e5e7eb', borderWidth: 1 },
  secondaryText: { color: '#111827' },
  sectionTitle: { fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  card: { backgroundColor: '#fff', padding: 8, borderRadius: 8, marginBottom: 12, borderColor: '#e5e7eb', borderWidth: 1 },
  error: { color: '#dc2626', marginBottom: 8 }
}); 