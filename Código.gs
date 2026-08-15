// ============================================
// ChatFlow CRM - Google Apps Script Backend
// ============================================
// API para integração com Google Sheets
// Planilha: 1L7LLOYXRa-eCeZgwKhcjapCaiPJvTQu3pRMmff9hqlA

const SPREADSHEET_ID = "1L7LLOYXRa-eCeZgwKhcjapCaiPJvTQu3pRMmff9hqlA";
const CONVERSAS_SHEET = "Conversas";
const MENSAGENS_SHEET = "Mensagens";
const USUARIOS_SHEET = "Usuarios";

// ============================================
// FUNÇÃO PRINCIPAL - Recebe requisições GET/POST
// ============================================
function doGet(e) {
  try {
    const action = e.parameter.action || "getDados";
    
    if (action === "getDados") {
      return getDados();
    } else if (action === "getConversas") {
      return getConversas();
    } else if (action === "getMensagens") {
      const conversaId = e.parameter.conversa_id;
      return getMensagensConversa(conversaId);
    } else if (action === "getUsuarios") {
      return getUsuarios();
    } else {
      return sendJsonResponse({ erro: "Ação não reconhecida" }, 400);
    }
  } catch (error) {
    return sendJsonResponse({ erro: error.toString() }, 500);
  }
}

// ============================================
// FUNÇÃO PARA POST - Receber dados
// ============================================
function doPost(e) {
  try {
    const dados = JSON.parse(e.postData.contents);
    const action = dados.action;

    if (action === "addMensagem") {
      return adicionarMensagem(dados.mensagem);
    } else if (action === "atualizarConversa") {
      return atualizarConversa(dados.conversa);
    } else if (action === "adicionarConversa") {
      return adicionarConversa(dados.conversa);
    } else {
      return sendJsonResponse({ erro: "Ação POST não reconhecida" }, 400);
    }
  } catch (error) {
    return sendJsonResponse({ erro: error.toString() }, 500);
  }
}

// ============================================
// GET DADOS - Retorna Conversas e Mensagens
// ============================================
function getDados() {
  try {
    const conversas = lerConversas();
    const mensagens = lerMensagens();
    const usuarios = lerUsuarios();

    const dados = {
      conversas: conversas,
      mensagens: mensagens,
      usuarios: usuarios,
      timestamp: new Date().toISOString()
    };

    return sendJsonResponse(dados);
  } catch (error) {
    Logger.log("Erro em getDados: " + error);
    return sendJsonResponse({ erro: error.toString() }, 500);
  }
}

// ============================================
// GET CONVERSAS - Apenas conversas
// ============================================
function getConversas() {
  try {
    const conversas = lerConversas();
    return sendJsonResponse({ conversas: conversas });
  } catch (error) {
    return sendJsonResponse({ erro: error.toString() }, 500);
  }
}

// ============================================
// GET MENSAGENS DA CONVERSA
// ============================================
function getMensagensConversa(conversaId) {
  try {
    const mensagens = lerMensagens().filter(m => m.conversa_id == conversaId);
    return sendJsonResponse({ mensagens: mensagens });
  } catch (error) {
    return sendJsonResponse({ erro: error.toString() }, 500);
  }
}

// ============================================
// GET USUARIOS
// ============================================
function getUsuarios() {
  try {
    const usuarios = lerUsuarios();
    return sendJsonResponse({ usuarios: usuarios });
  } catch (error) {
    return sendJsonResponse({ erro: error.toString() }, 500);
  }
}

// ============================================
// LER CONVERSAS DO SHEETS
// ============================================
function lerConversas() {
  const sheet = getSheet(CONVERSAS_SHEET);
  if (!sheet) return [];

  const range = sheet.getDataRange();
  const values = range.getValues();
  
  if (values.length <= 1) return []; // Apenas headers

  const headers = values[0];
  const conversas = [];

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    
    // Pular linhas vazias
    if (!row[0]) continue;

    const conversa = {};
    headers.forEach((header, index) => {
      let value = row[index];
      
      // Converter valores booleanos
      if (header === "lida" || header === "status_online" || header === "ativo") {
        value = value === true || value === "VERDADEIRO" || value === "Verdadeiro" || value === 1;
      }
      
      conversa[header] = value;
    });

    conversas.push(conversa);
  }

  return conversas;
}

