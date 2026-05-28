export function ProcessTable({ processes, onUpdateProcess, onDeleteProcess }) {
  if (!processes.length) {
    return <p className="empty-message">No hay procesos cargados.</p>;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Proceso</th>
            <th>Llegada</th>
            <th>Ejecucion</th>
            <th>Accion</th>
          </tr>
        </thead>
        <tbody>
          {processes.map((process) => (
            <tr key={process.id}>
              <td>
                <input
                  className="table-input"
                  value={process.name}
                  onChange={(event) => onUpdateProcess(process.id, 'name', event.target.value)}
                  aria-label={`Nombre de ${process.name}`}
                />
              </td>
              <td>
                <input
                  className="table-input numeric"
                  type="number"
                  min="0"
                  step="1"
                  value={process.arrivalTime}
                  onChange={(event) => onUpdateProcess(process.id, 'arrivalTime', Number(event.target.value))}
                  aria-label={`Llegada de ${process.name}`}
                />
              </td>
              <td>
                <input
                  className="table-input numeric"
                  type="number"
                  min="1"
                  step="1"
                  value={process.burstTime}
                  onChange={(event) => onUpdateProcess(process.id, 'burstTime', Number(event.target.value))}
                  aria-label={`Ejecucion de ${process.name}`}
                />
              </td>
              <td>
                <button className="button ghost danger" onClick={() => onDeleteProcess(process.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
