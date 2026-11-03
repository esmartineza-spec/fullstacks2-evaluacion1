import { Link, Navigate } from 'react-router-dom';
import { getCurrentUser } from '../services/authRepository.js';
import { getOrderHistory } from '../services/orderRepository.js';

function formatPrice(value) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        maximumFractionDigits: 0,
    }).format(Number(value) || 0);
}

function formatDate(value) {
    if (!value) return 'Fecha no disponible';

    return new Intl.DateTimeFormat('es-CL', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value));
}

export default function ProfilePage() {
    const user = getCurrentUser();

    if (!user) {
        return <Navigate to="/acceso" replace />;
    }

    const orders = getOrderHistory(user.email);

    return (
        <main className="container py-4">
            <h1 className="mb-4">Mi perfil</h1>

            <section className="card mb-4">
                <div className="card-body">
                    <h2 className="h4">Mis datos</h2>
                    <p className="mb-1"><strong>Nombre:</strong> {user.nombre}</p>
                    <p className="mb-0"><strong>Correo:</strong> {user.email}</p>
                </div>
            </section>

            <section>
                <h2 className="h3 mb-3">Historial de compras</h2>

                {orders.length === 0 ? (
                    <p>Aún no tienes compras asociadas a esta cuenta.</p>
                ) : (
                    <div className="d-grid gap-3">
                        {orders.map((order) => (
                            <article className="card" key={order.code}>
                                <div className="card-body">
                                    <div className="d-flex flex-wrap justify-content-between gap-2">
                                        <h3 className="h5 mb-0">
                                            Pedido {order.code}
                                        </h3>
                                        <span>{formatDate(order.createdAt)}</span>
                                    </div>

                                    <ul className="mt-3">
                                        {(order.items || []).map((item) => (
                                            <li key={item.productId}>
                                                {item.name} × {item.quantity}
                                            </li>
                                        ))}
                                    </ul>

                                    <p className="mb-0">
                                        <strong>Total: {formatPrice(order.total)}</strong>
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            <Link className="btn btn-primary mt-4" to="/categorias">
                Volver a la tienda
            </Link>
        </main>
    );
}