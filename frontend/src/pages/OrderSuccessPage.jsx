import { Link } from 'react-router-dom';
import { formatPrice } from '../data/products.js';

function getLastOrder() {
    try {
        return JSON.parse(localStorage.getItem('mil-sabores-last-order'));
    } catch {
        return null;
    }
}

export default function OrderSuccessPage() {
    const order = getLastOrder();

    if (!order) {
        return (
            <section className="receipt-empty">
                <h1 className="h2">No hay una compra reciente</h1>
                <Link to="/categorias" className="btn btn-primary">
                    Volver a la tienda
                </Link>
            </section>
        );
    }

    return (
        <section className="receipt-page">
            <div className="receipt-actions no-print">
                <div>
                    <p className="catalog-eyebrow">Compra registrada</p>
                    <h1 className="h2">Gracias, {order.customer.name}</h1>
                    <p className="text-secondary">
                        Guarda el número de pedido para consultar su registro.
                    </p>
                </div>

                <div className="d-flex flex-wrap gap-2">
                    <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => window.print()}
                    >
                        Imprimir / Guardar PDF
                    </button>
                    <Link to="/pedido" className="btn btn-primary">
                        Consultar pedido
                    </Link>
                </div>
            </div>

            <article className="receipt-card">
                <header className="receipt-header">
                    <div>
                        <p className="catalog-eyebrow mb-1">Comprobante de compra</p>
                        <h2 className="receipt-brand">Pastelería Mil Sabores</h2>
                        <p className="text-secondary mb-0">
                            Resumen de la compra realizada en esta tienda.
                        </p>
                    </div>

                    <div className="receipt-order-code">
                        <span>Número de pedido</span>
                        <strong>{order.code}</strong>
                    </div>
                </header>

                <section className="receipt-customer">
                    <h3 className="h5">Datos de compra</h3>
                    <p><strong>Cliente:</strong> {order.customer.name}</p>
                    <p><strong>Correo:</strong> {order.customer.email}</p>
                    <p><strong>Teléfono:</strong> {order.customer.phone}</p>
                    <p className="mb-0">
                        <strong>Despacho:</strong> {order.customer.address}, {order.customer.commune}
                    </p>
                </section>

                <section className="receipt-products">
                    <h3 className="h5">Productos</h3>

                    {order.items.map((item) => (
                        <div className="receipt-product-row" key={item.productId}>
                            <span>
                                {item.name} × {item.quantity}
                            </span>
                            <span>
                                {formatPrice(item.unitPrice * item.quantity)}
                            </span>
                        </div>
                    ))}
                </section>

                <section className="receipt-totals">
                    <p>
                        <span>Subtotal:</span>
                        <span>{formatPrice(order.subtotal ?? 0)}</span>
                    </p>

                    {order.discountAmount > 0 && (
                        <p className="receipt-discount">
                            <span>
                                Descuento ({order.discountPercentage}% · {order.discountReason}):
                            </span>
                            <span>-{formatPrice(order.discountAmount)}</span>
                        </p>
                    )}

                    <p>
                        <span>Despacho:</span>
                        <span>{formatPrice(order.shipping ?? 0)}</span>
                    </p>

                    <p className="receipt-iva">
                        <span>IVA incluido:</span>
                        <span>{formatPrice(order.iva ?? 0)}</span>
                    </p>

                    <p className="receipt-total">
                        <strong>Total:</strong>
                        <strong>{formatPrice(order.total)}</strong>
                    </p>

                    <p className="text-secondary mb-0">
                        Medio de pago: {order.customer.paymentMethod}
                    </p>
                </section>

                <footer className="receipt-footer">
                    Comprobante demostrativo generado por la aplicación para la evaluación.
                </footer>
            </article>

            <div className="text-center mt-4 no-print">
                <Link to="/categorias" className="btn btn-outline-primary">
                    Volver a la tienda
                </Link>
            </div>
        </section>
    );
}