import { useEffect, useState } from 'react';
import ProductCard from '../components/products/ProductCard.jsx';
import {
    listProducts,
    subscribeProducts,
} from '../services/productRepository.js';
import {
    listCategories,
    subscribeCategories,
} from '../services/categoryRepository.js';

export default function CategoriesPage() {
    const [products, setProducts] = useState(() => listProducts());
    const [selectedCategory, setSelectedCategory] = useState('todas');
    const [search, setSearch] = useState('');
    const [categories, setCategories] = useState(() => [
        { id: 'todas', label: 'Todas' },
        ...listCategories(),
    ]);

    useEffect(() => {
        return subscribeProducts(() => setProducts(listProducts()));
    }, []);
    useEffect(() => {
        return subscribeCategories(() => {
            setCategories([
                { id: 'todas', label: 'Todas' },
                ...listCategories(),
            ]);
        });
    }, []);


    const visibleProducts = products.filter((product) => {
        const matchesCategory =
            selectedCategory === 'todas' ||
            product.category === selectedCategory;

        const searchText = search.trim().toLowerCase();
        const matchesSearch =
            !searchText ||
            `${product.id} ${product.name} ${product.description}`
                .toLowerCase()
                .includes(searchText);

        return matchesCategory && matchesSearch;
    });

    return (
        <section className="catalog-page">
            <header className="catalog-header-section">
                <p className="catalog-eyebrow">Hecho para compartir</p>
                <h1 className="catalog-title">Nuestro catálogo</h1>
                <p className="catalog-description">
                    Busca una creación o explora nuestras categorías de pastelería.
                </p>
            </header>

            <div className="catalog-search">
                <label htmlFor="product-search" className="form-label">
                    Buscar productos
                </label>
                <input
                    id="product-search"
                    className="form-control"
                    type="search"
                    placeholder="Ej.: chocolate, brownie o TC001"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                />
            </div>

            <div className="catalog-filters" aria-label="Filtrar categorías">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        type="button"
                        className={`btn catalog-filter ${
                            selectedCategory === category.id ? 'active' : ''
                        }`}
                        aria-pressed={selectedCategory === category.id}
                        onClick={() => setSelectedCategory(category.id)}
                    >
                        {category.label}
                    </button>
                ))}
            </div>

            <div className="catalog-results">
                <span role="status">
                    {visibleProducts.length} producto(s) encontrados
                </span>
                {(search || selectedCategory !== 'todas') && (
                    <button
                        type="button"
                        className="catalog-clear"
                        onClick={() => {
                            setSearch('');
                            setSelectedCategory('todas');
                        }}
                    >
                        Limpiar filtros
                    </button>
                )}
            </div>

            {visibleProducts.length > 0 ? (
                <div className="row g-4">
                    {visibleProducts.map((product) => (
                        <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={product.id}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="catalog-empty" role="status">
                    <span aria-hidden="true">✦</span>
                    <h2 className="h4">No encontramos productos</h2>
                    <p>Prueba con otra búsqueda o categoría.</p>
                </div>
            )}
        </section>
    );
}