import React, { useState } from 'react';
import { SiEgghead } from 'react-icons/si';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export const VerifyToken = () => {
    const navigate = useNavigate();
    const [token, setToken] = useState('');
    const [verificationResult, setVerificationResult] = useState('');
    const swal = withReactContent(Swal);

    const handleVerifyToken = () => {
        // Obtener el token almacenado en localStorage
        const storedToken = localStorage.getItem('token');

        if (storedToken === token) {
            setVerificationResult('Token verificado con éxito');
            swal.fire({
                title: 'Éxito',
                text: 'Token verificado con éxito',
                icon: 'success',
            });
            localStorage.removeItem('token');
            if (localStorage.getItem('step2_q') === 'step2') {
                navigate("/questionform");
            } else {
                navigate("/updatePassword");
            }

        } else {
            setVerificationResult('Token no válido');
            swal.fire({
                title: 'Error',
                text: 'Token no válido',
                icon: 'error',
            });
        }
    };

    return (
        <div className="container-fluid mt-5">
            <div className="row">
                <div className="col-lg-4 offset-lg-4 col-md-6 offset-md-3 col-12">
                    <div className="text-center mb-4">
                        <h2 className="fw-bold ">Verificar Token</h2>
                        <SiEgghead style={{ width: '128px', height: '128px', fill: '#000' }} />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="token" className="form-label">
                            Ingrese el token:
                        </label>
                        <input
                            id="token"
                            name="token"
                            className="form-control"
                            type="text"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                        />
                    </div>

                    <button type="button" className="btn btn-danger mb-3 w-100" onClick={handleVerifyToken}>
                        Verificar Token
                    </button>

                    {verificationResult && (
                        <div className={`alert ${verificationResult.includes('éxito') ? 'alert-success' : 'alert-danger'} mt-3`}>
                            {verificationResult}
                        </div>
                    )}

                    <div className="d-flex justify-content-center">
                        <Link to="/" className="text-decoration-underline">
                            Volver al Inicio
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};