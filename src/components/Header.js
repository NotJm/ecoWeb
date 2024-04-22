import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { GiCosmicEgg } from "react-icons/gi";
import { CgProfile } from "react-icons/cg";
import { useAuth } from './Auth';
import { OffcanvasComponent } from './OffCanvas';

export const Header = () => {
    const navigate = useNavigate();
    const { currentUser, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/");
    }

    return (
        <nav className="navbar navbar-expand-lg bg-eggs sticky-top shadow">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand fs-1 text-dark">
                    <GiCosmicEgg fill='#000' className='mb-2 fs-1' />
                    Eco-Nido
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapsibleNavId"
                    aria-controls="collapsibleNavId"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                {/* Dentro del menubar */}
                <div className="collapse navbar-collapse" id="collapsibleNavId">
                    {/* Sitios por defecto */}
                    <ul className="navbar-nav me-auto mt-2 mt-lg-0">
                        <li className="nav-item">
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    `nav-link ${isActive ? 'link-primary link-offset-2 link-underline-opacity-100-hover' : 'link-underline-opacity-25'}`
                                }
                                exact>
                                Home
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/acercaDe"
                                className={({ isActive }) =>
                                    `nav-link ${isActive ? 'link-primary link-offset-2 link-underline-opacity-100-hover' : 'link-underline-opacity-25'}`
                                }
                                exact>
                                Quienes Somos
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/contactanos"
                                className={({ isActive }) =>
                                    `nav-link ${isActive ? 'link-primary link-offset-2 link-underline-opacity-100-hover' : 'link-underline-opacity-25'}`
                                }
                                exact>
                                Contactanos
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/catalogo"
                                className={({ isActive }) =>
                                    `nav-link ${isActive ? 'link-primary link-offset-2 link-underline-opacity-100-hover' : 'link-underline-opacity-25'}`
                                }
                                exact>
                                Incubadoras
                            </NavLink>
                        </li>
                    </ul>
                    <div className='d-md-flex'>
                        {/* <div className='d-flex justify-content-center align-self-center mt-2'>
                            <p className='text-center me-5'>Bienvenido Administrador</p>
                        </div> */}
                        {currentUser ? (
                            <ul className="navbar-nav ms-auto">
                                <li className='nav-item dropdown list-unstyled'>
                                    <a className='nav-link dropdown-toggle' data-bs-toggle="dropdown" aria-expanded="false">
                                        <CgProfile size={30} />
                                    </a>
                                    <ul className="dropdown-menu bg-eggs dropdown-menu-end">
                                        <li>
                                            <Link className="dropdown-item" to="/dispositivo">
                                                Dispostivo
                                            </Link>
                                        </li>

                                        <li>
                                            <Link className="dropdown-item" to="/domicilio">
                                                Editar Domicilio
                                            </Link>
                                        </li>
                                        <li>
                                            <hr className="dropdown-divider" />
                                        </li>
                                        <li>
                                            <span className="btn btn-danger w-100 text-light" onClick={handleLogout}>
                                                Cerrar Sesión
                                            </span>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        ) : (
                            <div className='d-flex'>
                                <Link to="/iniciar-sesion" className='btn btn-danger me-2'>
                                    Iniciar Sesión
                                </Link>
                                <Link to="/registrate" className='btn btn-outline-danger'>
                                    Regístrate
                                </Link>
                            </div>
                        )}
                        {currentUser?.permisos === true ? (

                            <>
                                <OffcanvasComponent>
                                    <ul className="list-group">
                                        <li className="list-group-item">
                                            <NavLink to="/usuarios"
                                                className={({ isActive }) =>
                                                    `nav-link ${isActive ? 'link-primary link-offset-2 link-underline-opacity-100-hover' : 'link-underline-opacity-25'}`
                                                }
                                                exact>
                                                Usuarios
                                            </NavLink>
                                        </li>
                                        <li className="list-group-item">
                                            <NavLink to="/productos"
                                                className={({ isActive }) =>
                                                    `nav-link ${isActive ? 'link-primary link-offset-2 link-underline-opacity-100-hover' : 'link-underline-opacity-25'}`
                                                }
                                                exact>
                                                Producto
                                            </NavLink>
                                        </li>
                                        <li className="list-group-item">
                                            <NavLink to="/Empresa"
                                                className={({ isActive }) =>
                                                    `nav-link ${isActive ? 'link-primary link-offset-2 link-underline-opacity-100-hover' : 'link-underline-opacity-25'}`
                                                }
                                                exact>
                                                Editar información de la Empresa
                                            </NavLink>
                                        </li>
                                        <li className="list-group-item">
                                            <NavLink to="/preguntas"
                                                className={({ isActive }) =>
                                                    `nav-link ${isActive ? 'link-primary link-offset-2 link-underline-opacity-100-hover' : 'link-underline-opacity-25'}`
                                                }
                                                exact>
                                                Preguntas
                                            </NavLink>
                                        </li>
                                        <li className="list-group-item">
                                            <NavLink to="/tablepreguntasfrecuentes"
                                                className={({ isActive }) =>
                                                    `nav-link ${isActive ? 'link-primary link-offset-2 link-underline-opacity-100-hover' : 'link-underline-opacity-25'}`
                                                }
                                                exact>
                                                Preguntas Frecuentes
                                            </NavLink>
                                        </li>
                                        <li className="list-group-item">
                                            <NavLink to="/alldevice"
                                                className={({ isActive }) =>
                                                    `nav-link ${isActive ? 'link-primary link-offset-2 link-underline-opacity-100-hover' : 'link-underline-opacity-25'}`
                                                }
                                                exact>
                                                Dispositvos
                                            </NavLink>
                                        </li>
                                    </ul>
                                </OffcanvasComponent>
                            </>
                        ) : null}
                    </div>
                </div>
            </div>
        </nav>
    );
};
