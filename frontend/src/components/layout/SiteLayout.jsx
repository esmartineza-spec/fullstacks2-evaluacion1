import { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { getCurrentUser, logoutUser } from '../../services/authRepository.js';

const publicLinks = [
    { to: '/', label: 'Inicio', end: true },
    { to: '/categorias', label: 'Categorías' },
    { to: '/ofertas', label: 'Ofertas' },
    { to: '/carrito', label: 'Carrito' },
];

export default function SiteLayout() {
    const [user, setUser] = useState(() => getCurrentUser());

    useEffect(() => {
        const refreshUser = () => setUser(getCurrentUser());
        window.addEventListener('mil-sabores:auth-changed', refreshUser);
        window.addEventListener('storage', refreshUser);
        return () => {
            window.removeEventListener('mil-sabores:auth-changed', refreshUser);
            window.removeEventListener('storage', refreshUser);
        };
    }, []);

    const links = user?.role === 'admin'
        ? [...publicLinks, { to: '/admin', label: 'Administración' }]
        : user
            ? [...publicLinks, { to: '/perfil', label: 'Mi perfil' }]
            : [...publicLinks, { to: '/login', label: 'Iniciar sesión' }, { to: '/registro', label: 'Registrarse' }];

    return (
        <>
            <header className="border-bottom bg-white">
                <nav className="container d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 py-3">
                    <NavLink to="/" className="navbar-brand fw-bold text-dark">Pastelería Mil Sabores</NavLink>
                    <div className="d-flex flex-wrap align-items-center gap-3">
                        {links.map(({ to, label, end }) => (
                            <NavLink key={to} to={to} end={end} className={({ isActive }) =>
                                isActive ? 'text-decoration-none fw-bold text-primary' : 'text-decoration-none text-dark'
                            }>{label}</NavLink>
                        ))}
                        {user && <>
                            <span className="small text-secondary">Hola, {user.nombre.split(' ')[0]}</span>
                            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={logoutUser}>Cerrar sesión</button>
                        </>}
                    </div>
                </nav>
            </header>
            <main className="container py-4"><Outlet /></main>
            <footer className="border-top mt-5 py-4 text-center text-secondary">
                Pastelería Mil Sabores · Evaluación Full Stack 2
            </footer>
        </>
    );
}