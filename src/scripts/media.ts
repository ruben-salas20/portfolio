/**
 * Reproductores de los artículos. Solo se carga en las páginas de artículo.
 *
 * - Audio: cambia el reproductor del navegador, que cada uno pinta a su
 *   manera, por uno con el estilo de la página. Sin JS se queda el del
 *   navegador, porque el <audio> lleva `controls`.
 * - YouTube: la portada que genera src/plugins/youtube.mjs se
 *   cambia por el reproductor de YouTube al pulsarla. Sin JS es un enlace.
 */

const ICONS = `
  <svg class="icon-play" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4v16l13-8z" /></svg>
  <svg class="icon-pause" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 4h4v16H6zM14 4h4v16h-4z" /></svg>`;

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return '0:00';
  const s = Math.floor(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function setupAudio(audio: HTMLAudioElement, labels: DOMStringMap) {
  const player = document.createElement('div');
  player.className = 'audio-player';
  // Los controles van en el idioma de la interfaz; el título, en el del
  // artículo, que lo hereda del <article>.
  player.innerHTML = `
    <button type="button" class="audio-toggle">${ICONS}</button>
    <div class="audio-body">
      <input type="range" class="audio-seek" min="0" max="0" step="0.1" value="0" />
    </div>
    <span class="audio-time">0:00 / 0:00</span>`;

  const toggle = player.querySelector<HTMLButtonElement>('.audio-toggle')!;
  const seek = player.querySelector<HTMLInputElement>('.audio-seek')!;
  const time = player.querySelector<HTMLSpanElement>('.audio-time')!;
  toggle.lang = labels.lang!;
  seek.lang = labels.lang!;
  toggle.setAttribute('aria-label', labels.play!);
  seek.setAttribute('aria-label', labels.seek!);

  if (audio.title) {
    const title = document.createElement('span');
    title.className = 'audio-title';
    title.textContent = audio.title;
    seek.before(title);
  }

  audio.removeAttribute('controls');
  // Basta con la duración para pintar el reproductor; el resto del archivo
  // se descarga al darle a play.
  audio.preload = 'metadata';
  audio.replaceWith(player);
  player.append(audio);

  const update = () => {
    seek.max = String(audio.duration || 0);
    seek.value = String(audio.currentTime);
    const text = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
    time.textContent = text;
    seek.setAttribute(
      'aria-valuetext',
      `${formatTime(audio.currentTime)} ${labels.of} ${formatTime(audio.duration)}`,
    );
  };
  const setPlaying = (playing: boolean) => {
    player.classList.toggle('playing', playing);
    toggle.setAttribute('aria-label', playing ? labels.pause! : labels.play!);
  };

  audio.addEventListener('loadedmetadata', update);
  audio.addEventListener('timeupdate', update);
  audio.addEventListener('play', () => setPlaying(true));
  audio.addEventListener('pause', () => setPlaying(false));
  audio.addEventListener('ended', () => setPlaying(false));
  // Si los metadatos llegaron antes de engancharse al evento.
  if (audio.readyState >= 1) update();

  toggle.addEventListener('click', () => {
    if (audio.paused) audio.play();
    else audio.pause();
  });
  seek.addEventListener('input', () => {
    audio.currentTime = Number(seek.value);
  });
}

function setupYoutube(link: HTMLAnchorElement) {
  link.addEventListener('click', (event) => {
    // Ctrl/Cmd + clic o clic central: que abra YouTube en otra pestaña.
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey) return;
    event.preventDefault();

    const title = link.querySelector('.youtube-title')?.textContent ?? '';
    const iframe = document.createElement('iframe');
    // youtube-nocookie: YouTube no guarda cookies hasta que se reproduce.
    iframe.src = `https://www.youtube-nocookie.com/embed/${link.dataset.youtubeId}?autoplay=1`;
    iframe.title = title;
    iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    iframe.allowFullscreen = true;

    const frame = document.createElement('span');
    frame.className = 'youtube-frame';
    frame.append(iframe);
    const wrapper = document.createElement('div');
    wrapper.className = 'youtube';
    wrapper.append(frame, link.querySelector('.youtube-title')!);
    link.replaceWith(wrapper);
    // El foco estaba en el enlace, que ya no existe: pasa al reproductor.
    iframe.focus();
  });
}

// Al final: ICONS es una constante y no existe hasta que se ejecuta su línea.
const article = document.querySelector<HTMLElement>('article[data-play]');
if (article) {
  article.querySelectorAll('audio').forEach((audio) => setupAudio(audio, article.dataset));
  article
    .querySelectorAll<HTMLAnchorElement>('a.youtube[data-youtube-id]')
    .forEach(setupYoutube);
}
