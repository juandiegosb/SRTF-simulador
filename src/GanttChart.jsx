function getSegmentClass(segment, index) {
  if (segment.isIdle) return 'segment idle';
  return `segment color-${index % 8}`;
}

export function GanttChart({ timeline, totalTime }) {
  if (!timeline.length || totalTime <= 0) {
    return <p className="empty-message">Agrega procesos validos para ver el diagrama de Gantt.</p>;
  }

  return (
    <div className="gantt-area">
      <div className="gantt-chart" role="img" aria-label="Diagrama de Gantt del algoritmo SRTF">
        {timeline.map((segment, index) => {
          const width = `${(segment.duration / totalTime) * 100}%`;

          return (
            <div
              key={`${segment.processId}-${segment.start}-${segment.end}`}
              className={getSegmentClass(segment, index)}
              style={{ width }}
              title={`${segment.processName}: ${segment.start} - ${segment.end}`}
            >
              <span>{segment.processName}</span>
              <small>{segment.duration}u</small>
            </div>
          );
        })}
      </div>

      <div className="time-scale">
        {timeline.map((segment) => (
          <span key={`${segment.processId}-${segment.start}`} style={{ width: `${(segment.duration / totalTime) * 100}%` }}>
            {segment.start}
          </span>
        ))}
        <span className="scale-end">{totalTime}</span>
      </div>
    </div>
  );
}
