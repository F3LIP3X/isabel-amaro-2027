# Isabel & Amaro · 2027

Web de la boda de Isabel y Amaro. Sitio estático (HTML + CSS + JS), sin dependencias
ni proceso de compilación: se abre con doble clic y se publica en GitHub Pages.

Paleta verde oliva oscuro, cal blanca y oro viejo. La portada es una composición
centrada tipo invitación: los nombres flanquean la foto, que va en un arco apuntado
de inspiración nazarí con el "&" como sello dorado. Tipografías *Bodoni Moda*
(títulos) y *Hanken Grotesk* (texto). Los colores están como variables al principio
de [`assets/css/styles.css`](assets/css/styles.css).

## Qué hay que rellenar

Casi todo lo editable está en un único sitio: el objeto `BODA` al principio de
[`assets/js/main.js`](assets/js/main.js).

```js
const BODA = {
  fecha: '2027-06-12T12:00:00+02:00',   // fecha y hora de la ceremonia
  formulario: 'https://forms.gle/...',  // enlace al formulario de confirmación
  iban: 'ES00 0000 ...',                // cuenta para el regalo
  mapas: { ceremony: '...', reception: '...' },
  limiteConfirmacion: '1 de abril de 2027'
};
```

Cambiando `fecha` se actualizan a la vez la cuenta atrás, la fecha de la portada y
la del pie.

### Pendiente de confirmar en `index.html`

- [ ] Fecha real de la boda (ahora hay un **12 de junio de 2027** de ejemplo)
- [ ] Iglesia y finca: nombre, dirección y horas
- [ ] Horas del itinerario
- [ ] Hoteles recomendados y enlaces de reserva
- [ ] Número de cuenta real
- [ ] Enlace del formulario de confirmación
- [ ] Repasar las preguntas frecuentes

### Fotos

`assets/img/hero.svg` es un marcador de posición. Sustituidlo por la foto de la
pareja, idealmente **vertical (4:5)** y de unos 1200 px de ancho, y actualizad el
`src` en `index.html`:

```html
<figure class="arch">
  <img src="assets/img/hero.jpg" alt="Isabel y Amaro" width="1200" height="1500">
</figure>
```

## Formulario de confirmación

La web no tiene servidor, así que la confirmación se delega en un formulario
externo (igual que hace WithJoy enlazando a Google Forms). Crea un
[Google Form](https://forms.google.com) con estos campos y pega el enlace corto en
`BODA.formulario`:

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
assets/js/main.js       configuración, cuenta atrás, menú, copiar IBAN
assets/img/             imágenes
```

## Accesibilidad y detalles

- Responsive hasta 360 px de ancho
- Navegación por teclado y `prefers-reduced-motion`
- Hoja de estilos de impresión (las FAQ se imprimen abiertas)
- `noindex` para que no se indexe en buscadores
