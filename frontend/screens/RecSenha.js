import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';

export default function RecSenha() {
    const [username, setUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleRecSenha = async () => {
        try {
            const response = await fetch('http://localhost:3000/recover-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, newPassword }),
            });

            if (response.ok) {
                setMessage('Senha atualizada com sucesso!');
            } else {
                const data = await response.json();
                setMessage(data.message || 'Erro ao atualizar a senha.');
            }
        } catch (error) {
            setMessage('Erro ao conectar-se ao servidor.');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Usuário"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Nova Senha"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
            />
            <Button title="Atualizar Senha" onPress={handleRecSenha} />
            {message ? <Text style={styles.message}>{message}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, paddingLeft: 10 },
    message: { color: 'green', marginTop: 10 },
});
