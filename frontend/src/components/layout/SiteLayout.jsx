import { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { getCurrentUser, logoutUser } from '../../services/authRepository.js';
import { getCart, subscribeCart} from "../../services/cartRepository.js";

const publicLinks = [
    { to: '/', label: 'Inicio', end: true },
    { to: '/categorias', label: 'Categorías' },
    { to: '/ofertas', label: 'Ofertas' },
    { to: '/nosotros', label: 'Nosotros' },
    { to: '/blogs', label: 'Blog' },
    { to: '/contacto', label: 'Contacto' },
    { to: '/pedido', label: 'Seguimiento' },
    { to: '/carrito', label: 'Carrito' },

];

export default function SiteLayout() {
    const [user, setUser] = useState(() => getCurrentUser());
    const [menuOpen, setMenuOpen] = useState(false);
    const [cartCount, setCartCount] = useState(() =>
        getCart().reduce((total, item) => total + item.quantity, 0)
    );

    useEffect(() => {
        const refreshUser = () => setUser(getCurrentUser());

        const refreshCartCount = () => {
            const count = getCart().reduce(
                (total, item) => total + item.quantity,
                0
            );
            setCartCount(count);
        };

        window.addEventListener('mil-sabores:auth-changed', refreshUser);
        window.addEventListener('storage', refreshUser);

        const unsubscribeCart = subscribeCart(refreshCartCount);

        return () => {
            window.removeEventListener('mil-sabores:auth-changed', refreshUser);
            window.removeEventListener('storage', refreshUser);
            unsubscribeCart();
        };
    }, []);

    const accountLinks = user?.role === 'admin'
        ? [
            { to: '/admin', label: 'Administración' },
            { to: '/perfil', label: 'Mi perfil' },
        ]
        : user
            ? [{ to: '/perfil', label: 'Mi perfil' }]
            : [
                { to: '/login', label: 'Iniciar sesión' },
                { to: '/registro', label: 'Registrarse' },
            ];

    function closeMenu() {
        setMenuOpen(false);
    }

    return (
        <div className="site-layout">
            <div className="announcement-bar">
                <div className="container announcement-content">
                    <span>Pastelería Mil Sabores</span>
                    <span>Un dulce momento para compartir</span>
                </div>
            </div>

            <header className="site-header">
                <div className="container">
                    <div className="site-header-inner">
                        <NavLink
                            to="/"
                            end
                            className="site-logo"
                            onClick={closeMenu}
                        >
                            <span aria-hidden="true">✦</span>
                            <span>Mil Sabores</span>
                            <span className="site-logo-badge">50 años</span>
                        </NavLink>

                        <button
                            type="button"
                            className="menu-toggle"
                            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
                            aria-expanded={menuOpen}
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            {menuOpen ? '×' : '☰'}
                        </button>

                        <nav
                            className={`site-nav ${menuOpen ? 'is-open' : ''}`}
                            aria-label="Navegación principal"
                        >
                            <div className="site-nav-links">
                                {publicLinks.map(({ to, label, end }) => (
                                    <NavLink
                                        key={to}
                                        to={to}
                                        end={end}
                                        onClick={closeMenu}
                                        className={({ isActive }) =>
                                            `site-nav-link${isActive ? ' active' : ''}`
                                        }>
                                        {label}
                                        {to === '/carrito' && (
                                            <span className="cart-count"
                                                  aria-label={`${cartCount} unidades en el carrito`}>{cartCount}
                                            </span>
                                        )}
                                    </NavLink>
                                ))}
                            </div>

                            <div className="site-account-links">
                                {accountLinks.map(({ to, label }) => (
                                    <NavLink
                                        key={to}
                                        to={to}
                                        onClick={closeMenu}
                                        className={({ isActive }) =>
                                            `site-account-link${isActive ? ' active' : ''}`
                                        }
                                    >
                                        {label}
                                    </NavLink>
                                ))}

                                {user && (
                                    <>
                                        <span className="site-greeting">
                                            Hola, {user.nombre.split(' ')[0]}
                                        </span>
                                        <button
                                            type="button"
                                            className="site-logout-button"
                                            onClick={() => {
                                                logoutUser();
                                                closeMenu();
                                            }}
                                        >
                                            Cerrar sesión
                                        </button>
                                    </>
                                )}
                            </div>
                        </nav>
                    </div>
                </div>
            </header>

            <main className="container py-4 site-main">
                <Outlet />
            </main>

            <footer className="site-footer">
                <div className="container">
                    <div className="site-footer-grid">
                        <div>
                            <h2 className="site-footer-title">Mil Sabores</h2>
                            <p>
                                Tortas y preparaciones para compartir en tus
                                momentos especiales.
                            </p>
                        </div>

                        <div>
                            <h2 className="site-footer-heading">Explora</h2>
                            <NavLink to="/categorias">Catálogo</NavLink>
                            <NavLink to="/ofertas">Ofertas</NavLink>
                            <NavLink to="/blogs">Blog</NavLink>
                        </div>

                        <div>
                            <h2 className="site-footer-heading">Ayuda</h2>
                            <NavLink to="/contacto">Contacto</NavLink>
                            <NavLink to="/pedido">Seguimiento de pedido</NavLink>
                            <NavLink to="/nosotros">Nosotros</NavLink>
                        </div>
                    </div>

                    <div className="site-footer-bottom">
                        Pastelería Mil Sabores · Proyecto Full Stack 2
                    </div>
                </div>
            </footer>
        </div>
    );
}