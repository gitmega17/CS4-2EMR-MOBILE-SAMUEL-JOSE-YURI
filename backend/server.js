const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'fiap'; // Substitua por uma chave secreta mais segura em produção

app.use(express.json());
app.use(cors()); // Habilita o CORS para todas as origens

const db = new sqlite3.Database('banco-de-dados.db');

// Lógica para criar as tabelas se elas não existirem
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT DEFAULT 'user' 
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS dados_sensores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sensor_id INTEGER,
        temperatura REAL,
        umidade REAL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

// Middleware para verificar o token JWT
const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (token) {
        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Acesso negado' });
            }
            req.user = user;
            next();
        });
    } else {
        res.status(401).json({ message: 'Token não fornecido' });
    }
};

// Middleware para verificar as permissões do usuário
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const role = req.user.role;
        if (!allowedRoles.includes(role)) {
            return res.status(403).json({ message: 'Acesso negado: Você não tem permissão para acessar este recurso.' });
        }
        next();
    };
};

// Rota para cadastrar um novo usuário
app.post('/register', async (req, res) => {
    const { username, password, role } = req.body;
    try {
        // Verificar se o usuário já existe
        db.get('SELECT * FROM usuarios WHERE username = ?', [username], async (err, row) => {
            if (row) {
                return res.status(400).json({ message: 'Usuário já existe' });
            }

            // Criptografar a senha
            const hashedPassword = await bcrypt.hash(password, 10);

            // Inserir o novo usuário na tabela com role padrão como 'user'
            const userRole = role || 'user'; // Se não for fornecido, define como 'user'
            db.run('INSERT INTO usuarios (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, userRole], (err) => {
                if (err) {
                    console.error('Erro ao cadastrar usuário:', err.message);
                    return res.status(500).json({ message: 'Erro ao cadastrar usuário' });
                }
                res.status(201).json({ message: 'Usuário cadastrado com sucesso' });
            });
        });
    } catch (err) {
        console.error('Erro ao processar o cadastro:', err.message);
        res.status(500).json({ message: 'Erro ao processar o cadastro' });
    }
});

// Rota para login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT * FROM usuarios WHERE username = ?', [username], async (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao acessar o banco de dados' });
        }
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Usuário ou senha incorretos' });
        }
        const token = jwt.sign({ userId: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    });
});


// Rota para buscar todos os dados dos sensores (protegida por JWT e apenas para admin)
app.get('/dados-sensores', authenticateJWT, authorizeRoles('admin', 'user'), (req, res) => {
    const query = `SELECT * FROM dados_sensores`;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Erro ao buscar dados no banco de dados:', err.message);
            res.status(500).send('Erro ao buscar os dados.');
        } else {
            res.json(rows);
        }
    });
});

// Rota para salvar os dados dos sensores (apenas para admin)
app.post('/dados-sensores', authenticateJWT, authorizeRoles('admin', 'user'), (req, res) => {
    const { sensor_id, temperatura, umidade } = req.body;

    db.run(
        `INSERT INTO dados_sensores (sensor_id, temperatura, umidade) VALUES (?, ?, ?)`,
        [sensor_id, temperatura, umidade],
        (err) => {
            if (err) {
                console.error('Erro ao inserir dados no banco de dados:', err.message);
                return res.status(500).json({ message: 'Erro ao processar os dados.' });
            }
            console.log('Dados inseridos no banco de dados com sucesso.');
            res.json({ message: 'Dados recebidos e armazenados com sucesso.' });
        }
    );
});

// Rota para buscar todos os usuários (protegida por JWT)
app.get('/usuarios', authenticateJWT, (req, res) => {
    // Verifica se o usuário tem o papel de admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acesso negado. Somente administradores podem acessar esta rota.' });
    }

    const query = `SELECT * FROM usuarios`;
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Erro ao buscar dados no banco de dados:', err.message);
            res.status(500).send('Erro ao buscar os dados.');
        } else {
            res.json(rows);
        }
    });
});

// Rota para limpar todos os dados da tabela (apenas para admin)
app.delete('/limpar-dados', authenticateJWT, authorizeRoles('admin'), (req, res) => {
    const query = `DELETE FROM dados_sensores`;

    db.run(query, [], (err) => {
        if (err) {
            console.error('Erro ao limpar dados do banco de dados:', err.message);
            res.status(500).send('Erro ao limpar os dados.');
        } else {
            console.log('Dados da tabela limpos com sucesso.');
            res.send('Dados da tabela foram limpos com sucesso.');
        }
    });
});

// Rota para recuperação de senha
app.post('/recover-password', async (req, res) => {
    const { username, newPassword } = req.body;

    // Verificar se o usuário existe
    db.get('SELECT * FROM usuarios WHERE username = ?', [username], async (err, row) => {
        if (!row) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Criptografar a nova senha
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Atualizar a senha do usuário
        db.run('UPDATE usuarios SET password = ? WHERE username = ?', [hashedPassword, username], function(err) {
            if (err) {
                console.error('Erro ao atualizar a senha:', err.message);
                return res.status(500).json({ message: 'Erro ao atualizar a senha' });
            }
            res.json({ message: 'Senha atualizada com sucesso' });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
