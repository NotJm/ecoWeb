import React, { useState } from 'react';
import { SiEgghead } from 'react-icons/si';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import md5 from 'md5';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export const SignUp = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)

  const swal = withReactContent(Swal);

  const validatePassword = (password) => {
    // Use regex to enforce password criteria
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&]{8,}$/;
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
      permisos: false
    };

    try {
      const response = await axios.post('https://ecoserver-zopz.onrender.com/user', data);

      if (response.status === 200) {
        swal.fire({
          title: `Registro exitoso`,
          text: `¡Bienvenido a Eco-Nido, ${username}!`,
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
          didOpen: () => {
            swal.showLoading();
          },
          didClose: () => {
            if (!swal.isLoading()) {
              navigate("/iniciar-sesion");
            }
          }
        });
      } else {
        swal.fire({
          title: "Error en el registro",
          text: "Usuario ya existe o información incorrecta.",
          icon: "error",
        });
        console.error('Error en la solicitud:', response.statusText);
        console.log('Contenido de la respuesta:', response.data);
      }
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
            <h2 className="fw-bold text-dark">¡Bienvenido de nuevo!</h2>
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

            <button type="submit" className="btn btn-primary mb-3 w-100">
              Registrarse
            </button>

            <div className="d-flex justify-content-center">
              <Link to="/iniciar-sesion" className="text-decoration-underline text-dark">
                ¿Ya tienes una cuenta? Inicia sesión
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
