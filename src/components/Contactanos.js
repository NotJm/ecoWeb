import React, { useState } from 'react';
import axios from 'axios';
import { Map } from "./GoogleMap";

export const Contactanos = () => {
    const [email, setEmail] = useState('');
    const [pregunta, setPregunta] = useState('');
    const [mensaje, setMensaje] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Acciones con los datos del formulario (puedes enviarlos a un servidor, etc.)

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert("Por favor ingresa un correo electrónico válido");
            return;
        }

        if (!pregunta) {
            alert("Por favor selecciona una pregunta");
            return;
        }
        if (!mensaje) {
            alert("Por favor ingresa un mensaje");
            return;
        }

        // Construccion del esquema que se va enviar
        const data = {
            email: email,
            pregunta: pregunta,
            mensaje: mensaje,
        }

        try {
            const response = await axios.post("https://ecoserver-zopz.onrender.com/user/contacto", data);

            if (response.status === 200) {
                const result = response.data;
                const { status } = result;
                if (status) {
                    alert("Se ha mandado a nuestro correo nosotros te contestamos");
                } else {
                    alert("Solo se permite una pregunta por correo electronico");
                }
            } else {
                console.error('Error en la solicitud:', response.statusText);
            }
        } catch (error) {
            console.error('Error al realizar la solicitud:', error);
        }



        // Muestra los datos en la consola para propósitos de demostración

        // Reinicia los campos del formulario después de enviar los datos
        setEmail('');
        setPregunta('');
        setMensaje('');
    };

    return (
        <div className="container mt-5 p-3 rounded shadow" style={{ backgroundColor: "#ccc" }}>
            <div className="row">
                {/* Mitad izquierda: Formulario */}
                <div className="col-md-6">
                    <h2 className='text-dark'>Contactanos</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label text-dark fw-bolder">
                                Correo Electrónico:
                            </label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="pregunta" className="form-label text-dark fw-bolder">
                                Tema:
                            </label>
                            <select
                                className="form-select"
                                id="pregunta"
                                value={pregunta}
                                onChange={(e) => setPregunta(e.target.value)}
                                required
                            >
                                <option value="" disabled>Selecciona una opción</option>
                                <option value="Cotizacion">Cotizacion</option>
                                <option value="Distribucion">Distribucion</option>
                                <option value="Sugerencia">Sugerencia</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="mensaje" className="form-label text-dark fw-bolder">
                                Mensaje:
                            </label>
                            <textarea
                                className="form-control"
                                id="mensaje"
                                rows="4"
                                value={mensaje}
                                onChange={(e) => setMensaje(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className="btn btn-danger w-100">
                            Enviar
                        </button>
                    </form>
                </div>
                <div className="col-md-6 d-flex justify-content-center align-items-center flex-column">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d7442.348343939589!2d-98.41836070000001!3d21.14546580000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses-419!2smx!4v1710299161973!5m2!1ses-419!2smx"  style={{borderWidth: 0}} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" className='w-100 h-100'/>
                </div>
            </div>
        </div>
    );
};


