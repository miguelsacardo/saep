import { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';

const StockMovement = () => {
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  
  const [formData, setFormData] = useState({
    product: '',
    movement_type: 'IN',
    quantity: 1,
    movement_date: new Date().toISOString().slice(0, 16)
  });
  
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [prodResponse, movResponse] = await Promise.all([
        api.get('/products/'),
        api.get('/movements/')
      ]);
      setProducts(prodResponse.data);
      setMovements(movResponse.data);
    } catch (error) {
      console.error("Erro ao carregar dados", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    try {
      const response = await api.post('/movements/', formData);
      
      fetchData(); 
      
      setFormData(prev => ({ ...prev, quantity: 1 }));

      if (response.data.warning) {
        setMessage({ text: response.data.warning, type: 'warning' });
        alert(response.data.warning);
      } else {
        setMessage({ text: 'Movimentação registrada com sucesso!', type: 'success' });
      }

    } catch (error) {
      const errorMsg = error.response?.data?.non_field_errors?.[0] || 'Erro ao registrar movimentação.';
      setMessage({ text: errorMsg, type: 'error' });
    }
  };

  return (
    // Fundo da página escuro
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-white mb-6">Gestão de Estoque</h2>

        {/* Mensagens de Feedback */}
        {message.text && (
          <div className={`p-4 rounded mb-6 text-center font-bold ${
            message.type === 'warning' ? 'bg-yellow-900/50 text-yellow-200 border border-yellow-600' :
            message.type === 'error' ? 'bg-red-900/50 text-red-200 border border-red-600' :
            'bg-green-900/50 text-green-200 border border-green-600'
          }`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Formulário de Movimentação */}
          <div className="lg:col-span-1 bg-gray-800 border border-gray-700 p-6 rounded-lg shadow h-fit text-white">
            <h3 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2">Nova Movimentação</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-sm font-bold mb-1 text-gray-300">Produto</label>
                <select 
                  name="product" 
                  value={formData.product} 
                  onChange={handleChange}
                  className="w-full border border-gray-600 p-2 rounded bg-gray-700 text-white focus:outline-none focus:border-[#512ED9]"
                  required
                >
                  <option value="">Selecione um produto...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (Atual: {p.current_stock})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1 text-gray-300">Tipo</label>
                <div className="flex space-x-4 mt-2 bg-gray-700 p-2 rounded border border-gray-600">
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="radio" 
                      name="movement_type" 
                      value="IN"
                      checked={formData.movement_type === 'IN'}
                      onChange={handleChange}
                      className="mr-2 accent-[#512ED9]"
                    />
                    <span className="text-green-400 font-bold">Entrada</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="radio" 
                      name="movement_type" 
                      value="OUT"
                      checked={formData.movement_type === 'OUT'}
                      onChange={handleChange}
                      className="mr-2 accent-[#512ED9]"
                    />
                    <span className="text-red-400 font-bold">Saída</span>
                  </label>
                </div>
              </div>

              {/* Quantidade */}
              <div>
                <label className="block text-sm font-bold mb-1 text-gray-300">Quantidade</label>
                <input 
                  type="number" 
                  name="quantity" 
                  value={formData.quantity} 
                  onChange={handleChange}
                  min="1"
                  className="w-full border border-gray-600 p-2 rounded bg-gray-700 text-white focus:outline-none focus:border-[#512ED9]"
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1 text-gray-300">Data e Hora</label>
                <input 
                  type="datetime-local" 
                  name="movement_date" 
                  value={formData.movement_date} 
                  onChange={handleChange}
                  className="w-full border border-gray-600 p-2 rounded bg-gray-700 text-white focus:outline-none focus:border-[#512ED9]"
                  required 
                />
              </div>

              <button type="submit" className="w-full bg-[#512ED9] text-white font-bold py-2 rounded hover:opacity-90 transition">
                CONFIRMAR
              </button>
            </form>
          </div>

          {/* Histórico Recente */}
          <div className="lg:col-span-2 bg-gray-800 border border-gray-700 p-6 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2 text-white">Histórico Recente</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-300">
                <thead className="bg-gray-700 text-gray-200 uppercase">
                  <tr>
                    <th className="p-3">Data</th>
                    <th className="p-3">Tipo</th>
                    <th className="p-3">Produto</th>
                    <th className="p-3">Qtd</th>
                    <th className="p-3">Responsável</th>
                  </tr>
                </thead>
                <tbody>
                  {movements.map((mov) => (
                    <tr key={mov.id} className="border-b border-gray-700 hover:bg-gray-700/50 transition">
                      <td className="p-3">{new Date(mov.movement_date).toLocaleString()}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          mov.movement_type === 'IN' ? 'bg-green-900 text-green-300 border border-green-700' : 'bg-red-900 text-red-300 border border-red-700'
                        }`}>
                          {mov.movement_type === 'IN' ? 'ENTRADA' : 'SAÍDA'}
                        </span>
                      </td>
                      <td className="p-3 font-medium text-white">{mov.product_name}</td>
                      <td className="p-3">{mov.quantity}</td>
                      <td className="p-3 text-gray-400">{mov.user_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StockMovement;