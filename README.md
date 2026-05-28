# Simulador SRTF

Proyecto web hecho con React + Vite para simular el algoritmo SRTF, Shortest Remaining Time First, usado en planificacion de procesos de sistemas operativos.

## Caracteristicas

- Agregar, editar y eliminar procesos.
- Simulacion automatica del algoritmo SRTF.
- Diagrama de Gantt interactivo.
- Tabla de metricas por proceso.
- Calculo de tiempo de finalizacion, retorno, espera y respuesta.
- Exportacion de resultados en CSV.
- Diseno responsive para escritorio y celular.
- Preparado para subir a GitHub y desplegar en Vercel.

## Estructura del proyecto

```text
srtf-simulator/
├── index.html
├── package.json
├── vercel.json
├── vite.config.js
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── styles.css
│   ├── components/
│   │   ├── GanttChart.jsx
│   │   ├── InfoPanel.jsx
│   │   ├── MetricsTable.jsx
│   │   ├── ProcessForm.jsx
│   │   └── ProcessTable.jsx
│   └── lib/
│       └── srtf.js
└── README.md
```

## Requisitos

- Node.js instalado.
- npm instalado.
- Cuenta de GitHub si deseas subir el proyecto.
- Cuenta de Vercel si deseas desplegarlo.

## Instalacion local

Clona o descarga el proyecto y entra a la carpeta:

```bash
cd srtf-simulator
```

Instala las dependencias:

```bash
npm install
```

Ejecuta el proyecto en modo desarrollo:

```bash
npm run dev
```

Abre en el navegador la URL que aparezca en la terminal. Normalmente sera:

```text
http://localhost:5173
```

## Compilar para produccion

```bash
npm run build
```

Para probar la version compilada:

```bash
npm run preview
```

## Como usar el simulador

1. Escribe el nombre del proceso, por ejemplo P1.
2. Ingresa el tiempo de llegada.
3. Ingresa el tiempo de ejecucion estimado.
4. Presiona Agregar proceso.
5. Repite el proceso con P2, P3, etc.
6. El diagrama de Gantt y las metricas se actualizan automaticamente.
7. Usa Exportar CSV si quieres guardar los resultados.

## Logica del algoritmo

El algoritmo se encuentra en:

```text
src/lib/srtf.js
```

La simulacion trabaja unidad por unidad. En cada unidad de tiempo:

1. Revisa que procesos estan en estado Ready.
2. Selecciona el proceso con menor tiempo restante.
3. Ejecuta ese proceso durante una unidad de tiempo.
4. Si llega otro proceso con menor tiempo restante, ocurre preemption.
5. Cuando un proceso llega a cero tiempo restante, se registra su tiempo de finalizacion.

## Subir a GitHub

Desde la carpeta del proyecto:

```bash
git init
git add .
git commit -m "Initial commit: SRTF simulator"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/srtf-simulator.git
git push -u origin main
```

Cambia `TU_USUARIO` por tu usuario real de GitHub.

## Desplegar en Vercel

Opcion recomendada:

1. Entra a Vercel.
2. Elige Add New Project.
3. Importa el repositorio desde GitHub.
4. Vercel detectara el proyecto como Vite.
5. Deja el comando de build como `npm run build`.
6. Deja el directorio de salida como `dist`.
7. Presiona Deploy.

El archivo `vercel.json` ya incluye la configuracion basica para build y salida.

## Autor

Proyecto educativo para explicar y simular la planificacion SRTF en sistemas operativos.
