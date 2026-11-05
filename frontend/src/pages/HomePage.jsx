import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/products/ProductCard.jsx';
import heroImage from '../assets/hero.png';
import {
    listProducts,
    subscribeProducts,
} from '../services/productRepository.js';

export default function HomePage() {
    const [products, setProducts] = useState(() => listProducts());

    useEffect(() => {
        return subscribeProducts(() => setProducts(listProducts()));
    }, []);

    const featuredProducts = products.slice(0, 3);

    return (
        <main>
            <section className="row align-items-center g-4 mb-5">
                <div className="col-12 col-lg-6">
                    <p className="text-primary fw-semibold mb-2">
                        Pastelería Mil Sabores
                    </p>
                    <h1 className="display-5 fw-bold">
                        Un dulce momento para compartir
                    </h1>
                    <p className="lead text-secondary">
                        Encuentra tortas, postres y preparaciones para cada ocasión.
                    </p>
                    <Link to="/categorias" className="btn btn-primary btn-lg">
                        Ver productos
                    </Link>
                </div>

                <div className="col-12 col-lg-6">
                    <img
                        src={heroImage}
                        alt="Preparaciones de Pastelería Mil Sabores"
                        className="img-fluid rounded shadow-sm"
                    />
                </div>
            </section>

            <section>
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                    <h2 className="h3 mb-0">Algunos de nuestros productos</h2>
                    <Link to="/categorias">Ver catálogo completo</Link>
                </div>

                {featuredProducts.length > 0 ? (
                    <div className="row g-4">
                        {featuredProducts.map((product) => (
                            <div className="col-12 col-sm-6 col-lg-4" key={product.id}>
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Pronto encontrarás productos en nuestro catálogo.</p>
                )}
            </section>

            <section className="alert alert-light border mt-5">
                <h2 className="h4">Conoce nuestros beneficios</h2>
                <p>Revisa los descuentos disponibles para tus compras.</p>
                <Link to="/ofertas" className="btn btn-outline-primary">
                    Ver ofertas
                </Link>
            </section>
        </main>
    );
}