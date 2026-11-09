import {
    getOrderByCode,
    getOrderHistory,
    listAllOrders,
    saveOrderToHistory,
} from '../services/orderRepository.js';

const STORAGE_KEY = 'mil-sabores-orders';

const sampleOrder = {
    code: 'MS-001',
    customer: {
        nombre: 'Cliente de prueba',
        email: 'cliente@example.com',
    },
    total: 10000,
    createdAt: '2026-01-10T12:00:00.000Z',
};

describe('orderRepository', () => {
    beforeEach(() => {
        localStorage.removeItem(STORAGE_KEY);
    });

    it('guarda un pedido y normaliza el correo de la cuenta', () => {
        const order = saveOrderToHistory({
            ...sampleOrder,
            accountEmail: '  CLIENTE@EXAMPLE.COM ',
        });

        expect(order.accountEmail).toBe('cliente@example.com');
        expect(getOrderByCode('MS-001')).toEqual(order);
    });

    it('asigna una fecha si el pedido no incluye createdAt', () => {
        const { createdAt, ...orderWithoutDate } = sampleOrder;

        const savedOrder = saveOrderToHistory(orderWithoutDate);

        expect(Number.isNaN(Date.parse(savedOrder.createdAt))).toBe(false);
    });

    it('rechaza un pedido sin código o sin correo de cliente', () => {
        expect(() => saveOrderToHistory({
            customer: { email: 'cliente@example.com' },
        })).toThrowError('El pedido necesita un código y un correo de cliente.');

        expect(() => saveOrderToHistory({
            code: 'MS-002',
            customer: {},
        })).toThrowError('El pedido necesita un código y un correo de cliente.');
    });

    it('reemplaza un pedido anterior que tenga el mismo código', () => {
        saveOrderToHistory(sampleOrder);
        saveOrderToHistory({ ...sampleOrder, total: 15000 });

        expect(listAllOrders().length).toBe(1);
        expect(getOrderByCode('MS-001').total).toBe(15000);
    });

    it('ordena todos los pedidos desde el más reciente', () => {
        saveOrderToHistory({
            ...sampleOrder,
            code: 'MS-ANTIGUO',
            createdAt: '2026-01-01T12:00:00.000Z',
        });
        saveOrderToHistory({
            ...sampleOrder,
            code: 'MS-RECIENTE',
            createdAt: '2026-02-01T12:00:00.000Z',
        });

        expect(listAllOrders().map((order) => order.code))
            .toEqual(['MS-RECIENTE', 'MS-ANTIGUO']);
    });

    it('busca el historial con el correo normalizado', () => {
        saveOrderToHistory(sampleOrder);

        expect(getOrderHistory('  CLIENTE@EXAMPLE.COM ').length).toBe(1);
        expect(getOrderHistory('')).toEqual([]);
    });

    it('busca un pedido por código sin distinguir mayúsculas', () => {
        saveOrderToHistory(sampleOrder);

        expect(getOrderByCode(' ms-001 ')).toEqual(
            jasmine.objectContaining({ code: 'MS-001' })
        );
        expect(getOrderByCode('')).toBeNull();
        expect(getOrderByCode('NO-EXISTE')).toBeNull();
    });

    it('devuelve listas vacías si el almacenamiento contiene JSON inválido', () => {
        localStorage.setItem(STORAGE_KEY, '{dato incorrecto');

        expect(listAllOrders()).toEqual([]);
        expect(getOrderHistory('cliente@example.com')).toEqual([]);
    });

    it('encuentra pedidos antiguos usando el correo del cliente y ordena los que no tienen fecha', () => {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify([
                {
                    code: 'MS-RECIENTE',
                    customer: { email: 'CLIENTE@example.com' },
                    createdAt: '2026-02-01T12:00:00.000Z',
                },
                {
                    code: 'MS-SIN-FECHA',
                    customer: { email: 'cliente@example.com' },
                },
            ])
        );

        const history = getOrderHistory(' cliente@example.com ');

        expect(history.map((order) => order.code))
            .toEqual(['MS-RECIENTE', 'MS-SIN-FECHA']);
    });
    it('solo muestra en el historial los pedidos del cliente correspondiente', () => {
        saveOrderToHistory({
            ...sampleOrder,
            code: 'MS-ANA',
            accountEmail: 'ana@example.com',
            customer: { nombre: 'Ana', email: 'ana@example.com' },
        });

        saveOrderToHistory({
            ...sampleOrder,
            code: 'MS-CAMILA',
            accountEmail: 'camila@example.com',
            customer: { nombre: 'Camila', email: 'camila@example.com' },
        });

        const history = getOrderHistory('ANA@example.com');

        expect(history.length).toBe(1);
        expect(history[0].code).toBe('MS-ANA');
    });

    it('devuelve resultados vacíos si el almacenamiento no contiene una lista de pedidos', () => {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ pedidos: [sampleOrder] })
        );

        expect(listAllOrders()).toEqual([]);
        expect(getOrderHistory('cliente@example.com')).toEqual([]);
        expect(getOrderByCode('MS-001')).toBeNull();
    });

});
