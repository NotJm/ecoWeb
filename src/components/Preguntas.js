import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

export const Preguntas = () => {
  const [preguntas, setPreguntas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://ecoserver-zopz.onrender.com/preguntas');
        setPreguntas(response.data);
      } catch (error) {
        console.error('Error al obtener las preguntas:', error);
      }
    };

    fetchData();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.delete(`https://ecoserver-zopz.onrender.com/preguntas/${id}`);
      setPreguntas(preguntas.filter(pregunta => pregunta._id !== id));
      Swal.fire({
        title: "Respuesta aprobada con exito",
        icon: 'success',
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 1200,
        timerProgressBar: true,
        allowEnterKey: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
    } catch (error) {
      console.error('Error al aprobar la pregunta:', error);
    }
  };

  const handleDeny = async (id) => {
    try {
      await axios.delete(`https://ecoserver-zopz.onrender.com/preguntas/${id}`);
      setPreguntas(preguntas.filter(pregunta => pregunta._id !== id));
      Swal.fire({
        title: "Respuesta denegada con exito",
        icon: 'success',
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 1200,
        timerProgressBar: true,
        allowEnterKey: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
    } catch (error) {
      console.error('Error al denegar la pregunta:', error);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = preguntas.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(preguntas.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className='container mt-5'>
      <h2>Preguntas</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Email</th>
            <th>Tema</th>
            <th>Mensaje</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((pregunta) => (
            <tr key={pregunta._id}>
              <td>{pregunta.email}</td>
              <td>{pregunta.pregunta}</td>
              <td>{pregunta.mensaje}</td>
              <td>
                <Button variant="success" onClick={() => handleApprove(pregunta._id)}>Aprobar</Button>{' '}
                <Button variant="danger" onClick={() => handleDeny(pregunta._id)}>Denegar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <nav>
        <ul className="pagination d-flex justify-content-center">
          {pageNumbers.map((number) => (
            <li key={number} className={number === currentPage ? 'page-item active' : 'page-item'}>
              <button onClick={() => paginate(number)} className="page-link">
                {number}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
