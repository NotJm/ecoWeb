import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import withReactContent from 'sweetalert2-react-content';
import { SiEgghead } from 'react-icons/si';
import { useNavigate } from 'react-router-dom';

export const PreguntasFrecuentes = () => {
    const [preguntas, setPreguntas] = useState([]);

    useEffect(() => {
        axios.get('https://ecoserver-zopz.onrender.com/get/preguntas/frecuentes')
            .then((response) => {
                console.log(response.data)
                setPreguntas(response.data);
            })
            .catch((error) => {
                throw new Error(error.message);
            });
    }, []);

    return (
        <div className="container mt-5">
            <h1 className='text-center mb-3'>Preguntas Frecuentes</h1>
            <div className="row row-cols-1 row-cols-md-3 g-4">
                {preguntas.map((pregunta) => (
                    <div className="col" key={pregunta._id}>
                        <div className="card shadow">
                            <div className="card-body">
                                <h2 className="card-title">{pregunta.pregunta}</h2>
                                <p className="card-text text-muted">{pregunta.respuesta}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

};


export const PreguntasFrecuentesTable = () => {
    const navigate = useNavigate();
    const swal = withReactContent(Swal);
    const [preguntas, setPreguntas] = useState([]);
    const [editingPreguntas, setEditingPreguntas] = useState(null);

    // Get preguntas 
    useEffect(() => {
        axios.get('https://ecoserver-zopz.onrender.com/get/preguntas/frecuentes')
            .then((response) => {
                console.log(response.data)
                setPreguntas(response.data);
            })
            .catch((error) => {
                throw new Error(error.message);
            });
    }, []);
    // Editing Preguntas
    const handleEdit = pregunta => setEditingPreguntas({ ...pregunta });

    const handleDelete = async id => {
        await axios.delete(`https://ecoserver-zopz.onrender.com/delete/preguntas/frecuentes/${id}`)
            .then((response) => {
                setPreguntas(preguntas.filter(pregunta => pregunta._id !== id));
                swal.fire({
                    title: "Pregunta Eliminada con exito",
                    icon: "success",
                    allowEnterKeyboard: false,
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    timer: 1200,
                    timerProgressBar: true,
                    showConfirmButton: false,
                })
            })
            .catch((error) => {
                console.log(error);
                throw new Error(error);
            });

    }

    const handleSave = async () => {
        // Validar que la pregunta y la respuesta no estén vacías
        if (!editingPreguntas.pregunta.trim() || !editingPreguntas.respuesta.trim()) {
            swal.fire({
                title: "Error",
                text: "Por favor, completa la pregunta y la respuesta.",
                icon: "error",
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false
            });
            return;
        }

        const { _id, ...preguntaWithoutId } = editingPreguntas;
        await axios.put(`https://ecoserver-zopz.onrender.com/edit/preguntas/frecuentes/${_id}`, preguntaWithoutId)
            .then((response) => {
                setPreguntas(preguntas.map(pregunta => (pregunta._id === _id ? editingPreguntas : pregunta)));
                setEditingPreguntas(null);
                swal.fire({
                    title: "Pregunta Actualizada con exito",
                    icon: "success",
                    allowEnterKeyboard: false,
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    timer: 1200,
                    timerProgressBar: true,
                    showConfirmButton: false,
                })
            })
            .catch((error) => {
                setEditingPreguntas(null);
            })
    }

    const handleCancel = () => setEditingPreguntas(null);

    const handleInputChange = e => {
        const { name, value } = e.target;
        setEditingPreguntas({ ...editingPreguntas, [name]: value });
    }

    return (
        <div className='container mt-5'>
            <h2 className='text-dark'>Preguntas Frecuentes</h2>
            <div className='d-flex justify-content-end mb-2'>
                <button className='btn btn-outline-success me-2' onClick={() => navigate("/addpreguntas")}>
                    Agregar Pregunta Frecuente
                </button>
            </div>
            <div className='table-responsive'>
                <table className='table table-bordered'>
                    <thead className='thead-dark'>
                        <tr>
                            <th>Pregunta</th>
                            <th>Respuesta</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {preguntas.map((pregunta) => {
                            return (
                                <tr key={pregunta._id}>
                                    <td>
                                        {editingPreguntas && editingPreguntas._id === pregunta._id ? (
                                            <textarea
                                                type="text"
                                                className='form-control'
                                                name='pregunta'
                                                value={editingPreguntas.pregunta}
                                                onChange={handleInputChange}
                                            />
                                        ) : (
                                            pregunta.pregunta
                                        )}

                                    </td>
                                    <td>
                                        {editingPreguntas && editingPreguntas._id === pregunta._id ? (
                                            <textarea
                                                type="text"
                                                className='form-control'
                                                name='respuesta'
                                                value={editingPreguntas.respuesta}
                                                onChange={handleInputChange}
                                            />
                                        ) : (
                                            pregunta.respuesta
                                        )}

                                    </td>
                                    <td>
                                        {editingPreguntas && editingPreguntas._id === pregunta._id ? (
                                            <>
                                                <button className='btn btn-success mb-2' onClick={handleSave}>
                                                    Guardar
                                                </button>
                                                <button className='btn btn-danger mb-2' onClick={handleCancel}>
                                                    Cancelar
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button className='btn btn-primary mb-2' onClick={() => handleEdit(pregunta)}>
                                                    Editar
                                                </button>
                                                <button className='btn btn-danger mb-2' onClick={() => handleDelete(pregunta._id)}>
                                                    Eliminar
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );

}


export const AddPreguntas = () => {
    const [pregunta, setPregunta] = useState('');
    const [respuesta, setRespuesta] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar que ambos campos estén llenos
        if (!pregunta || !respuesta) {
            Swal.fire({
                title: "Campos incompletos",
                text: "Por favor, completa todos los campos.",
                icon: "warning",
            });
            return;
        }

        // Construir el objeto de datos a enviar
        const data = {
            pregunta: pregunta,
            respuesta: respuesta
        };

        try {
            // Realizar la solicitud POST para agregar la pregunta
            const response = await axios.post('https://ecoserver-zopz.onrender.com/add/preguntas/frecuentes', data);

            if (response.status === 201) {
                Swal.fire({
                    title: "Pregunta agregada",
                    text: "La pregunta se ha agregado con éxito.",
                    icon: "success",
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    didClose: () => {
                        // Limpiar los campos después de agregar la pregunta
                        setPregunta('');
                        setRespuesta('');
                    }
                });
            } else {
                Swal.fire({
                    title: "Error al agregar pregunta",
                    text: "Hubo un error al intentar agregar la pregunta. Por favor, inténtalo nuevamente.",
                    icon: "error",
                });
            }
        } catch (error) {
            console.error('Error al realizar la solicitud:', error);

            Swal.fire({
                title: "Error",
                text: "Hubo un error al intentar agregar la pregunta. Por favor, inténtalo nuevamente.",
                icon: "error",
            });
        }
    }

    return (
        <div className="container-fluid mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-4 col-md-6 col-12">
                    <div className="text-center mb-4">
                        <h2 className="fw-bold text-dark">Agregar Pregunta</h2>
                        <SiEgghead style={{ width: '128px', height: '128px', fill: '#000' }} />
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="pregunta" className="form-label text-dark">
                                Pregunta
                            </label>
                            <input
                                id="pregunta"
                                name="pregunta"
                                className="form-control"
                                type="text"
                                placeholder="Ingrese la pregunta"
                                value={pregunta}
                                onChange={(e) => setPregunta(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="respuesta" className="form-label text-dark">
                                Respuesta
                            </label>
                            <input
                                id="respuesta"
                                name="respuesta"
                                className="form-control"
                                type="text"
                                placeholder="Ingrese la respuesta"
                                value={respuesta}
                                onChange={(e) => setRespuesta(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary mb-3 w-100">
                            Agregar Pregunta
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};