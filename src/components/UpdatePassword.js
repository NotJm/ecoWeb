import React, { useState } from 'react';
import { SiEgghead } from 'react-icons/si';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';
import md5 from 'md5';

export const UpdatePassword = () => {
    const swal = withReactContent(Swal);
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar que las contraseñas coincidan
        if (newPassword !== confirmPassword) {
            swal.fire({
                title: 'Error',
                text: 'Las contraseñas no coinciden. Por favor, verifica las contraseñas.',
                icon: 'error',
                timer: 5000,
                timerProgressBar: true,
            });
            return;
        }

        // Construir el objeto de datos a enviar
        const data = {
            username: username,
            newPassword: md5(newPassword),
        };

        try {
            // Hacer la solicitud al servidor para actualizar la contraseña
            const response = await axios.post('https://ecoserver-zopz.onrender.com/updatePassword', data);

            // Verificar si la solicitud fue exitosa
            if (response.data.success) {
                // Realizar acciones según la respuesta del servidor
                swal.fire({
                    title: 'Contraseña Actualizada',
                    text: 'La contraseña se ha actualizado exitosamente.',
                    icon: 'success',
                    timer: 5000,
                    timerProgressBar: true,
                    didClose: () => {
                        navigate("/iniciar-sesion");
                    }
                });
            } else {
                swal.fire({
                    title: 'Error',
                    text: 'Usuario no encontrado. Verifica el nombre de usuario.',
                    icon: 'error',
                    timer: 5000,
                    timerProgressBar: true,
                });
            }
        } catch (error) {
            console.error('Error al realizar la solicitud:', error);
        }
    };

    return (
        <div className="container-fluid mt-5">
            <div className="row">
                <div className="col-lg-4 offset-lg-4 col-md-6 offset-md-3 col-12">
                    <div className="text-center mb-4">
                        <h2 className="fw-bold text-light">Cambiar Contraseña</h2>
                        <SiEgghead style={{ width: '128px', height: '128px', fill: '#fff' }} />
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label text-light">
                                Nombre de Usuario
                            </label>
                            <input
                                id="username"
                                name="username"
                                className="form-control"
                                type="text"
                                placeholder="Nombre de usuario"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="newPassword" className="form-label text-light">
                                Nueva Contraseña
                            </label>
                            <input
                                id="newPassword"
                                name="newPassword"
                                className="form-control"
                                type="password"
                                placeholder="Nueva contraseña"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="confirmPassword" className="form-label text-light">
                                Confirmar Contraseña
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                className="form-control"
                                type="password"
                                placeholder="Confirmar contraseña"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary mb-3 w-100">
                            Cambiar Contraseña
                        </button>

                        <div className="d-flex justify-content-center">
                            <Link to="/" className="text-decoration-underline text-light-primary">
                                Volver al Inicio
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
