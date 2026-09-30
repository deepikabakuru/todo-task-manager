import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return;
    }

    try {
      setLoading(true);
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      const message = err?.response?.data?.message || 'Login failed';
      setError(message === 'Invalid email or password' ? 'Invalid email or password' : message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F7F3] px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="text-3xl font-bold text-center text-[#172033] mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#172033] mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#b9ddd5] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#172033] mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#b9ddd5] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#2A9D8F] px-4 py-2.5 text-white font-medium transition hover:bg-[#238579] disabled:cursor-not-allowed disabled:bg-[#9bcfc5]"
          >
            {loading ? <LoadingSpinner label="Logging in..." /> : 'Login'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-[#627087]">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-medium text-[#2A9D8F] hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
