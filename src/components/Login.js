import React, { useState } from 'react';
import { SiEgghead } from "react-icons/si";
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from './Auth';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';
import md5 from 'md5';

export const Login = () => {
    const navigate = useNavigate();
    const swal = withReactContent(Swal);
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            // Mostrar mensaje de error indicando que ambos campos son obligatorios
            swal.fire({
                title: "Campos requeridos",
                text: "Por favor, ingresa tu nombre de usuario y contraseña.",
                icon: "error",
            });
            return;
        }

        // Construir el objeto de datos a enviar
        const data = {
            username: username,
            password: md5(password),
        };

        try {
            // Hacer la solicitud al servidor
            const response = await axios.post('https://ecoserver-zopz.onrender.com/user/login', data);

            // Verificar si la solicitud fue exitosa (código de estado 200)
            if (response.status === 200) {
                // Realizar acciones según la respuesta del servidor
                const result = response.data;
                const { status, tipo, dispositivo, lightState, fanState } = result;

                if (status) {
                    swal.fire({
                        title: `Login exitoso`,
                        text: `¡Bienvenido a Eco-Nido, ${username}!`,
                        icon: "success",
                        timer: 1500,
                        timerProgressBar: true,
                        didOpen: () => {
                            swal.showLoading();
                        },
                        didClose: () => {
                            if (!swal.isLoading()) {
                                login({ username: username, permisos: tipo, dispositivo: dispositivo, lightState: lightState, fanState: fanState});
                                navigate("/");
                            }
                        }
                    });
                } else {
                    swal.fire({
                        title: `Usuario no existente`,
                        icon: "error",
                        timer: 2000,
                        timerProgressBar: true,
                        didOpen: () => {
                            swal.showLoading();
                        },
                    })
                }
            }
        } catch (error) {
            console.error('Error al realizar la solicitud:', error);

            // Mostrar un mensaje de error genérico
            swal.fire({
                title: "Error",
                text: "Hubo un error al intentar iniciar sesión. Por favor, inténtalo nuevamente.",
                icon: "error",
            });
        }
    };

    return (
        <div className="container-fluid mt-5">
            <div className="row">
                <div className="col-lg-4 offset-lg-4 col-md-6 offset-md-3 col-12">
                    <div className="text-center mb-4">
                        <h2 className="fw-bold">¡Bienvenido de nuevo!</h2>
                        <SiEgghead style={{ width: '128px', height: '128px', fill: '#000' }} />
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">
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
                            <label htmlFor="password" className="form-label">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                name="password"
                                className="form-control"
                                type="password"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="btn btn-danger mb-3 w-100">
                            Iniciar Sesion
                        </button>

                        <div className="d-flex justify-content-center">
                            <Link to="/resetpassword" className="text-decoration-underline">
                                ¿Contraseña olvidada?
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}; 