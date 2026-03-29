document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.sidebar__link');
    const mainContainer = document.getElementById('main-container');

    const loadModule = async (route) => {
        try {
            const response = await fetch(`./src/modules/${route}/${route}.html`);
            if (!response.ok) throw new Error('Error cargando la vista');
            
            const html = await response.text();
            mainContainer.innerHTML = html;

            if (route === 'huespedes') {
                const module = await import(`./modules/huespedes/huespedes.js`);
                module.initHuespedes();
            }

        } catch (error) {
            mainContainer.innerHTML = `<h2>Error al cargar el módulo: ${route}</h2>`;
            console.error(error);
        }
    };

    const navigateTo = (route) => {
        links.forEach(link => link.classList.remove('sidebar__link--active'));
        const activeLink = document.querySelector(`[data-route="${route}"]`);
        if (activeLink) activeLink.classList.add('sidebar__link--active');

        loadModule(route);
    };

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const route = e.target.getAttribute('data-route');
            navigateTo(route);
        });
    });

    navigateTo('huespedes');
});