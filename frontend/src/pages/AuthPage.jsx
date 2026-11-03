import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../services/authRepository.js';

const initialForm = { nombre: '', email: '', password: '', fechaNacimiento: '', telefono: '', direccion: '' };

export default function AuthPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const isRegister = location.pathname === '/registro';
    const [form, setForm] = useState(initialForm);
    const [error, setError] = useState('');

    function handleChange(event) {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
        setError('');
    }

    function handleSubmit(event) {
        event.preventDefault();
        try {
            const user = isRegister
                ? registerUser(form)
                : loginUser(form.email, form.password);
            window.dispatchEvent(new Event('mil-sabores:auth-changed'));
            navigate(user.role === 'admin' ? '/admin' : '/');
        } catch (submitError) {
            setError(submitError.message);
        }
    }

    return (
        <section className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
                <div className="card border-0 shadow-sm p-4 p-md-5">
                    <p className="text-uppercase small fw-bold text-primary mb-2">Pastelería Mil Sabores</p>
                    <h1 className="h2 mb-4">{isRegister ? 'Crear cuenta' : 'Iniciar sesión'}</h1>
                    <form onSubmit={handleSubmit} noValidate>
                        {isRegister && <div className="mb-3">
                            <label htmlFor="auth-name" className="form-label">Nombre completo</label>
                            <input id="auth-name" name="nombre" value={form.nombre} onChange={handleChange} className="form-control" minLength="3" required />
                        </div>}
                        <div className="mb-3">
                            <label htmlFor="auth-email" className="form-label">Correo electrónico</label>
                            <input id="auth-email" name="email" type="email" value={form.email} onChange={handleChange} className="form-control" autoComplete="email" required />
                            {isRegister && form.email.toLowerCase().endsWith('@duocuc.cl') && <div className="form-text text-success">Correo Duoc detectado: se registrará tu beneficio de cumpleaños. El código DUOCUMPLE se aplica en la compra.</div>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="auth-password" className="form-label">Contraseña</label>
                            <input id="auth-password" name="password" type="password" value={form.password} onChange={handleChange} className="form-control" autoComplete={isRegister ? 'new-password' : 'current-password'} minLength="8" required />
                            {isRegister && <div className="form-text">Usa al menos 8 caracteres.</div>}
                        </div>
                        {isRegister && <>
                            <div className="mb-3">
                                <label htmlFor="auth-birthdate" className="form-label">Fecha de nacimiento</label>
                                <input id="auth-birthdate" name="fechaNacimiento" type="date" value={form.fechaNacimiento} onChange={handleChange} className="form-control" required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="auth-phone" className="form-label">Teléfono</label>
                                <input id="auth-phone" name="telefono" type="tel" value={form.telefono} onChange={handleChange} className="form-control" autoComplete="tel" required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="auth-address" className="form-label">Dirección</label>
                                <input id="auth-address" name="direccion" value={form.direccion} onChange={handleChange} className="form-control" autoComplete="street-address" required />
                            </div>
                        </>}
                        {error && <div className="alert alert-danger" role="alert">{error}</div>}
                        <button type="submit" className="btn btn-primary w-100">{isRegister ? 'Registrarme' : 'Ingresar'}</button>
                    </form>
                    <p className="mt-3 mb-0">
                        {isRegister ? '¿Ya tienes cuenta? ' : '¿Aún no tienes cuenta? '}
                        <Link to={isRegister ? '/login' : '/registro'}>{isRegister ? 'Inicia sesión' : 'Regístrate'}</Link>
                    </p>
                    {!isRegister && <div className="alert alert-info mt-4 mb-0">
                        <strong>Acceso de demostración para la presentación</strong><br />
                        Correo: admin@milsabores.cl<br />Contraseña: Admin123!
                    </div>}
                </div>
            </div>
        </section>
    );
}