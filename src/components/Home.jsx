import { useState, useEffect } from 'react';

const WEDDING_DATE_ISO = '2026-08-29T18:00:00+02:00';
const WEDDING_LOCATION = 'Dalías · Almerimar';

const DATE = new Date(WEDDING_DATE_ISO);
const DATE_LABEL = DATE.toLocaleDateString('es-ES', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
}).replace(/^\w/, (c) => c.toUpperCase());

const P = process.env.PUBLIC_URL || '';
const IMG = {
  hero: `${P}/photo5.jpeg`,
  intro: `${P}/photo4.jpeg`,
  gallery: [`${P}/photo1.jpeg`, `${P}/photo2.jpeg`, `${P}/photo3.jpeg`, `${P}/photo4.jpeg`, `${P}/photo5.jpeg`],
};

function useCountdown(targetDate) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, targetDate.getTime() - now);
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff / 3600000) % 24),
    m: Math.floor((diff / 60000) % 60),
    s: Math.floor((diff / 1000) % 60),
  };
}

function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-cream/95 backdrop-blur border-b border-olive/20">
      <div className="flex items-center justify-between h-[60px] px-5 md:px-7 gap-4">
        <a href="#top" className="font-serif italic text-[22px] md:text-[28px] leading-none text-olive-deep whitespace-nowrap shrink-0">
          Carlos <span className="text-pink">&amp;</span> Laura
        </a>
        <div className="hidden lg:flex gap-7 font-mono text-[11px] tracking-[0.16em] uppercase text-ink/70">
          <a href="#historia" className="nav-link hover:text-ink">Historia</a>
          <a href="#ceremonia" className="nav-link hover:text-ink">Ceremonia</a>
          <a href="#convite" className="nav-link hover:text-ink">Convite</a>
          <a href="#bus" className="nav-link hover:text-ink">Autobús</a>
          <a href="#agenda" className="nav-link hover:text-ink">Agenda</a>
          <a href="#faq" className="nav-link hover:text-ink">FAQ</a>
        </div>
      </div>
    </nav>
  );
}

