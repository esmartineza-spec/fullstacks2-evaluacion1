import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCard from '../components/products/ProductCard.jsx';
import {
    listCategories,
    subscribeCategories,
} from '../services/categoryRepository.js';
import {
    listProducts,
    subscribeProducts,
} from '../services/productRepository.js';

export default function CategoryDetailsPage() {
    const { id } = useParams();
    const [products, setProducts] = useState(() => listProducts());
    const [categories, setCategories] = useState(() => listCategories());

    useEffect(() => {
        return subscribeProducts(() => setProducts(listProducts()));
    }, []);
    useEffect(() => {
        return subscribeCategories(() => setCategories(listCategories()));
    }, []);

    const category = categories.find((item) => item.id === id);
    const categoryProducts = products.filter(
        (product) => product.category === id
    );

    if (!category) {
        return (
            <section className="category-detail-empty">
                <p className="catalog-eyebrow">Catálogo Mil Sabores</p>
                <h1 className="h2">Categoría no encontrada</h1>
                <Link to="/categorias" className="btn btn-primary mt-3">
                    Volver a categorías
                </Link>
            </section>
        );
    }

    return (
        <div className="category-detail-page">
            <nav className="category-breadcrumb" aria-label="Ruta de navegación">
                <Link to="/">Inicio</Link>
                <span aria-hidden="true">/</span>
                <Link to="/categorias">Categorías</Link>
                <span aria-hidden="true">/</span>
                <span aria-current="page">{category.label}</span>
            </nav>

            <header className="category-detail-header">
                <p className="catalog-eyebrow">Explora nuestros sabores</p>
                <h1 className="category-detail-title">{category.label}</h1>
                <p className="text-secondary">
                    {categoryProducts.length} producto(s) en esta categoría.
                </p>
            </header>

            {categoryProducts.length > 0 ? (
                <div className="row g-4">
                    {categoryProducts.map((product) => (
                        <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={product.id}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="category-detail-empty">
                    <h2 className="h4">Aún no hay productos aquí</h2>
                    <p className="text-secondary">
                        Pronto tendremos nuevas preparaciones en esta categoría.
                    </p>
                </div>
            )}

            <Link to="/categorias" className="btn btn-outline-primary mt-4">
                Ver todas las categorías
            </Link>
        </div>
    );
}