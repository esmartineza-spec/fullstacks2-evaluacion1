import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../data/products.js';
import {
    createUserByAdmin,
    listUsers,
    updateUser,
} from '../services/authRepository.js';
import { getOrderHistory } from '../services/orderRepository.js';

const emptyForm = {
    nombre: '',
    email: '',
    password: '',
    fechaNacimiento: '',
    telefono: '',
    direccion: '',
};

function formatDate(value) {
    if (!value) return 'Sin fecha';

    return new Intl.DateTimeFormat('es-CL', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value));
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState(() =>
        listUsers().filter((user) => user.role !== 'admin')
    );
    const [form, setForm] = useState(emptyForm);
    const [editingEmail, setEditingEmail] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [historyEmail, setHistoryEmail] = useState('');

    const selectedUser = users.find((user) => user.email === historyEmail);
    const orders = historyEmail ? getOrderHistory(historyEmail) : [];

    function handleChange(event) {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
        setError('');
        setMessage('');
    }

    function resetForm() {
        setForm(emptyForm);
        setEditingEmail('');
    }

    function handleSubmit(event) {
        event.preventDefault();

        try {
            if (editingEmail) {
                updateUser(editingEmail, {
                    nombre: form.nombre,
                    telefono: form.telefono,
                    direccion: form.direccion,
                });
                setMessage('Usuario actualizado correctamente.');
            } else {
                createUserByAdmin(form);
                setMessage('Usuario creado correctamente.');
            }

            setUsers(listUsers().filter((user) => user.role !== 'admin'));
            setError('');
            resetForm();
        } catch (saveError) {
            setError(saveError.message);
        }
    }

    function handleEdit(user) {
        setEditingEmail(user.email);
        setForm({
            ...emptyForm,
            nombre: user.nombre,
            email: user.email,
            telefono: user.telefono || '',
            direccion: user.direccion || '',
        });
        setError('');
        setMessage('');
    }

    return (
        <section className="admin-page">
            <header className="admin-dashboard-header">
                <div>
                    <p className="catalog-eyebrow">Administración</p>
                    <h1 className="h2">Gestión de usuarios</h1>
                    <p className="text-secondary">
                        Clientes registrados: {users.length}
                    </p>
                </div>

                <Link to="/admin" className="btn btn-outline-primary">
                    Volver al Dashboard
                </Link>
            </header>

            <div className="card admin-panel admin-form-panel mb-4">
                <h2 className="h4">
                    {editingEmail ? 'Editar usuario' : 'Crear usuario'}
                </h2>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-3">
                        <label htmlFor="admin-user-name" className="form-label">
                            Nombre completo
                        </label>
                        <input
                            id="admin-user-name"
                            name="nombre"
                            className="form-control"
                            value={form.nombre}
                            onChange={handleChange}
                            minLength="3"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="admin-user-email" className="form-label">
                            Correo electrónico
                        </label>
                        <input
                            id="admin-user-email"
                            name="email"
                            type="email"
                            className="form-control"
                            value={form.email}
                            onChange={handleChange}
                            readOnly={Boolean(editingEmail)}
                            required
                        />
                    </div>

                    {!editingEmail && (
                        <>
                            <div className="mb-3">
                                <label htmlFor="admin-user-password" className="form-label">
                                    Contraseña inicial
                                </label>
                                <input
                                    id="admin-user-password"
                                    name="password"
                                    type="password"
                                    className="form-control"
                                    value={form.password}
                                    onChange={handleChange}
                                    minLength="8"
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="admin-user-birthdate" className="form-label">
                                    Fecha de nacimiento
                                </label>
                                <input
                                    id="admin-user-birthdate"
                                    name="fechaNacimiento"
                                    type="date"
                                    className="form-control"
                                    value={form.fechaNacimiento}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </>
                    )}

                    <div className="mb-3">
                        <label htmlFor="admin-user-phone" className="form-label">
                            Teléfono
                        </label>
                        <input
                            id="admin-user-phone"
                            name="telefono"
                            type="tel"
                            className="form-control"
                            value={form.telefono}
                            onChange={handleChange}
                            required={!editingEmail}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="admin-user-address" className="form-label">
                            Dirección
                        </label>
                        <input
                            id="admin-user-address"
                            name="direccion"
                            className="form-control"
                            value={form.direccion}
                            onChange={handleChange}
                            required={!editingEmail}
                        />
                    </div>

                    {error && <p className="text-danger" role="alert">{error}</p>}
                    {message && <p className="text-success" role="status">{message}</p>}

                    <button type="submit" className="btn btn-primary me-2">
                        {editingEmail ? 'Guardar cambios' : 'Crear usuario'}
                    </button>

                    {editingEmail && (
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={resetForm}
                        >
                            Cancelar edición
                        </button>
                    )}
                </form>
            </div>

            <div className="card admin-panel admin-products-panel">
                <h2 className="h4">Usuarios registrados</h2>

                <div className="table-responsive">
                    <table className="table admin-table align-middle">
                        <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user) => (
                            <tr key={user.email}>
                                <td>{user.nombre}</td>
                                <td>{user.email}</td>
                                <td>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-primary me-2"
                                        onClick={() => handleEdit(user)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() =>
                                            setHistoryEmail(
                                                historyEmail === user.email ? '' : user.email
                                            )
                                        }
                                    >
                                        {historyEmail === user.email
                                            ? 'Ocultar historial'
                                            : 'Historial'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedUser && (
                <section className="card admin-panel admin-order-receipt mt-4">
                    <h2 className="h4">
                        Compras de {selectedUser.nombre}
                    </h2>

                    {orders.length === 0 ? (
                        <p className="text-secondary mb-0">
                            Este usuario aún no tiene compras registradas.
                        </p>
                    ) : (
                        orders.map((order) => (
                            <article className="admin-user-order" key={order.code}>
                                <h3 className="h5">
                                    Pedido {order.code} · {formatDate(order.createdAt)}
                                </h3>
                                <ul>
                                    {(order.items || []).map((item) => (
                                        <li key={item.productId}>
                                            {item.name} × {item.quantity}
                                        </li>
                                    ))}
                                </ul>
                                <strong>Total: {formatPrice(order.total)}</strong>
                            </article>
                        ))
                    )}
                </section>
            )}
        </section>
    );
}