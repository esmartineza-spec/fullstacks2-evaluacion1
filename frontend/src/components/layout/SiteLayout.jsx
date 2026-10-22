import { NavLink, Outlet } from 'react-router-dom';

const links = [
    { to: '/', label: 'Inicio', end: true },
    { to: '/categorias', label: 'Categorías' },
    { to: '/ofertas', label: 'Ofertas' },
    { to: '/carrito', label: 'Carrito' },
    { to: '/admin', label: 'Administración' },
];

export default function SiteLayout() {
    return (
        <>
            <header className="border-bottom bg-white">
                <nav className="container d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 py-3">
                    <NavLink to="/" className="navbar-brand fw-bold text-dark">
                        Pastelería Mil Sabores
                    </NavLink>

                    <div className="d-flex flex-wrap gap-3">
                        {links.map(({ to, label, end }) => (
                            <NavLink
                                key={to}
                                to={to}
                                end={end}
                                className={({ isActive }) =>
                                    `text-decoration-none ${isActive ? 'fw-bold text-primary' : 'text-dark'}`
                                }
                            >
                                {label}
                            </NavLink>
                        ))}
                    </div>
                </nav>
            </header>

            <main className="container py-4">
                <Outlet />
            </main>

            <footer className="border-top mt-5 py-4 text-center text-secondary">
                Pastelería Mil Sabores · Evaluación Full Stack 2
            </footer>
        </>
    );
}