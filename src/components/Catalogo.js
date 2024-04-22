import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import Swal from "sweetalert2";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Card } from 'react-bootstrap';
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from './Auth';


export const Catalogo = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(3);
    const topRef = useRef(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("https://ecoserver-zopz.onrender.com/productos");
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching product data:", error);
                setError("Error fetching product data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        topRef.current.scrollIntoView({ behavior: 'smooth' });
    };


    const handleAboutme = (productId) => {
        navigate(`/producto/${productId}`);
    };

    return (
        <div ref={topRef} className="container mt-5">
            <h2 className="text-center mb-4 text-dark">Catálogo de Productos</h2>

            {loading ? (
                <div className="d-flex justify-content-center align-items-center">Cargando...</div>
            ) : error ? (
                <div className="d-flex justify-content-center align-content-center">Error: {error}</div>
            ) : (
                <>
                    <div className="row row-cols-1">
                        {currentProducts.map((product) => (
                            <div className="col mb-4" key={product.id}>
                                <div className="card h-100">
                                    <div className="row g-0">
                                        <div className="col-md-4">
                                            <img src={product.image} className="card-img" alt={product.name} />
                                        </div>
                                        <div className="col-md-8">
                                            <div className="card-body">
                                                <h5 className="card-title text-dark">{product.name}</h5>
                                                <p className="card-text text-dark card-description">{product.description}</p>
                                                <p className="card-text text-dark">Precio: {product.price}</p>

                                                <button className="btn btn-primary" onClick={() => handleAboutme(product._id)}>
                                                    Ver más
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <nav aria-label="Page navigation example">
                        <ul className="pagination justify-content-center">
                            {Array.from({ length: Math.ceil(products.length / productsPerPage) }, (_, i) => (
                                <li className={`page-item ${currentPage === i + 1 ? 'active' : ''}`} key={i}>
                                    <button className="page-link" onClick={() => paginate(i + 1)}>
                                        {i + 1}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </>
            )}
        </div>
    );
};



export const CarouselCatalogo = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const topRef = useRef(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("https://ecoserver-zopz.onrender.com/productos");
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching product data:", error);
                setError("Error fetching product data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1
    };

    // Estilo para fijar la altura de las tarjetas
    const cardStyle = {
        height: '100%' // Fijar la altura de las tarjetas al 100% del contenedor
    };

    // Estilo para las imágenes
    const imageStyle = {
        width: '100%', // Hacer que la imagen ocupe todo el ancho disponible
        height: '200px', // Establecer una altura fija para las imágenes
        objectFit: 'cover' // Controlar cómo se ajusta la imagen dentro de su contenedor
    };

    return (
        <div ref={topRef} className="container mt-5">
            <h2 className="text-center mb-4 text-dark">Catálogo de Productos</h2>

            {loading ? (
                <div className="d-flex justify-content-center align-items-center">Cargando...</div>
            ) : error ? (
                <div className="d-flex justify-content-center align-content-center">Error: {error}</div>
            ) : (
                <Slider {...settings}>
                    {products.map((product) => (
                        <div key={product.id} className="carousel-item">
                            <Card className="h-100" style={cardStyle}>
                                <Card.Body className="d-flex flex-column justify-content-between">
                                    <Card.Img variant="top" src={product.image} alt={product.name} style={imageStyle} />
                                    <div className="text-center">
                                        <Card.Title className="text-dark fw-bolder mt-2">{product.name}</Card.Title>
                                        <Card.Text className="text-dark">{product.description}</Card.Text>
                                        <Card.Text className="text-dark">Precio: {product.price}</Card.Text>
                                    </div>
                                    <button className="btn btn-success w-100" onClick={() => navigate("/catalogo")}>
                                        Ver más
                                    </button>
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                </Slider>
            )}
        </div>
    );

};


export const ProductDetailsPage = () => {
    const { id } = useParams(); // Obtener el ID del producto de los parámetros de la URL
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await axios.get(`https://ecoserver-zopz.onrender.com/productos/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error("Error fetching product details:", error);
                setError("Error fetching product details. Please try again later." + error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [id]); // Dependencia id para volver a cargar los detalles del producto cuando cambia


    const handleBuy = (product) => {
        if (currentUser) {
            Swal.fire({
                title: 'Compra exitosa',
                text: `¡Gracias por comprar ${product.name}!`,
                icon: 'success',
                timer: 1000,
                timerProgressBar: true,
                showConfirmButton: false
            });
        } else {
            Swal.fire({
                title: 'Necesita Iniciar Sesion',
                text: `Para poder comprar necesitar iniciar sesion`,
                icon: 'info',
                showConfirmButton: true,
                confirmButtonColor: '#22bf76',
                confirmButtonText: "Iniciar Sesion"
            }).then(() => {
                navigate("/iniciar-sesion")
            });
        }
    };

    return (
        <div className="container mt-5">


            {loading ? (
                <div className="d-flex justify-content-center align-items-center">Cargando...</div>
            ) : error ? (
                <div className="d-flex justify-content-center align-items-center">Error: {error}</div>
            ) : (
                <>
                    <h2 className="text-center mb-4 text-dark">Detalle de {product.name}</h2>
                    <div className="row">
                        <div className="col-md-6">
                            <img src={product.image} className="img-fluid" alt={product.name} />
                        </div>
                        <div className="col-md-6">
                            <h3 className="text-dark">{product.name}</h3>
                            <p className="text-dark">Precio: ${product.price}</p>
                            <p className="text-muted">{product.description}</p>
                            <p className="text-muted fw-bolder">Caracteristicas</p>
                            <ul class="list-group mb-2">
                                <li class="list-group-item">Sistema de volteo automático</li>
                                <li class="list-group-item">Control de temperatura automático</li>
                                <li class="list-group-item">Indicador LED de temperatura</li>
                                <li class="list-group-item">Fases de calor visibles en LED</li>
                                <li class="list-group-item">Acequias y ventilador para un control automático de la humedad</li>
                                <li class="list-group-item">Ventilador 140 mm para circulación de aire</li>
                                <li class="list-group-item">Limpieza fácil</li>
                                <li class="list-group-item">Dimensiones: 51 x 53 x 29 cm</li>
                                <li class="list-group-item">Capacidad 56 huevos con función nacedora y criadora</li>
                            </ul>
                            <button className="btn btn-success w-100" onClick={() => handleBuy(product)}>
                                Comprar
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
