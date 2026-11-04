/**
 * Plugin de Sätteri (ver youtube.mjs). Traduce los textos de la sección de
 * notas al pie. Sätteri solo acepta unos textos para todo el sitio, y cada
 * artículo está en un idioma: aquí se elige por el nombre del archivo
 * (es.md o en.md). Sin archivo, como en las recetas, quedan los de Sätteri,
 * en inglés.
 */

const TEXTS = {
  es: { label: 'Notas', back: (n) => `Volver a la referencia ${n}` },
  en: { label: 'Footnotes', back: (n) => `Back to reference ${n}` },
};

function langOf(fileURL) {
  const match = fileURL?.pathname.match(/\/(es|en)\.md$/);
  return match ? match[1] : null;
}

export const footnotes = {
  name: 'footnotes',
  element: {
    filter: ['h2', 'a'],
    visit(node, ctx) {
      const lang = langOf(ctx.fileURL);
      if (!lang) return;
      const texts = TEXTS[lang];
      const props = node.properties ?? {};
      if (node.tagName === 'h2' && props.id === 'footnote-label') {
        return { ...node, children: [{ type: 'text', value: texts.label }] };
      }
      // El número de la nota sale del href: "#user-content-fnref-2" o, si se
      // cita dos veces, "#user-content-fnref-2-2".
      if (node.tagName === 'a' && props.dataFootnoteBackref !== undefined) {
        const ref = String(props.href ?? '').match(/fnref-(.+)$/)?.[1] ?? '';
        return { ...node, properties: { ...props, ariaLabel: texts.back(ref) } };
      }
    },
  },
};
