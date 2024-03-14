import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export const UserManagementTable = () => {
    const swal = withReactContent(Swal);
    const [users, setUsers] = useState([]);
    const [macs, setMacs] = useState([]);
    const [editingUser, setEditingUser] = useState(null);

    // Recolecta datos del endpoint donde se consiguen todo los usuarios
    useEffect(() => {
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
    }, []);

    // Manipulador para la edicion de usuarios
    const handleEdit = (user) => {
        setEditingUser({ ...user });
    };

    // Manipulador para guardar usuario
    const handleSaveEdit = () => {
        const { _id, ...userWithoutId } = editingUser;

        axios.post(`https://ecoserver-zopz.onrender.com/useredit/${_id}`, userWithoutId)
            .then(response => {
                console.log(response.data);
                setUsers(users.map(existingUser => (existingUser._id === _id ? editingUser : existingUser)));
                setEditingUser(null);
            })
            .catch(error => console.error("Error saving user edit:", error));
    };

    // Manipulador para eliminar datos 
    const handleDelete = (userId) => {
        axios.delete(`https://ecoserver-zopz.onrender.com/userdelete/${userId}`)
            .then(response => {
                console.log(response.data);
                setUsers(users.filter(existingUser => existingUser._id !== userId));
            })
            .catch(error => console.error("Error deleting user:", error));
    };

    // Manipulador para canclear la edicion
    const handleCancelEdit = () => {
        setEditingUser(null);
    };

    // Manipulador para la edicion
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditingUser({ ...editingUser, [name]: value });
    };


    // Manipulador para asignar dispositivos
    const handleAssignDevice = () => {
        // Creacion de las opciones
        const userOptions = users.map((user) => (
            `<option value="${user.username}">${user.username}</option>`
        )).join('');
        // Creacion de los elementos
        const userSelect = document.createElement("select");
        userSelect.className = "form-select mb-3";
        userSelect.innerHTML = userOptions;

        // Creacion de las opciones
        const macOptions = macs.map((mac) => (
            `<option value="${mac}">${mac}</option>`
        )).join('');
        // Elemento select para el dispositivo
        const deviceSelect = document.createElement("select");
        deviceSelect.className = "form-select";
        deviceSelect.innerHTML = macOptions;

        // Crear el cuadro de diálogo
        swal.fire({
            title: "Asignar Dispositivo",
            icon: "question",
            html: `
            <div class="mb-3">
              <label for="userSelect" class="form-label">Usuario</label>
              ${userSelect.outerHTML}
            </div>
            <div>
              <label for="deviceSelect" class="form-label">Dispositivo</label>
              ${deviceSelect.outerHTML}
            </div>
          `,
            showCancelButton: true,
            confirmButtonText: "Asignar",
        }).then((result) => {
            if (result.isConfirmed) {
                const username = userSelect.value;
                const mac = deviceSelect.value;
                axios.post("https://ecoserver-zopz.onrender.com/userassign",
                    {
                        username: username,
                        mac: mac
                    }
                ).then(response => {
                    swal.fire({
                        title: "Dispositivo Asignado",
                        icon: "success",
                        timer: 1000,
                        timerProgressBar: true,
                        showCancelButton: false,
                        showConfirmButton: false
                    })
                }).catch(error => {
                    swal.fire({
                        title: "Error al momento de asignar " + error,
                        icon: "error",
                    });
                    console.error(error);
                })

            }
        });
    };


    return (
        <div className="container mt-5">
            <h2>Lista de usuarios</h2>
            <div className="d-flex justify-content-end mb-2">
                <button className="btn btn-outline-success me-2">Agregar usuario</button>
                <button className="btn btn-outline-dark" onClick={handleAssignDevice}>Asignar Dispositivo</button>
            </div>
            {/* Tabla de usuarios */}
            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead className="thead-dark">
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Password</th>
                            <th>Dispositivo (MAC)</th>
                            <th>Permisos</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>
                                    {editingUser && editingUser._id === user._id ? (
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="username"
                                            value={editingUser.username}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        user.username
                                    )}
                                </td>
                                <td>{user.email}</td>
                                <td>{user.password && "************"}</td>
                                <td>{user.dispositivo ? user.dispositivo : "No"}</td>
                                <td>{user.permisos ? "Sí" : "No"}</td>
                                <td>
                                    {editingUser && editingUser._id === user._id ? (
                                        <>
                                            <button className="btn btn-success" onClick={handleSaveEdit}>
                                                Guardar
                                            </button>
                                            <button className="btn btn-danger" onClick={handleCancelEdit}>
                                                Cancelar
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button className="btn btn-primary" onClick={() => handleEdit(user)}>
                                                Editar
                                            </button>
                                            <button className="btn btn-danger" onClick={() => handleDelete(user._id)}>
                                                Eliminar
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};




const AddUser = () => {
    const [newUser, setNewUser] = useState({
        username: "",
        password: "",
        email: "",
        dispositivo: "",
        pregunta_secreta: "",
        respuesta_secreta: "",
        domicilio: {
            estado: "",
            municipio: "",
            colonia: "",
            codigoPosta: "",
            telefono: ""
        },
        permisos: false
    });

    // Manipulador para agregar usuarios
    const handleAddUser = () => {
        axios.post("https://ecoserver-zopz.onrender.com/user", newUser)
            .then(response => {
                console.log(response.data);
                // setUsers([...users, response.data]);
                setNewUser({
                    username: "",
                    email: "",
                    password: "",
                    dispositivo: false,
                    permisos: false,
                });
            })
            .catch(error => console.error("Error adding new user:", error));
    };

    return (
        <div>
            <div className="form-group">
                <label>Nombre de usuario</label>
                <input
                    type="text"
                    className="form-control"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                />
            </div>
            <div className="form-group">
                <label>Email</label>
                <input
                    type="email"
                    className="form-control"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
            </div>
            <div className="form-group">
                <label>Contraseña</label>
                <input
                    type="password"
                    className="form-control"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
            </div>
            <div className="form-check">
                <input
                    type="checkbox"
                    className="form-check-input"
                    checked={newUser.dispositivo}
                    onChange={(e) => setNewUser({ ...newUser, dispositivo: e.target.checked })}
                />
                <label className="form-check-label">Dispositivo</label>
            </div>
            <div className="form-check">
                <input
                    type="checkbox"
                    className="form-check-input"
                    checked={newUser.permisos}
                    onChange={(e) => setNewUser({ ...newUser, permisos: e.target.checked })}
                />
                <label className="form-check-label">Permisos</label>
            </div>
            <button className="btn btn-primary" onClick={handleAddUser}>
                Agregar usuario
            </button>
        </div>
    )
}


