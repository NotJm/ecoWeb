import React from 'react';
import { SiEgghead } from 'react-icons/si';
import { Link, useNavigate } from 'react-router-dom';

export const Methods = () => {
    const navigate = useNavigate();

    return (
        <div className='container-fluid mt-5'>
            <div className='row'>
                <div className='col-lg-4 offset-lg-4 col-md-6 offset-md-3 col-12'>
                    <div className='text-center mb-4'>
                        <h2 className='fw-bold'>Metodos para recuperar contraseña</h2>
                        <SiEgghead style={{ width: '128px', height: '128px' }} />
                    </div>
                    <div className='d-flex justify-content-center'>
                        <button
                            className='btn btn-danger me-2'
                            onClick={() => { navigate("/emailform") }}>
                            Por Correo Electronico
                        </button>
                        <button
                            className='btn btn-outline-danger'
                            onClick={() => { navigate("/questionform")}}>
                            Por Pregunta Secreta
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}