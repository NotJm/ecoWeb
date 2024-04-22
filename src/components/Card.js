import React from "react";
import "./css/Cards.css";
import { Card } from 'react-bootstrap';

export const VerticalCards = ({ image, title, description, foot }) => {
    return (
        <div className="card mb-3" style={{ maxWidth: '540px' }}>
            <div className="row g-0">
                <div className="col-md-4">
                    <img src={image} className="img-fluid rounded-start" alt="..." />
                </div>
                <div className="col-md-8">
                    <div className="card-body">
                        <h5 className="card-title">{title}</h5>
                        <p className="card-text">{description}</p>
                        <p className="card-text"><small className="text-body-secondary">{foot}</small></p>
                    </div>
                </div>
            </div>
        </div>
    );

};
//holas
export const Cards = ({ image, title, description, buttonText }) => {
    return (
        <div className="card cardWrapper">
            <img src={image} className="card-img-top" alt="..." />
            <div className="card-body">
                <h5 className="card-title">{title}</h5>
                <p className="card-text"> {description}</p>
                <div className="d-flex justify-content-center">
                    <a href="#" className="btn btn-primary"> {buttonText}</a>
                </div>
            </div>
        </div>
    );
}


export const CardHover = ({ title, description, image }) => (
    <div>
        <p className="fw-bolder">{title}</p>
        <div className="cardv1">
            <img
                src={image}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '8px',
                }}
                alt="Card Background"
            />
            <div className="card__content overflow-y-scroll">
                <p className="card__title">{title}</p>
                <p className="card__description">
                    {description}
                </p>
            </div>

        </div>
        <p style={{color:"#7c7979"}}>Pasa el cursor para más información</p>
    </div>
);


export const CardProduct = ({ image, title, description, price }) => {
    return (
        <div className="card mb-4">
            <img src={image} className="card-img-top" alt={title} />
            <div className="card-body">
                <h5 className="card-title">{title}</h5>
                <p className="card-text">{description}</p>
                <div className="d-flex justify-content-between align-items-center">
                    <p className="mb-0">${price}</p>
                    <button className="btn btn-primary">Agregar al carrito</button>
                </div>
            </div>
        </div>
    );
}

export const Cardv3 = ({ image, title, description, price, modal }) => {
    const handleModal = () => {
        console.log(image);
        modal({ title: title, description: description, price: price, image: image });
    }

    return (
        <div className="cardv3" onClick={handleModal}>
            <img
                src={image}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '8px',
                }}
                alt="Card Background"
                className="card-image"
            />
            <p className="card-title fs-3 text-center">{title}</p>
        </div>
    )
}



export const CreatorCard = ({ image, name, role }) => {
    return (
        <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={image} />
            <Card.Body>
                <Card.Title>{name}</Card.Title>
                <Card.Text>
                    {role}
                </Card.Text>
            </Card.Body>
        </Card>
    );
};


