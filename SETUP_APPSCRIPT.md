# Setup Google Apps Script - ChatFlow CRM

## 📋 Pré-requisitos
- Google Sheets com as abas estruturadas
- Google Apps Script vinculado à planilha
- URL de implantação da web app gerada

---

## 🛠️ PASSO 1: Preparar a Planilha (Google Sheets)

A planilha `1L7LLOYXRa-eCeZgwKhcjapCaiPJvTQu3pRMmff9hqlA` deve ter **3 abas** com os seguintes nomes e estrutura:

### Aba 1: **Conversas**
| id | nome_contato | avatar_url | ultima_mensagem | data_mensagem | lida | status_online | ativo |
|---|---|---|---|---|---|---|---|
| 1 | Maria Silva | https://... | Oi! Você conseguiu revisar... | 2025-08-15T10:30:00Z | VERDADEIRO | VERDADEIRO | VERDADEIRO |
| 2 | João Santos | https://... | Fechado, nos falamos amanhã... | 2025-08-15T08:20:00Z | VERDADEIRO | FALSO | VERDADEIRO |

**Tipos de dados:**
- `id`: Número (autoincrement)
- `nome_contato`: Texto
- `avatar_url`: URL
- `ultima_mensagem`: Texto longo
- `data_mensagem`: Data/Hora (ISO 8601)
- `lida`: Booleano (VERDADEIRO/FALSO)
- `status_online`: Booleano (VERDADEIRO/FALSO)
- `ativo`: Booleano (VERDADEIRO/FALSO)

### Aba 2: **Mensagens**
| id | conversa_id | remetente_tipo | conteudo | data_envio | lida | status_envio |
|---|---|---|---|---|---|---|
| 1 | 1 | cliente | Oi! Você conseguiu revisar? | 2025-08-15T10:30:00Z | VERDADEIRO | entregue |
| 2 | 1 | operador | Olá, estou revisando agora! | 2025-08-15T10:31:00Z | VERDADEIRO | entregue |

**Tipos de dados:**
- `id`: Número
- `conversa_id`: Número (FK)
- `remetente_tipo`: Texto (valores: "cliente" ou "operador")
- `conteudo`: Texto longo
- `data_envio`: Data/Hora (ISO 8601)
- `lida`: Booleano
- `status_envio`: Texto (valores: "enviando", "entregue", "erro")

### Aba 3: **Usuarios**
| id | nome | email | avatar_url | status_recado | status_online | data_criacao |
|---|---|---|---|---|---|---|
| 1 | Carlos Andrade | carlos@example.com | https://... | Ativo | VERDADEIRO | 2025-01-01T00:00:00Z |

**Tipos de dados:**
- `id`: Número
- `nome`: Texto
- `email`: Email
- `avatar_url`: URL
- `status_recado`: Booleano ou Texto
- `status_online`: Booleano
- `data_criacao`: Data/Hora

---

## 🚀 PASSO 2: Copiar o Código para Google Apps Script

1. Acesse: https://script.google.com/u/0/home/projects/1aQCuLJjGPycLTmvYrSMrijwfTHeX1m7LEbIdZroQVxrxGyS10xYS9-ig/edit

2. **Abra a aba do Editor** (ou crie um novo arquivo `Código.gs`)

3. **Limpe o conteúdo existente** e **copie TODO o código** do arquivo `Código.gs` deste repositório

4. **Cole no editor** do Google Apps Script

5. Clique em **Salvar** (Ctrl+S)

---

## 🌐 PASSO 3: Implantar como Web App

1. No Apps Script, clique em **"Implantar"** (ou **"Deploy"** no menu)

2. Clique em **"Nova implantação"** (+)

3. Selecione:
   - **Tipo**: Web app
   - **Executar como**: Seu email
   - **Quem tem acesso**: Qualquer pessoa

4. Clique em **"Implantar"**

5. Você receberá uma **URL de implantação**. Exemplo:
   ```
   https://script.google.com/macros/s/AKfycbx.../exec
   ```

6. **Copie esta URL** - você vai precisar no frontend!

---

