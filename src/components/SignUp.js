import React, { useEffect, useState } from 'react';
import { SiEgghead } from 'react-icons/si';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import md5 from 'md5';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export const SignUp = () => {
  const navigate = useNavigate();
  const isAddUser = localStorage.getItem('addUser') === 'true';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)
  const [permission, setPermission] = useState(false);

  useEffect(() => {
    if (isAddUser) {
      localStorage.removeItem('addUser');
    }
  }, []);

  const swal = withReactContent(Swal);

  const validatePassword = (password) => {
    // Use regex to enforce password criteria
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#.])[A-Za-z\d@$!%*?&#.]{8,}$/;
    return regex.test(password);
  };

  const handlePasswordFocus = () => {
    setIsPasswordFocused(true);
  };

  const handlePasswordBlur = () => {
    setIsPasswordFocused(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que todos los campos estén llenos
    if (!username || !email || !password || !confirmPassword) {
      swal.fire({
        title: "Campos incompletos",
        text: "Por favor, completa todos los campos.",
        icon: "warning",
      });
      return;
    }

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      swal.fire({
        title: "Contraseñas no coinciden",
        text: "Por favor, asegúrate de que las contraseñas coincidan.",
        icon: "error",
      });
      return;
    }

    // Validar la contraseña con la nueva función
    if (!validatePassword(password)) {
      swal.fire({
        title: "Contraseña no segura",
        text: "La contraseña debe tener al menos una mayúscula, una minúscula, un número y un carácter especial. Además, debe tener al menos 8 caracteres.",
        icon: "error",
      });
      return;
    }

    // Construir el objeto de datos a enviar
    const data = {
      username: username,
      password: md5(password),
      email: email,
      dispositivo: "",
      pregunta_secreta: "",
      respuesta_secreta: "",
      domicilio: {
        estado: "",
        municipio: "",
        colonia: "",
        codigoPostal: "",
        telefono: ""
      },
      permisos: permission
    };

    const options = [
      "¿Cuál es el nombre de tu primer mascota?",
      "¿Cuál es tu comida favorita?",
      "¿En qué ciudad nació tu madre?",
      "¿Cuál es tu película favorita?",
      "¿Cuál es tu canción favorita?"
    ];

    try {
      Swal.fire({
        title: 'Pregunta secreta pendiente',
        text: 'Antes de concluir registro es necesario tener una pregunta secreta',
        icon: 'info',
        html:
          `<select id="question" class="form-select mb-3">
                <option value="" selected disabled>Selecciona una pregunta secreta</option>
                ${options.map((option) => `<option value="${option}">${option}</option>`)}
            </select>
            <input id="answer" type="text" class="form-control" placeholder="Respuesta a la pregunta secreta">`,
        showCancelButton: false,
        confirmButtonText: 'Guardar',
        allowOutsideClick: false, // Evita que el modal se cierre haciendo clic fuera de él
        preConfirm: () => {
          const question = document.getElementById('question').value;
          const answer = document.getElementById('answer').value;
          if (!question || !answer) {
            Swal.showValidationMessage('Por favor selecciona una pregunta y proporciona una respuesta.');
          } else {
            data.pregunta_secreta = question;
            data.respuesta_secreta = md5(answer);
          }
        }
      }).then(async () => {
        const response = await axios.post('https://ecoserver-zopz.onrender.com/user', data);

        if (response.status === 200) {
          swal.fire({
            title: !isAddUser ? (`Registro exitoso`) : (`Usuario añadido con exito`),
            text: `¡Bienvenido a Eco-Nido, ${username}!`,
            icon: "success",
            timer: 2000,
            timerProgressBar: true,
            didOpen: () => {
              swal.showLoading();
            },
            didClose: () => {
              if (!swal.isLoading()) {
                localStorage.removeItem('addUser');
                !isAddUser ? (navigate("/iniciar-sesion")) : (navigate("/usuarios"))
              }
            }
          });
        } else {
          swal.fire({
            title: "Error en el registro",
            text: "Usuario ya existe o información incorrecta.",
            icon: "error",
          });
        }
      });
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);

      swal.fire({
        title: "Error",
        text: "Hubo un error al intentar registrarse. Por favor, inténtalo nuevamente.",
        icon: "error",
      });
    }
  }

  return (
    <div className="container-fluid mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-4 col-md-6 col-12">
          <div className="text-center mb-4">
            <h2 className="fw-bold text-dark">{!isAddUser ? ("¡Bienvenido de nuevo!") : ("Añade Usuario")}</h2>
            <SiEgghead style={{ width: '128px', height: '128px', fill: '#000' }} />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label text-dark">
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
              <label htmlFor="email" className="form-label text-dark">
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

            <div className="mb-3">
              <label htmlFor="password" className="form-label text-dark">
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
                onFocus={handlePasswordFocus}
                onBlur={handlePasswordBlur}
              />
              {isPasswordFocused && (
                <p className="text-muted mt-2">
                  La contraseña debe tener al menos una mayúscula, una minúscula, un número y un carácter especial. Además, debe tener al menos 8 caracteres.
                </p>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label text-dark">
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
            {isAddUser ? (
              <div className="mb-3 form-check">
                <input
                  id="permissions"
                  name="permissions"
                  className="form-check-input"
                  type="checkbox"
                  checked={permission}
                  onChange={(e) => setPermission(e.target.checked)}
                />
                <label htmlFor="permissions" className="form-check-label text-dark">
                  ¿Administrador?
                </label>
              </div>
            ) : null}


            <button type="submit" className="btn btn-primary mb-3 w-100">
              {!isAddUser ? ("Registrate") : ("Añadir Usuario")}
            </button>

            {!isAddUser ? (
              <div className="d-flex justify-content-center">
                <Link to="/iniciar-sesion" className="text-decoration-underline text-dark">
                  ¿Ya tienes una cuenta? Inicia sesión
                </Link>
              </div>
            ) : null}
          </form>
        </div>
      </div>
    </div>
  );
};
