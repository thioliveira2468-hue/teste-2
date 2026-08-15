# 🧪 Guia de Teste - Integração Google Sheets

Bem-vindo! Este guia vai ajudá-lo a testar a integração entre o frontend e o Google Sheets via Google Apps Script.

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de que:

1. ✅ Você tem acesso ao Google Sheets: https://docs.google.com/spreadsheets/d/1L7LLOYXRa-eCeZgwKhcjapCaiPJvTQu3pRMmff9hqlA/
2. ✅ O Google Apps Script está implantado e ativo
3. ✅ As 3 abas estão criadas no Sheets: **Conversas**, **Mensagens**, **Usuarios**
4. ✅ Os headers das colunas estão configurados corretamente

---

## 🔧 Passo 1: Preparar as Abas no Google Sheets

### Aba 1: **Usuarios** (Criar se não existir)

Crie as colunas na primeira linha exatamente assim:

| id | nome | email | avatar_url | status_recado | status_online | data_criacao |
|---|---|---|---|---|---|---|
| (vazio) | (vazio) | (vazio) | (vazio) | (vazio) | (vazio) | (vazio) |

Deixe a primeira linha como header e a segunda linha vazia para os dados começarem a ser inseridos.

### Aba 2: **Conversas**

Crie as colunas:

| id | nome_contato | avatar_url | ultima_mensagem | data_mensagem | lida | status_online | ativo |
|---|---|---|---|---|---|---|---|

### Aba 3: **Mensagens**

Crie as colunas:

| id | conversa_id | remetente_tipo | conteudo | data_envio | lida | status_envio |
|---|---|---|---|---|---|---|

---

## 🚀 Passo 2: Testar a Página de Cadastro

### 2.1 Abrir a Página de Cadastro

1. Abra o arquivo `cadastro.html` no navegador ou publique-o
2. Você verá um formulário com os campos:
   - **Nome Completo** (obrigatório)
   - **Email** (obrigatório)
   - **URL do Avatar** (opcional)
   - **Status de Recado** (dropdown)
   - **Usuário Online?** (checkbox)

### 2.2 Preencher o Formulário

Exemplo de dados para teste:

```
Nome: Maria Silva
Email: maria@example.com
Avatar: https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100
Status de Recado: Ativo
Online: Marcado (✓)
```

### 2.3 Submeter o Formulário

1. Clique em **"Cadastrar"**
2. Você deve ver uma mensagem de sucesso: **"Usuário cadastrado com sucesso! ✅"**
3. A página vai mostrar um card verde confirmando o cadastro

### 2.4 Verificar os Dados no Google Sheets

1. Abra o Google Sheets: https://docs.google.com/spreadsheets/d/1L7LLOYXRa-eCeZgwKhcjapCaiPJvTQu3pRMmff9hqlA/
2. Vá até a aba **"Usuarios"**
3. Você deve ver os dados que acabou de cadastrar na segunda linha!

---

## 🔄 Passo 3: Testar a Sincronização no Frontend Principal

### 3.1 Abrir o Chat Principal

1. Abra o arquivo `index.html` 
2. Clique em **"Conectar Google Sheets"** (botão no header)
3. Os campos devem aparecer pré-preenchidos com:
   - ID da Planilha: `1L7LLOYXRa-eCeZgwKhcjapCaiPJvTQu3pRMmff9hqlA`
   - URL do Web App: `https://script.google.com/macros/s/AKfycby0wofLDTYBNg_zzFyHHQi4P1kWfBMu5LH4zu0xaqI93FNposs4OjUhriS6mYjIW-8/exec`

### 3.2 Sincronizar Dados

1. Clique em **"Salvar Conexão"**
2. O status deve mudar para **"Google Sheets Conectado"** (verde)
3. A página vai sincronizar automaticamente com o Sheets

### 3.3 Enviar uma Mensagem de Teste

1. Selecione uma conversa (ou adicione dados na aba Conversas do Sheets)
2. Digite uma mensagem no campo inferior
3. Clique em **"Enviar"** (ou pressione Enter)
4. A mensagem deve:
   - Aparecer no chat
   - Ser salva localmente
   - Ser enviada para o Google Sheets (aba Mensagens)

---

## ✅ Checklist de Verificação

Marque cada item conforme você testa:

- [ ] Página de cadastro abre corretamente
- [ ] Formulário valida campos obrigatórios
- [ ] Ao submeter, recebo mensagem de sucesso
- [ ] Os dados aparecem no Google Sheets (aba Usuarios)
- [ ] O index.html conecta ao Google Apps Script
- [ ] Status muda para "Google Sheets Conectado"
- [ ] Posso sincronizar dados com o botão de refresh
- [ ] Posso enviar mensagens e elas são salvas no Sheets

---

## 🐛 Troubleshooting

### "Erro ao cadastrar usuário"

**Possíveis causas:**
1. A URL do Google Apps Script está incorreta
2. A aba "Usuarios" não existe no Sheets
3. Os headers da aba não coincidem com o esperado

**Solução:**
- Verifique a URL do deployment
- Confirme os nomes das abas: "Conversas", "Mensagens", "Usuarios"
- Verifique os headers na primeira linha

### "Dados não aparecem no Sheets"

1. Abra o Google Sheets manualmente
2. Vá em **Ferramentas** → **Editor de Apps Script**
3. Procure por erros recentes em **Execução** → **Últimas execuções**
4. Verifique os logs para entender o erro

### "Conexão não funciona"

- Atualize a página (Ctrl+F5)
- Verifique se a URL do Web App está ativa em: https://script.google.com/
- Tente usar "Modo Demo" primeiro para testar a interface

---

## 📝 Próximos Passos

Após confirmar a integração básica:

1. **Adicionar mais dados** de teste nas diferentes abas
2. **Criar conversas** com múltiplas mensagens
3. **Testar filtros** (Não Lidos, Online)
4. **Buscar conversas** pela barra de pesquisa
5. **Atualizar conversas** e verificar se o Sheets é atualizado

---

## 📞 Endpoints Disponíveis para Teste

Se quiser fazer testes manuais via cURL ou Postman:

### GET - Obter todos os dados
```bash
curl "https://script.google.com/macros/s/AKfycby0wofLDTYBNg_zzFyHHQi4P1kWfBMu5LH4zu0xaqI93FNposs4OjUhriS6mYjIW-8/exec?action=getDados"
```

### GET - Apenas Usuarios
```bash
curl "https://script.google.com/macros/s/AKfycby0wofLDTYBNg_zzFyHHQi4P1kWfBMu5LH4zu0xaqI93FNposs4OjUhriS6mYjIW-8/exec?action=getUsuarios"
```

### POST - Adicionar Usuario
```bash
curl -X POST "https://script.google.com/macros/s/AKfycby0wofLDTYBNg_zzFyHHQi4P1kWfBMu5LH4zu0xaqI93FNposs4OjUhriS6mYjIW-8/exec" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "adicionarUsuario",
    "usuario": {
      "id": 123,
      "nome": "João Silva",
      "email": "joao@example.com",
      "avatar_url": "https://images.unsplash.com/...",
      "status_recado": "Ativo",
      "status_online": true,
      "data_criacao": "2025-08-15T10:00:00Z"
    }
  }'
```

---

## 🎉 Parabéns!

Se você conseguiu completar todos os testes, a integração está funcionando perfeitamente! 🎊

Agora você pode:
- Continuar desenvolvendo novas features
- Adicionar mais campos ao cadastro
- Criar um painel de administração
- Implementar autenticação

Qualquer dúvida, revise a documentação em `SETUP_APPSCRIPT.md`

