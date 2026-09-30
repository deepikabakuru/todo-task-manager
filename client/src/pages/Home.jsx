import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { token } = useAuth();
  const mainHref = token ? '/dashboard' : '/register';

  return (
    <main className="overflow-hidden bg-[#f3f3f1] text-[#111315]">
      <section className="relative isolate flex min-h-screen flex-col overflow-hidden bg-[radial-gradient(ellipse_at_72%_44%,#fff_0%,#f1f1ef_35%,#dedfdf_100%)]">
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-30" aria-hidden="true" style={{ backgroundImage: 'radial-gradient(#555 0.65px, transparent 0.65px)', backgroundSize: '36px 36px' }} />
        <header className="mx-auto flex w-[min(94%,1320px)] items-center justify-between border-b border-black/10 py-5 sm:py-6">
          <Link to="/" aria-label="Daymark home" className="flex items-center gap-2.5"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#111315] text-sm font-bold text-white">D</span><span className="text-base font-bold tracking-tight">daymark</span></Link>
          <nav className="hidden items-center gap-8 text-xs font-medium text-[#55595c] md:flex" aria-label="Main navigation"><a href="#home" className="transition hover:text-black">Home</a><a href="#approach" className="transition hover:text-black">Our approach</a><a href="#preview" className="transition hover:text-black">Preview</a></nav>
          {token ? <Link to="/dashboard" className="rounded-full bg-[#111315] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#3b3e40]">Open dashboard <span aria-hidden="true">↗</span></Link> : <div className="flex items-center gap-2 sm:gap-4"><Link to="/login" className="hidden px-2 py-2 text-xs font-semibold text-[#4c5053] transition hover:text-black sm:inline-flex">Log in</Link><Link to="/register" className="rounded-full bg-[#111315] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#3b3e40]">Get started <span aria-hidden="true">↗</span></Link></div>}
        </header>

        <div id="home" className="mx-auto grid w-[min(94%,1320px)] flex-1 items-center gap-5 py-10 sm:py-14 lg:grid-cols-[1fr_1fr] lg:gap-4 lg:py-8">
          <div className="relative z-10 max-w-[570px] py-8 text-center lg:text-left">
            <p className="mb-6 inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[.24em] text-[#777b7e]"><span className="h-px w-7 bg-[#202326]" /> A little clarity goes a long way</p>
            <h1 className="text-[3.2rem] font-semibold leading-[.98] tracking-[-.065em] text-[#111315] sm:text-7xl lg:text-[5.55rem]">Make space<br />for what<br className="sm:hidden" /> matters.</h1>
            <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-[#606568] sm:text-base lg:mx-0">Keep your tasks, priorities, and plans in one clear place. Start with today, then take the next thing at your own pace.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start"><Link to={mainHref} className="inline-flex items-center justify-center gap-3 rounded-full bg-[#111315] px-6 py-3.5 text-xs font-semibold text-white transition hover:bg-[#404447]">{token ? 'Go to your dashboard' : 'Create your free account'} <span aria-hidden="true">↗</span></Link>{!token && <Link to="/login" className="inline-flex items-center justify-center rounded-full border border-black/15 bg-white/45 px-6 py-3.5 text-xs font-semibold text-[#454a4d] transition hover:bg-white/80">I already have an account</Link>}</div>
            <p className="mt-9 text-[10px] font-medium uppercase tracking-[.18em] text-[#85898b]">Less noise <span className="mx-2">·</span> Clearer priorities <span className="mx-2">·</span> Your pace</p>
          </div>

          <div className="relative mx-auto flex h-[390px] w-full max-w-[610px] items-center justify-center sm:h-[500px] lg:h-[600px]" aria-label="Animated Daymark emblem">
            <div className="absolute h-[74%] w-[74%] rounded-full bg-white/65 blur-[75px]" />
            <div className="daymark-float relative h-[300px] w-[300px] sm:h-[390px] sm:w-[390px]">
              <div className="daymark-spin absolute inset-[14%] rounded-full border-[23px] border-[#7b7e80] shadow-[inset_8px_12px_22px_rgba(255,255,255,.95),inset_-10px_-12px_18px_rgba(0,0,0,.42),0_35px_55px_rgba(0,0,0,.18)] sm:border-[30px]" />
              <div className="absolute inset-[19%] rounded-full border-[14px] border-[#eceeed] shadow-[inset_2px_4px_13px_rgba(0,0,0,.55),0_3px_4px_rgba(255,255,255,.8)] sm:border-[18px]" />
              <div className="daymark-orbit absolute left-[-5%] top-[28%] h-[44%] w-[110%] rounded-[50%] border-[15px] border-[#55595b] shadow-[inset_0_4px_9px_rgba(255,255,255,.95),inset_0_-8px_12px_rgba(0,0,0,.65),0_9px_15px_rgba(0,0,0,.22)] sm:border-[20px]" />
              <div className="absolute left-[32%] top-[31%] grid h-[36%] w-[36%] place-items-center rounded-full bg-[radial-gradient(circle_at_33%_25%,#fff_0%,#babdbd_24%,#383c3e_59%,#070808_100%)] text-white shadow-[inset_-8px_-10px_17px_rgba(0,0,0,.65),inset_5px_6px_12px_rgba(255,255,255,.8),0_12px_22px_rgba(0,0,0,.28)]"><span className="text-5xl font-light tracking-[-.08em] text-white/90 sm:text-6xl">D</span></div>
              <span className="absolute left-[20%] top-[16%] h-5 w-12 rotate-[-34deg] rounded-full bg-white/90 blur-md sm:h-7 sm:w-16" />
              <span className="absolute right-[13%] top-[57%] h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_20px_6px_rgba(255,255,255,.85)]" />
            </div>
            <div className="absolute bottom-5 right-[4%] rounded-full border border-white/80 bg-white/50 px-4 py-2 text-[9px] font-semibold uppercase tracking-[.18em] text-[#55595c] shadow-sm backdrop-blur-md sm:bottom-8 sm:right-[5%]">Make room for today</div>
          </div>
        </div>
        <a href="#preview" className="mx-auto mb-7 flex flex-col items-center gap-2 text-[8px] font-bold uppercase tracking-[.35em] text-[#85898b]">Scroll to explore<span className="h-5 w-px bg-[#777b7e]/60" /></a>
      </section>

      <section id="preview" className="bg-[#111315] px-5 py-20 text-white sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[.75fr_1.25fr] md:gap-20">
          <div><p className="text-[9px] font-bold uppercase tracking-[.23em] text-white/45">A quieter workflow</p><h2 className="mt-4 text-3xl font-medium leading-tight tracking-[-.04em] sm:text-4xl">A clear place for what’s next.</h2><p className="mt-4 max-w-md text-sm leading-7 text-white/55">Keep the details together, choose your priorities, and make progress without crowding your day.</p><Link to={mainHref} className="mt-7 inline-flex items-center gap-2 text-xs font-semibold text-white transition hover:text-white/65">{token ? 'Open your workspace' : 'Start planning'} <span aria-hidden="true">→</span></Link></div>
          <div className="rounded-[26px] border border-white/10 bg-[#1b1e20] p-5 shadow-[0_28px_80px_-45px_rgba(0,0,0,.7)] sm:p-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-5"><div><p className="text-[9px] font-semibold uppercase tracking-[.2em] text-white/40">Today · At a glance</p><h3 className="mt-1 text-lg font-semibold">Your focus board</h3></div><span className="rounded-full border border-white/10 px-3 py-1.5 text-[9px] font-semibold text-white/55">3 TASKS</span></div>
            <div className="divide-y divide-white/[.08]">{[{title:'Review project proposal',time:'10:30 AM',tag:'HIGH'},{title:'Send the weekly update',time:'1:00 PM',tag:'MEDIUM'},{title:'Plan next week',time:'Tomorrow',tag:'LOW'}].map((task,index)=><div key={task.title} className="flex items-center gap-4 py-4"><span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border ${index===2?'border-white bg-white text-black':'border-white/20 text-white/40'}`}>{index===2?'✓':`0${index+1}`}</span><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-white/85">{task.title}</p><p className="mt-1 text-[10px] text-white/40">{task.time}</p></div><span className="text-[8px] font-bold tracking-[.16em] text-white/35">{task.tag}</span></div>)}</div>
            <div className="mt-2 flex items-center justify-between rounded-xl bg-white px-4 py-3 text-[#17191b]"><p className="text-[10px] font-semibold">Small wins add up.</p><p className="text-[10px] font-bold">01 / 03</p></div>
          </div>
        </div>
      </section>

      <section id="approach" className="bg-[#f3f3f1] px-5 py-14 sm:px-8 sm:py-16"><div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-3 sm:gap-6">{[{number:'01',title:'See the next step',detail:'Keep your priorities in view.'},{number:'02',title:'Set your own pace',detail:'Plan a day that feels like yours.'},{number:'03',title:'Notice your progress',detail:'Every small win deserves a moment.'}].map((item)=><article key={item.number} className="border-t border-black/15 pt-4"><p className="text-[9px] font-bold tracking-[.18em] text-[#85898b]">{item.number} / DAYMARK</p><h3 className="mt-3 text-sm font-semibold">{item.title}</h3><p className="mt-1 text-xs text-[#777c7f]">{item.detail}</p></article>)}</div></section>
      <footer className="border-t border-black/10 bg-[#f3f3f1] px-5 py-6 text-center text-[9px] font-medium tracking-[.18em] text-[#85898b]">DAYMARK <span className="mx-2 text-[#55595b]">·</span> MAKE SPACE FOR WHAT MATTERS</footer>
    </main>
  );
};

export default Home;
