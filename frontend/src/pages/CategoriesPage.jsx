import { useEffect, useState } from 'react';
import ProductCard from '../components/products/ProductCard.jsx';
import { categories } from '../data/products.js';
import {
    listProducts,
    subscribeProducts,
} from '../services/productRepository.js';

export default function CategoriesPage() {
    const [products, setProducts] = useState(() => listProducts());
    const [selectedCategory, setSelectedCategory] = useState('todas');
    const [search, setSearch] = useState('');

    useEffect(() => {
        return subscribeProducts(() => {
            setProducts(listProducts());
        });
    }, []);

    const visibleProducts = products.filter((product) => {
        const matchesCategory =
            selectedCategory === 'todas' || product.category === selectedCategory;

        const searchText = search.trim().toLowerCase();
        const matchesSearch =
            !searchText ||
            `${product.id} ${product.name} ${product.description}`
                .toLowerCase()
                .includes(searchText);

        return matchesCategory && matchesSearch;
    });

    return (
        <>
            <div className="mb-4">
                <h1 className="h2">Nuestro catálogo</h1>
                <p className="text-secondary">
                    Busca una creación o filtra por categoría.
                </p>
            </div>

            <label htmlFor="product-search" className="form-label">
                Buscar productos
            </label>
            <input
                id="product-search"
                className="form-control mb-3"
                type="search"
                placeholder="Ej.: chocolate, brownie o TC001"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
            />

            <div className="d-flex flex-wrap gap-2 mb-4" aria-label="Filtrar categorías">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        type="button"
                        className={`btn ${
                            selectedCategory === category.id ? 'btn-primary' : 'btn-outline-primary'
                        }`}
                        aria-pressed={selectedCategory === category.id}
                        onClick={() => setSelectedCategory(category.id)}
                    >
                        {category.label}
                    </button>
                ))}
            </div>

            <p role="status" className="text-secondary">
                {visibleProducts.length} producto(s) encontrados
            </p>

            {visibleProducts.length > 0 ? (
                <div className="row g-4">
                    {visibleProducts.map((product) => (
                        <div className="col-12 col-sm-6 col-lg-4" key={product.id}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="alert alert-info" role="status">
                    No encontramos productos con esos criterios.
                </div>
            )}
        </>
    );
}