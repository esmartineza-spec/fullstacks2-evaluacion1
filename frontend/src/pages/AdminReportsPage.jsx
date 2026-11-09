import { Link } from 'react-router-dom';
import { formatPrice } from '../data/products.js';
import { listAllOrders } from '../services/orderRepository.js';

export default function AdminReportsPage() {
    const orders = listAllOrders();

    const totalSales = orders.reduce(
        (sum, order) => sum + (Number(order.total) || 0),
        0
    );

    const unitsSold = orders.reduce(
        (sum, order) =>
            sum +
            (order.items || []).reduce(
                (itemSum, item) => itemSum + (Number(item.quantity) || 0),
                0
            ),
        0
    );

    const averageOrder = orders.length > 0
        ? totalSales / orders.length
        : 0;

    const productTotals = new Map();

    orders.forEach((order) => {
        (order.items || []).forEach((item) => {
            const current = productTotals.get(item.productId) || {
                id: item.productId,
                name: item.name,
                units: 0,
                sales: 0,
            };

            current.units += Number(item.quantity) || 0;
            current.sales +=
                (Number(item.unitPrice) || 0) *
                (Number(item.quantity) || 0);

            productTotals.set(item.productId, current);
        });
    });

    const bestSellingProducts = [...productTotals.values()]
        .sort((a, b) => b.units - a.units)
        .slice(0, 5);

    const metrics = [
        { label: 'Pedidos registrados', value: orders.length },
        { label: 'Ventas registradas', value: formatPrice(totalSales) },
        { label: 'Unidades vendidas', value: unitsSold },
        { label: 'Promedio por pedido', value: formatPrice(averageOrder) },
    ];

    return (
        <section className="admin-page">
            <header className="admin-dashboard-header">
                <div>
                    <p className="catalog-eyebrow">Administración</p>
                    <h1 className="h2">Reportes</h1>
                    <p className="text-secondary">
                        Resumen de los pedidos guardados en este navegador.
                    </p>
                </div>

                <Link to="/admin" className="btn btn-outline-primary">
                    Volver al Dashboard
                </Link>
            </header>

            <div className="row g-3 mb-4">
                {metrics.map((metric) => (
                    <div className="col-12 col-sm-6 col-xl-3" key={metric.label}>
                        <article className="card admin-metric-card h-100">
                            <div className="card-body">
                                <p className="admin-metric-label">{metric.label}</p>
                                <p className="admin-metric-value">{metric.value}</p>
                            </div>
                        </article>
                    </div>
                ))}
            </div>

            <section className="card admin-panel admin-products-panel">
                <h2 className="h4">Productos más vendidos</h2>

                {bestSellingProducts.length === 0 ? (
                    <p className="text-secondary mb-0">
                        Aún no hay pedidos para generar este reporte.
                    </p>
                ) : (
                    <div className="table-responsive">
                        <table className="table admin-table align-middle">
                            <thead>
                            <tr>
                                <th>Código</th>
                                <th>Producto</th>
                                <th>Unidades vendidas</th>
                                <th>Ventas asociadas</th>
                            </tr>
                            </thead>
                            <tbody>
                            {bestSellingProducts.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td>{product.name}</td>
                                    <td>{product.units}</td>
                                    <td>{formatPrice(product.sales)}</td>
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