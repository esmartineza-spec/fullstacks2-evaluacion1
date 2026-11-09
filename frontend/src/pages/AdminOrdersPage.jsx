import {useState} from "react";
import { formatPrice} from "../data/products.js";
import { listAllOrders} from "../services/orderRepository.js";

function formatDate(value) {
    if (!value) return 'Sin fecha';

    return new Intl.DateTimeFormat('es-CL', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value));
}

export default function AdminOrdersPage() {
    const orders = listAllOrders();
    const [selectedOrderCode, setSelectedOrderCode] = useState('');
    const selectedOrder = orders.find(
        (order) => order.code === selectedOrderCode
    );

    return (
        <section className="admin-orders-page">
            <header className="admin-dashboard-header">
                <div>
                    <p className="catalog-eyebrow">Administración</p>
                    <h1 className="h2">Pedidos y comprobantes</h1>
                    <p className="text-secondary">
                        Pedidos guardados en este navegador: {orders.length}
                    </p>
                </div>
            </header>

            {orders.length === 0 ? (
                <div className="card admin-panel p-4">
                    <p className="text-secondary mb-0">
                        Todavía no hay pedidos registrados.
                    </p>
                </div>
            ) : (
                <div className="card admin-panel admin-orders-panel">
                    <div className="table-responsive">
                        <table className="table admin-table align-middle">
                            <thead>
                            <tr>
                                <th>Número</th>
                                <th>Cliente</th>
                                <th>Fecha</th>
                                <th>Total</th>
                                <th>Comprobante</th>
                            </tr>
                            </thead>
                            <tbody>
                            {orders.map((order) => (
                                <tr key={order.code}>
                                    <td>{order.code}</td>
                                    <td>{order.customer?.name || 'Sin nombre'}</td>
                                    <td>{formatDate(order.createdAt)}</td>
                                    <td>{formatPrice(order.total)}</td>
                                    <td>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-primary"
                                            aria-expanded={selectedOrderCode === order.code}
                                            onClick={() =>
                                                setSelectedOrderCode(
                                                    selectedOrderCode === order.code
                                                        ? ''
                                                        : order.code
                                                )
                                            }
                                        >
                                            {selectedOrderCode === order.code
                                                ? 'Ocultar'
                                                : 'Ver detalle'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {selectedOrder && (
                <section className="card admin-panel admin-order-receipt mt-4">
                    <h2 className="h4">
                        Comprobante del pedido {selectedOrder.code}
                    </h2>

                    <p>
                        <strong>Cliente:</strong>{' '}
                        {selectedOrder.customer?.name || 'Sin nombre'}
                    </p>
                    <p>
                        <strong>Correo:</strong>{' '}
                        {selectedOrder.customer?.email || 'Sin correo'}
                    </p>

                    <h3 className="h5 mt-4">Productos</h3>
                    <ul>
                        {(selectedOrder.items || []).map((item) => (
                            <li key={item.productId}>
                                {item.name} × {item.quantity} —{' '}
                                {formatPrice(item.unitPrice * item.quantity)}
                            </li>
                        ))}
                    </ul>

                    <div className="admin-order-totals">
                        <p>
                            <span>Subtotal:</span>
                            <span>{formatPrice(selectedOrder.subtotal ?? 0)}</span>
                        </p>

                        {selectedOrder.discountAmount > 0 && (
                            <p>
                                <span>
                                    Descuento ({selectedOrder.discountPercentage}%):
                                </span>
                                <span>
                                    -{formatPrice(selectedOrder.discountAmount)}
                                </span>
                            </p>
                        )}

                        <p>
                            <span>Despacho:</span>
                            <span>{formatPrice(selectedOrder.shipping ?? 0)}</span>
                        </p>
                        <p>
                            <span>IVA incluido:</span>
                            <span>{formatPrice(selectedOrder.iva ?? 0)}</span>
                        </p>
                        <p className="admin-order-total">
                            <strong>Total:</strong>
                            <strong>{formatPrice(selectedOrder.total)}</strong>
                        </p>
                    </div>
                </section>
            )}
        </section>
    );
}