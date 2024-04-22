import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';

export const Empresa = () => {
    const swal = withReactContent(Swal);
    const [empresa, setEmpresa] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get("https://ecoserver-zopz.onrender.com/empresa")
            .then(response => {
                setEmpresa(response.data[0]);
            })
            .catch(error => {
                console.error("Error fetching empresa data:", error);
                setError("Error fetching empresa data. Please try again later.");
            });
    }, []);

    const handleSave = async () => {
        try {
            // Validación de campos requeridos
            const requiredFields = ['mision', 'vision', 'empresa', 'historia', 'valores', 'equipo'];
            const invalidFields = requiredFields.filter(field => !empresa[field]);
            if (invalidFields.length > 0) {
                swal.fire({
                    title: "Campos requeridos",
                    text: `Los siguientes campos son requeridos: ${invalidFields.join(', ')}`,
                    icon: "error",
                });
                return;
            }

            // Resto de la lógica de guardado si pasa la validación...
            const response = await axios.post('https://ecoserver-zopz.onrender.com/empresa/edit', empresa);
            console.log(response.data);
            swal.fire({
                title: "Datos guardados",
                text: "Los cambios se han guardado correctamente.",
                icon: "success",
                timer: 1000,
                timerProgressBar: true,
                showCancelButton: false,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Error adding device:', error);
            swal.fire({
                title: "No hay cambios relevantes",
                text: "Parece que no existen cambios relevantes como para actualizar.",
                icon: "warning",
            });
        }
    };

    const handleChange = (event, field) => {
        const newValue = event.target.value;
        setEmpresa(prevEmpresa => ({
            ...prevEmpresa,
            [field]: newValue
        }));
    };

    return (
        <div className='container mt-5'>
            <div className='row'>
                <div className='col-lg-4 col-md-12'>
                    <div className='mb-4'>
                        <label htmlFor="mision" className="form-label">
                            <h2>Misión</h2>
                        </label>
                        <textarea
                            id="mision"
                            className="form-control"
                            rows="3"
                            value={empresa.mision || ""}
                            onChange={(e) => handleChange(e, "mision")}
                        />
                    </div>
                </div>
                <div className='col-lg-4 col-md-12'>
                    <div className='mb-4'>
                        <label htmlFor="vision" className="form-label">
                            <h2>Visión</h2>
                        </label>
                        <textarea
                            id="vision"
                            className="form-control"
                            rows="3"
                            value={empresa.vision || ""}
                            onChange={(e) => handleChange(e, "vision")}
                        />
                    </div>
                </div>
                <div className='col-lg-4 col-md-12'>
                    <div className='mb-4'>
                        <label htmlFor="nombreEmpresa" className="form-label">
                            <h2>Eco-Nido</h2>
                        </label>
                        <textarea
                            id="nombreEmpresa"
                            className="form-control"
                            rows="3"
                            value={empresa.empresa || ""}
                            onChange={(e) => handleChange(e, "empresa")}
                        />
                    </div>
                </div>
                <div className='col-lg-12'>
                    <div className='mb-4'>
                        <label htmlFor="historia" className="form-label">
                            <h2>Historia de la Empresa</h2>
                        </label>
                        <textarea
                            id="historia"
                            className="form-control"
                            rows="3"
                            value={empresa.historia || ""}
                            onChange={(e) => handleChange(e, "historia")}
                        />
                    </div>
                </div>
                <div className='col-lg-6'>
                    <div className='mb-4'>
                        <label htmlFor="valores" className="form-label">
                            <h2>Valores y Filosofía</h2>
                        </label>
                        <textarea
                            id="valores"
                            className="form-control"
                            rows="3"
                            value={empresa.valores || ""}
                            onChange={(e) => handleChange(e, "valores")}
                        />
                    </div>
                </div>
                <div className='col-lg-6'>
                    <div className='mb-4'>
                        <label htmlFor="equipo" className="form-label">
                            <h2>Equipo</h2>
                        </label>
                        <textarea
                            id="equipo"
                            className="form-control"
                            rows="3"
                            value={empresa.equipo || ""}
                            onChange={(e) => handleChange(e, "equipo")}
                        />
                    </div>
                </div>
                <div className='col-lg-12'>
                    <button className='btn btn-danger' onClick={handleSave}>Guardar</button>
                </div>
            </div>
        </div>
    );
};
