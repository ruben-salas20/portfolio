/**
 * Plugin de Sätteri, el procesador de Markdown de Astro 7 (los plugins de
 * rehype ya no sirven sin instalar el procesador antiguo). Convierte un
 * enlace de YouTube que ocupa él solo un párrafo en una portada: miniatura
 * y botón de play. El reproductor de YouTube no se carga hasta que se pulsa;
 * eso lo hace src/scripts/media.ts.
 *
 * La portada sigue siendo un enlace al vídeo, así que sin JavaScript abre
 * YouTube. Un enlace de YouTube dentro de una frase no se toca.
 */

// Acepta youtube.com/watch?v=ID y youtu.be/ID; los ID tienen 11 caracteres.
function youtubeId(href) {
  let url;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^(www\.|m\.)/, '');
  const id =
    host === 'youtu.be'
      ? url.pathname.slice(1)
      : host === 'youtube.com' && url.pathname === '/watch'
        ? url.searchParams.get('v')
        : null;
  return id && /^[\w-]{11}$/.test(id) ? id : null;
}

function textOf(node) {
  if (node.type === 'text') return node.value;
  return (node.children ?? []).map(textOf).join('');
}

const isBlank = (node) => node.type === 'text' && !node.value.trim();

function facade(id, href, title) {
  const h = (tagName, properties, children = []) => ({
    type: 'element',
    tagName,
    properties,
    children,
  });
  return h('a', { className: ['youtube'], href, dataYoutubeId: id }, [
    h('span', { className: ['youtube-frame'] }, [
      // hqdefault existe para todos los vídeos; las variantes más grandes no.
      h('img', {
        src: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        alt: '',
        loading: 'lazy',
        decoding: 'async',
        width: 480,
        height: 360,
      }),
      h('span', { className: ['youtube-play'], ariaHidden: 'true' }, [
        h('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'currentColor' }, [
          h('path', { d: 'M8 5v14l11-7z' }),
        ]),
      ]),
    ]),
    h('span', { className: ['youtube-title'] }, [{ type: 'text', value: title }]),
  ]);
}

export const youtube = {
  name: 'youtube',
  element: {
    filter: ['p'],
    // Devolver un nodo sustituye al párrafo; no devolver nada lo deja igual.
    visit(node) {
      const content = node.children.filter((c) => !isBlank(c));
      const link = content[0];
      if (content.length !== 1 || link.type !== 'element' || link.tagName !== 'a') return;
      const href = String(link.properties.href ?? '');
      const id = youtubeId(href);
      if (!id) return;
      // Un enlace pegado sin más tiene la URL como texto: no sirve de título.
      const text = textOf(link).trim();
      return facade(id, href, text && text !== href ? text : 'Vídeo de YouTube');
    },
  },
};
