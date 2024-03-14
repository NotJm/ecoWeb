import React from "react";

export const Slider = ({ img1, img2, img3 }) => {
    return (
        <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
            <div className="carousel-indicators">
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
            </div>
            <div className="carousel-inner">
                <div className="carousel-item active">
                    <img src={img1} className="d-block w-100" alt="..." />
                    <div className="carousel-caption d-flex align-items-center justify-content-center">
                        <div className="text-center">
                            <h5>Empoderandos</h5>
                            <p className="fst-italic">"Eco-Nido: Sembrando sueños, incubando un futuro sostenible."</p>
                        </div>
                    </div>
                </div>
                <div className="carousel-item">
                    <img src={img2} className="d-block w-100" alt="..." />
                    <div className="carousel-caption d-flex align-items-center justify-content-center">
                        <div className="text-center">
                            <h5>Empoderando</h5>
                            <p>"¡Eco-Nido, donde el futuro se incuba con respeto al medio ambiente y amor por la naturaleza!"</p>
                        </div>
                    </div>
                </div>
                <div className="carousel-item">
                    <img src={img2} className="d-block w-100" alt="..." />
                    <div className="carousel-caption d-flex align-align-self-center justify-content-center">
                        <div className="text-center">
                            <h5>Empoderando</h5>
                            <p>"Eco-Nido: Donde la innovación se encuentra con la naturaleza, y los sueños eclosionan en armonía."</p>
                        </div>
                    </div>
                </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    );
};

export const IntroSection = () => {
    return (
        <div
            id="intro-example"
            className="p-5 text-center bg-image"
            style={{
                backgroundImage: "url('https://pollitosdegallina.com/wp-content/uploads/2022/01/Banner.jpg')",
                backgroundRepeat: 'no-repeat',
            }}
        >
            <div className="mask" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                <div className="d-flex justify-content-center align-items-center h-100">
                    <div className="text-white">
                        <h1 className="mb-3">Empoderando</h1>
                        <h5 className="mb-4">¡Eco-Nido, donde el futuro se incuba con respeto al medio ambiente y amor por la naturaleza!</h5>
                        <a
                            data-mdb-ripple-init
                            className="btn btn-danger btn-lg m-2"
                            href="/acercaDe"
                            role="button"
                        >
                            Conócenos
                        </a>
                        <a
                            data-mdb-ripple-init
                            className="btn btn-danger btn-lg m-2"
                            href="/catalogo"
                            role="button"
                        >
                            Incubadoras
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

