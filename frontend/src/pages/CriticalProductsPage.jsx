import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../data/products.js';
import {
    listProducts,
    subscribeProducts,
} from '../services/productRepository.js';

const CRITICAL_STOCK_LIMIT = 5;

export default function CriticalProductsPage() {
    const [products, setProducts] = useState(() => listProducts());

    useEffect(() => {
        return subscribeProducts(() => setProducts(listProducts()));
    }, []);

    const criticalProducts = products.filter(
        (product) => product.stock <= CRITICAL_STOCK_LIMIT
    );

    return (
        <section className="admin-page">
            <header className="admin-dashboard-header">
                <div>
                    <p className="catalog-eyebrow">Administración</p>
                    <h1 className="h2">Productos críticos</h1>
                    <p className="text-secondary">
                        Se consideran críticos los productos con {CRITICAL_STOCK_LIMIT} unidades o menos.
                    </p>
                </div>

                <Link to="/admin/productos" className="btn btn-primary">
                    Administrar stock
                </Link>
            </header>

            <div className="card admin-panel admin-products-panel">
                {criticalProducts.length === 0 ? (
                    <p className="text-secondary mb-0">
                        No hay productos con stock crítico.
                    </p>
                ) : (
                    <div className="table-responsive">
                        <table className="table admin-table align-middle">
                            <thead>
                            <tr>
                                <th>Código</th>
                                <th>Producto</th>
                                <th>Stock disponible</th>
                                <th>Precio</th>
                                <th>Estado</th>
                            </tr>
                            </thead>
                            <tbody>
                            {criticalProducts.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td>{product.name}</td>
                                    <td>{product.stock}</td>
                                    <td>{formatPrice(product.price)}</td>
                                    <td>
                                        {product.stock === 0 ? 'Sin stock' : 'Stock bajo'}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </section>
    );
}