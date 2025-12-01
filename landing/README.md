#  Documentação da landing page     
Este documento descreve o ambiente de execução, tecnologias presumidas e componentes funcionais utilizados na aplicação.

---

##  Ambiente e Configuração

### **URL de Acesso**
- A aplicação está acessível em: **http://localhost:4000**

### **Porta de Execução**
- O servidor está configurado para rodar na porta **4000**.
- Acesso padrão durante o desenvolvimento:  
  `localhost:4000`


### **inicialização**
- npm start (build)
---

## Tecnologias Front-end

### | Componente | Tecnologia | Descrição |
|------------|------------|-----------|
| **Estrutura** | Next | Utilizado para a marcação e estrutura semântica da página (header, sections, footer, formulário, etc.). |
| **Estilização** | **Tailwind CSS**. |
---

##  Componentes Funcionais

### **Formulário de Contato**
- **Estrutura:**  
  Formulário padrão contendo campos de nome, email e mensagem.
- **Ação (Presumida):**  
  O botão **Enviar** deve acionar um endpoint de backend para:
  - Registrar os dados do usuário  
  - Ou enviar um email automaticamente  

### **Toggle de Planos**
- Alteração entre os planos **Residência** e **Condomínio**
- Implementado em JavaScript, atualizando o conteúdo **sem recarregar a página**
- Experiência fluida e dinâmica para o usuário

---

##  Responsividade

A interface se adapta automaticamente a diferentes tamanhos de tela:
- **Desktop**
- **Tablet**
- **Mobile**

---
