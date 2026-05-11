/**
 * Apps Script para la boda Carlos & Laura.
 *
 * Despliegue: Apps Script → Deploy → New deployment → Web app
 *   - Execute as: Me
 *   - Who has access: Anyone
 *
 * Seguridad:
 *   - El parámetro `codigo` del cuerpo POST es lo único que decide qué fila
 *     se modifica. Nunca aceptamos un índice de fila desde el cliente.
 *   - Validamos que el código exista en la hoja antes de escribir.
 *   - Los códigos deben ser aleatorios (>= 8 chars) para que no sean adivinables.
 *   - El modo `?list=1` (usado por el build de previews OG) está protegido por
 *     un token guardado en Project Settings → Script properties → LIST_TOKEN.
 */

var SPREADSHEET_ID = '1G506EjOzb-3Qy2ofVvqinYyBDtGtbz2azjkNIiP61Kk';
var SHEET_NAME = 'Hoja 1';

function _getSheet() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    var names = ss.getSheets().map(function (s) { return s.getName(); });
    throw new Error('Pestaña no encontrada. Pestañas disponibles: ' + JSON.stringify(names));
  }
  return sheet;
}

function doGet(e) {
  try {
    var params = (e && e.parameter) || {};

    // Modo "lista": devuelve [{codigo, invitado1, invitado2}] para generar
    // las previews estáticas (Open Graph) en build time. Protegido por token
    // guardado en Project Settings → Script properties como LIST_TOKEN.
    if (params.list === '1') {
      var expected = PropertiesService.getScriptProperties().getProperty('LIST_TOKEN');
      if (!expected || params.token !== expected) {
        return _json({ result: 'error', message: 'No autorizado' });
      }
      var sheetL = _getSheet();
      var lastL = sheetL.getLastRow();
      if (lastL < 1) return _json({ result: 'success', invitados: [] });
      var rowsL = sheetL.getRange(1, 1, lastL, 9).getValues();
      var invitados = [];
      for (var k = 0; k < rowsL.length; k++) {
        var c = rowsL[k][8] ? rowsL[k][8].toString().trim().toUpperCase() : '';
        if (!c) continue;
        invitados.push({ codigo: c, invitado1: rowsL[k][0] || '', invitado2: rowsL[k][1] || '' });
      }
      return _json({ result: 'success', invitados: invitados });
    }

    var codigo = ((params.codigo) || '').toString().toUpperCase();
    if (!codigo) return _json({ result: 'error', message: 'Falta el parámetro codigo' });

    var sheet = _getSheet();
    var lastRow = sheet.getLastRow();
    if (lastRow < 1) return _json({ result: 'error', message: 'Hoja vacía', sheet: sheet.getName() });
    var rows = sheet.getRange(1, 1, lastRow, 11).getValues();
    for (var i = 0; i < rows.length; i++) {
      if (rows[i][8] && rows[i][8].toString().toUpperCase() === codigo) {
        var r = rows[i];
        return _json({
          result: 'success',
          invitado1: r[0], invitado2: r[1],
          hijos: [r[2], r[3], r[4], r[5]].filter(Boolean),
          menusVeganos: r[6], usaBus: r[7],
          confirmado: r[9], comentarios: r[10]
        });
      }
    }
    return _json({ result: 'error', message: 'Código no válido' });
  } catch (err) {
    return _json({ result: 'error', stage: 'doGet', message: String(err), stack: err && err.stack });
  }
}

// Límites
var MAX_HIJOS = 4;
var MAX_NOMBRE_LEN = 80;
var MAX_COMENTARIOS_LEN = 1000;

