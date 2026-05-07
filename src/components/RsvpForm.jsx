import { useEffect, useState } from 'react';

const inputBase =
  'w-full rounded-lg border border-boda-ink/20 bg-white px-4 py-2.5 text-boda-ink shadow-sm focus:border-boda-accent focus:outline-none focus:ring-2 focus:ring-boda-accent/30';
const labelBase = 'block text-sm font-medium text-boda-ink/80 mb-1.5';

function Toggle({ value, onChange, name }) {
  const opt = (v, label) => (
    <button
      type="button"
      onClick={() => onChange(v)}
      className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
        value === v
          ? 'bg-boda-accent text-white shadow'
          : 'bg-white text-boda-ink/70 border border-boda-ink/20 hover:bg-boda-cream'
      }`}
      aria-pressed={value === v}
      data-name={name}
    >
      {label}
    </button>
  );
  return (
    <div className="flex gap-2">
      {opt('Si', 'Sí')}
      {opt('No', 'No')}
    </div>
  );
}

export default function RsvpForm({ invitado, initial, onSubmit, submitting }) {
  const adultos = invitado.invitado2 ? 2 : 1;
  const [asistencia, setAsistencia] = useState(initial.asistencia);
  const [traeNinos, setTraeNinos] = useState(initial.traeNinos);
  const [numNinos, setNumNinos] = useState(initial.numNinos);
  const [hijos, setHijos] = useState(initial.hijos);
  const [menusVeganos, setMenusVeganos] = useState(initial.menusVeganos);
  const [usaBus, setUsaBus] = useState(initial.usaBus);
  const [comentarios, setComentarios] = useState(initial.comentarios);
  const [errors, setErrors] = useState({});

  const totalAsistentes = adultos + (traeNinos === 'Si' ? numNinos : 0);
  const maxVeganos = totalAsistentes;

  useEffect(() => {
    if (menusVeganos > maxVeganos) setMenusVeganos(maxVeganos);
  }, [menusVeganos, maxVeganos]);

  function setHijo(i, v) {
    setHijos((prev) => {
      const next = [...prev];
      next[i] = v;
      return next;
    });
  }

  function changeNumNinos(n) {
    setNumNinos(n);
    setHijos((prev) => {
      const next = [...prev];
      while (next.length < n) next.push('');
      return next.slice(0, n);
    });
  }

  function validate() {
    const e = {};
    if (!asistencia) e.asistencia = 'Selecciona una opción';
    if (asistencia === 'Si') {
      if (!traeNinos) e.traeNinos = 'Selecciona una opción';
      if (traeNinos === 'Si') {
        for (let i = 0; i < numNinos; i++) {
          if (!hijos[i] || !hijos[i].trim()) {
            e[`hijo_${i}`] = 'Falta el nombre';
          }
        }
      }
      if (!usaBus) e.usaBus = 'Selecciona una opción';
      if (menusVeganos < 0 || menusVeganos > maxVeganos) {
        e.menusVeganos = `Entre 0 y ${maxVeganos}`;
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    if (!validate()) return;

    if (asistencia === 'No') {
      onSubmit({
        asistencia: 'No',
        hijos: [],
        menusVeganos: 0,
        usaBus: '',
        comentarios: comentarios.trim(),
      });
      return;
    }

    const hijosFinal = traeNinos === 'Si' ? hijos.slice(0, numNinos).map((h) => h.trim()) : [];
    onSubmit({
      asistencia: 'Si',
      hijos: hijosFinal,
      menusVeganos,
      usaBus,
      comentarios: comentarios.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <section>
        <span className={labelBase}>¿Vais a asistir?</span>
        <Toggle value={asistencia} onChange={setAsistencia} name="asistencia" />
        {errors.asistencia && <p className="mt-1.5 text-sm text-red-600">{errors.asistencia}</p>}
      </section>

      {asistencia === 'Si' && (
        <>
          <section>
            <span className={labelBase}>¿Venís con niños?</span>
            <Toggle value={traeNinos} onChange={setTraeNinos} name="traeNinos" />
            {errors.traeNinos && (
              <p className="mt-1.5 text-sm text-red-600">{errors.traeNinos}</p>
            )}
          </section>

          {traeNinos === 'Si' && (
            <section>
              <label className={labelBase}>¿Cuántos niños?</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => changeNumNinos(n)}
                    className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                      numNinos === n
                        ? 'bg-boda-accent text-white shadow'
                        : 'bg-white text-boda-ink/70 border border-boda-ink/20 hover:bg-boda-cream'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <div className="mt-4 space-y-3">
                {Array.from({ length: numNinos }).map((_, i) => (
                  <div key={i}>
                    <label className={labelBase}>Nombre del niño/a {i + 1}</label>
                    <input
                      type="text"
                      className={inputBase}
                      value={hijos[i] || ''}
                      onChange={(e) => setHijo(i, e.target.value)}
                      autoComplete="off"
                    />
                    {errors[`hijo_${i}`] && (
                      <p className="mt-1.5 text-sm text-red-600">{errors[`hijo_${i}`]}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <label className={labelBase}>
              Menús veganos <span className="opacity-60">(máx. {maxVeganos})</span>
            </label>
            <input
              type="number"
              min={0}
              max={maxVeganos}
              className={inputBase}
              value={menusVeganos}
              onChange={(e) => {
                const v = Math.max(0, Math.min(maxVeganos, Number(e.target.value) || 0));
                setMenusVeganos(v);
              }}
            />
            {errors.menusVeganos && (
              <p className="mt-1.5 text-sm text-red-600">{errors.menusVeganos}</p>
            )}
          </section>

          <section>
            <span className={labelBase}>
              ¿Usaréis el autobús? <span className="opacity-60">(ida y vuelta a la iglesia y al banquete)</span>
            </span>
            <Toggle value={usaBus} onChange={setUsaBus} name="usaBus" />
            {errors.usaBus && <p className="mt-1.5 text-sm text-red-600">{errors.usaBus}</p>}
          </section>
        </>
      )}

      <section>
        <label className={labelBase}>Comentarios (opcional)</label>
        <textarea
          rows={4}
          className={inputBase}
          value={comentarios}
          onChange={(e) => setComentarios(e.target.value)}
          placeholder="Alergias, intolerancias, dudas…"
        />
      </section>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-boda-ink px-6 py-3 text-white font-medium shadow hover:bg-boda-ink/90 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? 'Enviando…' : 'Enviar respuesta'}
      </button>
    </form>
  );
}
