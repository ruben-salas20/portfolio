# Portafolio de Rubén

La hoja de vida de Rubén Salas, en Astro, en español y en inglés. Rubén no sabe Astro, HTML ni CSS: mantiene el sitio con agentes. Los porqués técnicos están en los comentarios del código; léelos antes de cambiar algo. Aquí va lo que el código no dice.

## Con Rubén

- Las decisiones técnicas las tomas tú. A Rubén pregúntale solo lo suyo: qué dice el sitio y cómo se ve.
- Tras cada cambio, comprueba con `npm run build` (no hay tests ni linter). Después arranca `npm run dev`, si no está en marcha, y dale la URL: Rubén revisa los cambios en vivo.
- El build no comprueba tipos. No uses `astro check`: con `npx` instala otra versión de Astro. Revisa a mano que cada texto de la interfaz exista en los dos idiomas.
- Vercel publica lo que está en `origin/main`, no lo local. Si Rubén no ve un cambio en el sitio, mira primero si está commiteado y pusheado.

## Contenido

El sitio dice lo que Rubén sabe y hace, nada más.

- **Dirigir agentes:** Rubén presenta construir dirigiendo agentes de IA como una habilidad que mejora, no como una disculpa. Por eso las etiquetas de autoría de los proyectos están ocultas (`showAuthorship`). El límite se mantiene: el sitio no afirma que Rubén sepa hacer a mano lo que hizo un agente.

- **Tecnologías:** en uso, solo lo que Rubén usa por su cuenta, sin IA; que salga en un repo suyo no basta. En aprendizaje, lo que estudia ahora, no lo que planea.
- **Proyectos:** uno entra si sigue vivo y si lo que dice su descripción existe en el código. Si dudas de si lo escribió él o lo dirigió con IA, pregúntale.
- **Texto de Rubén** (el párrafo «Cómo trabajo» y los artículos): corrige solo ortografía y puntuación, y conserva su forma de hablar. Pulir el estilo lo hace sonar a IA. Una traducción hecha con IA se marca como tal.
- **Plantilla de artículos:** es el catálogo de lo que admite un artículo y la referencia de Rubén. Siempre con `draft: true`. Si un artículo admite algo nuevo, añádelo ahí.
- **Imagen para compartir** (`og-image.png`): en español y sin la etiqueta «Disponible para trabajar», para que no caduque.

## Escena

La escena está oculta por decisión de Rubén (`showScene` en `Portfolio.astro`). La escena en pixel art ilustra el párrafo «Cómo trabajo»: si cambia uno, cambia el otro. Clawd, la mascota de Anthropic, se usa tal cual por decisión de Rubén. La primera franja es la de Rubén, en los márgenes y en móvil.
