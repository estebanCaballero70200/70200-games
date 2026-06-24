// Language handling functions
class LanguageManager {
    constructor() {
        // Set default language to English
        this.currentLanguage = localStorage.getItem('70200Language') || 'en';
        this.availableLanguages = ['en', 'es', 'ru', 'pt'];
        this.translations = {};
        
        // Initialize the language selector
        this.initLanguageSelector();
    }
    
    async initLanguageSelector() {
        // Create language selector in the DOM
        const languageSelector = document.createElement('div');
        languageSelector.className = 'language-selector';
        
        const selectedLang = document.createElement('div');
        selectedLang.className = 'selected-lang';
        selectedLang.textContent = this.currentLanguage.toUpperCase();
        selectedLang.addEventListener('click', () => {
            languageSelector.classList.toggle('active');
        });
        
        const langOptions = document.createElement('div');
        langOptions.className = 'lang-options';
        
        this.availableLanguages.forEach(lang => {
            if (lang !== this.currentLanguage) {
                const option = document.createElement('div');
                option.className = 'lang-option';
                option.textContent = lang.toUpperCase();
                option.addEventListener('click', () => {
                    this.changeLanguage(lang);
                    languageSelector.classList.remove('active');
                });
                langOptions.appendChild(option);
            }
        });
        
        languageSelector.appendChild(selectedLang);
        languageSelector.appendChild(langOptions);
        
        // Add the language selector to the navigation
        document.addEventListener('DOMContentLoaded', () => {
            const nav = document.querySelector('nav');
            if (nav) {
                nav.appendChild(languageSelector);
            }
            
            // Close the dropdown when clicking outside
            document.addEventListener('click', (event) => {
                if (!languageSelector.contains(event.target)) {
                    languageSelector.classList.remove('active');
                }
            });
            
            // Load initial language
            this.loadLanguage(this.currentLanguage);
        });
    }
    
    async loadLanguage(lang) {
        try {
            // Construct the URL for the language script
            const scriptUrl = `Assets/js/i18n/${lang}.js`;
            
            // Remove any previous script with this URL
            const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);
            if (existingScript) {
                document.head.removeChild(existingScript);
            }
            
            // Wait for the script to load
            await this.loadScript(scriptUrl);
            
            // Save the translations
            if (window.translations) {
                this.translations[lang] = {...window.translations};
                
                // Clear the global translations variable to prevent conflicts
                window.translations = null;
                
                // Update the page
                this.translatePage();
                console.log(`Language changed to: ${lang}`);
            } else {
                console.error(`No translations found for language: ${lang}`);
            }
        } catch (error) {
            console.error(`Error loading language file for ${lang}:`, error);
        }
    }
    
    loadScript(src) {
        return new Promise((resolve, reject) => {
            // Create a new script element
            const script = document.createElement('script');
            script.src = src;
            
            // Set callbacks
            script.onload = () => {
                console.log(`Loaded script: ${src}`);
                setTimeout(resolve, 100); // Small delay to ensure translations are available
            };
            script.onerror = (e) => {
                console.error(`Error loading script: ${src}`, e);
                reject(e);
            };
            
            // Add script to document
            document.head.appendChild(script);
        });
    }
    
    changeLanguage(lang) {
        if (this.availableLanguages.includes(lang) && lang !== this.currentLanguage) {
            this.currentLanguage = lang;
            localStorage.setItem('70200Language', lang);
            
            // Update selected language display
            const selectedLang = document.querySelector('.selected-lang');
            if (selectedLang) {
                selectedLang.textContent = lang.toUpperCase();
            }
            
            // Update language options
            const langOptions = document.querySelector('.lang-options');
            if (langOptions) {
                langOptions.innerHTML = '';
                this.availableLanguages.forEach(l => {
                    if (l !== this.currentLanguage) {
                        const option = document.createElement('div');
                        option.className = 'lang-option';
                        option.textContent = l.toUpperCase();
                        option.addEventListener('click', () => {
                            this.changeLanguage(l);
                            document.querySelector('.language-selector').classList.remove('active');
                        });
                        langOptions.appendChild(option);
                    }
                });
            }
            
            this.loadLanguage(lang);
        }
    }
    
    translatePage() {
        const currentTranslations = this.translations[this.currentLanguage];
        
        if (!currentTranslations) {
            console.error(`No translations available for ${this.currentLanguage}`);
            return;
        }
        
        console.log(`Translating page to ${this.currentLanguage}`);
        
        // Translate text content
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (currentTranslations[key]) {
                element.textContent = currentTranslations[key];
            } else {
                console.warn(`Translation missing for key: ${key} in language: ${this.currentLanguage}`);
            }
        });
        
        // Translate placeholders
        const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
        placeholders.forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (currentTranslations[key]) {
                element.placeholder = currentTranslations[key];
            } else {
                console.warn(`Translation missing for placeholder: ${key} in language: ${this.currentLanguage}`);
            }
        });
        
        // Update title attribute on scroll indicator
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            const scrollText = currentTranslations['nav_about'] || 'About Us';
            scrollIndicator.title = `${currentTranslations['scroll_to'] || 'Scroll down to'} ${scrollText}`;
        }
        
        // Update hidden form values
        const subjectInput = document.querySelector('input[name="_subject"]');
        if (subjectInput) {
            const siteName = '70-200 Website';
            subjectInput.value = `${currentTranslations['new_message'] || 'New message from'} ${siteName}`;
        }
        
        // Update HTML lang attribute
        document.documentElement.lang = this.currentLanguage;
    }
}

// Initialize language manager
const languageManager = new LanguageManager();