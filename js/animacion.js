document.addEventListener('DOMContentLoaded', () => {
    const fotos = document.querySelectorAll('.foto'); // Selecciona TODAS las fotos
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Opcional: Deja de observar después de animar (mejora rendimiento)
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1, // Dispara cuando el 10% del elemento es visible
        rootMargin: '0px 0px -50px 0px' // Activa 50px antes de que entre en pantalla
    });

    // Observa CADA foto individualmente
    fotos.forEach(foto => observer.observe(foto));
});


window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const sideNav = document.body.querySelector('#sideNav');
    if (sideNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#sideNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});


document.addEventListener('DOMContentLoaded', () => {
  const cursor = document.querySelector('.custom-cursor');
  
  // Activar cursor personalizado
  document.documentElement.classList.add('hide-native-cursor');
  
  // Seguir movimiento del mouse
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
  });
  
  // Efecto al pasar sobre elementos interactivos
  const interactiveElements = document.querySelectorAll('a, button, [data-cursor-hover]');
  
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(2)';
      cursor.style.backgroundColor = 'black';
      cursor.style.borderColor = 'white';
    });
    
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursor.style.backgroundColor = 'white';
      cursor.style.borderColor = 'black';
    });
  });
});
