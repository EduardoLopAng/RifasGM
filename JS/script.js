// D:\Joyeria GM\JS\script.js
let participantes = JSON.parse(localStorage.getItem('participantes')) || {};
const fechaRifaPredeterminada = '2025-12-31'; // Cambia esta fecha en el código
const costoBoletoPredeterminado = 100; // Cambia este costo en el código
const nombreRifaPredeterminado = 'Rifa'; // Cambia este nombre en el código
let metodoPagoSeleccionado = '';

function cargarNumeros() {
    const select = document.getElementById('numero');
    select.innerHTML = ''; // Asegurarse de que el select esté vacío antes de agregar opciones
    for (let i = 0; i < 100; i++) {
        if (!participantes[i < 10 ? `0${i}` : i]) {
            const option = document.createElement('option');
            option.value = i < 10 ? `0${i}` : i;
            option.textContent = i < 10 ? `0${i}` : i;
            select.appendChild(option);
        }
    }
}

function cargarDatos() {
    const fechaRifa = localStorage.getItem('fecha-rifa') || fechaRifaPredeterminada;
    const costoBoleto = localStorage.getItem('costo-boleto') || costoBoletoPredeterminado;
    const nombreRifa = localStorage.getItem('nombre-rifa') || nombreRifaPredeterminado;

    document.getElementById('fecha-rifa').textContent = fechaRifa;
    document.getElementById('costo-boleto').textContent = `$${costoBoleto}`;
    document.getElementById('nombre-rifa').textContent = nombreRifa;
}

function mostrarMetodosPago() {
    const nombre = document.getElementById('nombre').value;
    const numero = document.getElementById('numero').value;
    if (nombre && numero) {
        document.querySelector('.metodos-pago').style.display = 'block';
    } else {
        alert('Por favor, introduce un nombre y selecciona un número.');
    }
}

function mostrarFormularioPago(metodo) {
    metodoPagoSeleccionado = metodo;
    document.querySelector('.formulario-pago').style.display = 'block';
}

function procesarPago() {
    if (metodoPagoSeleccionado === 'BBVA') {
        procesarPagoBBVA();
    } else if (metodoPagoSeleccionado === 'MercadoPago') {
        procesarPagoMercadoPago();
    } else {
        alert('Selecciona un método de pago.');
    }
}

function procesarPagoBBVA() {
    const nombre = document.getElementById('nombre').value;
    const numero = document.getElementById('numero').value;
    const nombreTarjeta = document.getElementById('nombre-tarjeta').value;
    const numeroTarjeta = document.getElementById('numero-tarjeta').value;
    const fechaExpiracion = document.getElementById('fecha-expiracion').value;
    const cvv = document.getElementById('cvv').value;

    if (nombre && numero && nombreTarjeta && numeroTarjeta && fechaExpiracion && cvv) {
        if (!participantes[numero]) {
            // Aquí se realiza la llamada a la API de BBVA
            fetch('https://api.bbva.com/pago', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Reemplaza 'TU_TOKEN_DE_API_BBVA' con tu token de API de BBVA
                    'Authorization': 'Bearer TU_TOKEN_DE_API_BBVA'
                },
                body: JSON.stringify({
                    cardNumber: numeroTarjeta,
                    cardName: nombreTarjeta,
                    expiryDate: fechaExpiracion,
                    cvv: cvv,
                    amount: costoBoletoPredeterminado,
                    currency: 'MXN'
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    participantes[numero] = nombre;
                    actualizarTabla();
                    cargarNumeros(); // Actualiza la lista desplegable
                    document.getElementById('nombre').value = '';
                    document.getElementById('nombre-tarjeta').value = '';
                    document.getElementById('numero-tarjeta').value = '';
                    document.getElementById('fecha-expiracion').value = '';
                    document.getElementById('cvv').value = '';
                    localStorage.setItem('participantes', JSON.stringify(participantes));
                    alert('Pago realizado exitosamente.');
                } else {
                    alert('El pago no se pudo realizar. Intenta nuevamente.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Hubo un error al procesar el pago. Intenta nuevamente.');
            });
        } else {
            alert('El número ya está ocupado. Por favor, elige otro número.');
        }
    } else {
        alert('Por favor, completa todos los campos.');
    }
}

function procesarPagoMercadoPago() {
    const nombre = document.getElementById('nombre').value;
    const numero = document.getElementById('numero').value;
    const nombreTarjeta = document.getElementById('nombre-tarjeta').value;
    const numeroTarjeta = document.getElementById('numero-tarjeta').value;
    const fechaExpiracion = document.getElementById('fecha-expiracion').value;
    const cvv = document.getElementById('cvv').value;

    if (nombre && numero && nombreTarjeta && numeroTarjeta && fechaExpiracion && cvv) {
        if (!participantes[numero]) {
            // Aquí se realiza la llamada a la API de Mercado Pago
            fetch('https://api.mercadopago.com/v1/payments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Reemplaza 'TU_TOKEN_DE_API_MERCADO_PAGO' con tu token de API de Mercado Pago
                    'Authorization': 'Bearer TU_TOKEN_DE_API_MERCADO_PAGO'
                },
                body: JSON.stringify({
                    token: numeroTarjeta,
                    description: nombreRifaPredeterminado,
                    payment_method_id: metodoPagoSeleccionado,
                    transaction_amount: costoBoletoPredeterminado,
                    installments: 1,
                    payer: {
                        email: 'email@example.com'
                    }
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'approved') {
                    participantes[numero] = nombre;
                    actualizarTabla();
                    cargarNumeros(); // Actualiza la lista desplegable
                    document.getElementById('nombre').value = '';
                    document.getElementById('nombre-tarjeta').value = '';
                    document.getElementById('numero-tarjeta').value = '';
                    document.getElementById('fecha-expiracion').value = '';
                    document.getElementById('cvv').value = '';
                    localStorage.setItem('participantes', JSON.stringify(participantes));
                    alert('Pago realizado exitosamente.');
                } else {
                    alert('El pago no se pudo realizar. Intenta nuevamente.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Hubo un error al procesar el pago. Intenta nuevamente.');
            });
        } else {
            alert('El número ya está ocupado. Por favor, elige otro número.');
        }
    } else {
        alert('Por favor, completa todos los campos.');
    }
}

function actualizarTabla() {
    const tabla = document.querySelector('#tabla-numeros tbody');
    tabla.innerHTML = '';
    for (let i = 0; i < 50; i++) {
        const fila = document.createElement('tr');
        const numero1 = i < 10 ? `0${i}` : i;
        const numero2 = (i + 50) < 10 ? `0${i + 50}` : i + 50;

        const numeroCelda1 = document.createElement('td');
        const nombreCelda1 = document.createElement('td');
        const numeroCelda2 = document.createElement('td');
        const nombreCelda2 = document.createElement('td');

        numeroCelda1.textContent = numero1;
        numeroCelda2.textContent = numero2;

        if (participantes[numero1]) {
            nombreCelda1.textContent = participantes[numero1];
            nombreCelda1.classList.add('ocupado');
        } else {
            nombreCelda1.textContent = '';
        }

        if (participantes[numero2]) {
            nombreCelda2.textContent = participantes[numero2];
            nombreCelda2.classList.add('ocupado');
        } else {
            nombreCelda2.textContent = '';
        }

        fila.appendChild(numeroCelda1);
        fila.appendChild(nombreCelda1);
        fila.appendChild(numeroCelda2);
        fila.appendChild(nombreCelda2);
        tabla.appendChild(fila);
    }
}

// Cargar datos, números y actualizar tabla al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarDatos();
    cargarNumeros();
    actualizarTabla();
});
