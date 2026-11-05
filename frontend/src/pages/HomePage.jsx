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
        <div className="home-page">
            <section className="hero-section">
                <div className="hero-grid">
                    <div className="hero-content">
                        <p className="hero-kicker">Pastelería Mil Sabores</p>
                        <h1 className="hero-title">
                            Un dulce momento
                            <span className="highlight-cursive">
                                para compartir
                            </span>
                        </h1>
                        <p className="hero-description">
                            Encuentra tortas, postres y preparaciones para cada ocasión.
                        </p>
                        <div className="hero-buttons">
                            <Link to="/categorias" className="btn btn-primary btn-lg">
                                Ver productos
                            </Link>
                            <Link to="/ofertas" className="btn btn-outline-primary btn-lg">
                                Ver beneficios
                            </Link>
                        </div>
                    </div>

                    <div className="hero-image-wrapper">
                        <div className="hero-card">
                            <img
                                src="/img/hero_mockup.png"
                                alt="Torta de chocolate decorada para una celebración"
                            />
                            <span className="ribbon-discount">
                                10% · FELICES50
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="featured-section">
                <div className="home-section-heading">
                    <div>
                        <p className="hero-kicker">Conoce la tienda</p>
                        <h2 className="section-title">Algunos de nuestros productos</h2>
                    </div>
                    <Link to="/categorias" className="home-catalog-link">
                        Ver catálogo completo
                    </Link>
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
                    <p className="text-secondary">
                        Pronto encontrarás productos en nuestro catálogo.
                    </p>
                )}
            </section>

            <section className="home-promo-section">
                <div>
                    <p className="hero-kicker">Beneficios disponibles</p>
                    <h2>Un detalle dulce para tu próxima compra</h2>
                    <p>
                        Revisa los descuentos y sus condiciones antes de realizar tu pedido.
                    </p>
                </div>
                <Link to="/ofertas" className="btn btn-primary">
                    Conocer ofertas
                </Link>
            </section>
        </div>
    );
}