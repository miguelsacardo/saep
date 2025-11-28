import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api';

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({ name: '', description: '', min_stock: 0, current_stock: 0, material: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      api.get(`/products/${id}/`).then(response => setFormData(response.data)).catch(() => setError('Erro ao carregar dados do produto.'));
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || formData.min_stock < 0) {
      setError('Por favor, preencha o nome e certifique-se que o estoque não é negativo.');
      return;
    }

    try {
      if (isEditMode) await api.put(`/products/${id}/`, formData);
      else await api.post('/products/', formData);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.name?.[0] || 'Erro ao salvar. Verifique se o nome já existe.';
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200/10 p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">{isEditMode ? 'Editar Produto' : 'Novo Produto'}</h2>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-2">Nome do Produto *</label>
            <input name="name" value={formData.name} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-400 outline-none" required />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-2">Descrição</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-400 outline-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-2">Material</label>
              <input name="material" value={formData.material} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-400 outline-none" />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-2">Estoque Mínimo *</label>
              <input name="min_stock" type="number" value={formData.min_stock} onChange={handleChange} min={0} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-400 outline-none" required />
            </div>
          </div>

          {!isEditMode && (
            <div>
              <label className="block text-slate-700 font-semibold mb-2">Estoque Inicial</label>
              <input name="current_stock" type="number" value={formData.current_stock} onChange={handleChange} min={0} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-400 outline-none" />
              <p className="text-sm text-slate-500 mt-1">* Ajustes posteriores devem ser feitos via Movimentação.</p>
            </div>
          )}

          <div className="flex items-center justify-between pt-4">
            <Link to="/dashboard" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition">Cancelar</Link>
            <button type="submit" className="inline-flex items-center gap-2 bg-violet-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:brightness-105 transition">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;