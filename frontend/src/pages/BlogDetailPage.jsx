import { Link, useParams } from 'react-router-dom';

const articles = {
    '1': {
        title: 'Cómo conservar mejor tus productos de pastelería',
        paragraphs: [
            'Guarda cada producto según sus ingredientes y las indicaciones entregadas al momento de la compra.',
            'Protege las tortas y postres de fuentes de calor y consúmelos dentro del tiempo recomendado para mantener su calidad.',
        ],
    },
    '2': {
        title: 'Ideas para elegir una torta para tu celebración',
        paragraphs: [
            'Considera cuántas personas compartirán la torta y qué sabores prefieren.',
            'También puedes revisar las categorías disponibles y elegir una opción que se ajuste a la ocasión.',
        ],
    },
};

export default function BlogDetailPage() {
    const { id } = useParams();
    const article = articles[id];

    if (!article) {
        return (
            <main className="blog-detail-page">
                <h1 className="h2">Artículo no encontrado</h1>
                <Link to="/blogs" className="btn btn-primary mt-3">
                    Volver al blog
                </Link>
            </main>
        );
    }

    return (
        <main className="blog-detail-page">
            <article className="blog-detail-page">
                <h1 className="h2 mb-4 blog-detail-title">{article.title}</h1>

                {article.paragraphs.map((paragraph) => (
                    <p className="blog-detail-paragraph" key={paragraph}>{paragraph}</p>
                ))}
            </article>

            <Link to="/blogs" className="btn btn-outline-primary mt-3">
                Volver al blog
            </Link>
        </main>
    );
}