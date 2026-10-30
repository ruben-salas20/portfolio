/**
 * Botón de copiar en cada bloque de código de artículos y recetas. Sin JS
 * no aparece: el código se sigue pudiendo seleccionar a mano.
 *
 * El botón va en un contenedor alrededor del <pre> y no dentro: el <pre> se
 * desplaza en horizontal y el botón se iría con el texto.
 */

const COPY = `<svg class="icon-copy" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" /></svg>`;
const DONE = `<svg class="icon-done" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5 10 17 19 7" /></svg>`;

const root = document.querySelector<HTMLElement>('[data-copy]');
if (root && navigator.clipboard) {
  const { copy, copied } = root.dataset as { copy: string; copied: string };

  root.querySelectorAll('.prose pre').forEach((pre) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block';
    pre.replaceWith(wrapper);
    wrapper.append(pre);

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'copy-code';
    button.innerHTML = COPY + DONE;
    button.setAttribute('aria-label', copy);
    button.title = copy;
    wrapper.append(button);

    let timer: number | undefined;
    button.addEventListener('click', async () => {
      await navigator.clipboard.writeText(pre.textContent ?? '');
      button.classList.add('done');
      button.setAttribute('aria-label', copied);
      button.title = copied;
      clearTimeout(timer);
      timer = window.setTimeout(() => {
        button.classList.remove('done');
        button.setAttribute('aria-label', copy);
        button.title = copy;
      }, 2000);
    });
  });
}
