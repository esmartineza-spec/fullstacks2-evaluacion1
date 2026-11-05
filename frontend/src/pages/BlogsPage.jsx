import { Link } from 'react-router-dom';

const articles = [
    {
        id: '1',
        title: 'Cómo conservar mejor tus productos de pastelería',
        summary:
            'Algunos consejos generales para mantener la frescura de tortas y postres.',
    },
    {
        id: '2',
        title: 'Ideas para elegir una torta para tu celebración',
        summary:
            'Aspectos que puedes considerar al escoger una torta para compartir.',
    },
];

export default function BlogsPage() {
    return (
        <main>
            <h1 className="h2 mb-3">Blog Mil Sabores</h1>
            <p className="text-secondary mb-4">
                Ideas y consejos para disfrutar la pastelería.
            </p>

            <div className="row g-4">
                {articles.map((article) => (
                    <div className="col-12 col-md-6" key={article.id}>
                        <article className="card h-100 shadow-sm">
                            <div className="card-body d-flex flex-column">
                                <h2 className="h4">{article.title}</h2>
                                <p>{article.summary}</p>
                                <Link
                                    to={`/blogs/${article.id}`}
                                    className="btn btn-outline-primary align-self-start mt-auto"
                                >
                                    Leer artículo
                                </Link>
                            </div>
                        </article>
                    </div>
                ))}
            </div>
        </main>
    );
}