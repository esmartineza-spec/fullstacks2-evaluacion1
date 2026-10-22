import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../data/products.js';
import {
    clearCart,
    getCart,
    removeFromCart,
    subscribeCart,
    updateCartQuantity,
} from '../services/cartRepository.js';
import { getProductById } from '../services/productRepository.js';

export default function CartPage() {
    const [cart, setCart] = useState(() => getCart());

    useEffect(() => {
        return subscribeCart(() => setCart(getCart()));
    }, []);

    const items = cart
        .map((item) => ({
            ...item,
            product: getProductById(item.productId),
        }))
        .filter((item) => item.product);

    const total = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    if (items.length === 0) {
        return (
            <section className="card border-0 shadow-sm p-4">
                <h1 className="h2">Tu carrito</h1>
                <p className="text-secondary">Todavía no tienes productos en el carrito.</p>
                <Link to="/categorias" className="btn btn-primary align-self-start">
                    Ver productos
                </Link>
            </section>
        );
    }

    return (
        <section>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h2 mb-0">Tu carrito</h1>
                <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={clearCart}
                >
                    Vaciar carrito
                </button>
            </div>

            <div className="list-group mb-4">
                {items.map(({ product, quantity }) => (
                    <article
                        key={product.id}
                        className="list-group-item p-3"
                    >
                        <div className="row align-items-center g-3">
                            <div className="col-4 col-md-2">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="img-fluid rounded"
                                />
                            </div>

                            <div className="col-8 col-md-4">
                                <h2 className="h5">{product.name}</h2>
                                <p className="text-secondary mb-0">
                                    {formatPrice(product.price)} por unidad
                                </p>
                            </div>

                            <div className="col-6 col-md-3">
                                <div className="d-flex align-items-center gap-2">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary btn-sm"
                                        aria-label={`Quitar una unidad de ${product.name}`}
                                        onClick={() => {
                                            if (quantity === 1) {
                                                removeFromCart(product.id);
                                            } else {
                                                updateCartQuantity(product.id, quantity - 1);
                                            }
                                        }}
                                    >
                                        −
                                    </button>
                                    <span>Cantidad: {quantity}</span>
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary btn-sm"
                                        aria-label={`Agregar una unidad de ${product.name}`}
                                        onClick={() =>
                                            updateCartQuantity(product.id, quantity + 1)
                                        }
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="col-6 col-md-3 text-md-end">
                                <p className="fw-bold mb-2">
                                    {formatPrice(product.price * quantity)}
                                </p>
                                <button
                                    type="button"
                                    className="btn btn-link text-danger p-0"
                                    onClick={() => removeFromCart(product.id)}
                                >
                                    Quitar
                                </button>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
                <Link to="/categorias" className="btn btn-outline-primary">
                    Seguir comprando
                </Link>

                <div className="text-sm-end">
                    <p className="fs-5 fw-bold mb-2">Total: {formatPrice(total)}</p>
                    <Link to="/checkout" className="btn btn-primary">
                        Continuar compra
                    </Link>
                </div>
            </div>
        </section>
    );
}