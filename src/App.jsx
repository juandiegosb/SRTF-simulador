import { useMemo, useState } from 'react';
import { GanttChart } from './components/GanttChart.jsx';
import { InfoPanel } from './components/InfoPanel.jsx';
import { MetricsTable } from './components/MetricsTable.jsx';
import { ProcessForm } from './components/ProcessForm.jsx';
import { ProcessTable } from './components/ProcessTable.jsx';
import { exportMetricsAsCsv, simulateSRTF } from './lib/srtf.js';

const sampleProcesses = [
  { id: 'sample-p1', name: 'P1', arrivalTime: 0, burstTime: 8 },
  { id: 'sample-p2', name: 'P2', arrivalTime: 1, burstTime: 4 },
  { id: 'sample-p3', name: 'P3', arrivalTime: 2, burstTime: 2 },
  { id: 'sample-p4', name: 'P4', arrivalTime: 3, burstTime: 1 },
  { id: 'sample-p5', name: 'P5', arrivalTime: 4, burstTime: 3 },
];

const initialProcesses = [
  { id: 'p1', name: 'P1', arrivalTime: 0, burstTime: 7 },
  { id: 'p2', name: 'P2', arrivalTime: 2, burstTime: 4 },
  { id: 'p3', name: 'P3', arrivalTime: 4, burstTime: 1 },
];

function downloadFile(filename, content, type = 'text/plain') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function App() {
  const [processes, setProcesses] = useState(initialProcesses);
  const simulation = useMemo(() => simulateSRTF(processes), [processes]);

  function handleAddProcess(process) {
    setProcesses((currentProcesses) => [...currentProcesses, process]);
  }

  function handleUpdateProcess(id, field, value) {
    setProcesses((currentProcesses) =>
      currentProcesses.map((process) =>
        process.id === id
          ? {
              ...process,
              [field]: field === 'name' ? value : Number(value),
            }
          : process,
      ),
    );
  }

  function handleDeleteProcess(id) {
    setProcesses((currentProcesses) => currentProcesses.filter((process) => process.id !== id));
  }

  function handleLoadExample() {
    setProcesses(sampleProcesses.map((process) => ({ ...process })));
  }

  function handleClear() {
    setProcesses([]);
  }

  function handleExportCsv() {
    if (simulation.error || !simulation.metrics.length) return;
    downloadFile('srtf-resultados.csv', exportMetricsAsCsv(simulation.metrics), 'text/csv');
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Sistemas operativos</p>
          <h1>Simulador del algoritmo SRTF</h1>
          <p className="hero-description">
            Crea procesos, modifica sus tiempos y observa como Shortest Remaining Time First
            decide que proceso debe ejecutarse en cada unidad de tiempo.
          </p>
        </div>
        <div className="hero-badge">
          <span>Planificacion</span>
          <strong>Preemptive</strong>
        </div>
      </section>

      <section className="layout-grid">
        <div className="left-column">
          <section className="card">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Entrada</p>
                <h2>Procesos</h2>
              </div>
              <div className="actions">
                <button className="button ghost" onClick={handleLoadExample}>Cargar ejemplo</button>
                <button className="button ghost" onClick={handleClear}>Limpiar</button>
              </div>
            </div>

            <ProcessForm onAddProcess={handleAddProcess} />
            <ProcessTable
              processes={processes}
              onUpdateProcess={handleUpdateProcess}
              onDeleteProcess={handleDeleteProcess}
            />

            {simulation.error ? <p className="alert">{simulation.error}</p> : null}
          </section>

          <InfoPanel />
        </div>

        <div className="right-column">
          <section className="card result-card">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Salida</p>
                <h2>Diagrama de Gantt</h2>
              </div>
              <button
                className="button secondary"
                onClick={handleExportCsv}
                disabled={Boolean(simulation.error) || !simulation.metrics.length}
              >
                Exportar CSV
              </button>
            </div>

            <GanttChart timeline={simulation.timeline} totalTime={simulation.totalTime} />
          </section>

          <section className="card">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Resultados</p>
                <h2>Metricas</h2>
              </div>
            </div>

            <MetricsTable metrics={simulation.metrics} averages={simulation.averages} />
          </section>
        </div>
      </section>
    </main>
  );
}
