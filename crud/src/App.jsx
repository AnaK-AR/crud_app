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

// (R)ead
  const fetchApplications = async () => {
    const { data, error } = await supabase.from('applications').select('*');
    if (error) {
      console.error("Error fetching data: ", error);
      setApplications([]);
    }
   setApplications(data || []);
  }

  useEffect(() => {
    fetchApplications();
  }, []);

  // (C)reate
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Si se esta editando se acutaliza el form que coincide con el id
    if (editingId) {
      await supabase.from('applications').update(form).eq('id', editingId);
      setEditingId(null);
    // Si no se esta actualizadndo solo se inseta la nueva applicacion
    } else {
      await supabase.from('applications').insert([form]);
    }
    setForm({
      company: '',
      position: '',
      status: '',
      domain: '',
      notes: ''
    });

    fetchApplications();
  };

  // (U)pdate
  const handleEdit = (app) => {
    setForm(app);
    setEditingId(app.id);
  };

  // (D)elete
  const handleDelete = async (id) => {
    await supabase.from('applications').delete().eq('id', id);

    fetchApplications();
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
          {editingId ? 'Update' : 'Add'}
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
