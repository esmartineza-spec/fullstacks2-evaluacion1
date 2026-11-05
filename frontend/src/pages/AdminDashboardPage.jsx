import { Link } from 'react-router-dom';
import { formatPrice } from '../data/products.js';
import { listProducts } from '../services/productRepository.js';
import { listUsers } from '../services/authRepository.js';
import { listAllOrders } from '../services/orderRepository.js';

function formatDate(value) {
    if (!value) return 'Sin fecha';

    return new Intl.DateTimeFormat('es-CL', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value));
}

export default function AdminDashboardPage() {
    const products = listProducts();
    const customers = listUsers().filter((user) => user.role !== 'admin');
    const orders = listAllOrders();
    const totalSales = orders.reduce(
        (total, order) => total + (Number(order.total) || 0),
        0
    );
    const recentOrders = orders.slice(0, 5);

    const metrics = [
        { label: 'Productos', value: products.length, icon: '🧁' },
        { label: 'Clientes registrados', value: customers.length, icon: '👥' },
        { label: 'Pedidos registrados', value: orders.length, icon: '🛍️' },
        { label: 'Ventas registradas', value: formatPrice(totalSales), icon: '💰' },
    ];

    return (
        <section className="admin-dashboard">
            <header className="admin-dashboard-header">
                <div>
                    <p className="catalog-eyebrow">Panel de administración</p>
                    <h1 className="h2">Dashboard</h1>
                    <p className="text-secondary">
                        Resumen de la información guardada en esta tienda.
                    </p>
                </div>

                <Link to="/admin/productos" className="btn btn-primary">
                    Administrar productos
                </Link>
            </header>

            <div className="row g-3 mb-4">
                {metrics.map((metric) => (
                    <div className="col-12 col-sm-6 col-xl-3" key={metric.label}>
                        <article className="card admin-metric-card h-100">
                            <div className="card-body">
                                <span className="admin-metric-icon" aria-hidden="true">
                                    {metric.icon}
                                </span>
                                <p className="admin-metric-label">{metric.label}</p>
                                <p className="admin-metric-value">{metric.value}</p>
                            </div>
                        </article>
                    </div>
                ))}
            </div>

            <section className="card admin-panel admin-recent-orders">
                <div className="admin-recent-heading">
                    <h2 className="h4 mb-0">Pedidos recientes</h2>
                    <span>{orders.length} en total</span>
                </div>

                {recentOrders.length === 0 ? (
                    <p className="text-secondary mb-0">
                        Todavía no hay pedidos registrados en este navegador.
                    </p>
                ) : (
                    <div className="table-responsive">
                        <table className="table admin-table align-middle">
                            <thead>
                            <tr>
                                <th>Número</th>
                                <th>Cliente</th>
                                <th>Fecha</th>
                                <th>Total</th>
                            </tr>
                            </thead>
                            <tbody>
                            {recentOrders.map((order) => (
                                <tr key={order.code}>
                                    <td>{order.code}</td>
                                    <td>{order.customer?.name || 'Sin nombre'}</td>
                                    <td>{formatDate(order.createdAt)}</td>
                                    <td>{formatPrice(order.total)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </section>
    );
}