import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCard from '../components/products/ProductCard.jsx';
import { categories } from '../data/products.js';
import {
    listProducts,
    subscribeProducts,
} from '../services/productRepository.js';

export default function CategoryDetailPage() {
    const { id } = useParams();
    const [products, setProducts] = useState(() => listProducts());

    useEffect(() => {
        return subscribeProducts(() => setProducts(listProducts()));
    }, []);

    const category = categories.find((item) => item.id === id);
    const categoryProducts = products.filter(
        (product) => product.category === id
    );

    if (!category) {
        return (
            <main>
                <h1 className="h2">Categoría no encontrada</h1>
                <Link to="/categorias" className="btn btn-primary mt-3">
                    Volver a categorías
                </Link>
            </main>
        );
    }

    return (
        <main>
            <h1 className="h2 mb-3">{category.label}</h1>

            {categoryProducts.length > 0 ? (
                <div className="row g-4">
                    {categoryProducts.map((product) => (
                        <div className="col-12 col-sm-6 col-lg-4" key={product.id}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            ) : (
                <p>Aún no hay productos en esta categoría.</p>
            )}

            <Link to="/categorias" className="btn btn-outline-primary mt-4">
                Ver todas las categorías
            </Link>
        </main>
    );
}