import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'Usuário';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <h1 className="text-xl font-bold">SAEP Estoque</h1>
          <div className="space-x-4">
            <Link to="/dashboard" className="hover:text-blue-200">Produtos</Link>
            <Link to="/movements" className="hover:text-blue-200">Movimentações</Link>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <span>Olá, <strong>{username}</strong></span>
          <button 
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm transition"
          >
            SAIR
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;