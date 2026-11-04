/**
 * Plugin de Sätteri (ver youtube.mjs). Los enlaces a otros sitios abren en
 * una pestaña nueva, para que el lector no pierda el artículo. Los enlaces
 * internos, los saltos a una nota y las portadas de YouTube (que el script
 * convierte en reproductor) se quedan como están.
 */

export const externalLinks = {
  name: 'external-links',
  element: {
    filter: ['a'],
    visit(node) {
      const props = node.properties ?? {};
      const href = String(props.href ?? '');
      if (!/^https?:\/\//.test(href)) return;
      if (new URL(href).hostname.replace(/^www\./, '') === 'rubensalas.dev') return;
      if ([props.className ?? []].flat().includes('youtube')) return;
      return { ...node, properties: { ...props, target: '_blank', rel: ['noopener', 'noreferrer'] } };
    },
  },
};
