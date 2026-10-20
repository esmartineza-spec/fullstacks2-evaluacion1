export const categories = [
    { id: 'todas', label: 'Todas' },
    { id: 'cuadradas', label: 'Tortas Cuadradas' },
    { id: 'circulares', label: 'Tortas Circulares' },
    { id: 'individuales', label: 'Postres Individuales' },
    { id: 'sin-azucar', label: 'Sin Azúcar' },
    { id: 'tradicional', label: 'Pastelería Tradicional' },
    { id: 'sin-gluten', label: 'Sin Gluten' },
    { id: 'vegana', label: 'Vegana' },
    { id: 'especiales', label: 'Tortas Especiales' },
];

export const initialProducts = [
    { id: 'TC001', name: 'Torta Cuadrada de Chocolate', category: 'cuadradas', price: 45000, description: 'Torta de chocolate con capas de ganache y avellanas.', image: '/img/producto_TC001.avif' },
    { id: 'TC002', name: 'Torta Cuadrada de Frutas', category: 'cuadradas', price: 50000, description: 'Frutas frescas de estación, crema chantilly y bizcocho de vainilla.', image: '/img/producto_TC002.avif' },
    { id: 'TT001', name: 'Torta Circular de Vainilla', category: 'circulares', price: 40000, description: 'Bizcocho de vainilla con crema pastelera y glaseado tradicional.', image: '/img/producto_TT001.avif' },
    { id: 'TT002', name: 'Torta Circular de Manjar', category: 'circulares', price: 42000, description: 'Torta chilena de manjar artesanal y nueces.', image: '/img/producto_TT002.avif' },
    { id: 'PI001', name: 'Mousse de Chocolate', category: 'individuales', price: 5000, description: 'Postre individual cremoso de chocolate.', image: '/img/producto_PI001.jpg' },
    { id: 'PI002', name: 'Tiramisú Clásico', category: 'individuales', price: 5500, description: 'Postre individual con café, mascarpone y cacao.', image: '/img/producto_PI002.avif' },
    { id: 'PSA001', name: 'Torta Sin Azúcar de Naranja', category: 'sin-azucar', price: 48000, description: 'Torta de naranja para quienes buscan una opción sin azúcar.', image: '/img/producto_PSA001.avif' },
    { id: 'PSA002', name: 'Cheesecake Sin Azúcar', category: 'sin-azucar', price: 47000, description: 'Cheesecake cremoso sobre una base de frutos secos.', image: '/img/producto_PSA002.avif' },
    { id: 'PT001', name: 'Empanada de Manzana', category: 'tradicional', price: 3000, description: 'Empanada horneada de manzana especiada con canela.', image: '/img/producto_PT001.avif' },
    { id: 'PT002', name: 'Tarta de Santiago', category: 'tradicional', price: 6000, description: 'Tarta tradicional de almendras con azúcar flor.', image: '/img/producto_PT002.avif' },
    { id: 'PG001', name: 'Brownie Sin Gluten', category: 'sin-gluten', price: 4000, description: 'Brownie húmedo de chocolate elaborado sin gluten.', image: '/img/producto_PG001.avif' },
    { id: 'PG002', name: 'Pan Sin Gluten', category: 'sin-gluten', price: 3500, description: 'Panadería artesanal sin gluten.', image: '/img/producto_PG002.avif' },
    { id: 'PV001', name: 'Torta Vegana de Chocolate', category: 'vegana', price: 50000, description: 'Torta de chocolate elaborada sin ingredientes de origen animal.', image: '/img/producto_PV001.avif' },
    { id: 'PV002', name: 'Galletas Veganas de Avena', category: 'vegana', price: 4500, description: 'Galletas de avena con pasas y semillas.', image: '/img/producto_PV002.avif' },
    { id: 'TE001', name: 'Torta Especial de Cumpleaños', category: 'especiales', price: 55000, description: 'Torta de manjar y chantilly decorada para celebraciones.', image: '/img/producto_TE001.avif' },
    { id: 'TE002', name: 'Torta Especial de Boda', category: 'especiales', price: 60000, description: 'Torta de varios pisos con decoración artesanal.', image: '/img/producto_TE002.jpg' },
];

export function formatPrice(price) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        maximumFractionDigits: 0,
    }).format(price);
}