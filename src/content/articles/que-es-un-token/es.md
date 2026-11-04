---
title: Qué es un token
description: La inteligencia artificial no lee letras ni palabras. Lee tokens. Qué son, quién los decide y qué rarezas causan.
date: 2026-11-04
draft: false
---

## Antes de iniciar

Hola! Este es el primer artículo de una serie que iniciaré llamada **Lo técnico para no técnicos**, hecha para entender la inteligencia artificial actual desde cero sin que haga falta saber nada de computadoras. Cada artículo se apoya en el anterior y este es el primero de todos. Se publicarán los días miércoles a las 1:00 PM (UTC-5). Espero te guste y te sea útil para aprender, gracias por leer!

## El token, una palabra que está en todas partes

Si usas ChatGPT, Claude, Gemini o cualquier otra IA, es seguro que ya te has topado con los tokens, aunque no lo sepas.

- Cuando la IA te avisa de que llegaste a tu límite de uso, lo que se te acabó son sobre todo tokens.
- Cuando una empresa de IA publica sus precios, cobra por cada millón de tokens.
- Cuando presentan una IA nueva, presumen de que puede leer o generar X cantidad de tokens.

Todos los cuentan y todos los cobran, pero casi nadie explica qué son. En este artículo te lo explico, vamos a ver: qué es un token, quién decide cómo es cada uno y qué rarezas causan.

## ¿Letras o palabras?

Primero, un secreto: las computadoras no entienden letras, solo números. Así que, antes de leer un texto, la IA lo parte en piezas y le da un número a cada pieza, y aquí la pregunta es: ¿qué usamos como pieza?

Hay dos ideas obvias, y las dos tienen un problema.

- **Una letra.** Es fácil: hay pocas letras, el problema es que el texto se vuelve larguísimo porque la IA hace el mismo trabajo por cada pieza que lee, así que leer letra a letra la vuelve muy lenta.
- **Una palabra.** Así el texto queda corto, el problema aquí es que hacen falta millones de números, y aun así faltarían palabras: nombres, errores de escritura, palabras nuevas, un "jajajaja" que si le agregas otro "ja" se volvería otra palabra y la IA no puede leer lo que no está en su lista.

La solución está en el medio: **un trozo de palabra**. Vamos a imaginar un lego: para las partes más comunes ya vienen piezas grandes, pero las partes más pequeñas o complejas se arman con piezas más pequeñas. Y así podemos construir cualquier cosa.

Eso es un **token**: un trozo de palabra o una palabra que se repite mucho. En la frase "El uno es indiscutiblemente menor que el dos.", "uno" es un solo token porque en los textos de entrenamiento se vio muy repetido, en cambio "indiscutiblemente" son 4 tokens: "ind", "isc", "ut" e "iblemente"[^1], porque probablemente se repitió menos en los textos.

Para que captes mejor la idea, pruébalo tú en este artefacto interactivo. Escribe una frase y divídela de las tres maneras para ver la diferencia:

[Tres maneras de cortar una frase](/articulos/que-es-un-token/cortar.html)


## ¿Quién decide qué es un trozo?

Aquí entra el **tokenizador**, mencionado en el artefacto anterior. Resulta que nadie escribe la lista de tokens a mano: la arma este programa que se entrena antes de entrenar la IA. Este se entrena leyendo muchísimo texto y juega a un juego muy simple:

1. Empieza con cada letra como una pieza suelta.
2. Busca la pareja de piezas vecinas que más se repite en todo el texto.
3. Junta esa pareja en una pieza nueva.
4. Vuelve al paso 2, una y otra vez en bucle.

Lo que más se repite acaba en una sola pieza, lo raro se queda en trozos. Mira el siguiente artefacto para entender mejor el proceso:

[El juego de juntar parejas](/articulos/que-es-un-token/juntar.html)

Tras tres juntadas, "gato", que sale mucho, ya es una sola pieza; "pato", que salió un par, quedó en dos partes ("p" y "ato") y "pata", que es la que menos sale, quedó partida en tres ("p", "at" y "a"). Ojo, en este punto el programa no sabe qué significa ninguna palabra, solo cuenta, crea los tokens y les da su ID (el número que le da a cada pieza).

Los tokenizadores de la IA de hoy juegan a lo mismo, solo que a una escala enorme, con muchísimo texto de internet. El tokenizador de GPT-5, por ejemplo, hizo unas 200 000 juntadas. Este juego tiene un nombre técnico: BPE (*Byte-Pair Encoding*, «codificación por pares»).

## Dos rarezas que causan los tokens

### 1. No ve las letras

Hace un tiempo era una prueba conocida preguntarle a la IA cuántas letras "r" tiene la palabra "strawberry" y generalmente se equivocaba[^2]. Esto se debe a que la IA no ve las letras, lee los tokens. Escrita sola, "strawberry" son 3 tokens ("st", "raw", "berry"), y dentro de una pregunta en inglés es uno solo. Las letras quedan escondidas dentro.

Es como si conocieras el concepto y la forma visual de una carretera, te enseñaran la foto de una carretera y te preguntaran cuántas erres tiene: sabes qué es una carretera, pero en la foto no hay letras y como no ves la palabra entonces no sabes la respuesta correcta.

Ya, hoy en día la IA suele acertar porque, antes de responder, escribe la palabra letra a letra: s-t-r-a-w-b-e-r-r-y, así cada letra queda en su propio token y ya puede contarlas. Sigue sin ver las letras, aprendió un truco para esquivar el problema y llegar a la respuesta.

### 2. El español gasta más tokens que el inglés

La misma frase en los dos idiomas:

| Frase | Tokens |
|---|---|
| "Unfortunately, the keys were lost this morning." | 9 |
| "Desafortunadamente las llaves se perdieron esta mañana." | 13 |

Con palabras largas se nota más. "Unfortunately" es un solo token. "Desafortunadamente" en cambio son cuatro tokens ("Des", "af", "ortun" y "adamente").

¿Por qué se da esto? Por el juego de juntar parejas: en internet hay mucho más texto en inglés, así que las palabras en inglés se repitieron más y quedaron enteras, como "gato". Por su parte, las palabras en español quedaron más veces en trozos, como "pata", y como las empresas de IA cobran por token, usar la IA en español sale un poco más caro.

## Resumen rápido

- La IA no lee letras ni palabras: lee **tokens**, trozos de palabras o palabras completas que se repiten mucho.
- Cada token es un número, la IA solo ve una fila de números.
- La lista de tokens sale de un juego: juntar la pareja que más se repite, una y otra vez.
- Entendiendo el token comprendemos por qué le cuesta contar letras y por qué el español gasta más tokens.

## Final

Nuevamente, muchas gracias por leer este artículo, espero que te haya sido útil. Recuerda que puedes seguirme en **[X](https://x.com/rubensalas_dev)** o **[LinkedIn](https://www.linkedin.com/in/ruben-salas17/)** para más contenido, y si tienes alguna pregunta, comentario o sugerencia de un tema, mis DMs están abiertos, estaré encantado de responderte.

Recuerda que los artículos de la serie saldrán cada miércoles a las 1:00 PM (UTC-5). En el próximo artículo vamos a ver qué hace la IA con esos tokens. Spoiler: intenta predecir cuál es el siguiente.

---

[^1]: Verificado para [el tokenizador de OpenAI](https://platform.openai.com/tokenizer).
[^2]: Mira un [post](https://community.openai.com/t/incorrect-count-of-r-characters-in-the-word-strawberry/829618) sobre el caso comentado con GPT-4 en 2024.
