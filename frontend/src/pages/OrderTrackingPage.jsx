import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../data/products.js';
import { getOrderByCode } from '../services/orderRepository.js';

export default function OrderTrackingPage() {
    const [code, setCode] = useState('');
    const [order, setOrder] = useState(null);
    const [searched, setSearched] = useState(false);

    function handleSubmit(event) {
        event.preventDefault();
        setOrder(getOrderByCode(code));
        setSearched(true);
    }

    return (
        <main className="tracking-page">
            <h1 className="h2 mb-3">Seguimiento de pedido</h1>
            <p className="text-secondary">
                Ingresa el número que aparece en tu boleta.
            </p>

            <form className="card card-body shadow-sm tracking-form" onSubmit={handleSubmit}>
                <label htmlFor="order-code" className="form-label">
                    Número de pedido
                </label>
                <div className="d-flex flex-column flex-sm-row gap-2">
                    <input
                        id="order-code"
                        className="form-control"
                        value={code}
                        onChange={(event) => setCode(event.target.value)}
                        placeholder="Ej.: MS-123456"
                        required
                    />
                    <button type="submit" className="btn btn-primary">
                        Buscar
                    </button>
                </div>
            </form>

            {searched && !order && (
                <div className="alert alert-warning mt-4" role="status">
                    No encontramos ese pedido en este navegador.
                </div>
            )}

            {order && (
                <section className="card mt-4 tracking-result">
                    <div className="card-body">
                        <h2 className="h4">Pedido {order.code}</h2>
                        <p>
                            Estado: <strong>Compra registrada</strong>
                        </p>
                        <ul>
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
                </section>
            )}

            <Link to="/categorias" className="btn btn-outline-primary mt-4">
                Volver a la tienda
            </Link>
        </main>
    );
}