import { useEffect, useState } from 'react'
import './App.css'
import { supabase } from './supabaseClient'

function App() {
  // Lista de applicaciones en la BD
  const [applications, setApplications] = useState([])
  // Valores de input
  const [form, setForm] = useState({
    company: '',
    position: '',
    status: '',
    domain: '',
    notes: ''
  })
  // Para aplicaciones que se editan. Null == nuevo record
  const [editingId, setEditingId] = useState(null)

  // Leer aplicaciones (Read)
  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase.from('applications').select('*');
      if (error) throw error;
      setApplications(data || []);
    } catch (err) {
      console.error("Error al cargar las aplicaciones:", err.message);
      alert("Error al cargar las aplicaciones.");
      setApplications([]);
    }
  }

  useEffect(() => {
    fetchApplications();
  }, []);

  // Guardar o actualizar aplicacion (Create / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Si se esta editando se actualiza el form que coincide con el id
      if (editingId) {
        const { error } = await supabase.from('applications').update(form).eq('id', editingId);
        if (error) throw error;
        alert("Aplicación actualizada correctamente.");
        setEditingId(null);
      // Si no se esta actualizando solo se inserta la nueva aplicacion
      } else {
        const { error } = await supabase.from('applications').insert([form]);
        if (error) throw error;
        alert("Aplicación agregada correctamente.");
      }
      setForm({
        company: '',
        position: '',
        status: '',
        domain: '',
        notes: ''
      });
      fetchApplications();
    } catch (err) {
      console.error("Error al guardar la aplicación:", err.message);
      alert("Error al guardar la aplicación.");
    }
  };

  // Editar aplicacion (Update)
  const handleEdit = (app) => {
    setForm(app);
    setEditingId(app.id);
  };

  // Eliminar aplicacion (Delete)
  const handleDelete = async (id) => {
    try {
      const { error } = await supabase.from('applications').delete().eq('id', id);
      if (error) throw error;
      alert("Aplicación eliminada correctamente.");
      fetchApplications();
    } catch (err) {
      console.error("Error al eliminar la aplicación:", err.message);
      alert("Error al eliminar la aplicación.");
    }
  }

  return (
    <div className="content-wrapper">
      <h1>Seguimiento de Oportunidades</h1>
      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Empresa"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          required
        />
        <input
        type="text"
        placeholder="Puesto"
        value={form.position}
        onChange={(e) => setForm({ ...form, position: e.target.value })}
        required
        />
        <input
          type="text"
          placeholder="Estatus"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Dominio (ej. apple.com)"
          value={form.domain}
          onChange={(e) => setForm({ ...form, domain: e.target.value })}
          required
        />
        <textarea
          placeholder="Notas"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
        <button type="submit">
          {editingId ? 'Actualizar' : 'Agregar'}
        </button>
      </form>

      <ul>
        <div className="card-container">
        {applications.map((app) => (
          <li key={app.id} className="card">
            {app.domain && (
              <img
                src={`https://cdn.brandfetch.io/${app.domain}/w/400/h/400?c=1idCvByTOh4xs2wqywI`}
                alt={`${app.company} logo`}
                width="40"
                height="40"
                style={{ objectFit: 'contain' }}
              />
            )}
            <strong>{app.company}</strong> - {app.position}<br/>
            Estatus: {app.status}<br/>
            Notas: {app.notes}<br/>
            <button onClick={() => handleEdit(app)}>Editar</button>
            <button onClick={() => handleDelete(app.id)}>Eliminar</button>
          </li>
        ))}
        </div>
      </ul>
    </div>
  )
}

export default App
