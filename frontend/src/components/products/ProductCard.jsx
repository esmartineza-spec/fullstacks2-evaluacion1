import { Link } from 'react-router-dom';
import { formatPrice } from '../../data/products.js';

export default function ProductCard({ product }) {
    return (
        <article className="card h-100 shadow-sm">
            <img
                src={product.image}
                alt={product.name}
                className="card-img-top"
                style={{ height: 210, objectFit: 'cover' }}
            />
            <div className="card-body d-flex flex-column">
                <p className="small text-secondary mb-1">{product.category}</p>
                <h2 className="h5">{product.name}</h2>
                <p className="text-secondary">{product.description}</p>
                <p className="fw-bold mt-auto">{formatPrice(product.price)}</p>
                <Link
                    to={`/productos/${product.id}`}
                    className="btn btn-outline-primary"
                >
                    Ver detalle
                </Link>
            </div>
        </article>
    );
}