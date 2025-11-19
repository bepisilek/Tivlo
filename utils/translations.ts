export type Language = 'hu' | 'en';

export const translations = {
  hu: {
    // General
    app_name: 'Tivlo',
    loading: 'Betöltés...',
    save: 'Mentés',
    cancel: 'Mégse',
    close: 'Bezárás',
    next: 'Tovább',
    finish: 'Befejezés',
    
    // Welcome
    welcome_slogan: 'Ne pazarold az életed.',
    welcome_sub: 'Tudd meg, valójában mennyibe kerülnek a dolgok.',
    lets_start: 'Kezdjük',

    // Auth
    auth_login_title: 'Bejelentkezés',
    auth_register_title: 'Regisztráció',
    auth_email: 'Email cím',
    auth_password: 'Jelszó',
    auth_login_btn: 'Belépés',
    auth_register_btn: 'Regisztráció',
    auth_switch_to_register: 'Nincs még fiókod? Regisztrálj!',
    auth_switch_to_login: 'Van már fiókod? Jelentkezz be!',
    auth_error: 'Hiba történt. Ellenőrizd az adatokat.',
    auth_magic_link_sent: 'Ellenőrizd az email fiókodat a megerősítő linkért!',
    auth_logout: 'Kijelentkezés',

    // Tour
    tour_welcome_title: 'Üdvözöl a Tivlo!',
    tour_welcome_desc: 'Ez egy gyors útmutató, hogy kihozd a maximumot az appból.',
    tour_calc_title: 'Az Átváltó',
    tour_calc_desc: 'Itt írd be az árat, és azonnal látod, mennyi munkaórád bánja.',
    tour_hist_title: 'Napló',
    tour_hist_desc: 'Itt követheted nyomon a korábbi döntéseidet.',
    tour_stat_title: 'Statisztikák',
    tour_stat_desc: 'Nézd meg, mennyit spóroltál vagy költöttél az elmúlt időszakban.',
    tour_level_title: 'Szintek & Jelvények',
    tour_level_desc: 'Gyűjts jelvényeket és lépj szinteket a tudatos döntéseiddel!',
    
    // Navigation
    nav_calculator: 'Számoló',
    nav_history: 'Napló',
    nav_statistics: 'Statisztika',
    nav_levels: 'Szintek',
    
    // Settings / Onboarding
    settings_title_first: 'Állítsuk be a profilod',
    settings_title: 'Profil Beállítások',
    settings_desc_first: 'Az adatok a felhőben tárolódnak, hogy bárhonnan elérd.',
    settings_desc: 'Itt módosíthatod a fizetésed és adataidat.',
    appearance: 'Megjelenés',
    dark_mode: 'Sötét mód',
    light_mode: 'Világos mód',
    switch: 'Váltás',
    language: 'Nyelv',
    monthly_salary: 'Havi nettó bér',
    weekly_hours: 'Heti munkaórák',
    city: 'Település',
    age: 'Életkor',
    currency: 'Pénznem',
    start_btn: 'Profil Mentése',
    save_settings_btn: 'Beállítások Mentése',
    menu_profile: 'Jelenlegi profil',
    menu_edit_profile: 'Profil szerkesztése',
    
    // Calculator
    hourly_rate: 'Órabéred',
    what_to_buy: 'Mit szeretnél venni?',
    placeholder_item: 'Pl. Új telefon, Kávé',
    price_label: 'Ára',
    calculate_btn: 'Számolás',
    cost_in_life: 'Ez a tétel ennyi életedbe kerül',
    hour_short: 'óra',
    min_short: 'perc',
    buy_btn: 'Megveszem',
    buy_sub: 'munka',
    save_btn: 'Megspórolom',
    new_calculation: 'Új számítás',
    
    // Feedback Modals
    feedback_saved_title: 'Ez az!',
    feedback_saved_desc: 'Megspóroltál',
    feedback_saved_time: 'Ez',
    feedback_saved_time_suffix: 'munka lett volna.',
    feedback_bought_title: 'Sikeres rögzítés',
    feedback_bought_desc: 'Ez a tétel pontosan',
    feedback_bought_suffix: 'munkádba került.',
    thanks_btn: 'Köszönöm, értem',
    
    // History
    history_empty_title: 'Még nincs előzmény',
    history_empty_desc: 'Használd a számolót és döntsd el, hogy megveszel-e valamit vagy megspórolod.',
    saved_stat: 'Spórolva',
    spent_stat: 'Elköltve',
    clear_history: 'Előzmények törlése',
    clear_confirm: 'Biztosan törölni szeretnéd az összes előzményt?',
    tag_bought: 'Megvétel',
    tag_saved: 'Spórolás',
    item_unnamed: 'Névtelen tétel',
    
    // Levels
    level_label: 'Szint',
    conscious_buyer: 'Tudatos Vásárló',
    streak_days: 'nap',
    streak_label: 'Sorozat',
    count_db: 'db',
    count_label: 'Spórolás',
    badges_title: 'Kitüntetések',
    
    // Badges
    badge_first_save_name: 'Kezdő Tudatos',
    badge_first_save_desc: 'Az első megspórolt tétel.',
    badge_five_saves_name: 'Ötösfogat',
    badge_five_saves_desc: '5 alkalommal döntöttél a spórolás mellett.',
    badge_ten_hours_name: 'Időnyerő',
    badge_ten_hours_desc: '10 órányi munkaidőt spóroltál meg.',
    badge_streak_3_name: 'Tűzben Vagy',
    badge_streak_3_desc: '3 napos spórolási sorozat.',
    badge_hundred_hours_name: 'Időmilliomos',
    badge_hundred_hours_desc: '100+ óra megspórolva.',
    badge_status_unlocked: 'Feloldva',
    badge_status_locked: 'Még nincs meg',

    // Statistics
    stats_period: 'Időszak',
    stats_kept: 'Megtartva',
    stats_spent: 'Elköltve',
    stats_saved_time: 'Megspórolt munkaidő',
    stats_spent_time: 'Elköltött munkaidő',
    stats_decision_count: 'A kiválasztott időszakban {count} döntést hoztál.',
  },
  en: {
    // General
    app_name: 'Tivlo',
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    next: 'Next',
    finish: 'Finish',

    // Welcome
    welcome_slogan: 'Don\'t waste your life.',
    welcome_sub: 'Find out what things really cost you.',
    lets_start: 'Let\'s Start',

    // Auth
    auth_login_title: 'Sign In',
    auth_register_title: 'Sign Up',
    auth_email: 'Email Address',
    auth_password: 'Password',
    auth_login_btn: 'Sign In',
    auth_register_btn: 'Sign Up',
    auth_switch_to_register: 'No account? Sign up!',
    auth_switch_to_login: 'Have an account? Sign in!',
    auth_error: 'An error occurred. Please check your details.',
    auth_magic_link_sent: 'Check your email for the confirmation link!',
    auth_logout: 'Log Out',

    // Tour
    tour_welcome_title: 'Welcome to Tivlo!',
    tour_welcome_desc: 'Here is a quick tour to help you get the most out of the app.',
    tour_calc_title: 'The Converter',
    tour_calc_desc: 'Enter a price here and instantly see how many work hours it costs.',
    tour_hist_title: 'Journal',
    tour_hist_desc: 'Track your past decisions here.',
    tour_stat_title: 'Statistics',
    tour_stat_desc: 'See how much you saved or spent over time.',
    tour_level_title: 'Levels & Badges',
    tour_level_desc: 'Earn badges and level up with your conscious decisions!',

    // Navigation
    nav_calculator: 'Calculator',
    nav_history: 'Journal',
    nav_statistics: 'Statistics',
    nav_levels: 'Levels',

    // Settings / Onboarding
    settings_title_first: 'Let\'s set up your profile',
    settings_title: 'Profile Settings',
    settings_desc_first: 'Data is stored securely in the cloud.',
    settings_desc: 'Modify your salary and details here.',
    appearance: 'Appearance',
    dark_mode: 'Dark Mode',
    light_mode: 'Light Mode',
    switch: 'Switch',
    language: 'Language',
    monthly_salary: 'Monthly Net Salary',
    weekly_hours: 'Weekly Hours',
    city: 'City / Town',
    age: 'Age',
    currency: 'Currency',
    start_btn: 'Save Profile',
    save_settings_btn: 'Save Settings',
    menu_profile: 'Current Profile',
    menu_edit_profile: 'Edit Profile',

    // Calculator
    hourly_rate: 'Hourly Rate',
    what_to_buy: 'What do you want to buy?',
    placeholder_item: 'e.g. New Phone, Coffee',
    price_label: 'Price',
    calculate_btn: 'Calculate',
    cost_in_life: 'Cost in working life',
    hour_short: 'hr',
    min_short: 'min',
    buy_btn: 'Buy It',
    buy_sub: 'work',
    save_btn: 'Save It',
    new_calculation: 'New Calculation',

    // Feedback Modals
    feedback_saved_title: 'Awesome!',
    feedback_saved_desc: 'You saved',
    feedback_saved_time: 'That would have been',
    feedback_saved_time_suffix: 'of work.',
    feedback_bought_title: 'Recorded',
    feedback_bought_desc: 'This item cost you exactly',
    feedback_bought_suffix: 'of your work.',
    thanks_btn: 'Got it, thanks',

    // History
    history_empty_title: 'No history yet',
    history_empty_desc: 'Use the calculator to decide whether to buy or save.',
    saved_stat: 'Saved',
    spent_stat: 'Spent',
    clear_history: 'Clear History',
    clear_confirm: 'Are you sure you want to delete all history?',
    tag_bought: 'Bought',
    tag_saved: 'Saved',
    item_unnamed: 'Unnamed Item',

    // Levels
    level_label: 'Level',
    conscious_buyer: 'Conscious Buyer',
    streak_days: 'days',
    streak_label: 'Streak',
    count_db: '',
    count_label: 'Saves',
    badges_title: 'Badges',

    // Badges
    badge_first_save_name: 'First Step',
    badge_first_save_desc: 'Your first saved item.',
    badge_five_saves_name: 'High Five',
    badge_five_saves_desc: 'You chose to save 5 times.',
    badge_ten_hours_name: 'Time Winner',
    badge_ten_hours_desc: 'Saved 10 hours of work time.',
    badge_streak_3_name: 'On Fire',
    badge_streak_3_desc: '3-day saving streak.',
    badge_hundred_hours_name: 'Time Millionaire',
    badge_hundred_hours_desc: '100+ hours saved.',
    badge_status_unlocked: 'Unlocked',
    badge_status_locked: 'Locked',

    // Statistics
    stats_period: 'Period',
    stats_kept: 'Kept',
    stats_spent: 'Spent',
    stats_saved_time: 'Saved Work Time',
    stats_spent_time: 'Spent Work Time',
    stats_decision_count: 'You made {count} decisions in this period.',
  }
};