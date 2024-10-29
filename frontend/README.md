# Challenge Sprints 4 - Desenvolvimento Mobile

# integrantes do grupo:
José Manuel
Samuel Victor
Yuri Yve

# Projeto de Monitoramento de Sensores

Este projeto é um aplicativo React Native para monitoramento de sensores, permitindo que os usuários visualizem dados de sensores em gráficos interativos. O aplicativo inclui funcionalidades de login, registro, recuperação de senha e exibição de dados em gráficos de linha, barra e pizza.

## Fluxograma das Camadas do Sistema

Abaixo está o fluxograma que ilustra a arquitetura das camadas do sistema:

![Fluxograma das Camadas do Sistema](html/images/camadas%20do%20sistema%20e%20fluxo.png)

## Funcionalidades

- **Login**: Usuários realizam login com nome de usuário e senha; um token JWT é gerado para garantir a segurança e a validade do acesso.
- **Registro**: Novos usuários podem criar uma conta diretamente pelo app.
- **Recuperação de Senha**: Em caso de esquecimento, os usuários podem redefinir sua senha.
- **Gráficos**: Exibição dos dados dos sensores em gráficos variados, incluindo gráficos de linha, barra e pizza, facilitando o monitoramento visual de diferentes variáveis.
- **Tipos de Usuário**:
        User (Usuário Comum): Pode visualizar e monitorar dados de sensores.
        Admin (Administrador): Acesso adicional para gerenciar dados e informações de outros usuários.
- **Atualização em Tempo Real**:Integração com WebSocket para atualização contínua dos dados.
- **Monitoramento Automático e Manual**: Dados dos sensores são enviados automaticamente a cada 60 segundos ou manualmente ao clicar no sensor específico.   

## Tecnologias Utilizadas

- **React Native**: Para desenvolvimento do aplicativo mobile.
- **Chart.js**: Para gráficos interativos.
- **Socket.IO**: Para comunicação em tempo real.
- **Node.js/Express**: Para o backend (servidor).

## Estrutura do Projeto
/CS4-2EMR-MOBILE-SAMUEL-JOSE-YURI

|--/Backend
| |-- banco-de-dados.db
| |-- server.js
| |-- package.json
| |-- package-lock.json

|--/Frontend
| |-- /assets
| |-- /html
| | |-- /images
| | |-- index.html 
| |-- /screens 
| | |-- GraphScreen.js 
| | |-- LoginScreen.js 
| | |-- RegisterScreen.js 
| | |-- RecSenha.js 
| | |-- UsersScreen.js 
| |-- integrantes-do-grupo.txt
| |-- App.js
| |-- package.json
| |-- package-lock.json


## Configuração do Ambiente

1. Clone o repositório:
   ```bash
   git clone https://github.com/gitmega17/CS4-2EMR-MOBILE-SAMUEL-JOSE-YURI
   cd CS4-2EMR-MOBILE-SAMUEL-JOSE-YURI

2. Instale as dependências:
    ```bash
    cd frontend
    npm install

3. Inicie o servidor backend:
    ```bash
    cd backend
    node server.js
    A aplicação estará disponível em http://localhost:3000

4. Inicie o aplicativo:
    cd frontend
    npm start

## Instruções para Uso

### Registro
        Acesse a área de registro no app.
        Insira o nome de usuário desejado.
        Crie uma senha segura e a confirme.
        Clique em "Registrar".
        Após o registro, você poderá fazer login e acessar o sistema.
        Nota: O nome de usuário deve ser único; se já estiver em uso, será necessário escolher outro.

### Login
        Acesse a área de login no app.
        Insira o nome de usuário e a senha cadastrados.
        Clique em "Entrar".
        Após o login bem-sucedido, o usuário receberá um token que permitirá o acesso às funcionalidades específicas para o seu perfil.
        Nota: Caso insira informações incorretas, você receberá uma mensagem de erro.

### Recuperação de Senha
        Acesse a área de login e selecione "Esqueci minha senha".
        Insira o nome de usuário registrado e siga as instruções para redefinir a senha.
        Esse recurso facilita a recuperação de acesso em caso de perda de senha.

### Tipos de Usuários - Permissões - Roles
        A aplicação possui dois tipos principais de usuários: admin e user. A diferença entre eles está nos privilégios e nas permissões de acesso a determinadas funcionalidades:

        User (Usuário Comum): Tem acesso ao sistema para monitorar os dados dos sensores e visualizar informações dos cômodos.
        Admin (Administrador): Possui acesso adicional, podendo inserir e modificar dados no sistema, além de gerenciar informações de outros usuários.
        A autorização é verificada no servidor, e usuários sem permissão (user) receberão uma mensagem de acesso negado se tentarem acessar funções reservadas ao admin.
