## 🚀 Como Rodar o Projeto

Para executar o sistema completo em seu ambiente de desenvolvimento, siga os passos abaixo. A configuração é dividida em três partes: **Banco de Dados**, **Backend** e **Frontend (Aplicativo)**.

### ✅ Pré-requisitos

-   [Node.js](https://nodejs.org/) (versão LTS recomendada)
-   [NPM](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)
-   **MySQL:** Um servidor de banco de dados MySQL instalado e rodando localmente.
-   **Expo Go:** Aplicativo instalado em seu smartphone (Android ou iOS).
-   Um emulador Android configurado (opcional).

---

### 💾 1. Configuração do Banco de Dados

O backend precisa de um banco de dados MySQL para funcionar.

---

### ⚙️ 2. Configuração do Backend

Com o banco de dados criado, vamos configurar e iniciar o servidor.

1.  **Navegue até a pasta do backend:**
    ```bash
    cd ../../backend-mobile
    ```

2.  **Configure as Variáveis de Ambiente:**
    -   Nesta pasta, você encontrará um arquivo chamado `.env.example`.
    -   Crie uma cópia deste arquivo e renomeie-a para `.env`.
    -   Abra o novo arquivo `.env` e preencha as credenciais do seu banco de dados local. Ele deve ficar parecido com isto:

        ```dotenv
        # --- Credenciais e Configurações do Banco ---
        DB_HOST_LOCAL=127.0.0.1
        DB_PORT_LOCAL=3306
        DB_NAME=aqua
        DB_USER=root        # Seu usuário do MySQL
        DB_PASS=           # Sua senha do MySQL (se houver)
        DB_DIALECT=mysql
        DB_ENV=development

        # --- Chave de Segurança para Autenticação ---
        # Gere uma chave longa e aleatória aqui
        JWT_SECRET=SEU_SEGREDO_SUPER_SECRETO_E_LONGO_AQUI
        ```
    > **⚠️ Importante:** O backend está configurado para criar as tabelas automaticamente na primeira vez que for executado (`Tabelas sincronizadas com o banco!`).

3.  **Instale as dependências:**
    ```bash
    npm install
    ```

4.  **Inicie o servidor:**
    ```bash
    node src/server.js
    ```
    O terminal deve exibir as mensagens `Conexão estabelecida com sucesso!!`, `Tabelas sincronizadas com o banco!` e `Server Mobile listening on 3334`.

---

### 📱 3. Configuração do Aplicativo (Frontend)

Com o banco de dados e o backend rodando, configure e inicie o aplicativo.

1.  **Navegue até a pasta do aplicativo:**
    ```bash
    # Se você estiver na raiz do projeto (aqua/):
    cd User-App/User-App
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Inicie o servidor de desenvolvimento do Expo:**
    ```bash
    npx expo start
    ```
    Isso abrirá uma página no seu navegador com um QR Code.

### 🌐 4. Executando no seu Dispositivo

**Importante:** Seu computador (rodando o backend) e seu smartphone (ou emulador) **precisam estar conectados na mesma rede Wi-Fi**.

1.  **Abra o aplicativo Expo Go** no seu smartphone.
2.  Escaneie o QR Code exibido no terminal ou na página do navegador.
3.  O aplicativo será carregado no seu dispositivo.

> **⚠️ Atenção:** Se o aplicativo apresentar erros de conexão (`Network Error`), certifique-se de que a variável `API_BASE_URL` no arquivo `screens/Login.jsx` está configurada com o endereço IP de rede correto do seu computador (aquele que aparece no terminal do backend, ex: `http://192.168.0.10:3334`). além do mais, se preciso do componente @expo/ngrok@^4.1.0, qu eé instalado uma vez rodando --tunnel no seu computador