// ============================================
// LER MENSAGENS DO SHEETS
// ============================================
function lerMensagens() {
  const sheet = getSheet(MENSAGENS_SHEET);
  if (!sheet) return [];

  const range = sheet.getDataRange();
  const values = range.getValues();
  
  if (values.length <= 1) return [];

  const headers = values[0];
  const mensagens = [];

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    
    if (!row[0]) continue;

    const mensagem = {};
    headers.forEach((header, index) => {
      let value = row[index];
      
      if (header === "lida" || header === "conversa_id") {
        if (header === "lida") {
          value = value === true || value === "VERDADEIRO" || value === "Verdadeiro" || value === 1;
        } else {
          value = parseInt(value) || value;
        }
      }
      
      mensagem[header] = value;
    });

    mensagens.push(mensagem);
  }

  return mensagens;
}

// ============================================
// LER USUARIOS DO SHEETS
// ============================================
function lerUsuarios() {
  const sheet = getSheet(USUARIOS_SHEET);
  if (!sheet) return [];

  const range = sheet.getDataRange();
  const values = range.getValues();
  
  if (values.length <= 1) return [];

  const headers = values[0];
  const usuarios = [];

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    
    if (!row[0]) continue;

    const usuario = {};
    headers.forEach((header, index) => {
      let value = row[index];
      
      if (header === "status_online" || header === "status_recado") {
        value = value === true || value === "VERDADEIRO" || value === "Verdadeiro" || value === 1;
      }
      
      usuario[header] = value;
    });

    usuarios.push(usuario);
  }

  return usuarios;
}

// ============================================
// ADICIONAR MENSAGEM AO SHEETS
// ============================================
function adicionarMensagem(mensagem) {
  try {
    const sheet = getSheet(MENSAGENS_SHEET);
    if (!sheet) throw new Error("Aba 'Mensagens' não encontrada");

    // Obter headers
    const headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
    const headers = headerRange.getValues()[0];

    // Preparar dados na ordem das colunas
    const novaLinha = [];
    headers.forEach(header => {
      novaLinha.push(mensagem[header] !== undefined ? mensagem[header] : "");
    });

    // Adicionar nova linha
    sheet.appendRow(novaLinha);

    return sendJsonResponse({ 
      sucesso: true, 
      mensagem: "Mensagem adicionada com sucesso",
      dados: mensagem
    });
  } catch (error) {
    return sendJsonResponse({ erro: error.toString() }, 500);
  }
}

// ============================================
// ATUALIZAR CONVERSA NO SHEETS
// ============================================
function atualizarConversa(conversa) {
  try {
    const sheet = getSheet(CONVERSAS_SHEET);
    if (!sheet) throw new Error("Aba 'Conversas' não encontrada");

    const values = sheet.getDataRange().getValues();
    const headers = values[0];

    // Encontrar a linha com o ID
    let rowIndex = -1;
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] == conversa.id) {
        rowIndex = i + 1; // +1 porque getRange é 1-indexed
        break;
      }
    }

    if (rowIndex === -1) {
      throw new Error("Conversa com ID " + conversa.id + " não encontrada");
    }

    // Atualizar valores
    headers.forEach((header, index) => {
      if (conversa[header] !== undefined) {
        sheet.getRange(rowIndex, index + 1).setValue(conversa[header]);
      }
    });

    return sendJsonResponse({ 
      sucesso: true, 
      mensagem: "Conversa atualizada com sucesso"
    });
  } catch (error) {
    return sendJsonResponse({ erro: error.toString() }, 500);
  }
}

// ============================================
// ADICIONAR CONVERSA NO SHEETS
// ============================================
function adicionarConversa(conversa) {
  try {
    const sheet = getSheet(CONVERSAS_SHEET);
    if (!sheet) throw new Error("Aba 'Conversas' não encontrada");

    const headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
    const headers = headerRange.getValues()[0];

    const novaLinha = [];
    headers.forEach(header => {
      novaLinha.push(conversa[header] !== undefined ? conversa[header] : "");
    });

    sheet.appendRow(novaLinha);

    return sendJsonResponse({ 
      sucesso: true, 
      mensagem: "Conversa adicionada com sucesso",
      dados: conversa
    });
  } catch (error) {
    return sendJsonResponse({ erro: error.toString() }, 500);
  }
}

// ============================================
// UTILITÁRIOS
// ============================================

/**
 * Obter sheet por nome
 */
function getSheet(name) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    return ss.getSheetByName(name);
  } catch (error) {
    Logger.log("Erro ao obter sheet " + name + ": " + error);
    return null;
  }
}

/**
 * Enviar resposta JSON
 */
function sendJsonResponse(data, statusCode = 200) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