## 🔗 PASSO 4: Conectar ao Frontend

1. Abra o arquivo `index.html` no seu navegador ou editor

2. Clique no botão **"Conectar Google Sheets"** (header superior direito)

3. Um modal aparecerá com dois campos:
   - **ID da Planilha**: `1L7LLOYXRa-eCeZgwKhcjapCaiPJvTQu3pRMmff9hqlA` (já preenchido)
   - **URL do Web App**: Cole a URL que você copiou no Passo 3

4. Clique em **"Salvar Conexão"**

5. O frontend sincronizará automaticamente com o Google Sheets!

---

## 📡 Endpoints Disponíveis

### GET Requests

**1. Obter todos os dados (Conversas + Mensagens + Usuários)**
```
GET https://script.google.com/macros/s/AKfycbx.../exec?action=getDados
```
Resposta:
```json
{
  "conversas": [...],
  "mensagens": [...],
  "usuarios": [...],
  "timestamp": "2025-08-15T10:30:00Z"
}
```

**2. Obter apenas Conversas**
```
GET https://script.google.com/macros/s/AKfycbx.../exec?action=getConversas
```

**3. Obter Mensagens de uma Conversa específica**
```
GET https://script.google.com/macros/s/AKfycbx.../exec?action=getMensagens&conversa_id=1
```

**4. Obter Usuários**
```
GET https://script.google.com/macros/s/AKfycbx.../exec?action=getUsuarios
```

### POST Requests

**1. Adicionar Mensagem**
```javascript
fetch("https://script.google.com/macros/s/AKfycbx.../exec", {
  method: "POST",
  mode: "no-cors",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    action: "addMensagem",
    mensagem: {
      id: 10,
      conversa_id: 1,
      remetente_tipo: "operador",
      conteudo: "Olá!",
      data_envio: "2025-08-15T10:35:00Z",
      lida: true,
      status_envio: "entregue"
    }
  })
})
```

**2. Atualizar Conversa**
```javascript
fetch("https://script.google.com/macros/s/AKfycbx.../exec", {
  method: "POST",
  mode: "no-cors",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    action: "atualizarConversa",
    conversa: {
      id: 1,
      lida: true,
      status_online: false
    }
  })
})
```

**3. Adicionar Conversa**
```javascript
fetch("https://script.google.com/macros/s/AKfycbx.../exec", {
  method: "POST",
  mode: "no-cors",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    action: "adicionarConversa",
    conversa: {
      id: 4,
      nome_contato: "Pedro Costa",
      avatar_url: "https://...",
      ultima_mensagem: "Oi!",
      data_mensagem: "2025-08-15T10:36:00Z",
      lida: false,
      status_online: true,
      ativo: true
    }
  })
})
```

---

## ✅ Testando a Integração

1. **Modo Demonstrativo**: Clique em "Usar Modo Demo" para testar o frontend com dados locais

2. **Com Google Sheets**: Após conectar, clique em **"Sincronizar"** (ícone de refresh na sidebar)

3. **Enviando Mensagens**: Digitando uma mensagem e enviando, ela será:
   - Salva localmente no estado da aplicação
   - Enviada para o Google Sheets via POST (se conectado)

---

## 🐛 Troubleshooting

### "Erro ao conectar com a API do Google Sheets"
- Verifique se a URL do Web App está correta
- Confirme que a implantação está como "Qualquer pessoa" pode acessar
- Tente fazer refresh da página

### "Aba não encontrada"
- Confirme que as abas têm EXATAMENTE os nomes: "Conversas", "Mensagens", "Usuarios"
- Verifique se os headers das colunas coincidem com os nomes esperados

### Dados não aparecem
- Certifique-se de que há dados nas linhas 2 em diante (linha 1 é header)
- Verifique o console do navegador (F12) para erros de JavaScript
- Veja os logs do Apps Script em: https://script.google.com → Execução

---

## 📞 Suporte

Para mais informações sobre Google Apps Script:
- [Documentação Oficial](https://developers.google.com/apps-script)
- [Google Sheets API](https://developers.google.com/sheets/api)

