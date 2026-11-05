import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { categories, formatPrice } from '../data/products.js';
import { addToCart } from '../services/cartRepository.js';
import { getProductById } from '../services/productRepository.js';

export default function ProductDetailPage() {
    const { id } = useParams();
    const [message, setMessage] = useState('');
    const product = getProductById(id);

    if (!product) {
        return (
            <section className="product-not-found">
                <p className="catalog-eyebrow">Mil Sabores</p>
                <h1 className="h2">Producto no encontrado</h1>
                <p className="text-secondary">
                    No encontramos un producto con ese código.
                </p>
                <Link to="/categorias" className="btn btn-primary">
                    Volver al catálogo
                </Link>
            </section>
        );
    }

    const categoryLabel =
        categories.find((category) => category.id === product.category)?.label
        ?? product.category;

    function handleAddToCart() {
        try {
            addToCart(product.id);
            setMessage(`${product.name} se agregó al carrito.`);
        } catch (error) {
            setMessage(error.message);
        }
    }

    return (
        <section className="product-detail-card">
            <div className="product-detail-image">
                <img src={product.image} alt={product.name} />
                <span className="product-card-code">{product.id}</span>
            </div>

            <div className="product-detail-content">
                <Link to="/categorias" className="product-back-link">
                    ← Volver al catálogo
                </Link>

                <p className="product-card-category mt-4">{categoryLabel}</p>
                <h1 className="product-detail-title">{product.name}</h1>
                <p className="product-detail-description">{product.description}</p>
                <p className="product-detail-price">{formatPrice(product.price)}</p>

                <button
                    type="button"
                    className="btn btn-primary btn-lg"
                    onClick={handleAddToCart}
                >
                    Agregar al carrito
                </button>

                {message && (
                    <p className="alert alert-success mt-3 mb-0" role="status">
                        {message}
                    </p>
                )}
            </div>
        </section>
    );
}