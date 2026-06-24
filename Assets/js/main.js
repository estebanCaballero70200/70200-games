// El formulario ahora usa FormSubmit para el envío directo de correos
// No necesitamos manejar el envío manualmente, ya que el formulario
// ahora tiene action="https://formsubmit.co/contacto@70200.games" method="POST"

// Script para el scroll suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Efecto Parallax
window.addEventListener('scroll', function() {
    const parallaxBgs = document.querySelectorAll('.parallax-bg');
    
    parallaxBgs.forEach(bg => {
        const scrollY = window.pageYOffset;
        const sectionTop = bg.parentElement.offsetTop;
        const speed = bg.getAttribute('data-speed') || 0.5;
        
        const yPos = (scrollY - sectionTop) * speed;
        bg.style.transform = `translateY(${yPos}px)`;
    });
});

// Inicializar efecto parallax
document.addEventListener('DOMContentLoaded', function() {
    // Cambiar fondos para cada sección
    const sections = {
        'hero': 'Assets/images/bg-hero.jpg',
        'about': 'Assets/images/bg-about.jpg',
        'games': 'Assets/images/bg-games.jpg',
        'services': 'Assets/images/bg-services.jpg',
        'contact': 'Assets/images/bg-contact.jpg'
    };
    
    // Agregar el fondo parallax a cada sección
    Object.keys(sections).forEach(sectionClass => {
        const section = document.querySelector(`.${sectionClass}`);
        if (section) {
            const bgDiv = document.createElement('div');
            bgDiv.className = 'parallax-bg';
            bgDiv.setAttribute('data-speed', '0.3');
            bgDiv.style.backgroundImage = `url('${sections[sectionClass]}')`;
            section.insertBefore(bgDiv, section.firstChild);
        }
    });
    
    // Configurar el fondo del juego
    const gameCard = document.querySelector('.game-card');
    if (gameCard) {
        gameCard.style.backgroundImage = "url('Assets/images/wordtris-bg.jpg')";
    }
    
    // Manejar el clic en el indicador de desplazamiento
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            // Desplazarse a la siguiente sección (About)
            document.getElementById('about').scrollIntoView({
                behavior: 'smooth'
            });
        });
        
        // Ocultar el indicador de desplazamiento al hacer scroll
        window.addEventListener('scroll', function() {
            if (window.scrollY > 200) {
                scrollIndicator.style.opacity = '0';
            } else {
                scrollIndicator.style.opacity = '1';
            }
        });
    }
});