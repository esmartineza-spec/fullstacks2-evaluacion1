const ORDERS_KEY = 'mil-sabores-orders';

function readOrders() {
    try {
        const savedOrders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
        return Array.isArray(savedOrders) ? savedOrders : [];
    } catch {
        return [];
    }
}

function saveOrders(orders) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function saveOrderToHistory(order) {
    if (!order?.code || !order?.customer?.email) {
        throw new Error('El pedido necesita un código y un correo de cliente.');
    }

    const accountEmail = (
        order.accountEmail || order.customer.email
    ).trim().toLowerCase();

    const orderToSave = {
        ...order,
        accountEmail,
        createdAt: order.createdAt || new Date().toISOString(),
    };

    const previousOrders = readOrders().filter(
        (savedOrder) => savedOrder.code !== orderToSave.code
    );

    saveOrders([orderToSave, ...previousOrders]);

    return orderToSave;
}

export function getOrderHistory(email) {
    const normalizedEmail = String(email || '').trim().toLowerCase();

    if (!normalizedEmail) return [];

    return readOrders()
        .filter((order) => {
            const orderEmail = String(
                order.accountEmail || order.customer?.email || ''
            ).trim().toLowerCase();

            return orderEmail === normalizedEmail;
        })
        .sort(
            (a, b) =>
                new Date(b.createdAt || 0).getTime() -
                new Date(a.createdAt || 0).getTime()
        );
}