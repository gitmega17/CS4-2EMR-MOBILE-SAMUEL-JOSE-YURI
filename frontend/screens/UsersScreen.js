import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const UsersScreen = ({ route, navigation }) => {
    const [users, setUsers] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            const token = route.params.token; // Assume que o token é passado como parâmetro

            try {
                const response = await fetch('http://localhost:3000/usuarios', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Erro ao buscar usuários');
                }

                const data = await response.json();
                setUsers(data);
            } catch (error) {
                setErrorMessage(error.message);
            }
        };

        fetchUsers();
    }, [route.params.token]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Lista de Usuários</Text>
            {errorMessage ? (
                <Text style={styles.error}>{errorMessage}</Text>
            ) : (
                users.map(user => (
                    <View key={user.id} style={styles.user}>
                        <Text>ID: {user.id}</Text>
                        <Text>Usuário: {user.username}</Text>
                    </View>
                ))
            )}
            {/* Botão para navegar para a página GraphScreen */}
            <Button 
                title="Ir para Gráficos" 
                onPress={() => navigation.navigate('GraphScreen', { token: route.params.token })}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    user: { marginVertical: 10, padding: 10, borderWidth: 1, borderColor: 'gray' },
    error: { color: 'red' },
});

export default UsersScreen;
