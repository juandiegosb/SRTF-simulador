function formatNumber(value) {
  return Number.isInteger(value) ? value : value.toFixed(2);
}

export function MetricsTable({ metrics, averages }) {
  if (!metrics.length) {
    return <p className="empty-message">La tabla de metricas aparecera cuando haya procesos validos.</p>;
  }

  return (
    <div className="metrics-grid">
      <div className="summary-cards" aria-label="Promedios de la simulacion">
        <article className="summary-card">
          <span>Espera promedio</span>
          <strong>{formatNumber(averages.waitingTime)}</strong>
        </article>
        <article className="summary-card">
          <span>Retorno promedio</span>
          <strong>{formatNumber(averages.turnaroundTime)}</strong>
        </article>
        <article className="summary-card">
          <span>Respuesta promedio</span>
          <strong>{formatNumber(averages.responseTime)}</strong>
        </article>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Proceso</th>
              <th>Llegada</th>
              <th>Ejecucion</th>
              <th>Finalizacion</th>
              <th>Retorno</th>
              <th>Espera</th>
              <th>Respuesta</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric) => (
              <tr key={metric.id}>
                <td>{metric.name}</td>
                <td>{metric.arrivalTime}</td>
                <td>{metric.burstTime}</td>
                <td>{metric.completionTime}</td>
                <td>{metric.turnaroundTime}</td>
                <td>{metric.waitingTime}</td>
                <td>{metric.responseTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
