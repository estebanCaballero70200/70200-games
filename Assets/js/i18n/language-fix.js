// Translations storage for all languages
const allTranslations = {
    'en': {},
    'es': {},
    'ru': {},
    'pt': {}
};

// Simplified language manager
const LanguageManagerFixed = {
    // Current language
    currentLanguage: 'en',
    
    // Available languages
    availableLanguages: ['en', 'es', 'ru', 'pt'],
    
    // DOM elements
    elements: {
        selector: null,
        selected: null,
        options: null
    },
    
    // Initialize the language manager
    init: function() {
        // Load stored language or use default
        this.currentLanguage = localStorage.getItem('70200Language') || 'en';
        
        // Set up translations - collect from globals
        this.loadTranslations();
        
        // Create language selector
        this.createSelector();
        
        // Apply initial translations
        this.translatePage();
        
        console.log(`Language manager initialized with language: ${this.currentLanguage}`);
    },
    
    // Load translations from global variables set in language files
    loadTranslations: function() {
        // Legacy compatibility - check if window.translations exists
        if (window.translations) {
            allTranslations['en'] = {...window.translations};
            window.translations = null;
        }
        
        // Check for language-specific globals
        this.availableLanguages.forEach(lang => {
            const varName = `translations_${lang}`;
            if (window[varName]) {
                allTranslations[lang] = {...window[varName]};
                window[varName] = null;
            }
        });
        
        // Backup - gather from inline scripts by evaluating their content
        const langScripts = document.querySelectorAll('script[src*="/i18n/"]');
        langScripts.forEach(script => {
            const src = script.getAttribute('src');
            const langMatch = src.match(/\/i18n\/(\w+)\.js/);
            if (langMatch && langMatch[1]) {
                const lang = langMatch[1];
                // The script is already loaded, so its content is in the translations variable
                if (window.translations) {
                    allTranslations[lang] = {...window.translations};
                    
                    // Reset global translations to avoid conflicts
                    window.translations = null;
                }
            }
        });
        
        console.log('Loaded translations:', allTranslations);
    },
    
    // Create language selector in the DOM
    createSelector: function() {
        // Create container
        const selector = document.createElement('div');
        selector.className = 'language-selector';
        
        // Create selected language display
        const selected = document.createElement('div');
        selected.className = 'selected-lang';
        selected.textContent = this.currentLanguage.toUpperCase();
        selected.addEventListener('click', () => {
            selector.classList.toggle('active');
        });
        
        // Create options container
        const options = document.createElement('div');
        options.className = 'lang-options';
        
        // Add options for each available language (except current)
        this.availableLanguages.forEach(lang => {
            if (lang !== this.currentLanguage) {
                const option = document.createElement('div');
                option.className = 'lang-option';
                option.textContent = lang.toUpperCase();
                option.dataset.lang = lang;
                option.addEventListener('click', (e) => {
                    this.changeLanguage(e.target.dataset.lang);
                    selector.classList.remove('active');
                });
                options.appendChild(option);
            }
        });
        
        // Assemble and add to DOM
        selector.appendChild(selected);
        selector.appendChild(options);
        
        // Store references
        this.elements.selector = selector;
        this.elements.selected = selected;
        this.elements.options = options;
        
        // Add to navigation
        const nav = document.querySelector('nav');
        if (nav) {
            nav.appendChild(selector);
        }
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (selector && !selector.contains(e.target)) {
                selector.classList.remove('active');
            }
        });
    },
    
    // Change current language
    changeLanguage: function(lang) {
        if (this.availableLanguages.includes(lang) && lang !== this.currentLanguage) {
            console.log(`Changing language from ${this.currentLanguage} to ${lang}`);
            
            // Update current language
            this.currentLanguage = lang;
            localStorage.setItem('70200Language', lang);
            
            // Update selected language display
            if (this.elements.selected) {
                this.elements.selected.textContent = lang.toUpperCase();
            }
            
            // Update language options
            this.updateOptions();
            
            // Apply translations
            this.translatePage();
        }
    },
    
    // Update language options in the dropdown
    updateOptions: function() {
        if (this.elements.options) {
            // Clear existing options
            this.elements.options.innerHTML = '';
            
            // Add options for each available language (except current)
            this.availableLanguages.forEach(lang => {
                if (lang !== this.currentLanguage) {
                    const option = document.createElement('div');
                    option.className = 'lang-option';
                    option.textContent = lang.toUpperCase();
                    option.dataset.lang = lang;
                    option.addEventListener('click', (e) => {
                        this.changeLanguage(e.target.dataset.lang);
                        this.elements.selector.classList.remove('active');
                    });
                    this.elements.options.appendChild(option);
                }
            });
        }
    },
    
    // Apply translations to the page
    translatePage: function() {
        const currentTranslations = allTranslations[this.currentLanguage];
        
        if (!currentTranslations || Object.keys(currentTranslations).length === 0) {
            console.error(`No translations available for ${this.currentLanguage}`);
            return;
        }
        
        console.log(`Applying ${this.currentLanguage} translations to page`);
        
        // Translate text content
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (currentTranslations[key]) {
                element.textContent = currentTranslations[key];
            }
        });
        
        // Translate placeholders
        const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
        placeholders.forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (currentTranslations[key]) {
                element.placeholder = currentTranslations[key];
            }
        });
        
        // Update HTML lang attribute
        document.documentElement.lang = this.currentLanguage;
    }
};

// Initialize after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // We now use variable names with language suffix (translations_en, translations_es, etc.)
    // Get all these variables from the window object
    allTranslations.en = window.translations_en || {};
    allTranslations.es = window.translations_es || {};
    allTranslations.ru = window.translations_ru || {};
    allTranslations.pt = window.translations_pt || {};
    
    console.log('Translations captured:', {
        en: Object.keys(allTranslations.en).length,
        es: Object.keys(allTranslations.es).length,
        ru: Object.keys(allTranslations.ru).length,
        pt: Object.keys(allTranslations.pt).length
    });
    
    // Initialize the language manager
    LanguageManagerFixed.init();
});