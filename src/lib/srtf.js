export function normalizeProcesses(processes) {
  return processes
    .map((process, index) => ({
      id: process.id ?? `P${index + 1}`,
      name: String(process.name || `P${index + 1}`).trim() || `P${index + 1}`,
      arrivalTime: Number(process.arrivalTime),
      burstTime: Number(process.burstTime),
      originalIndex: index,
    }))
    .filter((process) => Number.isFinite(process.arrivalTime) && Number.isFinite(process.burstTime));
}

export function validateProcesses(processes) {
  if (!processes.length) {
    return 'Agrega al menos un proceso para ejecutar la simulacion.';
  }

  const names = new Set();

  for (const process of processes) {
    if (!process.name) {
      return 'Cada proceso debe tener un nombre.';
    }

    if (names.has(process.name.toLowerCase())) {
      return `El nombre ${process.name} esta repetido. Usa nombres diferentes.`;
    }

    names.add(process.name.toLowerCase());

    if (!Number.isInteger(process.arrivalTime) || process.arrivalTime < 0) {
      return `El tiempo de llegada de ${process.name} debe ser un entero mayor o igual a 0.`;
    }

    if (!Number.isInteger(process.burstTime) || process.burstTime <= 0) {
      return `El tiempo de ejecucion de ${process.name} debe ser un entero mayor que 0.`;
    }
  }

  return null;
}

function chooseNextProcess(processes, remaining, time) {
  const readyProcesses = processes.filter((process) => {
    return process.arrivalTime <= time && remaining[process.id] > 0;
  });

  if (!readyProcesses.length) return null;

  return readyProcesses.sort((a, b) => {
    const byRemaining = remaining[a.id] - remaining[b.id];
    if (byRemaining !== 0) return byRemaining;

    const byArrival = a.arrivalTime - b.arrivalTime;
    if (byArrival !== 0) return byArrival;

    return a.originalIndex - b.originalIndex;
  })[0];
}

function pushSegment(timeline, segment) {
  const lastSegment = timeline[timeline.length - 1];

  if (lastSegment && lastSegment.processId === segment.processId && lastSegment.end === segment.start) {
    lastSegment.end = segment.end;
    lastSegment.duration += segment.duration;
    return;
  }

  timeline.push(segment);
}

export function simulateSRTF(rawProcesses) {
  const processes = normalizeProcesses(rawProcesses);
  const validationError = validateProcesses(processes);

  if (validationError) {
    return {
      error: validationError,
      processes,
      timeline: [],
      metrics: [],
      averages: null,
      totalTime: 0,
    };
  }

  const remaining = {};
  const completionTime = {};
  const firstResponseTime = {};
  const timeline = [];
  let time = Math.min(...processes.map((process) => process.arrivalTime));
  let completed = 0;
  let safetyCounter = 0;
  const maxIterations = processes.reduce((sum, process) => sum + process.burstTime, 0) + 10000;

  processes.forEach((process) => {
    remaining[process.id] = process.burstTime;
    firstResponseTime[process.id] = null;
  });

  while (completed < processes.length) {
    safetyCounter += 1;
    if (safetyCounter > maxIterations) {
      throw new Error('La simulacion se detuvo por seguridad. Revisa los datos ingresados.');
    }

    const currentProcess = chooseNextProcess(processes, remaining, time);

    if (!currentProcess) {
      const nextArrival = Math.min(
        ...processes
          .filter((process) => remaining[process.id] > 0 && process.arrivalTime > time)
          .map((process) => process.arrivalTime),
      );

      pushSegment(timeline, {
        processId: 'IDLE',
        processName: 'Libre',
        start: time,
        end: nextArrival,
        duration: nextArrival - time,
        isIdle: true,
      });

      time = nextArrival;
      continue;
    }

    if (firstResponseTime[currentProcess.id] === null) {
      firstResponseTime[currentProcess.id] = time - currentProcess.arrivalTime;
    }

    pushSegment(timeline, {
      processId: currentProcess.id,
      processName: currentProcess.name,
      start: time,
      end: time + 1,
      duration: 1,
      isIdle: false,
    });

    remaining[currentProcess.id] -= 1;
    time += 1;

    if (remaining[currentProcess.id] === 0) {
      completionTime[currentProcess.id] = time;
      completed += 1;
    }
  }

  const metrics = processes.map((process) => {
    const completion = completionTime[process.id];
    const turnaround = completion - process.arrivalTime;
    const waiting = turnaround - process.burstTime;
    const response = firstResponseTime[process.id];

    return {
      id: process.id,
      name: process.name,
      arrivalTime: process.arrivalTime,
      burstTime: process.burstTime,
      completionTime: completion,
      turnaroundTime: turnaround,
      waitingTime: waiting,
      responseTime: response,
    };
  });

  const averages = {
    turnaroundTime: average(metrics.map((metric) => metric.turnaroundTime)),
    waitingTime: average(metrics.map((metric) => metric.waitingTime)),
    responseTime: average(metrics.map((metric) => metric.responseTime)),
  };

  return {
    error: null,
    processes,
    timeline,
    metrics,
    averages,
    totalTime: timeline.length ? timeline[timeline.length - 1].end : 0,
  };
}

export function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function exportMetricsAsCsv(metrics) {
  const headers = [
    'Proceso',
    'Llegada',
    'Ejecucion',
    'Finalizacion',
    'Retorno',
    'Espera',
    'Respuesta',
  ];

  const rows = metrics.map((metric) => [
    metric.name,
    metric.arrivalTime,
    metric.burstTime,
    metric.completionTime,
    metric.turnaroundTime,
    metric.waitingTime,
    metric.responseTime,
  ]);

  return [headers, ...rows]
    .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(','))
    .join('\n');
}
