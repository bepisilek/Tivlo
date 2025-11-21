import React, { useState, useEffect } from 'react';
import { isSupabaseConfigured, supabase, SUPABASE_CONFIG_MESSAGE } from './lib/supabaseClient';
import { SettingsForm } from './components/SettingsForm';
import { Calculator } from './components/Calculator';
import { History } from './components/History';
import { Levels } from './components/Levels';
import { Statistics } from './components/Statistics';
import { Navigation } from './components/Navigation';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { AuthScreen } from './components/AuthScreen';
import { OnboardingTour } from './components/OnboardingTour';
import { ResetPassword } from './components/ResetPassword';
import { DeleteAccount } from './components/DeleteAccount';
import { SplashScreen } from './components/SplashScreen';
import { UserSettings, ViewState, HistoryItem } from './types';
import { useLanguage } from './contexts/LanguageContext';

const TOUR_KEY = 'idopenz_tour_completed';
const SPLASH_SHOWN_KEY = 'tivlo_splash_shown';

const DEFAULT_SETTINGS: UserSettings = {
  monthlyNetSalary: 0,
  weeklyHours: 40,
  currency: 'HUF',
  city: '',
  age: 0,
  isSetup: false,
  theme: 'dark'
};

const App: React.FC = () => {
  const { t } = useLanguage();
  const [viewState, setViewState] = useState<ViewState>(ViewState.WELCOME);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [previousView, setPreviousView] = useState<ViewState>(ViewState.CALCULATOR);
  const [showTour, setShowTour] = useState(false);
  const [session, setSession] = useState<any>(null);

  // Splash Screen Logic
  useEffect(() => {
    const splashShown = sessionStorage.getItem(SPLASH_SHOWN_KEY);
    if (splashShown) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashComplete = () => {
    sessionStorage.setItem(SPLASH_SHOWN_KEY, 'true');
    setShowSplash(false);
  };

  // Initial Auth Check & Subscription
  useEffect(() => {
    if (!supabase) {
      console.warn(SUPABASE_CONFIG_MESSAGE);
      setIsLoading(false);
      setViewState(ViewState.WELCOME);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchUserData(session.user.id);
      } else {
        setIsLoading(false);
        setViewState(ViewState.WELCOME);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state change:', _event, session);
      setSession(session);
      if (session) {
        fetchUserData(session.user.id);
      } else {
        // Logged out
        setSettings(DEFAULT_SETTINGS);
        setHistory([]);
        setViewState(ViewState.WELCOME);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Detect password recovery from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    
    const type = urlParams.get('type') || hashParams.get('type');
    const accessToken = hashParams.get('access_token');

    if (type === 'recovery' && accessToken) {
      setViewState(ViewState.RESET_PASSWORD);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (type === 'signup' || (type === 'email' && accessToken)) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [session]);

  // Apply Theme Effect
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(settings.theme);
  }, [settings.theme]);

  // Fetch Profile and History from Supabase
  const fetchUserData = async (userId: string) => {
    if (!supabase) return;

    try {
        setIsLoading(true);

        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (profileError && profileError.code !== 'PGRST116') {
            console.error('Error fetching profile:', profileError);
        }

        const { data: historyData, error: historyError } = await supabase
            .from('history')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: false });
            
        if (historyError) {
             console.error('Error fetching history:', historyError);
        }

        if (profileData) {
            const newSettings: UserSettings = {
                monthlyNetSalary: profileData.monthly_net_salary || 0,
                weeklyHours: profileData.weekly_hours || 40,
                currency: profileData.currency || 'HUF',
                city: profileData.city || '',
                age: profileData.age || 0,
                theme: profileData.theme || 'dark',
                isSetup: !!profileData.monthly_net_salary
            };
            setSettings(newSettings);
            
            const mappedHistory: HistoryItem[] = (historyData || []).map((item: any) => ({
                id: item.id,
                productName: item.product_name,
                price: item.price,
                currency: item.currency,
                totalHoursDecimal: item.total_hours_decimal,
                decision: item.decision,
                date: item.date,
                adviceUsed: item.advice_used
            }));
            setHistory(mappedHistory);

            if (newSettings.isSetup) {
                setViewState(ViewState.CALCULATOR);
                const tourCompleted = localStorage.getItem(TOUR_KEY) === 'true';
                if (!tourCompleted) setShowTour(true);
            } else {
                setViewState(ViewState.ONBOARDING);
            }

        } else {
            setViewState(ViewState.ONBOARDING);
        }
    } catch (error) {
        console.error('Data fetch error:', error);
    } finally {
        setIsLoading(false);
    }
  };

  const handleStart = () => {
      setViewState(ViewState.AUTH);
  };

  const handleAuthSuccess = () => {
      // Handled by onAuthStateChange
  };

  const handleSaveSettings = async (newSettings: UserSettings) => {
    if (!session || !supabase) return;

    try {
        const updates = {
            id: session.user.id,
            monthly_net_salary: newSettings.monthlyNetSalary,
            weekly_hours: newSettings.weeklyHours,
            currency: newSettings.currency,
            city: newSettings.city,
            age: newSettings.age,
            theme: newSettings.theme,
            updated_at: new Date(),
        };

        const { error } = await supabase.from('profiles').upsert(updates);
        if (error) throw error;

        setSettings({ ...newSettings, isSetup: true });
        
        if (viewState === ViewState.ONBOARDING) {
            setViewState(ViewState.CALCULATOR);
            const tourCompleted = localStorage.getItem(TOUR_KEY) === 'true';
            if (!tourCompleted) setShowTour(true);
        } else if (viewState === ViewState.SETTINGS) {
            setViewState(previousView);
        }
    } catch (error) {
        console.error('Error saving settings:', error);
        alert('Failed to save profile.');
    }
  };

  const handleTourComplete = () => {
      setShowTour(false);
      localStorage.setItem(TOUR_KEY, 'true');
  };

  const toggleTheme = async () => {
      const newTheme = settings.theme === 'dark' ? 'light' : 'dark';
      setSettings(prev => ({ ...prev, theme: newTheme }));

      if (session && supabase) {
          await supabase.from('profiles').update({ theme: newTheme }).eq('id', session.user.id);
      }
  };

  const handleSaveHistory = async (itemData: Omit<HistoryItem, 'id' | 'date'>) => {
      if (!session || !supabase) return;

      try {
          const dbItem = {
            user_id: session.user.id,
            product_name: itemData.productName,
            price: itemData.price,
            currency: itemData.currency,
            total_hours_decimal: itemData.totalHoursDecimal,
            decision: itemData.decision,
            advice_used: itemData.adviceUsed,
            date: new Date().toISOString()
          };

          const { data, error } = await supabase.from('history').insert(dbItem).select().single();
          
          if (error) throw error;
          
          if (data) {
               const newItem: HistoryItem = {
                id: data.id,
                productName: data.product_name,
                price: data.price,
                currency: data.currency,
                totalHoursDecimal: data.total_hours_decimal,
                decision: data.decision,
                date: data.date,
                adviceUsed: data.advice_used
              };
              setHistory(prev => [newItem, ...prev]);
          }

      } catch (error) {
          console.error('Error saving history:', error);
      }
  };

  const handleClearHistory = async () => {
      if (!session || !supabase) return;
      if(confirm(t('clear_confirm'))) {
          const { error } = await supabase.from('history').delete().eq('user_id', session.user.id);
          if (!error) {
            setHistory([]);
          } else {
             console.error('Error clearing history:', error);
          }
      }
  };

  const handleOpenProfile = () => {
      setPreviousView(viewState === ViewState.SETTINGS ? ViewState.CALCULATOR : viewState);
      setViewState(ViewState.SETTINGS);
  };

  const handleOpenResetPassword = () => {
      setPreviousView(viewState);
      setViewState(ViewState.RESET_PASSWORD);
  };

  const handleResetSuccess = () => {
      setViewState(previousView === ViewState.RESET_PASSWORD ? ViewState.CALCULATOR : previousView);
  };

  const handleOpenDeleteAccount = () => {
      setPreviousView(viewState);
      setViewState(ViewState.DELETE_ACCOUNT);
  };

  const handleDeleteSuccess = () => {
      setViewState(ViewState.WELCOME);
  };

  const handleMenuClick = () => {
    setIsSidebarOpen(true);
  };

  const getPageTitle = () => {
    switch(viewState) {
      case ViewState.CALCULATOR: return t('nav_calculator');
      case ViewState.HISTORY: return t('nav_history');
      case ViewState.LEVELS: return t('nav_levels');
      case ViewState.STATISTICS: return t('nav_statistics');
      case ViewState.RESET_PASSWORD: return t('reset_password_title');
      case ViewState.DELETE_ACCOUNT: return t('delete_account_title');
      default: return t('app_name');
    }
  };

  // Splash Screen megjelenítése
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h1 className="text-2xl font-semibold">Configuration required</h1>
          <p className="text-slate-200 leading-relaxed">{SUPABASE_CONFIG_MESSAGE}</p>
          <p className="text-slate-400 text-sm">Update your <code>.env</code> file with <strong>VITE_SUPABASE_URL</strong> and <strong>VITE_SUPABASE_ANON_KEY</strong> to enable authentication and data syncing.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-sans selection:bg-blue-500/30 overflow-hidden flex flex-col relative">
      
      {!session ? (
          viewState === ViewState.WELCOME ? (
            <WelcomeScreen onStart={handleStart} />
          ) : (
            <AuthScreen onAuthSuccess={handleAuthSuccess} />
          )
      ) : (
        <>
            {viewState === ViewState.ONBOARDING ? (
                 <SettingsForm 
                    initialSettings={settings} 
                    onSave={handleSaveSettings} 
                    isFirstTime={true}
                    toggleTheme={toggleTheme}
                />
            ) : (
                <>
                    {showTour && viewState === ViewState.CALCULATOR && (
                        <OnboardingTour onComplete={handleTourComplete} />
                    )}

                    <Sidebar
                        isOpen={isSidebarOpen}
                        onClose={() => setIsSidebarOpen(false)}
                        onOpenProfile={handleOpenProfile}
                        onOpenResetPassword={handleOpenResetPassword}
                        onOpenDeleteAccount={handleOpenDeleteAccount}
                        settings={settings}
                        toggleTheme={toggleTheme}
                    />

                    {viewState === ViewState.SETTINGS ? (
                        <div className="flex flex-col h-full">
                            <TopBar title={t('settings_title')} onMenuClick={handleMenuClick} />
                            <div className="flex-1 overflow-hidden">
                                <SettingsForm
                                    initialSettings={settings}
                                    onSave={handleSaveSettings}
                                    toggleTheme={toggleTheme}
                                    onCancel={() => setViewState(previousView)}
                                />
                            </div>
                        </div>
                    ) : viewState === ViewState.RESET_PASSWORD ? (
                        <div className="flex flex-col h-full">
                            <TopBar title={t('reset_password_title')} onMenuClick={handleMenuClick} />
                            <div className="flex-1 overflow-hidden">
                                <ResetPassword
                                    onSuccess={handleResetSuccess}
                                    onCancel={() => setViewState(previousView)}
                                />
                            </div>
                        </div>
                    ) : viewState === ViewState.DELETE_ACCOUNT ? (
                        <div className="flex flex-col h-full">
                            <TopBar title={t('delete_account_title')} onMenuClick={handleMenuClick} />
                            <div className="flex-1 overflow-hidden">
                                <DeleteAccount
                                    onSuccess={handleDeleteSuccess}
                                    onCancel={() => setViewState(previousView)}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col h-full">
                            <TopBar title={getPageTitle()} onMenuClick={handleMenuClick} />
                            
                            <div className="flex-1 relative overflow-hidden">
                                {viewState === ViewState.CALCULATOR && (
                                    <Calculator 
                                        settings={settings} 
                                        onSaveHistory={handleSaveHistory}
                                    />
                                )}

                                {viewState === ViewState.HISTORY && (
                                    <History items={history} onClearHistory={handleClearHistory} />
                                )}

                                {viewState === ViewState.STATISTICS && (
                                    <Statistics history={history} />
                                )}

                                {viewState === ViewState.LEVELS && (
                                    <Levels history={history} />
                                )}
                            </div>

                            <Navigation currentView={viewState} onNavigate={setViewState} />
                        </div>
                    )}
                </>
            )}
        </>
      )}
    </div>
  );
};

export default App;
