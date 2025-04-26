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
