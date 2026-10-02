# Isabel y Amaro · 2027

Web de la boda de Isabel y Amaro. Sitio estático (HTML + CSS + JS), sin dependencias
ni proceso de compilación: se abre con doble clic y se publica en GitHub Pages.

Paleta verde oliva oscuro, cal blanca y oro viejo. La portada es una composición
centrada tipo invitación: los nombres flanquean la foto, que va en un arco apuntado
de inspiración nazarí con el "&" como sello dorado. Tipografías *Bodoni Moda*
(títulos) y *Hanken Grotesk* (texto). Los colores están como variables al principio
de [`assets/css/styles.css`](assets/css/styles.css).

La página sigue el recorrido de un invitado: portada → bienvenida → **el gran día**
(lugares con mapa, programa y vestimenta) → **confirmación** → alojamiento y
transporte → regalo → preguntas. El botón «Confirmar asistencia» está siempre a mano
en el menú.

## Qué hay que rellenar

### En `assets/js/main.js` (objeto `BODA`)

```js
const BODA = {
  fecha: '2027-04-03T13:00:00+02:00',   // fecha y hora de la ceremonia
  duracionHoras: 14,                    // duración para «Añadir al calendario»
  lugar: 'Granada',                     // lugar en la invitación de calendario
  formulario: 'https://forms.gle/...',  // enlace al formulario de confirmación
  limiteConfirmacion: '1 de abril de 2027',
  direcciones: {                        // dirección de cada lugar (Google Maps)
    ceremony:  'Granada centro',
    reception: 'Granada centro'
  },
  iban: 'ES00 0000 ...',                // cuenta para el regalo
  titular: '',                          // titular de la cuenta (vacío = no se muestra)
  whatsapp: ''                          // p. ej. '34600111222' (vacío = sin enlace)
};
```

- `fecha` actualiza a la vez la cuenta atrás, la fecha de la portada, la de «El gran
  día», la del pie y el evento de calendario.
- Cada dirección de `direcciones` alimenta el mapa incrustado y el enlace «Cómo
  llegar», que abre la ruta en Google Maps.

### En `index.html`

- [ ] Nombre de la iglesia y de la finca, y su dirección escrita
- [ ] Horas del programa del día (y la del primer autobús de vuelta)
- [ ] Hoteles recomendados, precios y enlaces de reserva
- [ ] Repasar las preguntas frecuentes

### Fotos

La foto de la portada es temporal (`picsum.photos`). Sustituidla por la de la
pareja, idealmente **vertical (4:5)** y de unos 1200 px de ancho: guardadla en
`assets/img/` y cambiad el `src` en `index.html`. Haced lo mismo con
`og:image` (la imagen que aparece al compartir el enlace), en horizontal 1200×630.

```html
<div class="arch__photo">
  <img src="assets/img/portada.jpg" alt="" width="1200" height="1500" fetchpriority="high" decoding="async">
</div>
```

## Formulario de confirmación

La web no tiene servidor, así que la confirmación se delega en un formulario
externo (igual que hace WithJoy enlazando a Google Forms). Crea un
[Google Form](https://forms.google.com) con estos campos y pega el enlace corto en
`BODA.formulario`. Basta con **una respuesta por invitación**: los acompañantes y
los niños se indican dentro del mismo formulario.

1. Nombre y apellidos
2. ¿Asistirás? (sí / no)
3. Nombre de los acompañantes
4. Menú especial o alergias (texto libre)
5. ¿Necesitas autobús? (ida / vuelta / ambos / no)
6. Niños y edades
7. Comentarios

Las respuestas caen en una hoja de cálculo que podéis consultar cuando queráis.

## Ver la web en local

```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

## Publicar

El workflow [`.github/workflows/pages.yml`](.github/workflows/pages.yml) publica
automáticamente en GitHub Pages cada vez que se hace push a `main`. Para activarlo:

**Settings → Pages → Build and deployment → Source: GitHub Actions**

Ojo: GitHub Pages sirve el contenido **públicamente** aunque el repositorio sea
privado. La web ya lleva `noindex` para no aparecer en Google, pero si queréis que
sea realmente privada, usad un hosting con contraseña (Netlify o Vercel lo
permiten) o un dominio con acceso restringido.

## Estructura

```
index.html              una sola página con todas las secciones
assets/css/styles.css   estilos (paleta y tipografía en :root)
assets/js/main.js       configuración, calendario, cuenta atrás, menú, copiar IBAN
assets/img/             imágenes
```

## Accesibilidad y detalles

- Responsive hasta 360 px de ancho
- Navegación por teclado, `prefers-reduced-motion` y textos con contraste AA
- «Añadir al calendario» para Google Calendar y Apple/Outlook (`.ics`)
- Hoja de estilos de impresión (las preguntas se imprimen desplegadas)
- `noindex` para que no se indexe en buscadores
