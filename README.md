# 🗺️ Mapa Histórico y Cultural de La Para (Córdoba)

Proyecto educativo y comunitario desarrollado para visibilizar y poner en valor los lugares históricos, monumentos y esculturas de la localidad de **La Para (Córdoba, Ansenuza)**, investigados por alumnos y docentes.

---

## ✨ Características Principales

- **Mapa Interactivo:** Desarrollado con Google Maps JavaScript API y marcadores personalizados para cada sitio histórico y escultura.
- **Visor 360° Interactivo con Zoom:** Relevamiento fotográfico secuencial de la estatua del *Santo Cura Brochero* sobre su mula Malacara, permitiendo girarla 360° con el mouse o pantalla táctil y hacer zoom en detalles.
- **Street View Integrado:** Navegación en primera persona por las calles con balizas interactivas para entrar a las esculturas.
- **Fichas e Investigación:** Presentaciones interactivas de Canva y diapositivas con la autoría de los estudiantes investigadores.
- **Buscador y Filtros:** Búsqueda en tiempo real y clasificación por categorías (*Esculturas*, *Monumentos*, *Sitios Históricos*).

---

## 🚀 Requisitos para ejecutar en la computadora de los alumnos

Solo se necesita tener instalado:
- **Node.js** (versión 18 o superior): [Descargar gratis de nodejs.org](https://nodejs.org/)
- **Git** (opcional, para clonar por consola): [Descargar de git-scm.com](https://git-scm.com/)

*(El proyecto utiliza servidores HTTP nativos, por lo que **no requiere** descargas pesadas de paquetes ni librerías adicionales).*

---

## 💻 Pasos para clonar y levantar el proyecto

1. **Abrir la terminal o consola de comandos** (PowerShell o Git Bash) y clonar el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   ```

2. **Entrar a la carpeta del proyecto:**
   ```bash
   cd mapa-la-para
   ```

3. **Iniciar el servidor local:**
   ```bash
   npm start
   ```
   *(También funciona con `npm run dev` o `node server.js`)*

4. **Abrir el navegador:**  
   Ingresar a: **`http://localhost:3000`**

---

## 📝 Cómo agregar nuevas esculturas o sitios históricos

Toda la información está centralizada en el archivo `data.js`. Para sumar un nuevo punto investigado por los alumnos:

1. Abrir `data.js` en Visual Studio Code.
2. Copiar y pegar uno de los bloques existentes con:
   - `nombre`: Nombre del lugar o monumento.
   - `coordenadas`: Coordenadas `{ lat, lng }` (se obtienen con clic derecho en Google Maps).
   - `investigadores`: Nombre de los alumnos a cargo.
   - `descripcionLarga`: Reseña histórica o ficha investigada.
3. Guardar el archivo y recargar el navegador (`F5`).