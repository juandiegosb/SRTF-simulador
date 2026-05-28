export function InfoPanel() {
  return (
    <section className="card info-card">
      <h2>Como interpreta el simulador</h2>
      <p>
        SRTF selecciona en cada instante el proceso listo con menor tiempo restante. Si llega un
        proceso mas corto que el proceso actual, ocurre preemption: el proceso actual vuelve a Ready
        y el nuevo proceso recibe la CPU.
      </p>
      <ul>
        <li><strong>Llegada:</strong> momento en que el proceso entra al sistema.</li>
        <li><strong>Ejecucion:</strong> tiempo total estimado que necesita el proceso en CPU.</li>
        <li><strong>Retorno:</strong> finalizacion menos llegada.</li>
        <li><strong>Espera:</strong> retorno menos tiempo de ejecucion.</li>
        <li><strong>Respuesta:</strong> primera vez que se ejecuta menos llegada.</li>
      </ul>
    </section>
  );
}
