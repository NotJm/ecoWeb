import React, { useEffect, useState } from 'react';
import { SiEgghead } from 'react-icons/si';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useAuth } from './Auth';
import axios from 'axios';

export const Domicilio = () => {
    const [estado, setEstado] = useState('');
    const [municipio, setMunicipio] = useState('');
    const [colonia, setColonia] = useState('');
    const [codigoPostal, setCodigoPostal] = useState('');
    const [telefono, setTelefono] = useState('');
    const { currentUser } = useAuth();

    useEffect(() => {
        const { username } = currentUser;
        if (currentUser) {
            axios.get('https://ecoserver-zopz.onrender.com/getdomicilio', { params: { username: username } })
                .then(response => {
                    const { estado, municipio, colonia, codigoPostal, telefono } = response.data.username.domicilio;
                    setEstado(estado || '');
                    setMunicipio(municipio || '');
                    setColonia(colonia || '');
                    setCodigoPostal(codigoPostal || '');
                    setTelefono(telefono || '');
                })
                .catch(error => {
                    console.error('Error fetching domicilio:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudo obtener la información del domicilio. Inténtalo de nuevo más tarde.'
                    });
                });
        }
    }, [currentUser]);

    const handleSave = async (e) => {
        e.preventDefault();
        if (currentUser) {
            const { username } = currentUser;
            // Validar campos
            if (!estado.trim() || !municipio.trim() || !colonia.trim() || !codigoPostal.trim() || !telefono.trim()) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Por favor, completa todos los campos.'
                });
                return;
            }
            // Validar código postal
            if (!/^\d{5}$/.test(codigoPostal.trim())) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'El código postal debe tener 5 dígitos.'
                });
                return;
            }
            // Validar teléfono
            if (!/^\d{10}$/.test(telefono.trim())) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'El teléfono debe tener 10 dígitos.'
                });
                return;
            }
            try {
                const response = await axios.post('https://ecoserver-zopz.onrender.com/savedomicilio', {
                    username: username,
                    domicilio: {
                        estado: estado,
                        municipio: municipio,
                        colonia: colonia,
                        codigoPostal: codigoPostal,
                        telefono: telefono
                    }
                });
                console.log(response.data);
                Swal.fire({
                    icon: 'success',
                    title: '¡Guardado!',
                    text: 'Los datos del domicilio han sido guardados exitosamente.'
                });
            } catch (error) {
                console.error('Error saving domicilio:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo guardar la información del domicilio. Inténtalo de nuevo más tarde.'
                });
            }
        }
    };


    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-6 col-md-8">
                    <div className="card">
                        <div className="card-body">
                            <div className="text-center mb-4">
                                <h2 className="fw-bold text-dark">Información de Domicilio</h2>
                                <SiEgghead style={{ width: '128px', height: '128px', fill: '#000' }} />
                            </div>
                            <form onSubmit={handleSave}>
                                <div className="mb-3">
                                    <label htmlFor="estado" className="form-label text-dark">Estado</label>
                                    <input
                                        id="estado"
                                        name="estado"
                                        className="form-control"
                                        type="text"
                                        placeholder="Estado"
                                        value={estado}
                                        onChange={(e) => setEstado(e.target.value)}
                                    />
                                    {estado === '' && <p className="text-danger">No se ha definido 'Estado'</p>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="municipio" className="form-label text-dark">Municipio</label>
                                    <input
                                        id="municipio"
                                        name="municipio"
                                        className="form-control"
                                        type="text"
                                        placeholder="Municipio"
                                        value={municipio}
                                        onChange={(e) => setMunicipio(e.target.value)}
                                    />
                                    {municipio === '' && <p className="text-danger">No se ha definido 'Municipio'</p>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="colonia" className="form-label text-dark">Colonia</label>
                                    <input
                                        id="colonia"
                                        name="colonia"
                                        className="form-control"
                                        type="text"
                                        placeholder="Colonia"
                                        value={colonia}
                                        onChange={(e) => setColonia(e.target.value)}
                                    />
                                    {colonia === '' && <p className="text-danger">No se ha definido 'Colonia'</p>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="codigoPostal" className="form-label text-dark">Código Postal</label>
                                    <input
                                        id="codigoPostal"
                                        name="codigoPostal"
                                        className="form-control"
                                        type="text"
                                        placeholder="Código Postal"
                                        value={codigoPostal}
                                        onChange={(e) => setCodigoPostal(e.target.value)}
                                    />
                                    {codigoPostal === '' && <p className="text-danger">No se ha definido 'Código Postal'</p>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="telefono" className="form-label text-dark">Teléfono</label>
                                    <input
                                        id="telefono"
                                        name="telefono"
                                        className="form-control"
                                        type="text"
                                        placeholder="Teléfono"
                                        value={telefono}
                                        onChange={(e) => setTelefono(e.target.value)}
                                    />
                                    {telefono === '' && <p className="text-danger">No se ha definido 'Teléfono'</p>}
                                </div>
                                <div className="d-grid">
                                    <button type="submit" className="btn btn-primary">Guardar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
