// Repositorio simulado de usuarios para el frontend.
// En una aplicación real, contraseñas y roles se validarían en un backend.
const USERS_KEY = 'usuarios_mil_sabores_lista';
const SESSION_KEY = 'usuario_mil_sabores_activo';
const AUTH_EVENT = 'mil-sabores:auth-changed';

// Cuenta de demostración para probar el flujo administrativo durante la presentación.
const DEMO_ADMIN = {
    nombre: 'Administración Mil Sabores',
    email: 'admin@milsabores.cl',
    password: 'Admin123!',
    role: 'admin',
    fechaNacimiento: '', edad: 0, descuentoSenior: false,
    esEstudianteDuoc: false, telefono: '', direccion: '',
};

function readUsers() {
    try {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        return Array.isArray(users) ? users : [];
    } catch {
        return [];
    }
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function ensureDemoAdmin() {
    const users = readUsers();
    if (!users.some((user) => user.email?.toLowerCase() === DEMO_ADMIN.email)) {
        saveUsers([...users, DEMO_ADMIN]);
    }
}

function notifyAuthChange() {
    window.dispatchEvent(new Event(AUTH_EVENT));
}

export function calculateAge(birthDate) {
    if (!birthDate) return 0;
    const date = new Date(birthDate + 'T00:00:00');
    if (Number.isNaN(date.getTime())) return 0;
    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    if (today.getMonth() < date.getMonth() ||
        (today.getMonth() === date.getMonth() && today.getDate() < date.getDate())) age -= 1;
    return age;
}

export function listUsers() {
    ensureDemoAdmin();
    return readUsers().map(({ password, ...user }) => user);
}

export function getCurrentUser() {
    try {
        const user = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
        if (!user) return null;
        const { password, ...safeUser } = user;
        return safeUser;
    } catch {
        return null;
    }
}

export function registerUser({ nombre = '', email = '', password = '', fechaNacimiento = '', telefono = '', direccion = '' }) {
    const normalizedEmail = email.trim().toLowerCase();
    if (nombre.trim().length < 3) throw new Error('El nombre debe tener al menos 3 caracteres.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) throw new Error('Ingresa un correo válido.');
    if (password.length < 8) throw new Error('La contraseña debe tener al menos 8 caracteres.');
    if (fechaNacimiento && calculateAge(fechaNacimiento) < 0) throw new Error('La fecha de nacimiento no puede estar en el futuro.');

    ensureDemoAdmin();
    const users = readUsers();
    if (users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
        throw new Error('Ya existe una cuenta con ese correo.');
    }
    const age = calculateAge(fechaNacimiento);
    const user = {
        nombre: nombre.trim(), email: normalizedEmail, password, fechaNacimiento,
        edad: age, descuentoSenior: age >= 50,
        esEstudianteDuoc: normalizedEmail.endsWith('@duocuc.cl'),
        role: 'customer', telefono: telefono.trim(), direccion: direccion.trim(),
    };
    saveUsers([...users, user]);
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    notifyAuthChange();
    return getCurrentUser();
}

export function loginUser(email = '', password = '') {
    ensureDemoAdmin();
    const normalizedEmail = email.trim().toLowerCase();
    const user = readUsers().find((item) => item.email.toLowerCase() === normalizedEmail && item.password === password);
    if (!user) throw new Error('Correo o contraseña incorrectos.');
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    notifyAuthChange();
    return getCurrentUser();
}

export function logoutUser() {
    localStorage.removeItem(SESSION_KEY);
    notifyAuthChange();
}

export function isAdmin() {
    return getCurrentUser()?.role === 'admin';
}

export const demoAdminCredentials = {
    email: DEMO_ADMIN.email,
    password: DEMO_ADMIN.password,
};