function doPost(e) {
  try {
    var data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (err) {
      return _json({ result: 'error', message: 'JSON inválido' });
    }
    if (!data || typeof data !== 'object') {
      return _json({ result: 'error', message: 'Payload inválido' });
    }

    var codigo = (data.codigo ? data.codigo.toString().trim().toUpperCase() : '');
    if (!codigo) return _json({ result: 'error', message: 'Código requerido' });
    if (codigo.length > 32 || !/^[A-Z0-9_-]+$/.test(codigo)) {
      return _json({ result: 'error', message: 'Código con formato inválido' });
    }

    var sheet = _getSheet();
    var rows = sheet.getRange(1, 1, sheet.getLastRow(), 9).getValues();
    var filaIndex = -1;
    var invitado1 = '';
    var invitado2 = '';
    for (var i = 0; i < rows.length; i++) {
      if (rows[i][8] && rows[i][8].toString().trim().toUpperCase() === codigo) {
        filaIndex = i + 1;
        invitado1 = (rows[i][0] || '').toString().trim();
        invitado2 = (rows[i][1] || '').toString().trim();
        break;
      }
    }
    if (filaIndex === -1) return _json({ result: 'error', message: 'Código no válido' });

    // --- Validaciones ---

    // asistencia: 'Si' | 'No'
    var asistencia = data.asistencia;
    if (asistencia !== 'Si' && asistencia !== 'No') {
      return _json({ result: 'error', message: 'Asistencia inválida' });
    }

    // hijos: array de strings, máx 4, longitud razonable
    var hijosIn = Array.isArray(data.hijos) ? data.hijos : [];
    if (hijosIn.length > MAX_HIJOS) {
      return _json({ result: 'error', message: 'Demasiados niños (máx ' + MAX_HIJOS + ')' });
    }
    var hijos = [];
    for (var h = 0; h < hijosIn.length; h++) {
      if (hijosIn[h] == null) { hijos.push(''); continue; }
      if (typeof hijosIn[h] !== 'string' && typeof hijosIn[h] !== 'number') {
        return _json({ result: 'error', message: 'Nombre de niño inválido' });
      }
      var nombre = hijosIn[h].toString().trim();
      if (nombre.length > MAX_NOMBRE_LEN) {
        return _json({ result: 'error', message: 'Nombre de niño demasiado largo' });
      }
      hijos.push(nombre);
    }

    // menusVeganos: entero >= 0, <= total asistentes
    var adultos = invitado2 ? 2 : 1;
    var hijosNoVacios = hijos.filter(function (n) { return n && n.length > 0; }).length;
    var totalAsistentes = adultos + (asistencia === 'Si' ? hijosNoVacios : 0);
    var menusVeganos = Number(data.menusVeganos);
    if (!isFinite(menusVeganos) || menusVeganos < 0 || Math.floor(menusVeganos) !== menusVeganos) {
      return _json({ result: 'error', message: 'menusVeganos inválido' });
    }
    if (menusVeganos > totalAsistentes) {
      return _json({ result: 'error', message: 'menusVeganos (' + menusVeganos + ') excede asistentes (' + totalAsistentes + ')' });
    }

    // usaBus: 'Si' | 'No' | ''
    var usaBus = data.usaBus;
    if (usaBus !== 'Si' && usaBus !== 'No' && usaBus !== '' && usaBus !== undefined && usaBus !== null) {
      return _json({ result: 'error', message: 'usaBus inválido' });
    }
    usaBus = usaBus || '';

    // comentarios: string, longitud máxima
    var comentarios = data.comentarios;
    if (comentarios != null && typeof comentarios !== 'string' && typeof comentarios !== 'number') {
      return _json({ result: 'error', message: 'comentarios inválido' });
    }
    comentarios = comentarios != null ? comentarios.toString() : '';
    if (comentarios.length > MAX_COMENTARIOS_LEN) {
      return _json({ result: 'error', message: 'Comentarios demasiado largos (máx ' + MAX_COMENTARIOS_LEN + ')' });
    }

    // Si no asiste, forzamos campos a vacío/cero (defensa en profundidad).
    if (asistencia === 'No') {
      hijos = [];
      menusVeganos = 0;
      usaBus = '';
    }

    // --- Escritura ---

    for (var j = 0; j < MAX_HIJOS; j++) {
      sheet.getRange(filaIndex, 3 + j).setValue(hijos[j] || '');
    }
    sheet.getRange(filaIndex, 7).setValue(menusVeganos);
    sheet.getRange(filaIndex, 8).setValue(usaBus);
    sheet.getRange(filaIndex, 10).setValue(asistencia === 'Si' ? 'S' : 'N');
    sheet.getRange(filaIndex, 11).setValue(comentarios);
    return _json({ result: 'success' });
  } catch (err) {
    return _json({ result: 'error', stage: 'doPost', message: String(err), stack: err && err.stack });
  }
}

function _json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function pingSheet() {
  Logger.log('ID usado: ' + SPREADSHEET_ID);
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  Logger.log('Nombre hoja: ' + ss.getName());
  Logger.log('Pestañas: ' + ss.getSheets().map(function (s) { return s.getName(); }));
}
