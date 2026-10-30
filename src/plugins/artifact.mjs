/**
 * Plugin de Sätteri (ver youtube.mjs). Convierte un enlace a un artefacto
 * HTML que ocupa él solo un párrafo en una portada. El artefacto no se carga
 * hasta que se pulsa; eso lo hace src/scripts/media.ts.
 *
 * Un artefacto es una página HTML suelta en public/articulos/<artículo>/.
 * Solo cuentan los enlaces a esa carpeta: un enlace a otra página .html no
 * se toca. Sin JavaScript la portada sigue siendo un enlace al artefacto.
 */

function textOf(node) {
  if (node.type === 'text') return node.value;
  return (node.children ?? []).map(textOf).join('');
}

const isBlank = (node) => node.type === 'text' && !node.value.trim();

function facade(href, title) {
  const h = (tagName, properties, children = []) => ({
    type: 'element',
    tagName,
    properties,
    children,
  });
  return h('a', { className: ['artifact'], href, dataArtifact: '' }, [
    h('span', { className: ['artifact-frame'] }, [
      h('span', { className: ['artifact-play'], ariaHidden: 'true' }, [
        h('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'currentColor' }, [
          h('path', { d: 'M8 5v14l11-7z' }),
        ]),
      ]),
    ]),
    h('span', { className: ['artifact-title'] }, [{ type: 'text', value: title }]),
  ]);
}

export const artifact = {
  name: 'artifact',
  element: {
    filter: ['p'],
    visit(node) {
      const content = node.children.filter((c) => !isBlank(c));
      const link = content[0];
      if (content.length !== 1 || link.type !== 'element' || link.tagName !== 'a') return;
      const href = String(link.properties.href ?? '');
      if (!/^\/articulos\/[^/]+\/[^/]+\.html$/.test(href)) return;
      const text = textOf(link).trim();
      return facade(href, text && text !== href ? text : href.split('/').pop());
    },
  },
};
