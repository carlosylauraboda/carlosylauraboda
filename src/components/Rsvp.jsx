import { useEffect, useMemo, useState } from 'react';
import { fetchInvitado, submitRsvp } from '../api/sheet';
import RsvpForm from './RsvpForm';

const HOME_URL = window.location.pathname;

function setCodigoCookie(codigo) {
  const oneYear = 60 * 60 * 24 * 365;
  document.cookie = `rsvp_codigo=${encodeURIComponent(codigo)}; max-age=${oneYear}; path=/; SameSite=Lax`;
}

function HomeLink({ className = '' }) {
  return (
    <div className={`text-center ${className}`}>
      <a
        href={HOME_URL}
        className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.16em] uppercase text-boda-ink/70 hover:text-boda-ink"
      >
        <span aria-hidden="true">←</span>
        <span>Ver detalles del evento</span>
      </a>
    </div>
  );
}

function Card({ children }) {
  return (
    <div className="min-h-screen bg-boda-cream text-boda-ink py-10 px-4">
      <div className="mx-auto max-w-xl bg-white rounded-2xl shadow-lg p-6 sm:p-10">
        <HomeLink className="mb-6" />
        {children}
      </div>
    </div>
  );
}

function buildInitial(invitado) {
  const hijos = (invitado.hijos || []).map((h) => (h ? h.toString() : ''));
  const traeNinos = hijos.length > 0 ? 'Si' : '';
  const numNinos = Math.max(1, hijos.length || 1);
  const padded = [...hijos];
  while (padded.length < numNinos) padded.push('');
  return {
    asistencia: invitado.confirmado === 'S' ? 'Si' : invitado.confirmado === 'N' ? 'No' : '',
    traeNinos,
    numNinos,
    hijos: padded,
    menusVeganos: Number(invitado.menusVeganos) || 0,
    usaBus: invitado.usaBus === 'Si' || invitado.usaBus === 'No' ? invitado.usaBus : '',
    comentarios: invitado.comentarios || '',
  };
}

export default function Rsvp({ codigo }) {
  const [state, setState] = useState({ status: 'loading' });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setCodigoCookie(codigo);
  }, [codigo]);

  useEffect(() => {
    let alive = true;
    fetchInvitado(codigo)
      .then((data) => {
        if (!alive) return;
        if (data.result === 'success') {
          setState({ status: 'ready', invitado: data });
        } else {
          setState({ status: 'invalid', message: data.message || 'Código no válido' });
        }
      })
      .catch(() => alive && setState({ status: 'error' }));
    return () => {
      alive = false;
    };
  }, [codigo]);

  const initial = useMemo(
    () => (state.status === 'ready' ? buildInitial(state.invitado) : null),
    [state]
  );

  if (state.status === 'loading') {
    return (
      <Card>
        <p className="text-center opacity-70">Cargando…</p>
      </Card>
    );
  }

  if (state.status === 'invalid') {
    return (
      <Card>
        <h1 className="font-serif text-3xl mb-3">Vaya…</h1>
        <p className="opacity-80">
          El código <span className="font-mono">{codigo}</span> no es válido. Revisa el enlace
          que te enviamos o escríbenos.
        </p>
      </Card>
    );
  }

  if (state.status === 'error') {
    return (
      <Card>
        <h1 className="font-serif text-3xl mb-3">Error de conexión</h1>
        <p className="opacity-80">No hemos podido cargar tu invitación. Inténtalo de nuevo en unos minutos.</p>
      </Card>
    );
  }

  const { invitado } = state;
  const yaConfirmado = invitado.confirmado === 'S' || invitado.confirmado === 'N';
  const saludo = invitado.invitado2
    ? `Hola ${invitado.invitado1} y ${invitado.invitado2}`
    : `Hola ${invitado.invitado1}`;

  if (yaConfirmado && !editing) {
    return (
      <Card>
        <h1 className="font-serif text-3xl mb-2">{saludo}</h1>
        <p className="opacity-80 mb-6">
          {invitado.confirmado === 'S'
            ? 'Ya tenemos vuestra confirmación. ¡Gracias!'
            : 'Hemos registrado que no podréis venir. ¡Os echaremos de menos!'}
        </p>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="rounded-lg border border-boda-ink/30 px-5 py-2.5 hover:bg-boda-cream"
        >
          Modificar respuesta
        </button>
      </Card>
    );
  }

  async function handleSubmit(formData) {
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await submitRsvp({ codigo, ...formData });
      if (res.result === 'success') {
        window.location.href = HOME_URL;
        return;
      } else {
        setSubmitError(res.message || 'No se pudo guardar la respuesta');
      }
    } catch {
      setSubmitError('Error de conexión al enviar. Inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <header className="mb-6 text-center">
        <p className="font-serif text-boda-accent uppercase tracking-widest text-sm">Boda Carlos &amp; Laura</p>
        <h1 className="font-serif text-3xl sm:text-4xl mt-2">{saludo}</h1>
        <p className="opacity-80 mt-3">
          Confirma tu asistencia rellenando este pequeño formulario. ¡Nos hace muchísima ilusión teneros con nosotros!
        </p>
      </header>
      <RsvpForm
        invitado={invitado}
        initial={initial}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
      {submitError && (
        <p className="mt-4 text-sm text-red-600 text-center">{submitError}</p>
      )}
    </Card>
  );
}