function Hero({ dateStr, location }) {
  return (
    <section id="top" className="bg-cream pt-14 pb-20 overflow-hidden relative">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="flex justify-between items-baseline font-mono text-[11px] tracking-[0.2em] uppercase text-olive mb-7">
          <span>Almería · España</span>
          <span className="hidden sm:inline">Una boda</span>
          <span>Sábado · 18:00</span>
        </div>

        <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-12 items-end">
          <div>
            <h1 className="font-serif font-normal text-olive-deep leading-[0.86] tracking-[-0.02em] m-0 whitespace-nowrap"
                style={{ fontSize: 'clamp(72px, 10vw, 176px)' }}>
              <span className="whitespace-nowrap">Carlos <span className="italic text-pink">&amp;</span></span>
              <span className="block italic" style={{ textIndent: '1.2em' }}>Laura</span>
            </h1>
            <div className="mt-14 md:mt-20 flex flex-wrap gap-10">
              <div>
                <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-olive/80 mb-1">Fecha</div>
                <div className="text-[18px]">{dateStr}</div>
              </div>
              <div>
                <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-olive/80 mb-1">Lugar</div>
                <div className="text-[18px]">{location}</div>
              </div>
            </div>
          </div>

          <div className="relative aspect-[4/5] bg-sage overflow-hidden rounded-[4px]">
            <img src={IMG.hero} alt="Carlos y Laura" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="mt-16 border-y border-olive/35 overflow-hidden whitespace-nowrap py-[14px] font-serif italic text-[28px] text-olive">
          <div className="inline-block animate-ticker">
            {Array.from({ length: 2 }).map((_, k) => (
              <span key={k}>
                <span className="px-6">Carlos &amp; Laura</span><span className="px-6 text-pink">●</span>
                <span className="px-6">Sí, quiero</span><span className="px-6 text-pink">●</span>
                <span className="px-6">Dalías · Almerimar · El Ejido</span><span className="px-6 text-pink">●</span>
                <span className="px-6">Una tarde de Agosto</span><span className="px-6 text-pink">●</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Countdown({ target }) {
  const { d, h, m, s } = useCountdown(target);
  const cell = (n, lbl, last) => (
    <div className={'pt-20 md:pt-24 pb-10 text-left ' + (last ? '' : 'border-r border-cream/50')}>
      <div className="font-serif italic font-normal text-cream tracking-[-0.02em]"
           style={{ fontSize: 'clamp(72px, 11vw, 160px)', lineHeight: 1 }}>
        {String(n).padStart(2, '0')}
      </div>
      <div className="font-mono text-[11px] tracking-[0.2em] uppercase mt-4 text-cream/80">{lbl}</div>
    </div>
  );
  return (
    <section className="bg-pink text-cream py-20 relative">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="flex justify-between items-baseline mb-7 font-mono text-[11px] tracking-[0.2em] uppercase">
          <span>— Cuenta atrás</span>
          <span>Hasta el sí, quiero</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 border-t border-cream/50">
          {cell(d, 'Días')}
          {cell(h, 'Horas')}
          {cell(m, 'Minutos')}
          {cell(s, 'Segundos', true)}
        </div>
        <div className="mt-6 font-serif italic text-[28px] text-cream">
          Cada segundo que pasa nos acerca un poquito más a vosotros.
        </div>
      </div>
    </section>
  );
}

function Intro() {
  return (
    <section id="historia" className="bg-cream py-28">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="grid md:grid-cols-[1fr_1.4fr] gap-20 items-start">
          <div className="aspect-[3/4] overflow-hidden bg-sage rounded-[4px]">
            <img src={IMG.intro} alt="Carlos y Laura en el campo" className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="font-mono text-[12px] tracking-[0.18em] uppercase text-pink">— Nos casamos</span>
            <h2 className="font-serif italic font-normal text-olive-deep leading-none mt-2 mb-7"
                style={{ fontSize: 'clamp(48px, 6vw, 84px)' }}>
              Y queremos<br/>celebrarlo contigo.
            </h2>
            <p className="text-[19px] leading-[1.6] text-ink/85 mb-[18px] max-w-[56ch]">
              Después de años bailando juntos, riéndonos a carcajadas y planeando viajes que casi siempre acababan en otro sitio del previsto, hemos decidido que toca firmar los papeles. Y vestirnos guapos. Y comer mucho.
            </p>
            <p className="text-[19px] leading-[1.6] text-ink/85 max-w-[56ch]">
              Esta página es nuestra forma de contártelo todo en un sitio: la hora, el sitio, cómo llegar y cómo seguirnos la fiesta hasta el final. Si tienes dudas, escríbenos. Si no, confirma cuanto antes — nos hace mucha ilusión.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function EventBlock({ id, label, theme, num, title, when, body, meta, mapsUrl }) {
  const palette = { olive: 'bg-olive text-cream', sage: 'bg-sage text-olive-deep' }[theme];
  const btnHover = theme === 'olive' ? 'hover:bg-cream hover:text-olive-deep' : 'hover:bg-olive-deep hover:text-cream';
  return (
    <section id={id} className={`${palette} py-28 overflow-hidden relative`}>
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="grid md:grid-cols-[0.9fr_1.1fr] gap-16 items-start">
          <div className="flex flex-col gap-[18px]">
            <span className="font-mono text-[11px] tracking-[0.2em] uppercase opacity-70">{num} — {label}</span>
            <h2 className="font-serif italic font-normal leading-[0.9] tracking-[-0.02em] m-0"
                style={{ fontSize: 'clamp(72px, 9vw, 140px)' }}
                dangerouslySetInnerHTML={{ __html: title }} />
            <div className="font-serif italic text-[32px] opacity-90">{when}</div>
          </div>
          <div>
            <p className="text-[19px] leading-[1.6] max-w-[50ch] mb-7 opacity-90"
               dangerouslySetInnerHTML={{ __html: body }} />
            <div className="grid grid-cols-2 gap-x-10 gap-y-7 pt-6 border-t border-current/40">
              {meta.map((m, i) => (
                <div key={i}>
                  <div className="font-mono text-[10px] tracking-[0.2em] uppercase opacity-65 mb-1.5">{m.lbl}</div>
                  <div className="text-[17px] leading-[1.35]" dangerouslySetInnerHTML={{ __html: m.val }} />
                </div>
              ))}
            </div>
            <a className={`inline-flex items-center gap-2.5 px-[18px] py-3 rounded-full border border-current font-mono text-[11px] tracking-[0.18em] uppercase mt-6 transition ${btnHover}`}
               href={mapsUrl} target="_blank" rel="noopener noreferrer">
              <span>Cómo llegar</span><span>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Ceremony() {
  return (
    <EventBlock
      id="ceremonia"
      theme="olive"
      label="La Ceremonia"
      num="01"
      title="La<br/>iglesia"
      when="18:00 h · puntuales, por favor"
      body="Nos daremos el «sí, quiero» en la <strong>Parroquia de Dalías</strong>, en pleno centro del pueblo. Una iglesia preciosa en un pueblo blanco de la sierra de Gádor. Te recomendamos llegar quince minutos antes — el sitio no es enorme y queremos veros bien colocados antes de que entre Laura."
      meta={[
        { lbl: 'Lugar', val: 'Parroquia de Dalías<br/>Plaza de la Iglesia<br/>04750 Dalías, Almería' },
        { lbl: 'Hora', val: '18:00 h<br/>Sábado 29 de Agosto' },
        { lbl: 'Aparcamiento', val: 'Plazas en las calles colindantes. Mejor venir en el bus.' },
        { lbl: 'Duración', val: '≈ 45 minutos' },
      ]}
      mapsUrl="https://maps.app.goo.gl/PxNKugG6U5ymPZjX6?g_st=iw"
    />
  );
}

function Reception() {
  return (
    <EventBlock
      id="convite"
      theme="sage"
      label="El Convite"
      num="02"
      title="Paraíso<br/>al Mar"
      when="A continuación · hasta que el cuerpo aguante"
      body="Después de la ceremonia, nos vamos al <strong>Paraíso al Mar</strong>: cóctel al fresco, cena larga, sobremesa eterna y barra libre con DJ. Bailes garantizados, gambas también. Trae zapato cómodo en el bolso."
      meta={[
        { lbl: 'Lugar', val: 'Paraíso al Mar<br/>Almerimar, Almería' },
        { lbl: 'Inicio', val: '≈ 19:30 h<br/>Cóctel de bienvenida' },
        { lbl: 'Cena', val: '21:00 h<br/>Menú con opciones' },
        { lbl: 'Barra libre', val: 'Hasta las 07:00<br/>Resaca opcional' },
      ]}
      mapsUrl="https://maps.app.goo.gl/nxrreqmfAusp7vGdA?g_st=iw"
    />
  );
}

const BUS_ROUTES = {
  'almerimar-dalias': {
    label: 'Almerimar → Dalías (Iglesia)',
    note: 'Para llegar a la ceremonia. Sale del paseo, junto al hotel.',
    stops: [
      { time: '17:00', where: 'Almerimar', detail: 'Paseo marítimo · frente al puerto' },
      { time: '17:25', where: 'El Ejido', detail: 'Plaza Mayor · parada intermedia' },
      { time: '17:50', where: 'Dalías', detail: 'Plaza de la Iglesia · llegada' },
    ],
  },
  'ejido-dalias': {
    label: 'El Ejido → Dalías (Iglesia)',
    note: 'Directo desde El Ejido hasta la parroquia.',
    stops: [
      { time: '17:15', where: 'El Ejido', detail: 'Plaza Mayor · salida' },
      { time: '17:40', where: 'Dalías', detail: 'Plaza de la Iglesia · llegada' },
    ],
  },
  'dalias-paraiso': {
    label: 'Dalías → Paraíso al Mar (Convite)',
    note: 'Te lleva directo de la ceremonia al convite.',
    stops: [
      { time: '19:00', where: 'Dalías', detail: 'Salida desde la iglesia' },
      { time: '19:25', where: 'El Ejido', detail: 'Parada intermedia · opcional' },
      { time: '19:45', where: 'Paraíso al Mar', detail: 'Almerimar · llegada al convite' },
    ],
  },
  'paraiso-vuelta': {
    label: 'Paraíso al Mar → vuelta',
    note: 'Dos turnos de vuelta a Almerimar / El Ejido.',
    stops: [
      { time: '02:00', where: 'Primer turno', detail: 'Almerimar y El Ejido' },
      { time: '04:00', where: 'Segundo turno', detail: 'Almerimar y El Ejido · cierre' },
    ],
  },
};

function Transport() {
  const keys = Object.keys(BUS_ROUTES);
  const [active, setActive] = useState(keys[0]);
  const route = BUS_ROUTES[active];
  return (
    <section id="bus" className="bg-cream py-28">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-10 mb-14">
          <div>
            <span className="font-mono text-[12px] tracking-[0.18em] uppercase text-pink">— En autobús</span>
            <h2 className="font-serif italic font-normal text-olive-deep leading-[0.9] mt-2"
                style={{ fontSize: 'clamp(64px, 8vw, 120px)' }}>
              Sin coche,<br/>sin alcoholímetro.
            </h2>
          </div>
          <p className="max-w-[38ch] text-[17px] leading-[1.5] text-ink/80">
            Hemos puesto autobuses gratuitos para llevarte y traerte. Apúntate al confirmar asistencia — necesitamos saber cuántos asientos reservar. Salidas puntuales.
          </p>
        </div>

        <div className="flex flex-wrap border-b border-olive/30 mb-7" role="tablist">
          {keys.map((k) => {
            const sel = active === k;
            return (
              <button
                key={k}
                role="tab"
                aria-selected={sel}
                onClick={() => setActive(k)}
                className={`relative px-6 pt-4 pb-3.5 font-mono text-[11px] tracking-[0.18em] uppercase cursor-pointer transition ${sel ? 'text-ink' : 'text-ink/55 hover:text-ink/80'}`}
              >
                {BUS_ROUTES[k].label}
                {sel && <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-pink" />}
              </button>
            );
          })}
        </div>

        <div className="bg-sage rounded-[4px] p-8 md:p-12 relative">
          <div className="absolute top-6 right-8 font-mono text-[11px] tracking-[0.2em] uppercase text-olive-deep flex items-center gap-2 max-w-[60%] text-right">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
              <rect x="3" y="6" width="18" height="11" rx="2"/>
              <circle cx="7.5" cy="18.5" r="1.5"/>
              <circle cx="16.5" cy="18.5" r="1.5"/>
              <path d="M3 10h18M9 6V4h6v2"/>
            </svg>
            <span className="hidden sm:inline">Bus · {route.note}</span>
          </div>
          <div className="grid md:grid-cols-3 gap-y-6 mt-12 md:mt-6">
            {route.stops.map((s, i) => (
              <div key={i} className={`md:pr-8 ${i > 0 ? 'md:pl-8 md:border-l border-dashed border-olive/40' : ''}`}>
                <div className="font-serif italic text-olive-deep leading-none text-[56px]">{s.time}</div>
                <div className="font-semibold text-[18px] mt-3.5 text-olive-deep">{s.where}</div>
                <div className="font-mono text-[11px] tracking-[0.14em] uppercase mt-1.5 text-olive-deep/70">{s.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  const items = [
    { src: IMG.gallery[0], cls: 'col-span-2 row-span-4' },
    { src: IMG.gallery[1], cls: 'col-span-2 row-span-3' },
    { src: IMG.gallery[2], cls: 'col-span-2 row-span-4' },
    { src: IMG.gallery[3], cls: 'col-span-3 row-span-3' },
    { src: IMG.gallery[4], cls: 'col-span-3 row-span-3' },
  ];
  return (
    <section className="bg-cream py-28">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="mb-10">
          <span className="font-mono text-[12px] tracking-[0.18em] uppercase text-pink">— Nosotros</span>
          <h2 className="font-serif italic font-normal text-olive-deep leading-[0.95] mt-2"
              style={{ fontSize: 'clamp(56px, 7vw, 96px)' }}>
            Antes de la boda,<br/>el rodaje.
          </h2>
        </div>
        <div className="grid grid-cols-6 gap-3 [grid-auto-rows:120px]">
          {items.map((it, i) => (
            <div key={i} className={`overflow-hidden rounded-[2px] bg-sage ${it.cls}`}>
              <img src={it.src} alt="" className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const SCHEDULE = [
  { time: '17:00', name: 'Salida del bus desde Almerimar', place: 'Paseo marítimo' },
  { time: '17:15', name: 'Salida del bus desde El Ejido', place: 'Plaza Mayor' },
  { time: '18:00', name: 'Ceremonia', place: 'Parroquia de Dalías' },
  { time: '18:45', name: 'Lluvia de pétalos y abrazos', place: 'Atrio de la iglesia' },
  { time: '19:00', name: 'Bus hacia el convite', place: 'Dalías → Paraíso al Mar' },
  { time: '19:30', name: 'Cóctel de bienvenida', place: 'Paraíso al Mar · jardín' },
  { time: '21:00', name: 'Cena', place: 'Salón principal' },
  { time: '23:30', name: 'Fiesta', place: 'Pista y terraza' },
  { time: '02:00', name: 'Primer bus de vuelta', place: 'Almerimar / El Ejido' },
  { time: '07:00', name: 'Segundo bus · cierre', place: 'Almerimar / El Ejido' },
];

function Timeline() {
  return (
    <section id="agenda" className="bg-olive text-cream py-28">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="mb-14">
          <span className="font-mono text-[12px] tracking-[0.18em] uppercase text-orange">— Agenda del día</span>
          <h2 className="font-serif italic font-normal leading-[0.9] mt-2"
              style={{ fontSize: 'clamp(64px, 8vw, 120px)' }}>
            Una tarde,<br/>una noche,<br/>una mañana.
          </h2>
        </div>
        <div>
          {SCHEDULE.map((row, i) => (
            <div key={i} className="grid grid-cols-[100px_1fr] md:grid-cols-[140px_1fr_auto] gap-x-8 items-baseline py-6 border-t border-cream/30 last:border-b">
              <div className="font-serif italic text-[36px]">{row.time}</div>
              <div className="text-[22px]">{row.name}</div>
              <div className="font-mono text-[10px] md:text-[11px] tracking-[0.18em] uppercase text-cream/65 col-start-2 md:col-start-3">{row.place}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5 mb-[18px]">
      <label className="font-mono text-[10px] tracking-[0.18em] uppercase text-ink/65">{label}</label>
      {children}
    </div>
  );
}

function Choice({ pressed, onClick, variant, children }) {
  let pressedCls = 'bg-ink text-cream border-ink';
  if (pressed && variant === 'yes') pressedCls = 'bg-olive text-cream border-olive';
  if (pressed && variant === 'no') pressedCls = 'bg-pink text-cream border-pink';
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`px-4 py-2.5 border rounded-full font-mono text-[11px] tracking-[0.16em] uppercase cursor-pointer transition ${pressed ? pressedCls : 'border-ink/20 text-ink hover:border-ink'}`}
    >
      {children}
    </button>
  );
}

const FAQS = [
  { q: '¿Puedo llevar acompañante?', a: 'Sí, si vuestra invitación lo incluye. En el formulario de asistencia podrás indicar cuántos sois.' },
  { q: '¿Hay sitio para dejar a los niños?', a: 'La ceremonia y el convite son aptos para peques, pero no hemos preparado canguro en el sitio. Si vienes con niños, avísanos en las notas del RSVP.' },
  { q: '¿Dónde puedo dormir?', a: 'Te recomendamos Almerimar (a 15 min en coche del convite) o El Ejido. Hay hoteles para todos los bolsillos. El bus de vuelta sale desde el Paraíso al Mar a las 02:00 y a las 04:00.' },
  { q: '¿Hay aparcamiento en la iglesia?', a: 'Plazas limitadas en las calles del centro de Dalías. Lo más cómodo es venir en el autobús que sale de Almerimar y El Ejido.' },
  { q: '¿Habrá menú especial para alergias?', a: 'Sí. Tenemos opciones vegetarianas, veganas, sin gluten y sin lactosa. Indícalo en el RSVP antes del 15 de mayo.' },
  { q: '¿Cuándo cierra la fiesta?', a: 'A las 04:00 sale el último bus desde Paraíso al Mar. Si te quedas más, tendrás que organizarte la vuelta.' },
];

function FAQ() {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <section id="faq" className="bg-cream py-28">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 gap-6">
          <div>
            <span className="font-mono text-[12px] tracking-[0.18em] uppercase text-pink">— Preguntas frecuentes</span>
            <h2 className="font-serif italic font-normal text-olive-deep leading-[0.95] mt-2"
                style={{ fontSize: 'clamp(56px, 7vw, 96px)' }}>
              Por si te queda<br/>alguna duda.
            </h2>
          </div>
          <p className="text-ink/70 max-w-[32ch]">¿No la encuentras? Escríbenos a nuestro WhatsApp</p>
        </div>
        <div className="border-t border-olive/30">
          {FAQS.map((f, i) => {
            const open = openIdx === i;
            return (
              <div key={i} className={`border-b border-olive/30 ${open ? 'faq-open' : ''}`}>
                <button
                  type="button"
                  onClick={() => setOpenIdx(open ? -1 : i)}
                  className="w-full bg-transparent border-0 py-7 flex justify-between items-center text-left cursor-pointer font-serif italic text-[28px] text-olive-deep"
                >
                  <span>{f.q}</span>
                  <span className={`faq-plus font-mono text-[20px] w-9 h-9 rounded-full inline-flex items-center justify-center shrink-0 transition-transform ${open ? 'bg-pink text-cream' : 'bg-olive text-cream'}`}>+</span>
                </button>
                <div className="faq-a">
                  <div>
                    <p className="pb-7 m-0 text-[17px] leading-[1.6] text-ink/80 max-w-[70ch]">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-olive-deep text-cream pt-20 pb-10">
      <div className="max-w-[1280px] mx-auto px-8">
        <h2 className="font-serif italic leading-[0.86] text-center m-0 tracking-[-0.02em] text-cream"
            style={{ fontSize: 'clamp(120px, 20vw, 280px)' }}>
          C <span className="italic text-pink">&amp;</span> L
        </h2>
        <div className="flex flex-col sm:flex-row justify-between sm:items-baseline mt-14 pt-6 border-t border-cream/20 gap-4 font-mono text-[10px] tracking-[0.2em] uppercase text-cream/60">
          <span>© 2026 · Carlos y Laura</span>
          <span>Dalías · Almerimar · El Ejido</span>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="bg-cream text-ink font-sans">
      <Nav />
      <Hero dateStr={DATE_LABEL} location={WEDDING_LOCATION} />
      <Countdown target={DATE} />
      <Intro />
      <Ceremony />
      <Reception />
      <Transport />
      <Gallery />
      <Timeline />
      <FAQ />
      <Footer />
    </div>
  );
}
