import React, { useEffect, useState } from 'react';
import { CardHover } from './Card';
import axios from 'axios';
import { Loader } from './Loader';

export const AcercaDe = () => {
    const [empresa, setEmpresa] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get("https://ecoserver-zopz.onrender.com/empresa")
            .then(response => {
                setEmpresa(response.data);
            })
            .catch(error => {
                console.error("Error fetching empresa data:", error);
                setError("Error fetching empresa data. Please try again later.");
            });
    }, []);

    return (
        <div className='container mt-5'>
            <div className='row'>
                <div className='col-lg-4 col-md-12'>
                    <div className='mb-4'>
                        <CardHover title={"Misión"} description={empresa[0]?.mision || "Loading..."} image={require("../assets/wallpaperflare.com_wallpaper (1).jpg")} />
                    </div>
                </div>
                <div className='col-lg-4 col-md-12'>
                    <div className='mb-4'>
                        <CardHover title={"Visión"} description={empresa[0]?.vision || "Loading..."} image={require("../assets/wallpaperflare.com_wallpaper (2).jpg")} />
                    </div>
                </div>
                <div className='col-lg-4 col-md-12'>
                    <div className='mb-4'>
                        <CardHover title={"Eco-Nido"} description={empresa[0]?.empresa || "Loading..."} image={require("../assets/wallpaperflare.com_wallpaper (3).jpg")} />
                    </div>
                </div>

                {/* Nuevas Secciones */}
                <div className='col-lg-12'>
                    <h2>Historia de la Empresa</h2>
                    <p>
                        {empresa[0]?.historia || <Loader/>}
                    </p>
                </div>

                <div className='col-lg-6'>
                    <h2>Valores y Filosofía</h2>
                    <p>
                        {empresa[0]?.valores || <Loader/>}
                    </p>
                </div>

                <div className='col-lg-6'>
                    <h2>Equipo</h2>
                    <p>
                        {empresa[0]?.equipo || <Loader/>}
                    </p>
                </div>
            </div>
        </div>
    );
};


export const VisionMisionEmpresa = () => {
    const [empresa, setEmpresa] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get("https://ecoserver-zopz.onrender.com/empresa")
            .then(response => {
                setEmpresa(response.data);
            })
            .catch(error => {
                console.error("Error fetching empresa data:", error);
                setError("Error fetching empresa data. Please try again later.");
            });
    }, []);

    return (
        <div className='container mt-5'>
            <div className='row'>
                <div className='col-lg-4 col-md-12'>
                    <div className='card mb-4'>
                        <div className='card-body'>
                            <h2 className="card-title text-center mb-3">Misión</h2>
                            <p className="card-text">{empresa[0]?.mision || <Loader/>}</p>
                        </div>
                    </div>
                </div>
                <div className='col-lg-4 col-md-12'>
                    <div className='card mb-4'>
                        <div className='card-body'>
                            <h2 className="card-title text-center mb-3">Visión</h2>
                            <p className="card-text">{empresa[0]?.vision || <Loader/>}</p>
                        </div>
                    </div>
                </div>
                <div className='col-lg-4 col-md-12'>
                    <div className='card mb-4'>
                        <div className='card-body'>
                            <h2 className="card-title text-center mb-3">Eco-Nido</h2>
                            <p className="card-text">{empresa[0]?.empresa || <Loader/>}</p>
                        </div>
                    </div>
                </div>
    
            </div>
        </div>
    );
    
    
    
};