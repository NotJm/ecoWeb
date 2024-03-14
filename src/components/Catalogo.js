import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

export const Catalogo = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(3);

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

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleBuy = (product) => {
        Swal.fire({
            title: 'Compra exitosa',
            text: '¡Gracias por su compra!',
            icon: 'success',
            timer: 1000, 
            timerProgressBar: true,
            showConfirmButton: false
        });
    };

    return (
        <div className="container mt-5">
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
                                                <button className="btn btn-success" onClick={() => handleBuy(product)}>
                                                    Comprar
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
