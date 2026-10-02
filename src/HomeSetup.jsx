import React, { useState, useEffect, useRef } from 'react';
import { UI_THEMES, SHOPS, AVATARS } from './data';
import { playSound } from './audio';
import { t, localShop, localShopDescription, localTheme } from './i18n';
function HomeSetup({ track, setTrack, uiTheme, setUiTheme, currentShopId, setCurrentShopId, avatarId, setAvatarId, onStart, language, resume }) {
        const tr = key => t(language, key);
        const [panel, setPanel] = useState(null);
        const dialogRef = useRef(null);
        const openerRef = useRef(null);
        const closePanel = () => { setPanel(null); requestAnimationFrame(() => openerRef.current?.focus()); };
        const activeShop = SHOPS[currentShopId];
        const avatar = AVATARS.find(a => a.id === avatarId) || AVATARS[0];
        const tracks = [
          { id: 'explorer', icon: '🌱', name: language === 'es' ? 'Explorador del mercado' : 'Market Explorer', detail: language === 'es' ? '5–7 años · Contar y sumar' : 'Ages 5–7 · Counting and adding' },
          { id: 'manager', icon: '📦', name: language === 'es' ? 'Gerente de tienda' : 'Shop Manager', detail: language === 'es' ? '8–10 años · Grupos, fracciones y cambio' : 'Ages 8–10 · Groups, fractions and change' },
          { id: 'planner', icon: '📊', name: language === 'es' ? 'Planificador del mercado' : 'Market Planner', detail: language === 'es' ? '11–12 años · Decimales, presupuestos y ganancias' : 'Ages 11–12 · Decimals, budgets and profit' }
        ];
        const selectedTrack = tracks.find(t => t.id === track) || tracks[0];
        const panels = {
          track: { icon: '🧭', title: tr('chooseTrack'), subtitle: tr('trackSub') },
          theme: { icon: '🎨', title: tr('chooseTheme'), subtitle: tr('themeSub') },
          stall: { icon: '🏪', title: tr('chooseStall'), subtitle: tr('stallSub') },
          avatar: { icon: '🧑‍🍳', title: tr('chooseAvatar'), subtitle: tr('avatarSub') }
        };
        const options = panel === 'track' ? tracks.map(t => ({ id: t.id, icon: t.icon, name: t.name, detail: t.detail }))
          : panel === 'theme' ? Object.values(UI_THEMES).map(theme => ({ id: theme.id, icon: theme.icon, name: localTheme(language, theme), detail: language === 'es' ? 'Tema del mercado' : 'Island market theme' }))
          : panel === 'stall' ? Object.values(SHOPS).map(s => ({ id: s.id, icon: s.icon, name: localShop(language, s), detail: localShopDescription(language, s), isIcon: true }))
          : panel === 'avatar' ? AVATARS.map(a => ({ id: a.id, icon: a.avatar, name: a.name, detail: language === 'es' ? '¡Listo para atender!' : 'Ready to serve!' })) : [];
        const selectedId = panel === 'track' ? track : panel === 'theme' ? uiTheme : panel === 'stall' ? currentShopId : avatarId;
        const choose = (id) => {
          if (panel === 'track') setTrack(id);
          if (panel === 'theme') setUiTheme(id);
          if (panel === 'stall') setCurrentShopId(id);
          if (panel === 'avatar') setAvatarId(id);
          playSound('click');
          closePanel();
        };
        useEffect(() => {
          if (!panel) return;
          dialogRef.current?.querySelector('button')?.focus();
          const onKey = (event) => {
            if (event.key === 'Escape') closePanel();
            if (event.key === 'Tab') {
              const buttons = [...dialogRef.current.querySelectorAll('button')];
              const first = buttons[0], last = buttons[buttons.length - 1];
              if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
              else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
            }
          };
          window.addEventListener('keydown', onKey);
          return () => window.removeEventListener('keydown', onKey);
        }, [panel]);

        return <div className="setup-world relative flex-1 min-h-0 overflow-y-auto custom-scrollbar rounded-3xl border border-emerald-200 p-4 sm:p-7 max-w-5xl mx-auto w-full">
          <div className="home-content max-w-3xl mx-auto flex flex-col min-h-full gap-4">
            <div className="home-hero text-center">
              <img src="/market-island.svg" alt="" className="home-art w-full h-20 object-contain mb-1 drop-shadow-md" />
              <div className="inline-block rounded-full bg-white/75 px-3 py-1 text-[11px] font-extrabold text-emerald-800">{tr('heroTag')}</div>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-emerald-950 mt-2">{tr('heroTitle')}</h2>
              <p className="text-sm font-bold text-emerald-900/80">{tr('heroLead')}</p>
            </div>
            <div className="home-grid grid grid-cols-2 gap-3 sm:gap-4 flex-1 content-center">
              {[
                { id: 'track', icon: selectedTrack.icon, label: tr('adventure'), value: selectedTrack.name, description: tr('trackHelp'), color: 'from-amber-100 to-orange-100 border-amber-300' },
                { id: 'theme', icon: UI_THEMES[uiTheme].icon, label: tr('sky'), value: localTheme(language, UI_THEMES[uiTheme]), description: tr('themeHelp'), color: 'from-sky-100 to-cyan-100 border-sky-300' },
                { id: 'stall', icon: '🏪', label: tr('stall'), value: localShop(language, activeShop), description: tr('stallHelp'), color: 'from-emerald-100 to-lime-100 border-emerald-300' },
                { id: 'avatar', icon: avatar.avatar, label: tr('shopkeeper'), value: avatar.name, description: tr('avatarHelp'), color: 'from-rose-100 to-pink-100 border-rose-300' }
              ].map(tile => <button key={tile.id} type="button" onClick={(event) => { openerRef.current = event.currentTarget; playSound('click'); setPanel(tile.id); }} className={`setup-tile home-tile bg-gradient-to-br ${tile.color} border-2 rounded-2xl p-3 sm:p-4 text-left text-slate-900 transition-transform hover:-translate-y-1 min-h-[128px] sm:min-h-[134px] flex flex-col justify-between`}>
                <span className="text-3xl sm:text-4xl" aria-hidden="true">{tile.icon}</span>
                <span><span className="block text-[11px] font-extrabold uppercase tracking-wide opacity-70">{tile.label} · {tr('change')}</span><span className="block font-display font-extrabold text-sm sm:text-lg leading-tight mt-0.5">{tile.value}</span><span className="block text-[11px] sm:text-xs font-bold opacity-70 leading-snug mt-1">{tile.description}</span></span>
              </button>)}
            </div>
            <button type="button" onClick={onStart} className="home-start w-full rounded-2xl border-b-4 border-orange-700 bg-gradient-to-r from-orange-500 to-amber-400 py-3.5 text-white font-display text-lg font-extrabold shadow-lg active:translate-y-1 active:border-b-0">▶ {tr(resume ? 'resume' : 'start')}</button>
          </div>
          {panel && <div className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6" onMouseDown={(e) => { if (e.target === e.currentTarget) closePanel(); }}>
            <div ref={dialogRef} role="dialog" aria-modal="true" aria-label={panels[panel].title} className="setup-dialog w-full max-w-xl max-h-[88dvh] overflow-hidden flex flex-col rounded-3xl border-4 border-white bg-amber-50 text-slate-900">
              <div className="flex items-start justify-between gap-3 bg-gradient-to-r from-amber-300 to-orange-200 px-4 py-3 sm:px-5">
                <div><div className="text-2xl" aria-hidden="true">{panels[panel].icon}</div><h3 className="font-display text-xl font-extrabold leading-tight">{panels[panel].title}</h3><p className="text-xs font-bold opacity-75">{panels[panel].subtitle}</p></div>
                <button type="button" onClick={closePanel} aria-label={tr('close')} className="w-11 h-11 shrink-0 rounded-full bg-white/80 font-extrabold text-lg">×</button>
              </div>
              <div className="overflow-y-auto custom-scrollbar p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {options.map(option => <button key={option.id} type="button" onClick={() => choose(option.id)} aria-pressed={selectedId === option.id} className={`flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition ${selectedId === option.id ? 'bg-amber-200 border-orange-500 shadow-inner' : 'bg-white border-slate-200 hover:border-orange-400'}`}>
                  <span className="w-11 h-11 shrink-0 rounded-xl bg-white/70 flex items-center justify-center text-2xl" aria-hidden="true">{option.isIcon ? <i className={`fa-solid ${option.icon}`}></i> : option.icon}</span>
                  <span className="min-w-0 flex-1"><span className="block font-display font-extrabold text-sm leading-tight">{option.name}</span><span className="block text-[11px] leading-snug opacity-75 mt-0.5">{option.detail}</span></span>
                  {selectedId === option.id && <span className="text-orange-700 font-black" aria-label="Selected">✓</span>}
                </button>)}
              </div>
            </div>
          </div>}
        </div>;
      }
export default HomeSetup;
