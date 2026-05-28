import { useState } from 'react';

const initialForm = {
  name: '',
  arrivalTime: 0,
  burstTime: 1,
};

export function ProcessForm({ onAddProcess }) {
  const [form, setForm] = useState(initialForm);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: name === 'name' ? value : Number(value),
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const processName = form.name.trim() || `P${Date.now().toString().slice(-4)}`;
    onAddProcess({
      id: crypto.randomUUID(),
      name: processName,
      arrivalTime: Number(form.arrivalTime),
      burstTime: Number(form.burstTime),
    });

    setForm({ ...initialForm, name: '' });
  }

  return (
    <form className="process-form" onSubmit={handleSubmit}>
      <label>
        <span>Proceso</span>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Ej: P1"
          aria-label="Nombre del proceso"
        />
      </label>

      <label>
        <span>Llegada</span>
        <input
          name="arrivalTime"
          type="number"
          min="0"
          step="1"
          value={form.arrivalTime}
          onChange={handleChange}
          aria-label="Tiempo de llegada"
        />
      </label>

      <label>
        <span>Ejecucion</span>
        <input
          name="burstTime"
          type="number"
          min="1"
          step="1"
          value={form.burstTime}
          onChange={handleChange}
          aria-label="Tiempo de ejecucion"
        />
      </label>

      <button className="button primary" type="submit">
        Agregar proceso
      </button>
    </form>
  );
}
