import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import dashboardArtwork from '../assets/dashboard-cards.webp';

const defaultForm = {
  title: '',
  description: '',
  priority: 'medium',
  dueDate: '',
  category: '',
};

const priorityStyles = {
  high: 'bg-[#E8F5F2] text-[#172033] ring-[#b9ddd5]',
  medium: 'bg-[#E8F5F2] text-[#172033] ring-[#b9ddd5]',
  low: 'bg-[#E8F5F2] text-[#172033] ring-[#b9ddd5]',
};

const Dashboard = () => {
  const { logout, user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [stats, setStats] = useState({ pending: 0, completed: 0 });
  const [statsLoading, setStatsLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [showDueTodayOnly, setShowDueTodayOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [pendingTaskId, setPendingTaskId] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await api.get('/api/categories?page=1&limit=100');
      setCategories(response.data.categories || []);
    } catch (err) {
      console.error('Failed to load categories', err);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await api.get('/api/tasks/stats');
      setStats(response.data || { pending: 0, completed: 0 });
    } catch (err) {
      console.error('Failed to load task stats', err);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchTasks = async (nextPage = page) => {
    try {
      setLoading(true);
      let url = `/api/tasks?page=${nextPage}&limit=10`;

      if (search.trim()) {
        url = `/api/tasks/search?q=${encodeURIComponent(search.trim())}`;
      } else if (showDueTodayOnly) {
        url = '/api/tasks/due-today';
      }

      const response = await api.get(url);

      if (search.trim() || showDueTodayOnly) {
        setTasks(response.data || []);
        setPages(1);
      } else {
        const { tasks: data = [], page: currentPage = 1, pages: totalPages = 1 } = response.data || {};
        setTasks(data);
        setPage(currentPage);
        setPages(totalPages);
      }
    } catch (err) {
      console.error('Failed to fetch tasks', err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchStats();
    fetchTasks();
  }, []);

  useEffect(() => {
    const handleCategoriesUpdated = () => fetchCategories();
    window.addEventListener('categories:updated', handleCategoriesUpdated);
    return () => window.removeEventListener('categories:updated', handleCategoriesUpdated);
  }, []);

  useEffect(() => {
    fetchTasks(1);
    fetchStats();
  }, [search, showDueTodayOnly]);

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
      const payload = {
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category || null,
        dueDate: form.dueDate || null,
      };

      if (editingId) {
        await api.put(`/api/tasks/${editingId}`, payload);
      } else {
        await api.post('/api/tasks', payload);
      }

      setForm(defaultForm);
      setEditingId(null);
      await Promise.all([fetchTasks(), fetchStats()]);
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const toggleComplete = async (taskId, currentStatus) => {
    try {
      setPendingTaskId(taskId);
      await api.patch(`/api/tasks/${taskId}/complete`);
      setTasks((previous) => previous.map((task) => (
        task._id === taskId ? { ...task, completed: !currentStatus } : task
      )));
      fetchStats();
    } catch (err) {
      console.error('Failed to toggle task', err);
    } finally {
      setPendingTaskId(null);
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;

    try {
      setDeletingTaskId(taskId);
      await api.delete(`/api/tasks/${taskId}`);
      await Promise.all([fetchTasks(), fetchStats()]);
    } catch (err) {
      console.error('Failed to delete task', err);
    } finally {
      setDeletingTaskId(null);
    }
  };

  const startEdit = (task) => {
    setEditingId(task._id);
    setForm({
      title: task.title || '',
      description: task.description || '',
      priority: task.priority || 'medium',
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : '',
      category: task.category?._id || '',
    });
    setError('');
  };

  const resetForm = () => {
    setForm(defaultForm);
    setEditingId(null);
    setError('');
  };

  const totalTasks = Number(stats.pending || 0) + Number(stats.completed || 0);
  const firstName = user?.name?.trim().split(/\s+/)[0] || 'Divya';
  const today = new Intl.DateTimeFormat('en', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  return (
    <div className="min-h-screen bg-[#F8F7F3] text-[#172033]">
      <header className="border-b border-[#d8e8e4] bg-white">
        <div className="mx-auto flex min-h-[76px] max-w-[1440px] flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
          <div className="flex items-center gap-3 sm:gap-5">
            <Link to="/" className="flex items-center gap-3" aria-label="Daymark home">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#172033] text-lg font-bold text-white">D</span>
              <span>
                <span className="block text-lg font-bold leading-tight tracking-tight text-slate-900">daymark</span>
                <span className="block text-[11px] font-medium text-slate-500">TASK MANAGER</span>
              </span>
            </Link>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => `rounded-lg px-3 py-2 text-sm font-semibold transition ${isActive ? 'bg-[#E8F5F2] text-[#2A9D8F]' : 'text-[#465268] hover:bg-[#E8F5F2] hover:text-[#172033]'}`}
            >
              Home
            </NavLink>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/tasks/new" className="rounded-lg px-3 py-2 text-sm font-semibold text-[#465268] transition hover:bg-[#E8F5F2] hover:text-[#172033]">New task</Link>
            <Link to="/categories" className="rounded-lg px-3 py-2 text-sm font-semibold text-[#465268] transition hover:bg-[#E8F5F2] hover:text-[#172033]">
              Categories
            </Link>
            <span className="hidden h-8 w-px bg-[#d8e8e4] sm:block" />
            <span className="hidden text-sm text-[#627087] sm:block">Hi, {firstName}</span>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#E8F5F2] text-sm font-bold uppercase text-[#2A9D8F]">
              {firstName.charAt(0)}
            </span>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-[#d8e8e4] px-3 py-2 text-sm font-semibold text-[#465268] transition hover:border-[#b9ddd5] hover:bg-[#E8F5F2]"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] space-y-7 px-4 py-7 sm:px-6 sm:py-9 lg:px-10 lg:py-10">
        <section className="relative isolate min-h-[330px] overflow-hidden rounded-[30px] border border-white/80 bg-gradient-to-br from-[#e7e3ed] via-[#f1edf0] to-[#dce4ea] px-5 py-7 shadow-[0_22px_60px_-36px_rgba(61,65,94,.32)] sm:min-h-[350px] sm:px-9 sm:py-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_38%,rgba(255,255,255,.82),transparent_48%)]" />
          <img src={dashboardArtwork} alt="" className="pointer-events-none absolute bottom-[-34px] right-[-44px] z-0 w-[100%] max-w-[510px] opacity-45 mix-blend-multiply [mask-image:radial-gradient(ellipse_at_52%_50%,black_38%,transparent_76%)] sm:bottom-[-76px] sm:right-[-16px] sm:w-[62%] sm:opacity-90" />
          <div className="relative z-10 flex h-full min-h-[275px] max-w-[600px] flex-col justify-center sm:min-h-[290px]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#64768d]">{today}</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#202942] sm:text-5xl">Good day, {firstName}</h1>
            <p className="mt-3 max-w-md text-sm leading-6 text-[#617087] sm:text-base">Here&apos;s a clear look at what needs your attention. Take a breath, then choose your next step.</p>
            <p className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/80 bg-white/60 px-3.5 py-2 text-xs font-semibold text-[#596b82] shadow-sm backdrop-blur-sm"><span className="h-2 w-2 rounded-full bg-[#ef9a76]" /> Your progress, one task at a time.</p>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-3" aria-label="Task summary">
          <SummaryCard
            label="Pending tasks"
            value={statsLoading ? null : stats.pending}
            note="Still on your list"
            theme="blue"
            icon={<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" /><path d="M12 7.5v5l3 1.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>}
          />
          <SummaryCard
            label="Completed"
            value={statsLoading ? null : stats.completed}
            note="You made progress"
            theme="green"
            icon={<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6.5 12.5 3.6 3.6 7.7-8.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" /></svg>}
          />
          <SummaryCard
            label="Total tasks"
            value={statsLoading ? null : totalTasks}
            note="Across every category"
            theme="dark"
            icon={<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 6.5h10M8 12h10M8 17.5h10M4.5 6.5h.01M4.5 12h.01M4.5 17.5h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>}
          />
        </section>

        <section className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.85fr)] xl:gap-7">
          <div className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_8px_24px_-20px_rgba(15,23,42,0.35)] sm:p-6">
            <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900">Your tasks</h2>
                <p className="mt-1 text-sm text-slate-500">Keep your next steps moving.</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <label className="relative block min-w-0 sm:w-56">
                  <span className="sr-only">Search tasks</span>
                  <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="10.8" cy="10.8" r="6.3" stroke="currentColor" strokeWidth="1.8" />
                    <path d="m15.5 15.5 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search tasks"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#69a99a] focus:bg-white focus:ring-4 focus:ring-[#176b5d]/10"
                  />
                </label>
                <button
                  type="button"
                  aria-pressed={showDueTodayOnly}
                  onClick={() => setShowDueTodayOnly((previous) => !previous)}
                  className={`inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-semibold transition ${showDueTodayOnly ? 'border-[#176b5d] bg-[#176b5d] text-white' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="5.5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" /><path d="M8 3.5v4M16 3.5v4M4 9.5h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
                  {showDueTodayOnly ? 'Due today on' : 'Due today'}
                </button>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {loading ? (
                <div className="flex justify-center py-14 text-slate-500"><LoadingSpinner label="Loading your tasks..." /></div>
              ) : tasks.length === 0 ? (
                <div className="px-3 py-14 text-center">
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#eaf3ef] text-[#176b5d]">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 5.5h10a1.5 1.5 0 0 1 1.5 1.5v11a1.5 1.5 0 0 1-1.5 1.5h-12A1.5 1.5 0 0 1 4.5 18V8.5L8 5.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M8 5.5v3h-3M8 12h8M8 15.5h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                  </span>
                  <p className="mt-4 text-sm font-semibold text-slate-800">
                    {search.trim() || showDueTodayOnly ? 'No tasks match this view.' : 'No tasks yet â€” create your first one.'}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">Your list will show up here when it&apos;s ready.</p>
                </div>
              ) : (
                tasks.map((task) => (
                  <article key={task._id} className="group flex gap-3 py-4 sm:gap-4 sm:py-5">
                    <button
                      type="button"
                      aria-label={task.completed ? `Mark ${task.title} pending` : `Complete ${task.title}`}
                      aria-pressed={!!task.completed}
                      disabled={pendingTaskId === task._id}
                      onClick={() => toggleComplete(task._id, task.completed)}
                      className={`mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border transition ${task.completed ? 'border-[#176b5d] bg-[#176b5d] text-white' : 'border-slate-300 text-transparent hover:border-[#176b5d]'} disabled:opacity-60`}
                    >
                      {pendingTaskId === task._id ? <span className="h-3 w-3 animate-spin rounded-full border border-current border-r-transparent" /> : task.completed ? <span className="text-xs">âœ“</span> : null}
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h3 className={`break-words text-sm font-bold sm:text-base ${task.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{task.title}</h3>
                        <span className={`rounded-md px-2 py-1 text-[11px] font-bold capitalize ring-1 ${priorityStyles[task.priority] || priorityStyles.medium}`}>{task.priority || 'medium'}</span>
                      </div>
                      <p className="mt-1 break-words text-sm leading-5 text-slate-500">{task.description || 'No description added.'}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-slate-500">
                        <span className="inline-flex items-center gap-1.5">
                          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="5.5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" /><path d="M8 3.5v4M16 3.5v4M4 9.5h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-[#61a58e]" />
                          {task.category?.name || 'Uncategorized'}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 ${task.completed ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                          {task.completed ? 'Completed' : 'In progress'}
                        </span>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-start gap-1 opacity-100 transition sm:opacity-70 sm:group-hover:opacity-100">
                      <button type="button" onClick={() => startEdit(task)} aria-label={`Edit ${task.title}`} className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 transition hover:bg-blue-50 hover:text-blue-700">
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m14.5 5.5 4 4M5 19l3.7-.8L19 7.9a2.1 2.1 0 0 0-3-3L5.7 15.2 5 19Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </button>
                      <button type="button" onClick={() => handleDelete(task._id)} disabled={deletingTaskId === task._id} aria-label={`Delete ${task.title}`} className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 transition hover:bg-rose-50 hover:text-rose-700 disabled:opacity-50">
                        {deletingTaskId === task._id ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" /> : <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4.5 7h15M10 11v6M14 11v6M6.5 7l.8 13h9.4l.8-13M9 7V4.5h6V7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>

            {!search && !showDueTodayOnly && pages > 1 && (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <p className="text-xs font-medium text-slate-500">Page {page} of {pages}</p>
                <div className="flex gap-2">
                  <button type="button" disabled={page <= 1 || loading} onClick={() => fetchTasks(page - 1)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
                  <button type="button" disabled={page >= pages || loading} onClick={() => fetchTasks(page + 1)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">Next</button>
                </div>
              </div>
            )}
          </div>

          <aside className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_8px_24px_-20px_rgba(15,23,42,0.35)] sm:p-6 lg:sticky lg:top-6">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#eaf3ef] text-[#176b5d]">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                  </span>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900">{editingId ? 'Edit task' : 'New task'}</h2>
                </div>
                <p className="mt-2 text-sm text-slate-500">Add the next thing on your list.</p>
              </div>
              {editingId && (
                <button type="button" onClick={resetForm} className="rounded-md px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-800">Cancel</button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="task-title" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">Task title</label>
                <input id="task-title" type="text" name="title" value={form.title} onChange={handleChange} placeholder="What needs to get done?" className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#69a99a] focus:ring-4 focus:ring-[#176b5d]/10" />
              </div>

              <div>
                <label htmlFor="task-description" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">Description</label>
                <textarea id="task-description" name="description" value={form.description} onChange={handleChange} rows="3" placeholder="Add a few details (optional)" className="w-full resize-y rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#69a99a] focus:ring-4 focus:ring-[#176b5d]/10" />
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <div>
                  <label htmlFor="task-priority" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">Priority</label>
                  <select id="task-priority" name="priority" value={form.priority} onChange={handleChange} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm capitalize text-slate-700 outline-none transition focus:border-[#69a99a] focus:ring-4 focus:ring-[#176b5d]/10">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="task-due-date" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">Due date</label>
                  <input id="task-due-date" type="datetime-local" name="dueDate" value={form.dueDate} onChange={handleChange} className="w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-[#69a99a] focus:ring-4 focus:ring-[#176b5d]/10" />
                </div>
              </div>

              <div>
                <label htmlFor="task-category" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">Category</label>
                <select id="task-category" name="category" value={form.category} onChange={handleChange} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-[#69a99a] focus:ring-4 focus:ring-[#176b5d]/10">
                  <option value="">{categoriesLoading ? 'Loading categories...' : 'Choose a category'}</option>
                  {categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}
                </select>
                {!categoriesLoading && categories.length === 0 && (
                  <Link to="/categories" className="mt-2 inline-block text-xs font-semibold text-[#176b5d] hover:underline">Create a category</Link>
                )}
              </div>

              {error && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-700">{error}</p>}

              <button type="submit" disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#176b5d] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#125448] focus:outline-none focus:ring-4 focus:ring-[#176b5d]/20 disabled:cursor-wait disabled:opacity-70">
                {saving ? <LoadingSpinner label={editingId ? 'Updating task...' : 'Creating task...'} /> : <><svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>{editingId ? 'Update task' : 'Create task'}</>}
              </button>
            </form>
          </aside>
        </section>
      </main>
    </div>
  );
};

const SummaryCard = ({ label, value, note, theme, icon }) => {
  const themeStyles = {
    blue: 'bg-[#2A9D8F]',
    green: 'bg-[#238579]',
    dark: 'bg-[#172033]',
  };

  return (
    <article className={`relative isolate overflow-hidden rounded-2xl p-5 text-white shadow-[0_12px_28px_-18px_rgba(23,32,51,0.35)] sm:p-6 ${themeStyles[theme]}`}>
      <span className="absolute -right-6 -top-8 -z-10 h-32 w-32 rounded-full border-[22px] border-white/5" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-white/80">{label}</p>
          <p className="mt-3 text-4xl font-bold tracking-tight">{value === null ? <span className="inline-block h-9 w-10 animate-pulse rounded bg-white/20" /> : value}</p>
          <p className="mt-2 text-xs font-medium text-white/70">{note}</p>
        </div>
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 text-white [&>svg]:h-5 [&>svg]:w-5">{icon}</span>
      </div>
    </article>
  );
};

export default Dashboard;


