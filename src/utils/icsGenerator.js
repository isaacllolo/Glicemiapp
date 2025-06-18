export function generarICS(medicamentos, pacienteNombre) {
  let contenidoICS = `
BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
METHOD:PUBLISH
`;

  medicamentos.forEach((med) => {
    const { numero, fecha, hora, tomado } = med;
    if (!fecha || !hora) return;

    const fechaEvento = new Date(`${fecha}T${hora}`);
    const fechaFin = new Date(fechaEvento.getTime() + 15 * 60000); // 15 min duración

    const formatoICS = (date) =>
      date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    contenidoICS += `
BEGIN:VEVENT
SUMMARY:Recordatorio Medicamento - ${pacienteNombre}
DESCRIPTION:Toma número ${numero} - Medicamento asignado
DTSTART:${formatoICS(fechaEvento)}
DTEND:${formatoICS(fechaFin)}
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
TRIGGER:-PT10M
DESCRIPTION:Recordatorio de Medicamento
ACTION:DISPLAY
END:VALARM
END:VEVENT
`;
  });

  contenidoICS += `END:VCALENDAR`;

  const blob = new Blob([contenidoICS], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `recordatorios_${pacienteNombre}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
