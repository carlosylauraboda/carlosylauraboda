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
 */

var SHEET_NAME = 'invitados por parejas';

function doGet(e) {
  var codigo = ((e && e.parameter && e.parameter.c) || '').toString().trim().toUpperCase();
  if (!codigo) return _json({ result: 'error', message: 'Código requerido' });

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) return _json({ result: 'error', message: 'No se encontró la pestaña' });

  var rows = sheet.getRange(1, 1, sheet.getLastRow(), 11).getValues();
  for (var i = 0; i < rows.length; i++) {
    if (rows[i][8] && rows[i][8].toString().trim().toUpperCase() === codigo) {
      var r = rows[i];
      return _json({
        result: 'success',
        invitado1: r[0] || '',
        invitado2: r[1] || '',
        hijos: [r[2], r[3], r[4], r[5]].filter(function (h) { return h && h.toString().trim(); }),
        menusVeganos: r[6] || 0,
        usaBus: r[7] || '',
        confirmado: r[9] || '',
        comentarios: r[10] || ''
      });
    }
  }
  return _json({ result: 'error', message: 'Código no válido' });
}

function doPost(e) {
  var data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return _json({ result: 'error', message: 'JSON inválido' });
  }

  var codigo = (data && data.codigo ? data.codigo.toString().trim().toUpperCase() : '');
  if (!codigo) return _json({ result: 'error', message: 'Código requerido' });

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) return _json({ result: 'error', message: 'No se encontró la pestaña' });

  var rows = sheet.getRange(1, 1, sheet.getLastRow(), 9).getValues();
  var filaIndex = -1;
  for (var i = 0; i < rows.length; i++) {
    if (rows[i][8] && rows[i][8].toString().trim().toUpperCase() === codigo) {
      filaIndex = i + 1;
      break;
    }
  }
  if (filaIndex === -1) return _json({ result: 'error', message: 'Código no válido' });

  var hijos = Array.isArray(data.hijos) ? data.hijos : [];
  for (var j = 0; j < 4; j++) {
    var nombre = hijos[j] ? hijos[j].toString().trim() : '';
    sheet.getRange(filaIndex, 3 + j).setValue(nombre);
  }

  var menusVeganos = Number(data.menusVeganos);
  if (!isFinite(menusVeganos) || menusVeganos < 0) menusVeganos = 0;
  sheet.getRange(filaIndex, 7).setValue(menusVeganos);

  var bus = data.usaBus === 'Si' || data.usaBus === 'No' ? data.usaBus : '';
  sheet.getRange(filaIndex, 8).setValue(bus);

  sheet.getRange(filaIndex, 10).setValue(data.asistencia === 'Si' ? 'S' : 'N');
  sheet.getRange(filaIndex, 11).setValue(data.comentarios ? data.comentarios.toString() : '');

  return _json({ result: 'success' });
}

function _json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
