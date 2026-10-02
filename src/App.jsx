import React, { useState, useEffect, useMemo, useRef } from 'react';
import confetti from 'canvas-confetti';
import { UI_THEMES, SHOPS, AVATARS, CUSTOMERS, SHOP_UPGRADES } from './data';
import { playSound, setMuted } from './audio';
import { generateUniqueMission } from './missions';
import HomeSetup from './HomeSetup';
import { t, localShop, localTheme, localProduct, localUpgrade, localMission, localCustomerStory, localCustomerName, localSkill } from './i18n';
function MainApp() {
        const saved = useMemo(() => {
          try { return JSON.parse(localStorage.getItem('math-market-progress-v1')) || {}; }
          catch { return {}; }
        }, []);
        // App modes: 'home', 'story', 'challenge', 'decorator', 'dashboard'
        const [mode, setMode] = useState('home');
        const [language, setLanguage] = useState(['en', 'es'].includes(saved.language) ? saved.language : 'en');
        const [soundOff, setSoundOff] = useState(Boolean(saved.soundOff));
        const tr = key => t(language, key);
        const [uiTheme, setUiTheme] = useState(UI_THEMES[saved.uiTheme] ? saved.uiTheme : 'sunny');
        const [track, setTrack] = useState(['explorer', 'manager', 'planner'].includes(saved.track) ? saved.track : 'explorer');
        const [currentShopId, setCurrentShopId] = useState(SHOPS[saved.currentShopId] ? saved.currentShopId : 'fruit');
        const [avatarId, setAvatarId] = useState(saved.avatarId || 'aminath');
        const [coins, setCoins] = useState(Number.isFinite(saved.coins) ? saved.coins : 250);
        const [level, setLevel] = useState(Number.isInteger(saved.level) && saved.level >= 1 && saved.level <= 6 ? saved.level : 1);
        const [customerIndex, setCustomerIndex] = useState(Number.isInteger(saved.customerIndex) && saved.customerIndex >= 0 ? saved.customerIndex : 0);

        // 3-STEP WORKFLOW STATE FOR STORY MODE ('order', 'shelves', 'payment')
        const [storyStep, setStoryStep] = useState(['order', 'shelves', 'payment'].includes(saved.storyStep) ? saved.storyStep : 'order');

        const currentUiTheme = UI_THEMES[uiTheme];
        const selectedAvatarObj = AVATARS.find(a => a.id === avatarId) || AVATARS[0];

        useEffect(() => {
          document.body.className = `${currentUiTheme.bodyBg} min-h-screen flex flex-col justify-between selection:bg-amber-200 transition-colors duration-500 overflow-hidden`;
        }, [uiTheme]);
        useEffect(() => { document.documentElement.lang = language; }, [language]);
        useEffect(() => { setMuted(soundOff); }, [soundOff]);

        const [basket, setBasket] = useState(() => Array.isArray(saved.basketIds) ? saved.basketIds.map(id => Object.values(SHOPS).flatMap(shop => shop.products).find(p => p.id === id)).filter(Boolean) : []);
        const [userAnswer, setUserAnswer] = useState(typeof saved.userAnswer === 'string' ? saved.userAnswer : '');
        const [hintLevel, setHintLevel] = useState(Number.isInteger(saved.hintLevel) ? saved.hintLevel : 0);
        const [message, setMessage] = useState(null);
        const [inventory, setInventory] = useState(Array.isArray(saved.inventory) ? saved.inventory : ['plant_flower']);
        const [equipped, setEquipped] = useState(saved.equipped || { awning: null, sign: null, mascot: null, plant: 'plant_flower' });

        const [earnedBadges, setEarnedBadges] = useState(Array.isArray(saved.earnedBadges) ? saved.earnedBadges : []);
        const [stats, setStats] = useState({
          completedOrders: saved.stats?.completedOrders ?? saved.customerIndex ?? 0,
          independentSuccess: saved.stats?.independentSuccess || 0,
          hintsRequested: saved.stats?.hintsRequested || 0,
          skillsPracticed: new Set(saved.stats?.skillsPracticed || [])
        });

        const [challengeBasket, setChallengeBasket] = useState(() => Array.isArray(saved.challengeBasketIds) ? saved.challengeBasketIds.map(id => Object.values(SHOPS).flatMap(shop => shop.products).find(p => p.id === id)).filter(Boolean) : []);
        const [challengeRound, setChallengeRound] = useState(Number.isInteger(saved.challengeRound) ? saved.challengeRound : 0);
        const [completing, setCompleting] = useState(Boolean(saved.completing));

        useEffect(() => {
          try {
            localStorage.setItem('math-market-progress-v1', JSON.stringify({
              uiTheme, track, currentShopId, avatarId, coins, level, customerIndex, language, soundOff,
              inventory, equipped, earnedBadges, storyStep, basketIds: basket.map(item => item.id || item),
              userAnswer, hintLevel, challengeBasketIds: challengeBasket.map(item => item.id || item), challengeRound, completing,
              stats: { ...stats, skillsPracticed: [...stats.skillsPracticed] }
            }));
          } catch (e) { /* Browser storage may be unavailable. */ }
        }, [uiTheme, track, currentShopId, avatarId, coins, level, customerIndex, language, soundOff, inventory, equipped, earnedBadges, storyStep, basket, userAnswer, hintLevel, challengeBasket, challengeRound, completing, stats]);

        const activeShop = SHOPS[currentShopId];
        const challengeQuantity = [3, 2, 4][challengeRound % 3];
        const challengeMinimum = [...activeShop.products].sort((a, b) => a.price - b.price).slice(0, challengeQuantity).reduce((sum, item) => sum + item.price, 0);
        const challengeMaximum = challengeMinimum + 20;
        const challengeGoal = language === 'es'
          ? `Elige ${challengeQuantity} artículos distintos por un total de ${challengeMinimum}–${challengeMaximum} MVR.`
          : `Choose ${challengeQuantity} different items totaling MVR ${challengeMinimum}–${challengeMaximum}.`;
        const currentCustomer = CUSTOMERS[customerIndex % CUSTOMERS.length];

        const usedQuestionKeysRef = useRef(new Set());

        const currentMission = useMemo(() => {
          return generateUniqueMission(track, level, activeShop, customerIndex, usedQuestionKeysRef.current);
        }, [track, level, currentShopId, customerIndex, activeShop]);
        const needsShelves = currentMission.type === 'count_items';
        const activeStep = !needsShelves && storyStep === 'shelves' ? 'order' : storyStep;
        const missionHints = language === 'es'
          ? currentMission.type === 'count_items'
            ? [tr('hintCount'), `${tr('basketNeeds')} ${currentMission.targetQty} ${localProduct(language, currentMission.item)}.`, tr('adjustBasket')]
            : [tr('hintOne'), tr('hintTwo'), `${tr('hintAnswer')} ${currentMission.expectedNumeric}.`]
          : currentMission.hints;

        const triggerConfetti = () => {
          try {
            if (confetti) {
              confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
            }
          } catch (e) {}
        };

        const handleKeypadPress = (val) => {
          playSound('click');
          if (val === 'DEL') {
            setUserAnswer(prev => prev.slice(0, -1));
          } else if (val === 'CLEAR') {
            setUserAnswer('');
          } else {
            if (val === '.' && userAnswer.includes('.')) return;
            if (userAnswer.length > 8) return;
            setUserAnswer(prev => prev + val);
          }
        };

        const handleAddToBasket = (item) => {
          playSound('item');
          setBasket(prev => [...prev, item]);
        };

        const handleRemoveFromBasket = (index) => {
          playSound('click');
          setBasket(prev => prev.filter((_, i) => i !== index));
        };

        const handleVerifyAnswer = () => {
          if (completing) return;
          if (currentMission.type === 'count_items') {
            const count = basket.length;
            if (count === currentMission.targetQty && basket.every(item => item.id === currentMission.item.id)) {
              handleSuccess();
            } else {
              playSound('hint');
              setMessage({
                type: 'error',
                text: `${tr('basketNeeds')} ${currentMission.targetQty} ${localProduct(language, currentMission.item)}. ${tr('adjustBasket')}`
              });
            }
          } else {
          const parsed = Number(userAnswer);
            if (userAnswer.trim() === '' || !Number.isFinite(parsed)) {
              setMessage({ type: 'error', text: tr('validNumber') });
              return;
            }
            const expected = currentMission.expectedNumeric;
            if (Math.round(parsed * 100) === Math.round(expected * 100)) {
              handleSuccess();
            } else {
              playSound('hint');
              setMessage({
                type: 'error',
                text: `${tr('wrongAnswer')} ${missionHints[Math.min(hintLevel, Math.max(0, missionHints.length - 2))]}`
              });
            }
          }
        };

        const handleSuccess = () => {
          setCompleting(true);
          playSound('success');
          if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) triggerConfetti();
          const earned = 25;
          setCoins(prev => prev + earned);

          if (!earnedBadges.includes(currentMission.badgeName)) {
            setEarnedBadges(prev => [...prev, currentMission.badgeName]);
          }

          setStats(prev => ({
            ...prev,
            completedOrders: prev.completedOrders + 1,
            independentSuccess: hintLevel === 0 ? prev.independentSuccess + 1 : prev.independentSuccess,
            skillsPracticed: new Set([...prev.skillsPracticed, currentMission.strategyName])
          }));

          setMessage({
            type: 'success',
            text: tr('perfect')
          });

        };

        const handleNextCustomer = () => {
          setCompleting(false);
          setBasket([]);
          setUserAnswer('');
          setHintLevel(0);
          setMessage(null);
          setStoryStep('order');
          setCustomerIndex(prev => prev + 1);
          if ((customerIndex + 1) % 3 === 0 && level < 6) setLevel(prev => prev + 1);
        };

        const handleBuyUpgrade = (upgrade) => {
          if (coins < upgrade.price) {
            setMessage({ type: 'error', text: tr('noCoins') });
            return;
          }
          playSound('coin');
          setCoins(prev => prev - upgrade.price);
          setInventory(prev => [...prev, upgrade.id]);
          setEquipped(prev => ({ ...prev, [upgrade.type]: upgrade.id }));
          setMessage({ type: 'success', text: `${tr('unlocked')}: ${localUpgrade(language, upgrade)}!` });
        };

        const handleEquipItem = (upgrade) => {
          playSound('click');
          setEquipped(prev => ({ ...prev, [upgrade.type]: upgrade.id }));
        };

        const handleResetProgress = () => {
          if (!window.confirm(tr('resetConfirm'))) return;
          localStorage.removeItem('math-market-progress-v1');
          window.location.reload();
        };

        const resetCurrentOrder = () => {
          setBasket([]);
          setUserAnswer('');
          setHintLevel(0);
          setMessage(null);
          setCompleting(false);
          setStoryStep('order');
        };

        return (
          <div className="game-shell h-screen max-h-screen flex flex-col justify-between overflow-hidden">
            {/* COMPACT APP HEADER */}
            <header className={`${currentUiTheme.headerBg} game-header border-b py-2 px-4 transition-colors duration-500 shrink-0`}>
              <div className="game-header-top max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-white text-lg font-bold shadow-xs">
                    🌴
                  </div>
                  <div>
                    <h1 className="text-base font-extrabold font-display leading-tight flex items-center gap-1.5">
                      Math Market
                      <span className="text-[10px] font-normal px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-800 border border-amber-300">
                        Maldives NCF
                      </span>
                    </h1>
                  </div>
                </div>

                {/* TRACK SELECTOR & HOME BUTTON */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setMode('home'); playSound('click'); }}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 bg-amber-500/20 text-amber-900 border border-amber-300 hover:bg-amber-500/30`}
                  >
                    <span>🏠</span> <span>{tr('home')}</span>
                  </button>

                  <div className="hidden sm:flex items-center bg-black/5 p-0.5 rounded-xl border border-black/5">
                    <button
                      onClick={() => { resetCurrentOrder(); setTrack('explorer'); setLevel(1); playSound('click'); }}
                      className={`px-2 py-1 rounded-lg text-xs font-bold transition ${
                        track === 'explorer' ? currentUiTheme.navActive : currentUiTheme.navInactive
                      }`}
                    >
                      🌱 {language === 'es' ? 'Explorador' : 'Explorer'} (KS1)
                    </button>
                    <button
                      onClick={() => { resetCurrentOrder(); setTrack('manager'); setLevel(1); playSound('click'); }}
                      className={`px-2 py-1 rounded-lg text-xs font-bold transition ${
                        track === 'manager' ? currentUiTheme.navActive : currentUiTheme.navInactive
                      }`}
                    >
                      📦 {language === 'es' ? 'Gerente' : 'Manager'} (KS2 L)
                    </button>
                    <button
                      onClick={() => { resetCurrentOrder(); setTrack('planner'); setLevel(1); playSound('click'); }}
                      className={`px-2 py-1 rounded-lg text-xs font-bold transition ${
                        track === 'planner' ? currentUiTheme.navActive : currentUiTheme.navInactive
                      }`}
                    >
                      📊 {language === 'es' ? 'Planificador' : 'Planner'} (KS2 U)
                    </button>
                  </div>
                </div>

                {/* COINS & THEME SELECTOR */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-xl font-bold text-amber-700 dark:text-amber-300 text-xs">
                    <span>🪙</span>
                    <span>{coins} MVR</span>
                  </div>

                  <select
                    value={uiTheme}
                    onChange={(e) => { setUiTheme(e.target.value); playSound('click'); }}
                    aria-label={tr('chooseTheme')}
                    className="bg-black/5 border border-black/10 rounded-xl px-2 py-1 text-xs font-bold outline-none cursor-pointer"
                  >
                    {Object.values(UI_THEMES).map(t => (
                      <option key={t.id} value={t.id} className="text-slate-800">
                        {t.icon} {localTheme(language, t)}
                      </option>
                    ))}
                  </select>
                  <select value={language} onChange={e => setLanguage(e.target.value)} aria-label="Language / Idioma" className="bg-white/70 border border-black/10 rounded-xl px-2 py-1 text-xs font-bold text-slate-900">
                    <option value="en">EN · English</option>
                    <option value="es">ES · Español</option>
                  </select>
                  <button type="button" onClick={() => setSoundOff(value => !value)} aria-label={tr(soundOff ? 'soundOn' : 'soundOff')} aria-pressed={soundOff} className="min-w-9 min-h-9 rounded-xl bg-black/5 border border-black/10">{soundOff ? '🔇' : '🔊'}</button>
                </div>
              </div>

              {/* NAVIGATION TABS (Shown when not on Home screen) */}
              {mode !== 'home' && (
                <div className="game-nav max-w-7xl mx-auto flex items-center justify-between gap-2 mt-1 pt-1 border-t border-black/5">
                  <div className="game-nav-tabs flex items-center gap-1.5">
                    <button
                      onClick={() => { setMode('story'); playSound('click'); }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                        mode === 'story' ? currentUiTheme.navActive : currentUiTheme.navInactive
                      }`}
                    >
                      <i className="fa-solid fa-store"></i> {tr('serve')}
                    </button>
                    <button
                      onClick={() => { setMode('challenge'); playSound('click'); }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                        mode === 'challenge' ? currentUiTheme.navActive : currentUiTheme.navInactive
                      }`}
                    >
                      <i className="fa-solid fa-basket-shopping"></i> {tr('picnic')}
                    </button>
                    <button
                      onClick={() => { setMode('decorator'); playSound('click'); }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                        mode === 'decorator' ? currentUiTheme.navActive : currentUiTheme.navInactive
                      }`}
                    >
                      <i className="fa-solid fa-paint-roller"></i> {tr('decorate')}
                    </button>
                    <button
                      onClick={() => { setMode('dashboard'); playSound('click'); }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                        mode === 'dashboard' ? currentUiTheme.navActive : currentUiTheme.navInactive
                      }`}
                    >
                      <i className="fa-solid fa-chart-line"></i> {tr('progress')}
                    </button>
                  </div>

                  {/* STALL QUICK SELECTOR */}
                  <div className="game-stalls flex items-center gap-1 bg-black/5 p-0.5 rounded-lg">
                    {Object.values(SHOPS).map(s => (
                      <button
                        key={s.id}
                        onClick={() => { resetCurrentOrder(); setChallengeBasket([]); setCurrentShopId(s.id); playSound('click'); }}
                        title={localShop(language, s)}
                        className={`px-2 py-0.5 rounded-md text-xs font-bold flex items-center gap-1 transition ${
                          currentShopId === s.id ? 'bg-amber-500 text-white shadow-2xs' : 'opacity-70 hover:opacity-100'
                        }`}
                      >
                        <i className={`fa-solid ${s.icon}`}></i>
                        <span className="hidden md:inline">{localShop(language, s).split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </header>

            {/* MAIN CONTAINER */}
            <main className="game-main max-w-6xl mx-auto px-4 py-3 flex-1 w-full flex flex-col justify-between overflow-hidden">
              {/* NOTIFICATION TOAST */}
              {message && (
                <div role="status" aria-live="polite" className={`p-2.5 rounded-2xl border font-bold flex items-center justify-between text-xs shadow-sm mb-2 shrink-0 ${
                  message.type === 'success' ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-rose-500 text-white border-rose-400'
                }`}>
                  <div className="flex items-center gap-2">
                    <span>{message.type === 'success' ? '🎉' : '💡'}</span>
                    <p>{message.text}</p>
                  </div>
                  <button onClick={() => setMessage(null)} aria-label={tr('close')} className="opacity-80 hover:opacity-100">✕</button>
                </div>
              )}
              {mode === 'story' && completing && <button onClick={handleNextCustomer} className="w-full rounded-2xl bg-emerald-600 text-white p-3 font-extrabold mb-2">{tr('nextCustomer')} →</button>}

              {}
              {/* HOME SETUP PAGE */}
              {mode === 'home' && <HomeSetup
                track={track} setTrack={(value) => { resetCurrentOrder(); setTrack(value); setLevel(1); }}
                uiTheme={uiTheme} setUiTheme={setUiTheme}
                currentShopId={currentShopId} setCurrentShopId={(value) => { resetCurrentOrder(); setChallengeBasket([]); setCurrentShopId(value); }}
                avatarId={avatarId} setAvatarId={setAvatarId}
                language={language}
                resume={storyStep !== 'order' || basket.length > 0 || Boolean(userAnswer) || completing}
                onStart={() => { playSound('success'); setMode('story'); }}
              />}
              {/* STORY MODE WITH 3-STEP WORKFLOW */}
              {mode === 'story' && (
                <div className="game-story flex-1 flex flex-col justify-between space-y-3 overflow-hidden min-h-0">
                  
                  {/* STEPPER PROGRESS BAR */}
                  <div className={`game-steps grid ${needsShelves ? 'grid-cols-3' : 'grid-cols-2'} gap-2 shrink-0`}>
                    <button
                      onClick={() => { if (!completing) setStoryStep('order'); playSound('click'); }}
                      className={`p-2 rounded-2xl border flex items-center justify-center gap-2 text-xs transition ${
                        activeStep === 'order' ? currentUiTheme.stepActive : 'bg-black/5 text-slate-600 border-black/10'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center text-[10px]">1</span>
                      <span className="font-bold">{tr('question')}</span>
                    </button>

                    {needsShelves && <button
                      onClick={() => { setStoryStep('shelves'); playSound('click'); }}
                      className={`p-2 rounded-2xl border flex items-center justify-center gap-2 text-xs transition ${
                        storyStep === 'shelves' ? currentUiTheme.stepActive : 'bg-black/5 text-slate-600 border-black/10'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center text-[10px]">2</span>
                      <span className="font-bold">{tr('shelves')}</span>
                    </button>}

                    <button
                      onClick={() => { if (!completing) setStoryStep('payment'); playSound('click'); }}
                      className={`p-2 rounded-2xl border flex items-center justify-center gap-2 text-xs transition ${
                        activeStep === 'payment' ? currentUiTheme.stepActive : 'bg-black/5 text-slate-600 border-black/10'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center text-[10px]">{needsShelves ? 3 : 2}</span>
                      <span className="font-bold">{tr('payment')}</span>
                    </button>
                  </div>

                  {/* SECTION 1: THE QUESTION & CUSTOMER ORDER */}
                  {activeStep === 'order' && (
                    <div className={`${currentUiTheme.cardBg} game-panel p-5 rounded-3xl border flex-1 flex flex-col justify-between overflow-y-auto custom-scrollbar shadow-sm`}>
                      <div className="space-y-4">
                        {/* CUSTOMER HEADER */}
                        <div className="flex items-center justify-between border-b pb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-2xl bg-amber-200 border-2 border-amber-300 flex items-center justify-center text-3xl shadow-inner animate-bounce-subtle">
                              {currentCustomer.avatar}
                            </div>
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                                {tr('customer')} #{customerIndex + 1} • {localShop(language, activeShop)}
                              </span>
                              <h3 className="text-lg font-extrabold font-display">{localCustomerName(language, customerIndex, currentCustomer)}</h3>
                              <p className="text-xs opacity-75">{localCustomerStory(language, customerIndex, currentCustomer)}</p>
                            </div>
                          </div>
                          <span className="text-xs bg-amber-500/20 text-amber-900 px-3 py-1 rounded-full font-bold">
                            {tr('level')} {level} {tr('mission')}
                          </span>
                        </div>

                        {/* SPEECH BUBBLE QUESTION BOX */}
                        <div className={`${currentUiTheme.dialogueBg} p-4 rounded-2xl border text-slate-900 space-y-2`}>
                          <div className="text-xs font-bold uppercase text-amber-800 flex items-center gap-1.5">
                            <i className="fa-solid fa-comment-dots"></i> {tr('orderPrompt')}
                          </div>
                          <p className="text-base font-extrabold leading-relaxed">
                            "{localMission(language, currentMission)}"
                          </p>
                        </div>

                        {/* SKILL / HINT HELPER */}
                        <div className="flex flex-col sm:flex-row gap-3 items-stretch justify-between">
                          <div className="flex items-center gap-2 text-xs opacity-80 bg-black/5 p-3 rounded-2xl border border-black/5 flex-1">
                            <i className="fa-solid fa-graduation-cap text-amber-500 text-base"></i>
                            <div>
                              <div className="font-bold">{tr('curriculum')}</div>
                              <div>{localSkill(language, currentMission.skillName)}</div>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              playSound('hint');
                              setHintLevel(prev => Math.min(prev + 1, missionHints.length));
                              setStats(s => ({ ...s, hintsRequested: s.hintsRequested + 1 }));
                            }}
                            className="text-xs bg-amber-500/20 text-amber-900 px-4 py-2 rounded-2xl font-bold hover:bg-amber-500/30 transition flex items-center gap-2 justify-center"
                          >
                            <span>💡 {tr('hint')} ({hintLevel}/{missionHints.length})</span>
                          </button>
                        </div>

                        {/* HINTS DISPLAY */}
                        {hintLevel > 0 && (
                          <div className="space-y-1.5 pt-1">
                            {missionHints.slice(0, hintLevel).map((h, idx) => (
                              <div key={idx} className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs font-medium text-amber-900 flex items-center gap-2">
                                <span className="font-bold">{tr('hint')} {idx + 1}:</span>
                                <span>{h}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="story-scene rounded-2xl bg-gradient-to-r from-amber-100 to-emerald-100 p-2 flex items-center justify-center gap-4" aria-label={tr('myStall')}>
                        <span className="text-3xl" aria-hidden="true">{selectedAvatarObj.avatar}</span>
                        <span className="font-display font-extrabold text-emerald-900">{localShop(language, activeShop)}</span>
                        {SHOP_UPGRADES.filter(upgrade => equipped[upgrade.type] === upgrade.id).map(upgrade => <span key={upgrade.id} title={localUpgrade(language, upgrade)} className="text-2xl" aria-label={localUpgrade(language, upgrade)}>{upgrade.icon}</span>)}
                      </div>

                      {/* STEP 1 NAVIGATION BUTTON */}
                      <div className="game-actions pt-4 border-t mt-4">
                        <button
                          onClick={() => { playSound('click'); setStoryStep(needsShelves ? 'shelves' : 'payment'); }}
                          className={`w-full py-3 rounded-2xl font-extrabold font-display text-base tracking-wide shadow-md transition transform active:scale-98 flex items-center justify-center gap-2 ${currentUiTheme.btnPrimary}`}
                        >
                          <span>{tr(needsShelves ? 'toShelves' : 'toPayment')}</span>
                          <i className="fa-solid fa-arrow-right"></i>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* SECTION 2: SELECTING FROM SHELVES */}
                  {needsShelves && storyStep === 'shelves' && (
                    <div className={`${currentUiTheme.cardBg} game-panel p-4 rounded-3xl border flex-1 flex flex-col justify-between overflow-y-auto custom-scrollbar shadow-sm`}>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b pb-2">
                          <div>
                            <span className="text-xs font-bold uppercase text-amber-700">{tr('step2')}</span>
                            <h3 className="text-base font-extrabold font-display"><span className="shelves-title-full">{tr('shelvesTitle')}</span><span className="shelves-title-mobile">{tr('shelves')}</span></h3>
                          </div>
                          <div className="game-shelves-question text-xs bg-black/5 px-3 py-1 rounded-full font-bold" title={localMission(language, currentMission)}>
                            {currentMission.type === 'count_items' ? `${currentMission.targetQty} × ${localProduct(language, currentMission.item)}` : `${tr('question')}: ${localMission(language, currentMission)}`}
                          </div>
                        </div>

                        {/* PRODUCT SHELF GRID */}
                        <div className={`${currentUiTheme.rackBg} game-shelf p-3 rounded-2xl border grid grid-cols-2 sm:grid-cols-3 gap-2.5`}>
                          {activeShop.products.map(p => (
                            <button
                              key={p.id}
                              onClick={() => handleAddToBasket(p)}
                              className={`${currentUiTheme.itemCard} game-product p-2.5 rounded-2xl border text-left transition transform active:scale-95 flex items-center gap-3 shadow-2xs hover:shadow-sm`}
                            >
                              <div className="text-3xl">{p.icon}</div>
                              <div>
                                <div className="font-bold text-xs leading-tight">{localProduct(language, p)}</div>
                                <div className="text-xs text-amber-600 dark:text-amber-400 font-extrabold">MVR {p.price.toFixed(2)}</div>
                              </div>
                            </button>
                          ))}
                        </div>

                        {/* VISUAL 10-FRAME COUNTING TRAY FOR EXPLORER TRACK */}
                        {currentMission.type === 'count_items' && (
                          <div className="game-tray bg-black/5 p-3 rounded-2xl border border-black/5">
                            <div className="text-xs font-bold uppercase text-amber-700 dark:text-amber-300 mb-1.5 flex justify-between">
                              <span>{tr('tray')}</span>
                              <span>{basket.length} / {currentMission.targetQty} {tr('selected')}</span>
                            </div>
                            <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
                              {Array.from({ length: Math.max(10, currentMission.targetQty) }).map((_, idx) => (
                                <div
                                  key={idx}
                                  className={`h-10 rounded-xl border-2 border-dashed flex items-center justify-center text-lg ${
                                    basket[idx] ? 'bg-amber-400/20 border-amber-500' : 'border-black/20 bg-black/5'
                                  }`}
                                >
                                  {basket[idx] ? basket[idx].icon : ''}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* BASKET DISPLAY */}
                        <div className={`${currentUiTheme.basketBg} game-basket p-3 rounded-2xl border`}>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                              <i className="fa-solid fa-basket-shopping text-amber-500"></i> {tr('packed')} ({basket.length})
                            </span>
                            {basket.length > 0 && (
                              <button onClick={() => setBasket([])} className="text-xs text-rose-500 hover:underline font-bold">
                                {tr('clear')}
                              </button>
                            )}
                          </div>

                          {basket.length === 0 ? (
                            <p className="text-xs text-center py-2 opacity-50 italic">{tr('emptyBasket')}</p>
                          ) : (
                            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto custom-scrollbar">
                              {basket.map((item, idx) => (
                                <button type="button" aria-label={`${tr('remove')} ${localProduct(language, item)}`}
                                  key={idx}
                                  onClick={() => handleRemoveFromBasket(idx)}
                                  className="bg-white dark:bg-slate-800 border border-amber-300 px-2 py-1 min-h-10 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-rose-50"
                                >
                                  <span>{item.icon}</span>
                                  <span>{localProduct(language, item)}</span>
                                  <span className="text-rose-500 ml-1">✕</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* STEP 2 NAVIGATION BUTTONS */}
                      <div className="game-actions flex gap-2 pt-3 border-t mt-3">
                        <button
                          onClick={() => { playSound('click'); setStoryStep('order'); }}
                          className={`w-1/3 py-2.5 rounded-2xl font-bold text-xs ${currentUiTheme.btnSecondary}`}
                        >
                          ⬅️ {tr('backQuestion')}
                        </button>
                        <button
                          onClick={() => { playSound('click'); setStoryStep('payment'); }}
                          className={`w-2/3 py-2.5 rounded-2xl font-extrabold font-display text-sm shadow-md transition ${currentUiTheme.btnPrimary}`}
                        >
                          {tr('toPayment')} ➡️
                        </button>
                      </div>
                    </div>
                  )}

                  {/* SECTION 3: PAYMENT & CALCULATION RESULT */}
                  {storyStep === 'payment' && (
                    <div className={`${currentUiTheme.cardBg} game-panel game-payment p-5 rounded-3xl border flex-1 flex flex-col justify-between overflow-y-auto custom-scrollbar shadow-sm`}>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-2">
                          <div>
                            <span className="text-xs font-bold uppercase text-amber-700">{needsShelves ? tr('step3') : tr('step2of2')}</span>
                            <h3 className="text-base font-extrabold font-display"><span className="game-payment-title-full">{tr('checkoutFull')}</span><span className="game-payment-title-mobile">{tr('checkout')}</span></h3>
                          </div>
                          <div className="game-question text-xs bg-amber-500/20 text-amber-900 px-3 py-1 rounded-full font-bold">
                            {tr('question')}: "{localMission(language, currentMission)}"
                          </div>
                        </div>

                        {/* ORDER SUMMARY */}
                        {currentMission.type === 'count_items' && (
                          <div className="game-summary bg-black/5 p-3 rounded-2xl border border-black/5 flex items-center justify-between text-xs font-bold">
                            <div className="flex items-center gap-2">
                              <span>📦 {tr('selectedItems')}</span>
                              <span>{basket.length} {tr('itemsInBasket')}</span>
                            </div>
                            <div>
                              <span>{tr('basketTotal')} MVR {basket.reduce((s, i) => s + i.price, 0).toFixed(2)}</span>
                            </div>
                          </div>
                        )}

                        {/* KEYPAD OR COUNT CONFIRMATION */}
                        {currentMission.type === 'count_items' ? (
                          <div className="p-6 bg-amber-500/10 border border-amber-500/30 rounded-3xl text-center space-y-3">
                            <div className="text-4xl">🧺</div>
                            <h4 className="font-extrabold text-base">{tr('handBasket')}</h4>
                            <ul className="checkout-items flex flex-wrap justify-center gap-2 max-w-md mx-auto" aria-label={tr('selectedItems')}>
                              {basket.map((item, index) => (
                                <li key={`${item.id}-${index}`} className="checkout-item w-12 h-12 rounded-xl bg-white border border-amber-300 shadow-sm flex items-center justify-center text-2xl" aria-label={localProduct(language, item)} title={localProduct(language, item)}>
                                  <span aria-hidden="true">{item.icon}</span>
                                </li>
                              ))}
                            </ul>
                            <p className="text-xs opacity-80 max-w-md mx-auto">
                              {tr('packedIntro')} <strong>{basket.length} {localProduct(language, currentMission.item)}</strong> {tr('packedOutro')} {localCustomerName(language, customerIndex, currentCustomer)}.
                            </p>
                          </div>
                        ) : (
                          <div className={`${currentUiTheme.keypadBg} game-keypad p-4 rounded-2xl border space-y-3`}>
                            <div className="text-xs font-bold uppercase text-amber-700 dark:text-amber-300">
                              {tr('enterAnswer')}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 items-center">
                              {/* DISPLAY FIELD */}
                              <div className="w-full sm:w-1/2">
                                <div className="bg-white dark:bg-slate-900 border-2 border-amber-400 p-3 rounded-2xl text-right font-mono text-3xl font-extrabold tracking-wider shadow-inner text-amber-700 min-h-[60px] flex items-center justify-end">
                                  {userAnswer || '0'}
                                </div>
                              </div>

                              {/* KEYPAD GRID */}
                              <div className="w-full sm:w-1/2 grid grid-cols-4 gap-1.5">
                                {['7','8','9','DEL','4','5','6','CLEAR','1','2','3','.','0'].map(k => (
                                  <button
                                    key={k}
                                    onClick={() => handleKeypadPress(k)}
                                    className={`${currentUiTheme.keypadKey} p-2 rounded-xl font-bold text-sm border transition active:scale-95 ${
                                      k === 'DEL' || k === 'CLEAR' ? 'text-xs text-rose-500 font-extrabold' : ''
                                    } ${k === '0' ? 'col-span-2' : ''}`}
                                  >
                                    {k}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* STEP 3 SUBMIT BUTTON */}
                      <div className="game-actions flex gap-2 pt-4 border-t mt-3">
                        <button
                          onClick={() => { playSound('click'); setStoryStep(needsShelves ? 'shelves' : 'order'); }}
                          className={`w-1/3 py-3 rounded-2xl font-bold text-xs ${currentUiTheme.btnSecondary}`}
                        >
                          ⬅️ {tr(needsShelves ? 'backShelves' : 'backQuestion')}
                        </button>
                        <button
                          onClick={handleVerifyAnswer}
                          disabled={completing}
                          className={`w-2/3 py-3 rounded-2xl font-extrabold font-display text-base tracking-wide shadow-lg transition transform active:scale-98 ${currentUiTheme.btnPrimary}`}
                        >
                          {tr('checkAnswer')} ✨
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {}
              {/* OTHER GAME MODES */}
              {mode === 'challenge' && (
                <div className={`${currentUiTheme.cardBg} p-5 rounded-3xl border flex-1 flex flex-col justify-between max-w-4xl mx-auto w-full overflow-y-auto custom-scrollbar shadow-sm`}>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 border-b pb-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-xl font-bold">
                        🧺
                      </div>
                      <div>
                        <h2 className="text-lg font-extrabold font-display">{tr('picnicTitle')}</h2>
                        <p className="text-xs opacity-75">{challengeGoal}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {activeShop.products.map(p => (
                        <button
                          key={p.id}
                          onClick={() => setChallengeBasket(prev => [...prev, p])}
                          className={`${currentUiTheme.itemCard} p-2.5 rounded-2xl border text-left transition flex items-center gap-2`}
                        >
                          <span className="text-2xl">{p.icon}</span>
                          <div>
                            <div className="font-bold text-xs leading-tight">{localProduct(language, p)}</div>
                            <div className="text-xs text-amber-600 font-extrabold">MVR {p.price.toFixed(2)}</div>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="bg-black/5 p-3 rounded-2xl border border-black/5">
                      <div className="flex items-center justify-between mb-1 text-xs">
                        <span className="font-bold uppercase">{tr('picnicItems')}</span>
                        <span className="font-bold text-amber-600">
                          {tr('total')} MVR {challengeBasket.reduce((s, i) => s + i.price, 0).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto custom-scrollbar">
                        {challengeBasket.map((item, idx) => (
                          <button type="button" aria-label={`${tr('remove')} ${localProduct(language, item)}`}
                            key={idx}
                            onClick={() => setChallengeBasket(prev => prev.filter((_, i) => i !== idx))}
                            className="bg-white dark:bg-slate-800 px-2.5 py-1 min-h-10 rounded-xl border text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <span>{item.icon}</span>
                            <span>{localProduct(language, item)}</span>
                            <span className="text-rose-500">✕</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const total = challengeBasket.reduce((sum, item) => sum + item.price, 0);
                      const uniqueTypes = new Set(challengeBasket.map(i => i.id)).size;
                      if (challengeBasket.length === challengeQuantity && uniqueTypes === challengeQuantity && total >= challengeMinimum && total <= challengeMaximum) {
                        playSound('success');
                        triggerConfetti();
                        setCoins(c => c + 50);
                        setMessage({ type: 'success', text: tr('picnicSuccess') });
                        setChallengeBasket([]);
                        setChallengeRound(round => round + 1);
                      } else {
                        playSound('hint');
                        setMessage({ type: 'error', text: `${challengeGoal} ${tr('total')} MVR ${total.toFixed(2)}.` });
                      }
                    }}
                    className={`w-full py-3 rounded-2xl font-extrabold font-display text-base ${currentUiTheme.btnPrimary} mt-2`}
                  >
                    {tr('submitPicnic')} 🧺
                  </button>
                </div>
              )}

              {mode === 'decorator' && (
                <div className={`${currentUiTheme.cardBg} p-5 rounded-3xl border flex-1 max-w-4xl mx-auto w-full overflow-y-auto custom-scrollbar shadow-sm space-y-4`}>
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <h2 className="text-lg font-extrabold font-display">{tr('decoratorTitle')}</h2>
                      <p className="text-xs opacity-75">{tr('decoratorLead')}</p>
                    </div>
                    <div className="font-bold text-amber-600 text-xs">
                      🪙 {coins} {tr('coins')}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {SHOP_UPGRADES.map(upgrade => {
                      const isBought = inventory.includes(upgrade.id);
                      const isEquipped = equipped[upgrade.type] === upgrade.id;

                      return (
                        <div key={upgrade.id} className="p-3 bg-black/5 rounded-2xl border border-black/10 text-center flex flex-col justify-between">
                          <div>
                            <span className="text-3xl mb-1 block">{upgrade.icon}</span>
                            <h4 className="font-bold text-xs">{localUpgrade(language, upgrade)}</h4>
                            <span className="text-xs text-amber-600 font-extrabold">MVR {upgrade.price}</span>
                          </div>

                          {isBought ? (
                            <button
                              onClick={() => handleEquipItem(upgrade)}
                              disabled={isEquipped}
                              className={`w-full py-1.5 rounded-xl text-xs font-bold transition mt-2 ${
                                isEquipped ? 'bg-emerald-500 text-white' : 'bg-amber-500/20 text-amber-900'
                              }`}
                            >
                              {isEquipped ? `${tr('equipped')} ✓` : tr('equip')}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleBuyUpgrade(upgrade)}
                              className={`w-full py-1.5 rounded-xl text-xs font-bold text-white transition mt-2 ${currentUiTheme.btnPrimary}`}
                            >
                              {tr('buy')}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {mode === 'dashboard' && (
                <div className={`${currentUiTheme.cardBg} p-5 rounded-3xl border flex-1 max-w-4xl mx-auto w-full overflow-y-auto custom-scrollbar shadow-sm space-y-4`}>
                  <div className="border-b pb-3">
                    <h2 className="text-lg font-extrabold font-display">{tr('dashboardTitle')}</h2>
                    <p className="text-xs opacity-75">{tr('dashboardLead')}</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-center">
                      <div className="text-xl font-extrabold text-amber-600">{stats.completedOrders}</div>
                      <div className="text-xs font-bold opacity-75">{tr('completed')}</div>
                    </div>
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center">
                      <div className="text-xl font-extrabold text-emerald-600">{stats.independentSuccess}</div>
                      <div className="text-xs font-bold opacity-75">{tr('independent')}</div>
                    </div>
                    <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl text-center">
                      <div className="text-xl font-extrabold text-cyan-600">{stats.hintsRequested}</div>
                      <div className="text-xs font-bold opacity-75">{tr('hintsUsed')}</div>
                    </div>
                    <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-center">
                      <div className="text-xl font-extrabold text-purple-600">{earnedBadges.length}</div>
                      <div className="text-xs font-bold opacity-75">{tr('badges')}</div>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-black/5 p-3">
                    <h3 className="font-extrabold text-sm mb-2">{tr('levelPath')}</h3>
                    <div className="grid grid-cols-6 gap-1.5" aria-label={tr('levelPath')}>
                      {[1, 2, 3, 4, 5, 6].map(stage => <button key={stage} type="button" disabled={stage > level} onClick={() => { setLevel(stage); setBasket([]); setUserAnswer(''); setHintLevel(0); setStoryStep('order'); setMode('story'); }} className={`min-h-11 rounded-xl font-bold ${stage === level ? 'bg-amber-500 text-white' : stage < level ? 'bg-emerald-200 text-emerald-950' : 'bg-slate-200 text-slate-500'}`} aria-label={`${tr('level')} ${stage}`}>{stage}</button>)}
                    </div>
                    <p className="text-xs mt-2 opacity-70">{tr('retryLevel')}</p>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-xs mb-2">{tr('badgeTitle')}</h3>
                    {earnedBadges.length === 0 ? (
                      <p className="text-xs opacity-50 italic">{tr('noBadges')}</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {earnedBadges.map((badge, idx) => (
                          <span key={idx} className={`${currentUiTheme.badgeBg} px-2.5 py-1 rounded-xl text-xs font-bold`}>
                            {badge}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button type="button" onClick={handleResetProgress} className="rounded-xl border border-rose-300 text-rose-700 px-3 py-2 text-xs font-bold">{tr('resetProgress')}</button>
                </div>
              )}
            </main>

            {/* COMPACT FOOTER */}
            <footer className="game-footer text-center py-1.5 text-[11px] opacity-60 w-full shrink-0">
              {language === 'es' ? 'Math Market • Aventura de mercado • Matemáticas de las etapas 1 y 2' : 'Math Market • Shopkeeping Adventure • Maldivian National Curriculum Framework (Key Stage 1 & 2)'}
            </footer>
          </div>
        );
      }
export default MainApp;
