import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from './Auth';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css'
import './css/Toggle.css';
import { Link } from 'react-router-dom';
import Chart from 'chart.js/auto';
import 'anychart/dist/css/anychart-ui.min.css';
import 'chartjs-adapter-date-fns'
import bootstrapBundle from 'bootstrap/dist/js/bootstrap.bundle';

export const Dispositivo = () => {
    const swal = withReactContent(Swal);
    const { currentUser } = useAuth();
    const [temperature, setTemperature] = useState();
    const [humidity, setHumidity] = useState();
    const [mqQuality, setMqQuality] = useState();
    const [quality, setQuality] = useState();
    const [focoState, setFocoState] = useState(false);
    const [ventiladorState, setVentiladorState] = useState(false);
    const [automatico, setAutomatico] = useState(false);
    const [temperatureSate, setTemperatureState] = useState(false);
    const [humidityState, setHumidityState] = useState(false);
    const [humColor, setHumColor] = useState('');
    const [tempColor, setTempColor] = useState('');
    const [mqColor, setMqColor] = useState('');
    const [nameIcon, setNameIcon] = useState('');
    const [colorIcon, setColorIcon] = useState('');
    const [onlyAutomaticState, setOnlyAutomaticState] = useState(true);
    const [dispositivo, setDispositivo] = useState('');
    const [asignado, setAsignado] = useState(true);

    useEffect(() => {
        // Inicializar los tooltips al montar el componente
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrapBundle.Tooltip(tooltipTriggerEl);
        });
        return () => {
            // Limpiar los tooltips al desmontar el componente
            tooltipList.forEach(tooltip => tooltip.dispose());
        };
    }, []);

    useEffect(() => {
        // Cargar los estados al principio
        if (currentUser.dispositivo) {
            cargarEstados();
        } else {
            setAsignado(false);
        }

        // Cargar los estados continuamente
        const intervalId = setInterval(() => {
            if (currentUser.dispositivo) {
                cargarDatos(); // No sé de dónde proviene esta función, asegúrate de definirla correctamente
                cargarEstados();
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, []); // Se carga solo una vez al principio

    const cargarDatos = async () => {
        try {
            const { dispositivo } = currentUser;
            const response = await axios.post("https://ecoserver-zopz.onrender.com/device/sensor", { mac: dispositivo });

            const { temperatura, humedad, mq, quality } = response.data;

            // Mq conditions
            if (mq >= 0 && mq < 500) {
                setMqColor("#7CFC00");
                setNameIcon('check-box');
                setColorIcon('#7CFC00');
            } else if (mq >= 500 && mq < 800) {
                setMqColor("#99CC33");
                setNameIcon('check-box');
                setColorIcon('#99cc33');
            } else if (mq >= 800 && mq < 1200) {
                setMqColor("#FFCC00");
                setNameIcon('info');
                setColorIcon('##ffcc00');
            } else {
                setMqColor("#CC3300");
                setNameIcon('error');
                setColorIcon('#cc3300');
            }

            // Temperature conditions
            if (temperatura >= 38.3) {
                setTempColor("#CC3000");
                setTemperatureState(false);
            } else if (temperatura < 38.3 && temperatura >= 35) {
                setTempColor("#7cfc00");
                setTemperatureState(true);
            } else {
                setTempColor("#CC3000");
                setTemperatureState(false);
            }

            if (humedad >= 40 && humedad <= 50) {
                setHumColor("#7CFC00");
                setHumidityState(true);
            } else {
                setHumColor("#CC3000");
                setHumidityState(false);
            }

            setTemperature(temperatura || 0);
            setHumidity(humedad || 0);
            setMqQuality(mq || 0);
            setQuality(quality || "");

        } catch (err) {
            console.error(err);
        }
    };

    const cargarEstados = () => {
        try {
            const { dispositivo } = currentUser;
            axios.post("https://ecoserver-zopz.onrender.com/device/sensor", { mac: dispositivo })
                .then((response) => {
                    const { light, fan, automatic } = response.data;

                    // Actualizar estados de luz y ventilador
                    setFocoState(light || false);
                    setVentiladorState(fan || false);

                    // Si es la primera vez, cargar el estado automático
                    if (onlyAutomaticState) {
                        setAutomatico(automatic || false);
                        setOnlyAutomaticState(true);
                    }
                });
        } catch (err) {
            console.error(err);
        }
    };

    const sendMQTT = async (state) => {
        try {
            await axios.post('https://ecoserver-zopz.onrender.com/mqtt', {
                state: state,
            }).then((response) => {
                console.log(response);
            });
        } catch (err) {
            console.error(err);
        }
    };

    const toggleLight = async () => {
        if (automatico) {
            swal.fire({
                title: "Para poder controlar el foco desactive el modo automatico",
                icon: "warning",
                timer: 1100,
                timerProgressBar: true,
                showConfirmButton: false
            });
            return;
        }
        setFocoState(!focoState);
        await sendMQTT(focoState ? "lightOFF" : "lightON");
    };

    const toggleFan = async () => {
        if (automatico) {
            swal.fire({
                title: "Para poder controlar el ventilador desactive el modo automatico",
                icon: "warning",
                timer: 1100,
                timerProgressBar: true,
                showConfirmButton: false,
            });
            return;
        }
        setVentiladorState(!ventiladorState);
        await sendMQTT(ventiladorState ? "fanOFF" : "fanON");
    };

    const toggleAutomatic = async () => {
        setAutomatico(!automatico);
        setFocoState(focoState === false ? true : true);
        setVentiladorState(ventiladorState === true ? false : false);
        await cargarEstados();
        await sendMQTT(automatico ? "automaticDisabled" : "automaticEnable");
    };

    const handleDispositivoChange = (event) => {
        setDispositivo(event.target.value);
    };

    const asignarDispositivo = async () => {
        try {
            const response = await axios.post("https://ecoserver-zopz.onrender.com/asignarDispositivo", { otp: dispositivo, userId: currentUser.username });
            console.log(response);
            const { mac, message } = response.data;
            currentUser.dispositivo = mac;
            setAsignado(true);
            // Cargar los datos y estados después de asignar el dispositivo
            cargarDatos();
            cargarEstados();

            // Mostrar una alerta de éxito
            swal.fire({
                title: message,
                icon: "success",
                timer: 1100,
                timerProgressBar: true,
                showConfirmButton: false,
            });
        } catch (err) {
            if (err.response && err.response.status === 400 && err.response.data.message === "El dispositivo ya está asignado a otro usuario") {
                // Mostrar una alerta de dispositivo ya asignado
                swal.fire({
                    title: "Este dispositivo no esta disponible ya que se encuentra ocupado por otro usuario",
                    icon: "error",
                    timer: 1100,
                    timerProgressBar: true,
                    showConfirmButton: false,
                });
            } else {
                // Mostrar una alerta de error genérico
                swal.fire({
                    title: "Error al asignar dispositivo",
                    icon: "error",
                    timer: 1100,
                    timerProgressBar: true,
                    showConfirmButton: false,
                });
            }
        }
    };

    return (
        <div className='container mt-5' id='device'>
            {asignado ? (
                <>
                    <div className='row'>
                        <div className='col-lg-4 col-md-12 col-12'>
                            <p className='fs-2 text-center'>Temperatura</p>
                            <p className='fs-6 text-center'>Estado: {temperatureSate ? "Optimo" : "Fuera de rango"}</p>
                            <Link to="/temp" data-bs-toggle="tooltip" title="Haz clic para ver el gráfico">
                                <Widget metric={temperature ? temperature : 0} unity="°C" color={tempColor} />
                            </Link>
                        </div>
                        <div className='col-lg-4 col-md-12 col-12'>
                            <p className='fs-2 text-center'>Humedad</p>
                            <p className='fs-6 text-center'>Estado: {humidityState ? "Optimo" : "Fuera de rango"}</p>
                            <Link to='/hum' data-bs-toggle="tooltip" title="Haz clic para ver el gráfico">
                                <Widget metric={humidity ? humidity : 0} unity="%" color={humColor} />
                            </Link>
                        </div>
                        <div className='col-lg-4 col-md-12 col-12'>
                            <p className='fs-2 text-center'>Calidad de Aire</p>
                            <p className='fs-6 text-center'>Calidad: {quality}</p>
                            <Link to='/mq' data-bs-toggle="tooltip" title="Haz clic para ver el gráfico">
                                <Widget metric={mqQuality ? mqQuality : 0} unity="ppm" color={mqColor} />
                            </Link>
                        </div>
                    </div>
                    <div className='row mt-5'>
                        <div className='col-lg-4 col-md-12 col-12 d-flex flex-column'>
                            <p className='fs-2 text-center'>Modo Automático</p>
                            <Toggle id="automatico" handle={toggleAutomatic} state={automatico} />
                        </div>
                        <div className='col-lg-4 col-md-12 col-12 d-flex flex-column'>
                            <p className='fs-2 text-center'>Foco Incandescente</p>
                            <Toggle id="light" handle={toggleLight} state={focoState} />
                        </div>
                        <div className='col-lg-4 col-md-12 col-12 d-flex flex-column'>
                            <p className='fs-2 text-center'>Ventilador</p>
                            <Toggle id="fan" handle={toggleFan} state={ventiladorState} />
                        </div>
                    </div>
                </>
            ) : (
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-md-8 mx-auto d-flex justify-content-center">
                            <div className="card mt-5">
                                <div className="card-body">
                                    <h5 className="card-title">Asignar Dispositivo</h5>
                                    <div className="mb-3">
                                        <label htmlFor="dispositivo" className="form-label">Código del Dispositivo:</label>
                                        <input type="password" className="form-control" id="dispositivo" value={dispositivo} onChange={handleDispositivoChange} />
                                    </div>
                                    <button className="btn btn-primary" onClick={asignarDispositivo}>Asignar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


const Widget = ({ metric, unity, color }) => {
    return (
        <CircularProgressbar
            minValue={0}
            maxValue={100}
            value={metric}
            text={`${metric} ${unity}`}
            styles={{
                path: {
                    stroke: color,

                },
                trail: {
                    stroke: 'white',
                    strokeWidth: 8
                },
                text: {
                    fill: "#000",
                    fontSize: 16,
                    fontWeight: "bold"
                },
                root: {
                    borderWidth: 8,
                    borderColor: "#000",
                    borderStyle: "solid",
                    borderRadius: "100%",
                }

            }} />
    )
}

const Toggle = ({ id, handle, state }) => {
    return (
        <div className="container2">
            <input hidden id={id} name={id} type="checkbox" style={{ display: 'none' }} onClick={handle} checked={state} />
            <label className="toggle2" htmlFor={id}>
                <div className="toggle__circle2" />
            </label>
            <div className="toggle-text2">
                <span>N</span>
                <span>F</span>
            </div>
        </div>
    )
};

export const DevicesTable = () => {
    const [devices, setDevices] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    useEffect(() => {
        fetchDevices();
    }, []);

    const fetchDevices = async () => {
        try {
            const response = await axios.get('https://ecoserver-zopz.onrender.com/devices');
            setDevices(response.data);
        } catch (error) {
            console.error('Error fetching devices:', error);
        }
    };

    const deleteDevice = async (mac) => {
        try {
            console.log(mac);
            await axios.delete(`https://ecoserver-zopz.onrender.com/devices/${mac}`);
            fetchDevices();
        } catch (error) {
            console.error('Error deleting device:', error);
        }
    };

    return (
        <div className="container mt-5 table-responsive">
            <h2 className="text-center">Lista de Dispositivos</h2>
            <div className='d-flex justify-content-end mb-2'>
                <button className='btn btn-outline-success' onClick={openModal}>Agregar dispositivo</button>
            </div>
            <table className="table table-striped table-bordered table-hover">
                <thead className="thead-dark">
                    <tr>
                        <th className="text-center">MAC</th>
                        <th className='text-center'>Codigo</th>
                        <th className="text-center">Temperatura</th>
                        <th className="text-center">Humedad</th>
                        <th className="text-center">MQ</th>
                        <th className="text-center">Calidad de Aire</th>
                    </tr>
                </thead>
                <tbody>
                    {devices.map(device => (
                        <tr key={device.mac}>
                            <td className="text-center">{device.mac}</td>
                            <td className='text-center'>{device.otp}</td>
                            <td className="text-center">{device.temperatura || "0"} °C</td>
                            <td className="text-center">{device.humedad || '--'} %</td>
                            <td className="text-center">{device.mq || '--'} ppm</td>
                            <td className="text-center">{device.quality || '--'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <AddDeviceModal showModal={showModal} closeModal={closeModal} fetchDevices={fetchDevices} />
        </div>
    );
};


const AddDeviceModal = ({ showModal, closeModal, fetchDevices }) => {
    const generateOTP = () => {
        let digits = '0123456789';
        let OTP = '';
        let len = digits.length;
        for (let i = 0; i < 8; i++)
            OTP += digits[Math.floor(Math.random() * len)];

        return OTP;
    }

    const [deviceName, setDeviceName] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            // Generar valores aleatorios para MAC, temperatura, humedad, calidad de aire y MQ
            const randomMac = Array(6)
                .fill(0)
                .map(() => Math.floor(Math.random() * 256))
                .map(num => num.toString(16).padStart(2, '0').toUpperCase())
                .join(':');

            const randomTemperature = Math.floor(Math.random() * 100);
            const randomHumidity = Math.floor(Math.random() * 100);
            const qualityLevels = ['Excelente', 'Bajo', 'Malo', 'Moderado'];
            const randomQualityIndex = Math.floor(Math.random() * qualityLevels.length);
            const randomQuality = qualityLevels[randomQualityIndex];
            const randomMQ = Math.floor(Math.random() * 1000);
            const otp = generateOTP();

            // Enviar solicitud POST para agregar el nuevo dispositivo
            await axios.post('https://ecoserver-zopz.onrender.com/insertDevice', {
                name: deviceName,
                mac: randomMac,
                temperatura: randomTemperature,
                humedad: randomHumidity,
                quality: randomQuality,
                mq: randomMQ,
                otp: otp
            });

            // Cerrar el modal después de agregar el dispositivo
            closeModal();

            fetchDevices();
        } catch (error) {
            console.error('Error adding device:', error);
        }
    };

    return (
        <div className={`modal ${showModal ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: showModal ? 'block' : 'none' }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Agregar Dispositivo</h5>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group mb-4">
                                <label htmlFor="deviceName">Nombre del Dispositivo</label>
                                <input type="text" className="form-control" id="deviceName" value={deviceName} onChange={(e) => setDeviceName(e.target.value)} required />
                            </div>
                            <button type="submit" className="btn btn-primary">Agregar</button>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={closeModal}>Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const TemperatureChart = () => {
    const [temperatureData, setTemperatureData] = useState([]);
    const [chart, setChart] = useState(null);
    const { currentUser } = useAuth(); // Suponiendo que useAuth es tu hook para obtener la información de autenticación

    useEffect(() => {
        const fetchTemperatureData = async () => {
            try {
                const response = await axios.get(`https://ecoserver-zopz.onrender.com/device/${currentUser.dispositivo}/history`);
                setTemperatureData(response.data);
            } catch (error) {
                console.error('Error fetching temperature data:', error.message);
            }
        };

        const interval = setInterval(fetchTemperatureData, 1000); // Actualizar cada segundo
        return () => clearInterval(interval); // Limpieza del intervalo al desmontar el componente
    }, [currentUser.dispositivo]);

    useEffect(() => {
        if (temperatureData.length > 0 && !chart) {
            createChart();
        } else if (chart) {
            updateChart();
        }
    }, [temperatureData, chart]);

    const createChart = () => {
        const ctx = document.getElementById('temperatureChart').getContext('2d');
        const validTemperatures = temperatureData
            .map(entry => parseFloat(entry.temperatura))
            .filter(temp => !isNaN(temp));

        const frequency = validTemperatures.reduce((acc, temp) => {
            acc[temp] = (acc[temp] || 0) + 1;
            return acc;
        }, {});

        const sortedTemperatures = Object.keys(frequency).sort((a, b) => a - b);
        const frequencies = sortedTemperatures.map(temp => frequency[temp]);

        const newChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: sortedTemperatures.map(temp => `${temp}°C`),
                datasets: [{
                    label: 'Frecuencia',
                    data: frequencies,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: '#36a2eb',
                    borderWidth: 1,
                    barThickness: 20
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: `Frecuencia de Temperaturas (${currentUser.dispositivo})`, fontSize: 24 } // Tamaño de fuente aumentado
                },
                scales: {
                    x: { title: { display: true, text: 'Temperatura (°C)', fontSize: 18 } }, // Tamaño de fuente aumentado
                    y: { title: { display: true, text: 'Frecuencia', fontSize: 18 } } // Tamaño de fuente aumentado
                }
            }
        });

        setChart(newChart);
    };

    const updateChart = () => {
        // No es necesario actualizar el gráfico si los datos no han cambiado
    };

    return (
        <div className="container mt-5" style={{ width: '80%', margin: '0 auto' }}>
            <div className="row">
                <div className="col-12">
                    <div className="card w-100">
                        <div className="card-body">
                            <canvas id="temperatureChart" width="800" height="400"></canvas>
                        </div>
                    </div>
                </div>
                <div className='col-12 mt-3'>
                    {temperatureData.length > 0 && (
                        <div className="card w-100">
                            <div className="card-body">
                                <h5 className="card-title">Datos relevantes sobre la temperatura</h5>
                                <p><strong>Dispositivo:</strong> {currentUser.dispositivo}</p>
                                <p><strong>Número de registros:</strong> {temperatureData.length}</p>
                                {temperatureData.length > 0 && (() => {
                                    const validTemperatures = temperatureData
                                        .map(entry => parseFloat(entry.temperatura))
                                        .filter(temp => !isNaN(temp));

                                    if (validTemperatures.length > 0) {
                                        const maxTemperature = Math.max(...validTemperatures);
                                        const minTemperature = Math.min(...validTemperatures);
                                        return (
                                            <>
                                                <p><strong>Temperatura máxima:</strong> {maxTemperature}°C</p>
                                                <p><strong>Temperatura mínima:</strong> {minTemperature}°C</p>
                                            </>
                                        );
                                    } else {
                                        return <p>No hay valores de temperatura válidos.</p>;
                                    }
                                })()}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const HumidityChart = () => {
    const [humidityData, setHumidityData] = useState([]);
    const [chart, setChart] = useState(null);
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchHumidityData = async () => {
            try {
                const response = await axios.get(`https://ecoserver-zopz.onrender.com/device/${currentUser.dispositivo}/history`);
                setHumidityData(response.data);
            } catch (error) {
                console.error('Error fetching humidity data:', error.message);
            }
        };

        const interval = setInterval(fetchHumidityData, 1000);
        return () => clearInterval(interval);
    }, [currentUser.dispositivo]);

    useEffect(() => {
        if (humidityData.length > 0 && !chart) {
            createChart();
        } else if (chart) {
            updateChart();
        }
    }, [humidityData, chart]);

    const createChart = () => {
        const ctx = document.getElementById('humidityChart').getContext('2d');
        const validHumidities = humidityData
            .map(entry => parseFloat(entry.humedad))
            .filter(humidity => !isNaN(humidity));

        const frequency = validHumidities.reduce((acc, humidity) => {
            acc[humidity] = (acc[humidity] || 0) + 1;
            return acc;
        }, {});

        const sortedHumidities = Object.keys(frequency).sort((a, b) => a - b);
        const frequencies = sortedHumidities.map(humidity => frequency[humidity]);

        const newChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: sortedHumidities.map(humidity => `${humidity}%`),
                datasets: [{
                    label: 'Frecuencia',
                    data: frequencies,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    barThickness: 20
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: `Frecuencia de Humedad (${currentUser.dispositivo})`, fontSize: 24 }
                },
                scales: {
                    x: { title: { display: true, text: 'Humedad (%)', fontSize: 18 } },
                    y: { title: { display: true, text: 'Frecuencia', fontSize: 18 } }
                }
            }
        });

        setChart(newChart);
    };

    const updateChart = () => {
        // No es necesario actualizar el gráfico si los datos no han cambiado
    };

    return (
        <div className="container mt-5" style={{ width: '80%', margin: '0 auto' }}>
            <div className="row">
                <div className="col-12">
                    <div className="card w-100">
                        <div className="card-body">
                            <canvas id="humidityChart" width="800" height="400"></canvas>
                        </div>
                    </div>
                </div>
                <div className='col-12 mt-3'>
                    {humidityData.length > 0 && (
                        <div className="card w-100">
                            <div className="card-body">
                                <h5 className="card-title">Datos relevantes sobre la humedad</h5>
                                <p><strong>Dispositivo:</strong> {currentUser.dispositivo}</p>
                                <p><strong>Número de registros:</strong> {humidityData.length}</p>
                                {humidityData.length > 0 && (() => {
                                    const validHumidities = humidityData
                                        .map(entry => parseFloat(entry.humedad))
                                        .filter(humidity => !isNaN(humidity));

                                    if (validHumidities.length > 0) {
                                        const maxHumidity = Math.max(...validHumidities);
                                        const minHumidity = Math.min(...validHumidities);
                                        return (
                                            <>
                                                <p><strong>Humedad máxima:</strong> {maxHumidity}%</p>
                                                <p><strong>Humedad mínima:</strong> {minHumidity}%</p>
                                            </>
                                        );
                                    } else {
                                        return <p>No hay valores de humedad válidos.</p>;
                                    }
                                })()}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const AirQualityChart = () => {
    const [airQualityData, setAirQualityData] = useState([]);
    const [chart, setChart] = useState(null);
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchAirQualityData = async () => {
            try {
                const response = await axios.get(`https://ecoserver-zopz.onrender.com/device/${currentUser.dispositivo}/history`);
                setAirQualityData(response.data);
            } catch (error) {
                console.error('Error fetching air quality data:', error.message);
            }
        };

        const interval = setInterval(fetchAirQualityData, 1000);
        return () => clearInterval(interval);
    }, [currentUser.dispositivo]);

    useEffect(() => {
        if (airQualityData.length > 0 && !chart) {
            createChart();
        } else if (chart) {
            updateChart();
        }
    }, [airQualityData, chart]);

    const createChart = () => {
        const ctx = document.getElementById('airQualityChart').getContext('2d');
        const validAirQuality = airQualityData
            .map(entry => parseFloat(entry.mq))
            .filter(quality => !isNaN(quality));

        const frequency = validAirQuality.reduce((acc, quality) => {
            acc[quality] = (acc[quality] || 0) + 1;
            return acc;
        }, {});

        const sortedQuality = Object.keys(frequency).sort((a, b) => a - b);
        const frequencies = sortedQuality.map(quality => frequency[quality]);

        const newChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: sortedQuality,
                datasets: [{
                    label: 'Frecuencia',
                    data: frequencies,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    barThickness: 20
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: `Frecuencia de Calidad del Aire (${currentUser.dispositivo})`, fontSize: 24 }
                },
                scales: {
                    x: { title: { display: true, text: 'Calidad del Aire', fontSize: 18 } },
                    y: { title: { display: true, text: 'Frecuencia', fontSize: 18 } }
                }
            }
        });

        setChart(newChart);
    };

    const updateChart = () => {
        // No es necesario actualizar el gráfico si los datos no han cambiado
    };

    return (
        <div className="container mt-5" style={{ width: '80%', margin: '0 auto' }}>
            <div className="row">
                <div className="col-12">
                    <div className="card w-100">
                        <div className="card-body">
                            <canvas id="airQualityChart" width="800" height="400"></canvas>
                        </div>
                    </div>
                </div>
                <div className='col-12 mt-3'>
                    {airQualityData.length > 0 && (
                        <div className="card w-100">
                            <div className="card-body">
                                <h5 className="card-title">Datos relevantes sobre la calidad del aire</h5>
                                <p><strong>Dispositivo:</strong> {currentUser.dispositivo}</p>
                                <p><strong>Número de registros:</strong> {airQualityData.length}</p>
                                {airQualityData.length > 0 && (() => {
                                    const validQuality = airQualityData
                                        .map(entry => parseFloat(entry.mq))
                                        .filter(quality => !isNaN(quality));

                                    if (validQuality.length > 0) {
                                        const maxQuality = Math.max(...validQuality);
                                        const minQuality = Math.min(...validQuality);
                                        return (
                                            <>
                                                <p><strong>Calidad del aire máxima:</strong> {maxQuality}</p>
                                                <p><strong>Calidad del aire mínima:</strong> {minQuality}</p>
                                            </>
                                        );
                                    } else {
                                        return <p>No hay valores válidos de calidad del aire.</p>;
                                    }
                                })()}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

