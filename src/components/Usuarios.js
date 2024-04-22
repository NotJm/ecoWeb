import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./Auth";

export const UserManagementTable = () => {
    const ITEMS_PER_PAGE = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const { currentUser, login } = useAuth();
    const swal = withReactContent(Swal);
    const navigate = useNavigate();
    const topRef = useRef(null);
    const [users, setUsers] = useState([]);
    const [macs, setMacs] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [editingPermissions, setEditingPermissions] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const getCurrentUsers = () => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return users.slice(startIndex, endIndex);
    };

    const paginate = pageNumber => {
        setCurrentPage(pageNumber);
        topRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    const fetchData = () => {
        axios.get("https://ecoserver-zopz.onrender.com/allusers")
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => console.error("Error fetching users:", error));
        axios.get("https://ecoserver-zopz.onrender.com/device/mac")
            .then(response => {
                setMacs(response.data);
            })
            .catch(error => console.error("Error fetching macs:", error));
    };

    const handleAssignDevice = () => {
        const currentDate = new Date().toISOString().slice(0, 10); // Obtiene la fecha actual en formato YYYY-MM-DD

        swal.fire({
            title: "Asignar Dispositivo",
            icon: "question",
            html:
                `<div><div class="mb-3">
                    <label for="userSelect" class="form-label">Usuario</label>
                    <select id="userSelect" class="form-select mb-3">
                        <option value="">Selecciona un usuario</option>
                        ${users.map((user) => `<option key=${user._id} value=${user.username}>${user.username}</option>`).join("")}
                    </select>
                </div>
                <div class="mb-3">
                    <label for="deviceSelect" class="form-label">Dispositivo</label>
                    <select id="deviceSelect" class="form-select">
                        <option value="">Selecciona un dispositivo</option>
                        ${macs.map((mac) => {
                    const uniqueNumber = generateUniqueNumber(); // Genera un número único para cada dispositivo
                    return `<option key=${mac} value=${mac}>${mac}-ECONIDO-JR${currentDate}-${uniqueNumber}</option>`;
                }).join("")}
                    </select>
                </div>
                </div>`,
            showCancelButton: true,
            confirmButtonText: "Asignar",
            preConfirm: async () => {
                const selectedUser = document.getElementById("userSelect").value;
                const selectedDevice = document.getElementById("deviceSelect").value;
                if (!selectedUser || !selectedDevice) {
                    Swal.showValidationMessage('Por favor selecciona un usuario y un dispositivo.');
                    return;
                }

                // Verificar si el dispositivo ya está asignado a otro usuario
                const existingUser = users.find(user => user.dispositivo === selectedDevice);
                if (existingUser) {
                    swal.fire({
                        title: "Dispositivo ya asignado",
                        text: `El dispositivo ${selectedDevice} ya está asignado a ${existingUser.username}`,
                        icon: "error"
                    });
                    return;
                }

                // Si el dispositivo no está asignado a otro usuario, proceder con la asignación
                try {
                    const response = await axios.post("https://ecoserver-zopz.onrender.com/userassign", {
                        username: selectedUser,
                        mac: selectedDevice
                    });

                    if (response.status === 200) {
                        swal.fire({
                            title: "Dispositivo Asignado",
                            icon: "success",
                            timer: 1500,
                            timerProgressBar: true,
                            showCancelButton: false,
                            showConfirmButton: false,
                            didClose: () => {
                                fetchData();
                            }
                        });
                    }
                } catch (error) {
                    swal.fire({
                        title: "Error al asignar el dispositivo",
                        text: error.message,
                        icon: "error"
                    });
                    console.error(error);
                }
            }
        });
    };

    const generateUniqueNumber = () => {
        // Generar un número aleatorio único (por ejemplo, entre 1000 y 9999)
        return Math.floor(Math.random() * 9000) + 1000;
    };

    const handleEdit = (user) => {
        if (editingPermissions && editingUser && editingUser._id === user._id) {
            setEditingUser(null);
            setEditingPermissions(false);
        } else {
            setEditingUser({ ...user });
            setEditingPermissions(true);
        }
    };

    const handleSaveEdit = async () => {
        const { _id, ...userWithoutId } = editingUser;

        await axios.put(`https://ecoserver-zopz.onrender.com/useredit/${_id}`, userWithoutId)
            .then(response => {
                console.log(response.data);
                setUsers(users.map(existingUser => (existingUser._id === _id ? editingUser : existingUser)));
                setEditingUser(null);
                swal.fire({
                    title: 'Acceso Cambiado',
                    icon: 'success',
                    timer: 1000,
                    timerProgressBar: true,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    allowEnterKey: false,
                    showConfirmButton: false,
                    position: 'bottom-end'
                })
            })
            .catch(error => console.error("Error saving user edit:", error));
    };

    const handleDelete = (userId) => {
        axios.delete(`https://ecoserver-zopz.onrender.com/userdelete/${userId}`)
            .then(response => {
                console.log(response.data);
                setUsers(users.filter(existingUser => existingUser._id !== userId));
            })
            .catch(error => console.error("Error deleting user:", error));
    };

    const handleCancelEdit = () => {
        setEditingUser(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditingUser({ ...editingUser, [name]: value });
    };

    const handleAddUser = () => {
        localStorage.setItem('addUser', true);
        navigate('/registrate');
    }

    const handleViewUserData = (user) => {
        setSelectedUser(user);
    };

    const handleCloseModal = () => {
        setSelectedUser(null);
    };


    return (
        <div ref={topRef} className="container mt-5">
            <h2>Lista de usuarios</h2>
            <div className="d-flex justify-content-end mb-2">
                <button className="btn btn-outline-success me-2" onClick={handleAddUser}>Agregar usuario</button>
                <button className="btn btn-outline-dark" onClick={handleAssignDevice}>Asignar Dispositivo</button>
            </div>
            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead className="thead-dark">
                        <tr>
                            <th>Nombre de usuario</th>
                            <th>Dispositivo (MAC)</th>
                            <th>Permisos</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {getCurrentUsers().map((user) => (
                            <tr key={user._id}>
                                <td>{user.username}</td>
                                <td>{user.dispositivo ? user.dispositivo : "No asignado"}</td>
                                <td>
                                    {editingUser && editingUser._id === user._id && editingPermissions ? (
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={editingUser.permisos}
                                            onChange={(e) => handleInputChange({ target: { name: 'permisos', value: e.target.checked } })}
                                        />
                                    ) : (
                                        user.permisos ? "Sí" : "No"
                                    )}
                                </td>
                                <td>
                                    {editingUser && editingUser._id === user._id ? (
                                        <div className="d-flex justify-content-center">
                                            <button className="btn btn-success" onClick={handleSaveEdit}>
                                                Guardar
                                            </button>
                                            <button className="btn btn-danger" onClick={handleCancelEdit}>
                                                Cancelar
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="d-flex justify-content-center">
                                            <button className="btn btn-primary me-2" onClick={() => handleEdit(user)}>
                                                Editar permisos
                                            </button>
                                            <button className="btn btn-info me-2" onClick={() => handleViewUserData(user)}>
                                                Ver todos los datos
                                            </button>
                                            <button className="btn btn-danger" onClick={() => handleDelete(user._id)}>
                                                Eliminar
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="d-flex justify-content-center">
                <nav>
                    <ul className="pagination">
                        {Array.from({ length: Math.ceil(users.length / ITEMS_PER_PAGE) }).map((_, index) => (
                            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => paginate(index + 1)}>{(index + 1)}</button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
            {selectedUser && (
                <UserDetailModal user={selectedUser} onClose={handleCloseModal} />
            )}
        </div>
    );
};


const UserDetailModal = ({ user, onClose }) => {
    return (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Datos del Usuario: {user.username}</h5>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <p><strong>Nombre de Usuario:</strong> {user.username}</p>
                        <p><strong>Correo Electrónico:</strong> {user.email}</p>
                        <p><strong>Dispositivo (MAC):</strong> {user.dispositivo ? user.dispositivo : "No asignado"}</p>
                        <p><strong>Permisos:</strong> {user.permisos ? "Sí" : "No"}</p>
                        {/* Agrega aquí más detalles sobre el usuario si los tienes */}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};


