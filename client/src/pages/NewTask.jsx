import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

const NewTask = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', dueDate: '', category: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/api/categories?page=1&limit=100')
      .then((response) => setCategories(response.data.categories || []))
      .catch(() => setCategories([]))
      .finally(() => setCategoriesLoading(false));
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!form.title.trim()) {
      setError('Task title is required');
      return;
    }

    try {
      setSaving(true);
      await api.post('/api/tasks', {
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category || null,
        dueDate: form.dueDate || null,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const firstName = user?.name?.trim().split(/\s+/)[0] || 'Divya';

  return (
    <main className="min-h-screen bg-[#f3f4f4] text-[#17191b]">
      <header className="border-b border-black/10 bg-[#f9fafa]">
        <div className="mx-auto flex min-h-[72px] max-w-[1440px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
          <Link to="/dashboard" className="flex items-center gap-3" aria-label="Back to Daymark dashboard">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#17191b] text-sm font-bold text-white">D</span>
            <span className="text-base font-bold tracking-tight">daymark</span>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-4" aria-label="Workspace navigation">
            <Link to="/dashboard" className="rounded-lg px-3 py-2 text-xs font-semibold text-[#5b6064] transition hover:bg-black/5 hover:text-black">Dashboard</Link>
            <Link to="/categories" className="hidden rounded-lg px-3 py-2 text-xs font-semibold text-[#5b6064] transition hover:bg-black/5 hover:text-black sm:inline-flex">Categories</Link>
            <span className="hidden h-7 w-px bg-black/10 sm:block" />
            <span className="hidden text-xs font-medium text-[#6c7175] sm:inline">{firstName}</span>
            <button type="button" onClick={logout} className="rounded-lg border border-black/10 px-3 py-2 text-xs font-semibold text-[#4d5255] transition hover:bg-white">Log out</button>
          </nav>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-5 py-8 sm:px-8 sm:py-12 lg:grid-cols-[minmax(0,1fr)_minmax(360px,.9fr)] lg:gap-16 lg:px-12 lg:py-14">
        <section>
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-xs font-semibold text-[#777d82] transition hover:text-black"><span aria-hidden="true">←</span> Back to your day</Link>
          <p className="mt-8 text-[10px] font-bold uppercase tracking-[.24em] text-[#858b8e]">A fresh start · New task</p>
          <h1 className="mt-3 text-4xl font-semibold leading-[1.03] tracking-[-.055em] text-[#17191b] sm:text-5xl">Make your next<br />move count.</h1>
          <p className="mt-4 max-w-lg text-sm leading-6 text-[#71777b]">Give the task a name, choose a priority, and leave the rest for later. You can update the details any time.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-[26px] border border-white bg-white/80 p-5 shadow-[0_22px_70px_-48px_rgba(20,25,29,.32)] sm:p-7">
            <div>
              <label htmlFor="new-task-title" className="mb-2 block text-[10px] font-bold uppercase tracking-[.16em] text-[#5d6367]">Task name</label>
              <input id="new-task-title" autoFocus type="text" name="title" value={form.title} onChange={handleChange} placeholder="What needs to get done?" className="w-full rounded-xl border border-[#e4e6e7] bg-[#f8f9f9] px-4 py-3.5 text-sm outline-none transition placeholder:text-[#a0a5a8] focus:border-[#52585c] focus:bg-white focus:ring-4 focus:ring-black/5" />
            </div>
            <div>
              <label htmlFor="new-task-description" className="mb-2 block text-[10px] font-bold uppercase tracking-[.16em] text-[#5d6367]">A few details <span className="font-medium normal-case tracking-normal text-[#a0a5a8]">· optional</span></label>
              <textarea id="new-task-description" name="description" value={form.description} onChange={handleChange} rows="3" placeholder="Add a note to future you" className="w-full resize-y rounded-xl border border-[#e4e6e7] bg-[#f8f9f9] px-4 py-3.5 text-sm outline-none transition placeholder:text-[#a0a5a8] focus:border-[#52585c] focus:bg-white focus:ring-4 focus:ring-black/5" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="new-task-priority" className="mb-2 block text-[10px] font-bold uppercase tracking-[.16em] text-[#5d6367]">Priority</label>
                <select id="new-task-priority" name="priority" value={form.priority} onChange={handleChange} className="w-full rounded-xl border border-[#e4e6e7] bg-[#f8f9f9] px-3.5 py-3.5 text-sm capitalize outline-none transition focus:border-[#52585c] focus:bg-white focus:ring-4 focus:ring-black/5"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select>
              </div>
              <div>
                <label htmlFor="new-task-due-date" className="mb-2 block text-[10px] font-bold uppercase tracking-[.16em] text-[#5d6367]">Due date</label>
                <input id="new-task-due-date" type="datetime-local" name="dueDate" value={form.dueDate} onChange={handleChange} className="w-full min-w-0 rounded-xl border border-[#e4e6e7] bg-[#f8f9f9] px-3 py-3.5 text-sm text-[#50565a] outline-none transition focus:border-[#52585c] focus:bg-white focus:ring-4 focus:ring-black/5" />
              </div>
            </div>
            <div>
              <label htmlFor="new-task-category" className="mb-2 block text-[10px] font-bold uppercase tracking-[.16em] text-[#5d6367]">Category</label>
              <select id="new-task-category" name="category" value={form.category} onChange={handleChange} className="w-full rounded-xl border border-[#e4e6e7] bg-[#f8f9f9] px-3.5 py-3.5 text-sm text-[#50565a] outline-none transition focus:border-[#52585c] focus:bg-white focus:ring-4 focus:ring-black/5"><option value="">{categoriesLoading ? 'Loading categories…' : 'Choose a category (optional)'}</option>{categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}</select>
              {!categoriesLoading && categories.length === 0 && <Link to="/categories" className="mt-2 inline-block text-xs font-semibold text-[#555c61] underline decoration-black/20 underline-offset-4">Create a category</Link>}
            </div>
            {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-700">{error}</p>}
            <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
              <Link to="/dashboard" className="rounded-xl px-4 py-3 text-center text-xs font-semibold text-[#777d82] transition hover:bg-[#f1f2f2]">Cancel</Link>
              <button type="submit" disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#17191b] px-5 py-3.5 text-xs font-bold text-white transition hover:bg-[#363b3e] disabled:cursor-wait disabled:opacity-65">{saving ? <LoadingSpinner label="Creating task…" /> : <><span className="grid h-5 w-5 place-items-center rounded-full bg-white/15">+</span>Create task</>}</button>
            </div>
          </form>
        </section>

        <aside className="relative mx-auto flex min-h-[380px] w-full max-w-[570px] items-center justify-center overflow-hidden rounded-[32px] bg-[#e8e9e9] p-6 sm:min-h-[540px]" aria-label="Isometric task illustration">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_52%_45%,#fff_0%,#eef0f0_44%,#dfe1e1_100%)]" />
          <div className="absolute left-1/2 top-[68%] h-16 w-[72%] -translate-x-1/2 rounded-[50%] bg-[#9da1a2]/25 blur-2xl" />
          <svg className="relative z-10 w-full max-w-[500px] drop-shadow-[0_28px_22px_rgba(20,23,25,.13)]" viewBox="0 0 520 460" fill="none" role="img" aria-labelledby="task-illustration-title">
            <title id="task-illustration-title">A layered isometric checklist</title>
            <path d="m73 282 174-101 199 115-174 101L73 282Z" fill="#d1d4d4"/>
            <path d="m73 282 199 115v20L73 302v-20Z" fill="#bfc3c3"/>
            <path d="m272 397 174-101v20L272 417v-20Z" fill="#aeb2b2"/>
            <path d="m109 254 146-85 162 94-146 85-162-94Z" fill="#f7f8f8" stroke="#aeb3b4" strokeWidth="2"/>
            <path d="m109 254 162 94v17l-162-94v-17Z" fill="#d0d3d3"/>
            <path d="m271 348 146-85v17l-146 85v-17Z" fill="#b9bdbd"/>
            <path d="m152 197 129-75 147 85-129 75-147-85Z" fill="#292d2f" stroke="#414648" strokeWidth="2"/>
            <path d="m152 197 147 85v104l-147-85V197Z" fill="#171a1c"/>
            <path d="m299 282 129-75v104l-129 75V282Z" fill="#373c3e"/>
            <path d="m169 200 111-65 110 64-111 65-110-64Z" fill="#f7f8f8"/>
            <path d="m169 200 110 64v81l-110-64v-81Z" fill="#e0e2e2"/>
            <path d="m279 264 111-65v81l-111 65v-81Z" fill="#c9cdcd"/>
            <path d="m188 199 12-7 8 5-12 7-8-5Zm0 21 12-7 8 5-12 7-8-5Zm0 21 12-7 8 5-12 7-8-5Z" fill="#464c4e"/>
            <path d="m216 194 72-42m-72 63 72-42m-72 63 72-42" stroke="#929899" strokeWidth="3" strokeLinecap="round"/>
            <path d="m335 115 37-21 44 25-37 21-44-25Z" fill="#fff" stroke="#b9bebe" strokeWidth="2"/>
            <path d="m379 140 37-21v47l-37 21v-47Z" fill="#d3d6d6"/>
            <path d="m335 115 44 25v47l-44-25v-47Z" fill="#eceeee"/>
            <path d="m350 136 8 5 17-19" stroke="#454b4d" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="124" cy="148" r="26" fill="#d4d7d7"/><circle cx="124" cy="145" r="24" fill="#f8f9f9" stroke="#aeb3b4" strokeWidth="2"/><path d="m114 145 7 7 15-17" stroke="#4f5557" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="m96 103 31-18 33 19-31 18-33-19Z" fill="#b9bebe"/><path d="m129 122 31-18v16l-31 18v-16Z" fill="#a5aaaa"/><path d="m96 103 33 19v16l-33-19v-16Z" fill="#d7dada"/>
            <circle cx="414" cy="88" r="4" fill="#8b9091"/><circle cx="103" cy="337" r="4" fill="#b6baba"/><circle cx="437" cy="317" r="3" fill="#969b9c"/>
          </svg>
          <div className="absolute bottom-5 left-5 right-5 z-20 flex items-center justify-between rounded-2xl border border-white/70 bg-white/65 px-4 py-3 backdrop-blur-md sm:bottom-6 sm:left-6 sm:right-6"><span className="text-[9px] font-bold uppercase tracking-[.2em] text-[#73797c]">A clearer next step</span><span className="text-xs font-semibold text-[#34393b]">01 / Create</span></div>
        </aside>
      </div>
    </main>
  );
};

export default NewTask;
