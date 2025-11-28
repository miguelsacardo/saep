import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProducts = async () => {
    try {
      const url = searchTerm ? `/products/?search=${searchTerm}` : '/products/';
      const response = await api.get(url);
      setProducts(response.data);
    } catch (error) {
      console.error('Erro ao buscar produtos', error);
    }
  };

  useEffect(() => { fetchProducts(); }, [searchTerm]);

  const handleDelete = async (id) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await api.delete(`/products/${id}/`);
        fetchProducts();
      } catch (error) {
        alert('Erro ao excluir produto.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-gray-900 to-slate-800 text-slate-100">
      <Navbar />

      <main className="container mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">Lista de Produtos</h2>
            <p className="text-sm text-slate-300 mt-1">Gerencie seus itens, níveis de estoque e ações rápidas.</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder="Buscar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 md:w-72 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg placeholder-slate-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none shadow-inner"
            />

            <Link
              to="/product/new"
              className="inline-flex items-center gap-2 bg-white text-slate-900 px-4 py-2 rounded-lg font-semibold shadow hover:translate-y-[-1px] transition-transform"
            >
              + Novo Produto
            </Link>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-700 bg-slate-800">
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-slate-900/60">
                <tr className="text-slate-300 text-sm uppercase tracking-wider">
                  <th className="px-6 py-3 text-left">Nome</th>
                  <th className="px-6 py-3 text-left">Descrição</th>
                  <th className="px-6 py-3 text-center">Estoque Atual</th>
                  <th className="px-6 py-3 text-center">Mínimo</th>
                  <th className="px-6 py-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-t border-slate-700 hover:bg-slate-700/40 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{product.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">{product.description}</td>
                    <td className={`px-6 py-4 text-center font-semibold ${product.is_low_stock ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {product.current_stock}
                    </td>
                    <td className="px-6 py-4 text-center">{product.min_stock}</td>
                    <td className="px-6 py-4 text-center flex items-center justify-center gap-3">
                      <Link to={`/product/edit/${product.id}`} className="text-violet-400 hover:text-violet-300 font-medium">Editar</Link>
                      <button onClick={() => handleDelete(product.id)} className="text-rose-400 hover:text-rose-300 font-medium">Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {products.length === 0 && (
            <div className="p-8 text-center text-slate-400">Nenhum produto encontrado.</div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;