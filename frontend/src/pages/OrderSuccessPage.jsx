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
            <section className="card border-0 shadow-sm p-4">
                <h1 className="h2">No hay una compra reciente</h1>
                <Link to="/categorias" className="btn btn-primary align-self-start">
                    Volver a la tienda
                </Link>
            </section>
        );
    }

    return (
        <section className="card border-0 shadow-sm p-4 p-md-5">
            <p className="text-success fw-bold">¡Compra registrada!</p>
            <h1 className="h2">Gracias, {order.customer.name}</h1>
            <p>Tu número de pedido es <strong>{order.code}</strong>.</p>

            <h2 className="h5 mt-3">Productos</h2>
            {order.items.map((item) => (
                <p key={item.productId}>
                    {item.name} × {item.quantity} — {formatPrice(item.unitPrice * item.quantity)}
                </p>
            ))}

            <p className="fs-5 fw-bold">Total: {formatPrice(order.total)}</p>
            <p className="text-secondary">Medio de pago: {order.customer.paymentMethod}</p>

            <Link to="/categorias" className="btn btn-primary align-self-start">
                Volver a la tienda
            </Link>
        </section>
    );
}