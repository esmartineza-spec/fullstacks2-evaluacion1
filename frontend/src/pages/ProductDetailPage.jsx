import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { formatPrice } from '../data/products.js';
import { getProductById } from '../services/productRepository.js';
import { addToCart } from '../services/cartRepository.js';

export default function ProductDetailPage() {
    const { id } = useParams();
    const [message, setMessage] = useState('');
    const product = getProductById(id);

    function handleAddToCart() {
        try {
            addToCart(product.id);
            setMessage(`${product.name} se agregó al carrito.`);
        } catch (error) {
            setMessage(error.message);
        }
    }

    if (!product) {
        return (
            <section className="card border-0 shadow-sm p-4">
                <h1 className="h3">Producto no encontrado</h1>
                <p className="text-secondary">
                    No encontramos un producto con ese código.
                </p>
                <Link to="/categorias" className="btn btn-outline-primary align-self-start">
                    Volver a categorías
                </Link>
            </section>
        );
    }

    return (
        <section className="card border-0 shadow-sm overflow-hidden">
            <div className="row g-0">
                <div className="col-md-6">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-100 h-100"
                        style={{ objectFit: 'cover', minHeight: 320 }}
                    />
                </div>

                <div className="col-md-6">
                    <div className="card-body p-4 p-lg-5">
                        <p className="small text-secondary">{product.category}</p>
                        <h1 className="h2">{product.name}</h1>
                        <p>{product.description}</p>
                        <p className="fs-4 fw-bold">{formatPrice(product.price)}</p>

                        <button
                            type="button"
                            className="btn btn-primary me-2"
                            onClick={handleAddToCart}
                        >
                            Agregar al carrito
                        </button>

                        <Link to="/categorias" className="btn btn-outline-primary">
                            Volver a categorías
                        </Link>

                        {message && (
                            <p className="mt-3 mb-0 text-success" role="status">
                                {message}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}