import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';

export default function LoginScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();

            if (response.ok) {
                console.log('Token JWT:', data.token);

                // Verifica o role do usuário
                if (data.role === 'admin') {
                    // Navegar para a tela de usuários (admin)
                    navigation.navigate('UsersScreen', { token: data.token });
                } else {
                    // Navegar para a tela de gráficos (usuário comum)
                    navigation.navigate('GraphScreen', { token: data.token });
                }
            } else {
                setErrorMessage(data.message || 'Erro no login');
            }
        } catch (error) {
            setErrorMessage('Erro ao conectar-se ao servidor.');
        }
    };


    const handleRecSenha = () => {
        // Lógica para recuperação de senha
        navigation.navigate('RecSenha');
    };

    return (
        <View style={styles.container}>
            <Text>Usuário: adm</Text>
            <Text>Senha: 123</Text>
            <Text>Login</Text>
            {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
            <TextInput
                style={styles.input}
                placeholder="adm"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="123"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <Button title="Entrar" onPress={handleLogin} />
            <Button title="Registrar" onPress={() => navigation.navigate('RegisterScreen')} />
            <Button title="Recuperar Senha" onPress={handleRecSenha} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, gap: 8 },
    input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, paddingLeft: 10 },
    error: { color: 'red' },
});
