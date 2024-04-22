import React, { useEffect, useState } from 'react';
import { SiEgghead } from 'react-icons/si';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';

export const EmailForm = () => {
    const emailUser = localStorage.getItem('email');
    const navigate = useNavigate();
    const swal = withReactContent(Swal);
    const [email, setEmail] = useState('');

    useEffect(() => {
        const emailUser = localStorage.getItem('email');
        setEmail(emailUser || '');
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Verificar si el correo electrónico ya está registrado
        try {
            
            console.log(emailUser);
            if (emailUser && emailUser !== email) {
                swal.fire({
                    title: 'No coinciden',
                    text: 'El correo electronico no pertenece al usuario registrado', 
                    icon: 'warning',
                    timer: 1500,
                    showConfirmButton: false,
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    timerProgressBar: true,
                });
                return;
            }

            const emailCheckResponse = await axios.post('https://ecoserver-zopz.onrender.com/userEmail', { email });

            if (emailCheckResponse.status === 200) {
                const { exists } = emailCheckResponse.data;

                if (exists) {
                    // El correo electrónico existe, proceder a enviar el enlace de recuperación
                    const emailResponse = await axios.post('https://ecoserver-zopz.onrender.com/email', { email });

                    if (emailResponse.status === 200) {
                        const result = emailResponse.data;
                        const { status, error, token } = result;
                        localStorage.setItem("token", token);
                        if (status) {
                            swal.fire({
                                title: 'Recuperación de Contraseña',
                                text: 'Se ha enviado un token de recuperación a tu correo electrónico.',
                                icon: 'success',
                                timer: 5000,
                                timerProgressBar: true,
                            });
                            if (localStorage.getItem("step2_e") === "step2") {
                                navigate("/verifyToken");
                            } else {
                                localStorage.setItem("step2_q", "step2");
                                navigate("/verifyToken");
                            }
                        } else {
                            swal.fire({
                                title: 'Error',
                                text: error || 'No se pudo procesar la solicitud. Verifica la dirección de correo electrónico.',
                                icon: 'error',
                                timer: 5000,
                                timerProgressBar: true,
                            });
                        }
                    } else {
                        console.error('Error al procesar la solicitud de correo electrónico:', emailResponse);
                    }
                } else {
                    // El correo electrónico no existe
                    swal.fire({
                        title: 'Error',
                        text: 'El correo electrónico no está registrado en la página.',
                        icon: 'error',
                        timer: 5000,
                        timerProgressBar: true,
                    });
                }
            } else {
                console.error('Error al verificar el correo electrónico:', emailCheckResponse);
            }
        } catch (error) {
            console.error('Error al realizar la verificación:', error);
        }
    };

    return (
        <div className="container-fluid mt-5">
            <div className="row">
                <div className="col-lg-4 offset-lg-4 col-md-6 offset-md-3 col-12">
                    <div className="text-center mb-4">
                        <h2 className="fw-bold">{localStorage.getItem('step2_e') === 'step2' ? ("Ingresa Email") : ("Recuperar Contraseña por Email")}</h2>
                        <SiEgghead style={{ width: '128px', height: '128px', fill: '#000' }} />
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                                Correo Electrónico
                            </label>
                            <input
                                id="email"
                                name="email"
                                className="form-control"
                                type="email"
                                placeholder="Correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary mb-3 w-100">
                            Enviar Enlace de Recuperación
                        </button>

                        <div className="d-flex justify-content-center">
                            <Link to="/iniciar-sesion" className="text-decoration-underline">
                                Volver al Inicio de Sesión
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
