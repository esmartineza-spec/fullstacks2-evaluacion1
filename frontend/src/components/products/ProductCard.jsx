import { Link } from 'react-router-dom';
import { categories, formatPrice } from '../../data/products.js';

export default function ProductCard({ product }) {
    const categoryLabel =
        categories.find((category) => category.id === product.category)?.label
        ?? product.category;

    return (
        <article className="card product-card h-100">
            <div className="product-card-image">
                <img src={product.image} alt={product.name} />
                <span className="product-card-code">{product.id}</span>
            </div>

            <div className="card-body product-card-body">
                <p className="product-card-category">{categoryLabel}</p>
                <h2 className="product-card-title">{product.name}</h2>
                <p className="product-card-description">{product.description}</p>

                <div className="product-card-footer">
                    <span className="product-card-price">
                        {formatPrice(product.price)}
                    </span>
                    <Link
                        to={`/productos/${product.id}`}
                        className="btn btn-outline-primary"
                    >
                        Ver detalle
                    </Link>
                </div>
            </div>
        </article>
    );
}