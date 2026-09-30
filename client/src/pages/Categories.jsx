import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const categoryTones = ['bg-[#cbb6e4]', 'bg-[#efbdc2]', 'bg-[#a9c4d8]', 'bg-[#e4cb91]', 'bg-[#a7c6b4]'];

const Categories = () => {
  const { logout } = useAuth();
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [form, setForm] = useState({ name: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const fetchCategories = async (nextPage = page) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/categories?page=${nextPage}&limit=5`);
      const payload = response.data || {};
      setCategories(payload.categories || []);
      setPage(payload.page || 1);
      setPages(payload.pages || 1);
    } catch (err) {
      console.error('Failed to load categories', err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  useEffect(() => {
    const handleCategoriesUpdated = () => fetchCategories();
    window.addEventListener('categories:updated', handleCategoriesUpdated);
    return () => window.removeEventListener('categories:updated', handleCategoriesUpdated);
  }, [page]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!form.name.trim()) {
      setError('Category name is required');
      return;
    }
    try {
      setSaving(true);
      if (editingId) await api.put(`/api/categories/${editingId}`, { name: form.name.trim() });
      else await api.post('/api/categories', { name: form.name.trim() });
      setForm({ name: '' });
      setEditingId(null);
      await fetchCategories(1);
      window.dispatchEvent(new CustomEvent('categories:updated'));
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      setDeletingId(categoryId);
      await api.delete(`/api/categories/${categoryId}`);
      await fetchCategories();
      window.dispatchEvent(new CustomEvent('categories:updated'));
    } catch (err) {
      console.error('Failed to delete category', err);
    } finally {
      setDeletingId(null);
    }
  };

  const startEdit = (category) => {
    setEditingId(category._id);
    setForm({ name: category.name || '' });
    setError('');
  };

  const resetForm = () => {
    setForm({ name: '' });
    setEditingId(null);
    setError('');
  };

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#eeedf3] text-[#171b2b]">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_78%_24%,#fff9f1_0%,transparent_40%),radial-gradient(ellipse_at_14%_32%,#ded9ef_0%,transparent_40%),linear-gradient(150deg,#e8e7f0_0%,#f5f0f0_56%,#e9e9ef_100%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[.18]" aria-hidden="true" style={{ backgroundImage: 'radial-gradient(#7d7b8b .65px, transparent .65px)', backgroundSize: '44px 44px' }} />

      <header className="mx-auto flex w-[min(94%,1280px)] items-center justify-between border-b border-white/65 py-5 sm:py-6">
        <Link to="/dashboard" className="flex items-center gap-3" aria-label="Back to Daymark dashboard"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#18243b] text-sm font-bold text-white shadow-md shadow-slate-900/10">D</span><span className="text-sm font-bold tracking-tight">daymark</span></Link>
        <nav className="flex items-center gap-1.5 sm:gap-4" aria-label="Workspace navigation"><Link to="/dashboard" className="rounded-full px-3 py-2 text-[10px] font-semibold text-[#5e6474] transition hover:bg-white/60 hover:text-[#1c2233]">Dashboard</Link><Link to="/tasks/new" className="hidden rounded-full px-3 py-2 text-[10px] font-semibold text-[#5e6474] transition hover:bg-white/60 hover:text-[#1c2233] sm:inline-flex">New task</Link><button type="button" onClick={logout} className="rounded-full bg-[#18243b] px-4 py-2.5 text-[10px] font-semibold text-white transition hover:bg-[#34415a]">Log out</button></nav>
      </header>

      <section className="mx-auto grid min-h-[560px] w-[min(94%,1280px)] items-center gap-0 px-1 py-10 sm:py-14 lg:min-h-[calc(100vh-90px)] lg:grid-cols-[.9fr_1.1fr] lg:py-5">
        <div className="relative z-10 max-w-[540px] py-6 text-center lg:text-left">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/45 px-3.5 py-2 text-[9px] font-bold uppercase tracking-[.2em] text-[#77758a] shadow-sm backdrop-blur-sm"><span className="h-1.5 w-1.5 rounded-full bg-[#c49a4c]" /> Make room for what matters</p>
          <h1 className="text-4xl font-semibold leading-[1.02] tracking-[-.055em] text-[#151a2b] sm:text-6xl">A place for<br />every part of<br /><span className="text-[#77708e]">your day.</span></h1>
          <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-[#686b7a] sm:text-base sm:leading-7 lg:mx-0">Create thoughtful categories for work, home, and everything in between. A little structure makes room to focus.</p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start"><a href="#manage-categories" className="rounded-full bg-[#18243b] px-6 py-3.5 text-xs font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-[#34415a]">Organize your categories <span className="ml-2" aria-hidden="true">↓</span></a><Link to="/dashboard" className="rounded-full border border-white/85 bg-white/45 px-6 py-3.5 text-xs font-semibold text-[#414658] transition hover:bg-white/80">Back to dashboard</Link></div>
          <p className="mt-8 text-[9px] font-semibold uppercase tracking-[.2em] text-[#8a8998]">A little clarity for the everyday</p>
        </div>

        <div className="relative mx-auto flex h-[360px] w-full max-w-[660px] items-center justify-center sm:h-[480px] lg:h-[590px]" aria-hidden="true">
          <div className="absolute left-1/2 top-1/2 h-[75%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/65 blur-[75px]" />
          <svg className="relative h-full w-full drop-shadow-[0_35px_32px_rgba(73,68,97,.17)]" viewBox="0 0 680 650" fill="none" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="sculpture" x1="183" y1="72" x2="466" y2="590" gradientUnits="userSpaceOnUse"><stop stopColor="#fff" stopOpacity=".95"/><stop offset=".22" stopColor="#d7d5e1" stopOpacity=".84"/><stop offset=".43" stopColor="#fffaf2"/><stop offset=".66" stopColor="#c6c3d3" stopOpacity=".92"/><stop offset=".84" stopColor="#fff"/><stop offset="1" stopColor="#c7c5d5"/></linearGradient>
              <linearGradient id="sculptureLight" x1="245" y1="74" x2="425" y2="580" gradientUnits="userSpaceOnUse"><stop stopColor="white" stopOpacity=".96"/><stop offset=".5" stopColor="white" stopOpacity=".1"/><stop offset="1" stopColor="white" stopOpacity=".87"/></linearGradient>
              <radialGradient id="coinGold" cx="0" cy="0" r="1" gradientTransform="matrix(29 39 -40 29 344 385)" gradientUnits="userSpaceOnUse"><stop stopColor="#fff8d8"/><stop offset=".38" stopColor="#eed282"/><stop offset=".76" stopColor="#b9873b"/><stop offset="1" stopColor="#fff0ad"/></radialGradient>
            </defs>
            <path d="M396 -46C305 51 254 121 336 218c73 86 159 89 113 176-43 80-181 129-108 226 37 49 90 73 121 104" stroke="url(#sculpture)" strokeWidth="132" strokeLinecap="round"/>
            <path d="M396 -46C305 51 254 121 336 218c73 86 159 89 113 176-43 80-181 129-108 226 37 49 90 73 121 104" stroke="url(#sculptureLight)" strokeWidth="86" strokeLinecap="round"/>
            <path d="M390 -27C327 41 288 93 319 151" stroke="white" strokeOpacity=".82" strokeWidth="6" strokeLinecap="round"/>
            <ellipse cx="353" cy="404" rx="70" ry="21" fill="#596075" fillOpacity=".2" filter="blur(13px)"/>
            <g transform="translate(350 378) rotate(-24)"><ellipse cx="0" cy="0" rx="42" ry="31" fill="#b98231"/><ellipse cx="0" cy="-6" rx="41" ry="29" fill="url(#coinGold)" stroke="#fff0bd" strokeWidth="3"/><ellipse cx="0" cy="-6" rx="29" ry="19" stroke="#fff7d7" strokeOpacity=".9" strokeWidth="1.5"/><path d="M-12-7h24M0-19v26" stroke="#b48948" strokeOpacity=".72" strokeWidth="2" strokeLinecap="round"/></g>
            <circle cx="524" cy="171" r="4" fill="white"/><circle cx="173" cy="452" r="3" fill="#9d8ab9" fillOpacity=".55"/><circle cx="512" cy="517" r="3.5" fill="#c5a45d" fillOpacity=".6"/>
          </svg>
          <div className="absolute bottom-4 right-[2%] rounded-2xl border border-white/80 bg-white/55 px-4 py-3 shadow-[0_15px_38px_rgba(49,46,72,.12)] backdrop-blur-lg sm:bottom-8 sm:right-[5%]"><p className="text-[8px] font-bold uppercase tracking-[.18em] text-[#8c849a]">Thoughtful organization</p><p className="mt-1 text-xs font-semibold text-[#38384a]">Each thing in its place.</p></div>
        </div>
      </section>

      <section id="manage-categories" className="border-t border-white/80 bg-[#f8f7f8]/80 px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[1.1fr_.9fr] lg:gap-7">
          <div className="rounded-[26px] border border-white bg-white/85 p-5 shadow-[0_22px_65px_-45px_rgba(43,45,62,.25)] backdrop-blur-md sm:p-7">
            <div className="mb-5 flex items-end justify-between gap-3 border-b border-[#ecebf0] pb-5"><div><p className="text-[9px] font-bold uppercase tracking-[.2em] text-[#8d8798]">Your personal map</p><h2 className="mt-2 text-xl font-semibold tracking-tight text-[#202438]">Your categories</h2></div><span className="rounded-full bg-[#f0eef4] px-3 py-1.5 text-[9px] font-semibold text-[#777286]">{categories.length} ON THIS PAGE</span></div>
            {loading ? <div className="flex justify-center py-14 text-[#697080]"><LoadingSpinner label="Loading categories..." /></div> : categories.length === 0 ? <div className="py-14 text-center"><span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#f0eef4] text-[#7d7790]"><svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg></span><p className="mt-4 text-sm font-semibold text-[#383a4a]">No categories yet</p><p className="mt-1 text-xs text-[#878997]">Create one to start shaping your task list.</p></div> : <div className="space-y-2.5">{categories.map((category, index) => <article key={category._id} className="flex items-center justify-between gap-3 rounded-2xl border border-[#eeedf1] bg-white/80 p-3.5 transition hover:border-[#dcd8e5] sm:p-4"><div className="flex min-w-0 items-center gap-3"><span className={`h-2.5 w-2.5 shrink-0 rounded-full ${categoryTones[index % categoryTones.length]}`} /><span className="truncate text-sm font-semibold text-[#35394a]">{category.name}</span></div><div className="flex shrink-0 gap-2"><button type="button" onClick={() => startEdit(category)} className="rounded-lg border border-[#e8e7ec] px-3 py-1.5 text-[10px] font-semibold text-[#5f6270] transition hover:bg-[#f5f3f7]">Edit</button><button type="button" onClick={() => handleDelete(category._id)} disabled={deletingId === category._id} className="rounded-lg border border-rose-100 px-3 py-1.5 text-[10px] font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50">{deletingId === category._id ? <LoadingSpinner label="Deleting..." size="h-3 w-3" /> : 'Delete'}</button></div></article>)}</div>}
            {pages > 1 && <div className="mt-5 flex items-center justify-between border-t border-[#ecebf0] pt-4"><button type="button" disabled={page <= 1} onClick={() => fetchCategories(page - 1)} className="rounded-full border border-[#e3e1e8] px-3.5 py-2 text-[10px] font-semibold text-[#545968] transition hover:bg-[#f3f1f5] disabled:cursor-not-allowed disabled:opacity-35">Previous</button><span className="text-[10px] text-[#868898]">Page {page} of {pages}</span><button type="button" disabled={page >= pages} onClick={() => fetchCategories(page + 1)} className="rounded-full border border-[#e3e1e8] px-3.5 py-2 text-[10px] font-semibold text-[#545968] transition hover:bg-[#f3f1f5] disabled:cursor-not-allowed disabled:opacity-35">Next</button></div>}
          </div>

          <div className="relative overflow-hidden rounded-[26px] border border-white bg-gradient-to-br from-white/95 to-[#f0edf4] p-5 shadow-[0_22px_65px_-45px_rgba(43,45,62,.25)] sm:p-7">
            <div className="pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-full border-[24px] border-white/50" />
            <div className="relative mb-5 flex items-center justify-between border-b border-[#e8e6ed] pb-5"><div><p className="text-[9px] font-bold uppercase tracking-[.2em] text-[#9a839a]">{editingId ? 'A small refinement' : 'Make it yours'}</p><h2 className="mt-2 text-xl font-semibold tracking-tight text-[#202438]">{editingId ? 'Edit category' : 'Add a category'}</h2></div>{editingId && <button type="button" onClick={resetForm} className="rounded-full px-3 py-2 text-[10px] font-semibold text-[#7d7d88] transition hover:bg-white hover:text-[#25283a]">Cancel</button>}</div>
            <form onSubmit={handleSubmit} className="relative space-y-5"><div><label htmlFor="category-name" className="mb-2 block text-[9px] font-bold uppercase tracking-[.18em] text-[#70727f]">Category name</label><input id="category-name" type="text" value={form.name} onChange={(event) => setForm({ name: event.target.value })} placeholder="Work, personal, ideas…" className="w-full rounded-xl border border-[#e2e0e7] bg-white/80 px-4 py-3.5 text-sm text-[#303447] outline-none transition placeholder:text-[#a3a2ac] focus:border-[#9990ab] focus:ring-4 focus:ring-[#9185a8]/10" /></div>{error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs text-rose-700">{error}</p>}<button type="submit" disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#18243b] px-4 py-3.5 text-xs font-bold text-white transition hover:bg-[#35415a] disabled:cursor-wait disabled:opacity-65">{saving ? <LoadingSpinner label={editingId ? 'Updating category...' : 'Creating category...'} /> : <><span className="grid h-5 w-5 place-items-center rounded-full bg-white/15">{editingId ? '✓' : '+'}</span>{editingId ? 'Save changes' : 'Create category'}</>}</button></form>
            <div className="relative mt-6 flex items-center gap-2 border-t border-[#e8e6ed] pt-5 text-[10px] text-[#858491]"><span className="h-1.5 w-1.5 rounded-full bg-[#c89a4d]" /> Categories help keep your tasks easy to find.</div>
          </div>
        </div>
      </section>
      <footer className="border-t border-white/75 bg-[#f8f7f8]/80 px-5 py-6 text-center text-[9px] font-medium tracking-[.18em] text-[#92909c]">DAYMARK <span className="mx-2 text-[#b8914e]">·</span> ORGANIZE YOUR DAY</footer>
    </main>
  );
};

export default Categories;
