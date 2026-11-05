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

    useEffect(() => subscribeCart(() => setCart(getCart())), []);

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
            <section className="cart-empty">
                <span className="cart-empty-icon" aria-hidden="true">✦</span>
                <h1 className="h2">Tu carrito está esperando algo rico</h1>
                <p className="text-secondary mb-4">
                    Todavía no tienes productos en el carrito.
                </p>
                <Link to="/categorias" className="btn btn-primary">
                    Explorar productos
                </Link>
            </section>
        );
    }

    return (
        <section className="cart-page">
            <div className="cart-page-heading">
                <div>
                    <p className="catalog-eyebrow">Tu selección</p>
                    <h1 className="h2 mb-0">Tu carrito</h1>
                </div>
                <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={clearCart}
                >
                    Vaciar carrito
                </button>
            </div>

            <div className="cart-layout">
                <div className="cart-items">
                    {items.map(({ product, quantity }) => (
                        <article className="cart-item-card" key={product.id}>
                            <img
                                src={product.image}
                                alt={product.name}
                                className="cart-item-image"
                            />

                            <div className="cart-item-info">
                                <p className="product-card-category">
                                    Código {product.id}
                                </p>
                                <h2 className="h5">{product.name}</h2>
                                <p className="text-secondary mb-2">
                                    {formatPrice(product.price)} por unidad
                                </p>

                                <div className="cart-quantity">
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary btn-sm"
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
                                    <span aria-live="polite">Cantidad: {quantity}</span>
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary btn-sm"
                                        aria-label={`Agregar una unidad de ${product.name}`}
                                        onClick={() =>
                                            updateCartQuantity(product.id, quantity + 1)
                                        }
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="cart-item-total">
                                <strong>{formatPrice(product.price * quantity)}</strong>
                                <button
                                    type="button"
                                    className="cart-remove"
                                    onClick={() => removeFromCart(product.id)}
                                >
                                    Quitar
                                </button>
                            </div>
                        </article>
                    ))}
                </div>

                <aside className="cart-summary">
                    <h2 className="h4">Resumen</h2>
                    <div className="cart-summary-row">
                        <span>Productos ({items.length})</span>
                        <span>{formatPrice(total)}</span>
                    </div>
                    <div className="cart-summary-row cart-summary-total">
                        <strong>Total parcial</strong>
                        <strong>{formatPrice(total)}</strong>
                    </div>
                    <p className="small text-secondary">
                        Descuentos y despacho se calcularán durante el checkout.
                    </p>
                    <Link to="/checkout" className="btn btn-primary w-100">
                        Continuar compra
                    </Link>
                    <Link to="/categorias" className="cart-continue-link">
                        Seguir comprando
                    </Link>
                </aside>
            </div>
        </section>
    );
}