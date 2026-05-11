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

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var codigo = (data && data.codigo ? data.codigo.toString().trim().toUpperCase() : '');
  if (!codigo) return _json({ result: 'error', message: 'Código requerido' });

  var sheet = _getSheet();
  var rows = sheet.getRange(1, 1, sheet.getLastRow(), 9).getValues();
  var filaIndex = -1;
  for (var i = 0; i < rows.length; i++) {
    if (rows[i][8] && rows[i][8].toString().trim().toUpperCase() === codigo) {
      filaIndex = i + 1; break;
    }
  }
  if (filaIndex === -1) return _json({ result: 'error', message: 'Código no válido' });

  var hijos = data.hijos || [];
  for (var j = 0; j < 4; j++) {
    sheet.getRange(filaIndex, 3 + j).setValue(hijos[j] || '');
  }
  sheet.getRange(filaIndex, 7).setValue(data.menusVeganos || 0);
  sheet.getRange(filaIndex, 8).setValue(data.usaBus || '');
  sheet.getRange(filaIndex, 10).setValue(data.asistencia === 'Si' ? 'S' : 'N');
  sheet.getRange(filaIndex, 11).setValue(data.comentarios || '');
  return _json({ result: 'success' });
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
