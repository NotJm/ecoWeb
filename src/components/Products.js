import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

export const ProductsManagementTable = () => {
  const navigate = useNavigate();
  const topRef = useRef(null);
  const [productos, setProductos] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(3);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await axios.get("https://ecoserver-zopz.onrender.com/productos")
      .then(response => {
        setProductos(response.data);
      })
      .catch(error => console.error("Error fetching products:", error));
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = productos.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = pageNumber => {
    setCurrentPage(pageNumber);
    topRef.current.scrollIntoView({ behavior: 'smooth' });
  }

  const handleEdit = (product) => {
    setEditingProduct({ ...product });
    setCurrentImage(product.imageUrl); // Establecer la URL de la imagen actual al editar el producto
  };

  const handleSaveEdit = () => {
    // Verificar que los campos requeridos no estén vacíos
    if (!editingProduct.name.trim() || !editingProduct.price || !editingProduct.stock || !editingProduct.description.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, completa todos los campos.'
      });
      return;
    }

    // Verificar que el precio y el stock sean números válidos
    if (isNaN(parseFloat(editingProduct.price)) || isNaN(parseInt(editingProduct.stock))) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, ingresa un precio y un stock válidos.'
      });
      return;
    }

    const { _id, ...productWithoutId } = editingProduct;

    axios.put(`https://ecoserver-zopz.onrender.com/productosedit/${_id}`, productWithoutId)
      .then(response => {
        console.log(response.data);
        setProductos(productos.map(product => (product._id === _id ? editingProduct : product)));
        setEditingProduct(null);
      })
      .catch(error => console.error("Error saving product edit:", error));
  };

  const handleDelete = (productId) => {
    axios.delete(`https://ecoserver-zopz.onrender.com/productos/${productId}`)
      .then(response => {
        console.log(response.data);
        setProductos(productos.filter(product => product._id !== productId));
      })
      .catch(error => console.error("Error deleting product:", error));
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setCurrentImage(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct({ ...editingProduct, [name]: value });
  };

  const handleAddProduct = () => {
    navigate('/addProductos');
  }

  const showCurrentImage = (productId, imageUrl) => {
    Swal.fire({
      title: 'Imagen Actual',
      html: `
        <img id="currentImage" src="${imageUrl}" alt="Imagen Actual" style="max-width: 100%; max-height: 300px;">
        <input type="file" id="newImage" accept="image/*" class="form-control mt-2">
      `,
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      preConfirm: async () => {
        const newImageFile = document.getElementById('newImage').files[0];
        if (newImageFile) {
          try {
            const formData = new FormData();
            formData.append('file', newImageFile);
            formData.append('upload_preset', 'ecoImages');

            const cloudinaryResponse = await axios.post('https://api.cloudinary.com/v1_1/djy0fxyoq/image/upload', formData);

            const newImageUrl = cloudinaryResponse.data.secure_url;

            await axios.put(`https://ecoserver-zopz.onrender.com/productosedit/${productId}`, { image: newImageUrl });

            const currentImage = document.getElementById('currentImage');
            currentImage.src = newImageUrl;

            Swal.fire({
              title: 'Imagen Actualizada',
              icon: 'success',
              timer: 1500,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
              allowEnterKey: false,
              allowOutsideClick: false,
              allowEscapeKey: false,
            });
          } catch (error) {
            console.error('Error al actualizar la imagen:', error);
            Swal.fire('Error', 'Hubo un problema al actualizar la imagen. Por favor, inténtalo de nuevo más tarde.', 'error');
          }
        } else {
          Swal.fire({
            title: 'No se selecciono ninguna imagen',
            icon: 'info',
            timer: 1500,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
            allowEnterKey: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
          });
        }
      }
    }).then(() => { fetchData(); });
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };


  return (
    <div ref={topRef} className="container mt-5">
      <h2 className="text-dark">Lista de productos</h2>
      <div className="d-flex justify-content-end mb-2">
        <button className="btn btn-outline-success me-2" onClick={handleAddProduct}>Agregar Producto</button>
      </div>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>Nombre del Producto</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product) => (
              <tr key={product._id}>
                <td>
                  {editingProduct && editingProduct._id === product._id ? (
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={editingProduct.name}
                      onChange={handleInputChange}
                    />
                  ) : (
                    product.name
                  )}
                </td>
                <td>
                  {editingProduct && editingProduct._id === product._id ? (
                    <input
                      type="number"
                      className="form-control"
                      name="price"
                      value={editingProduct.price}
                      onChange={handleInputChange}
                    />
                  ) : (
                    "$" + product.price
                  )}
                </td>
                <td>
                  {editingProduct && editingProduct._id === product._id ? (
                    <input
                      type="number"
                      className="form-control"
                      name="stock"
                      value={editingProduct.stock}
                      onChange={handleInputChange}
                    />
                  ) : (
                    product.stock
                  )}
                </td>
                <td>
                  {editingProduct && editingProduct._id === product._id ? (
                    <textarea
                      className="form-control"
                      name="description"
                      value={editingProduct.description}
                      onChange={handleInputChange}
                    />
                  ) : (
                    product.description
                  )}
                </td>
                <td>
                  {editingProduct && editingProduct._id === product._id ? (
                    <>
                      <button className="btn btn-success mb-2" onClick={handleSaveEdit}>
                        Guardar
                      </button>
                      <button className="btn btn-danger mb-2" onClick={handleCancelEdit}>
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-primary mb-2 me-1" onClick={() => handleEdit(product)}>
                        Editar
                      </button>
                      <button className="btn btn-danger mb-2" onClick={() => handleDelete(product._id)}>
                        Eliminar
                      </button>
                    </>
                  )}
                  <button className="btn btn-outline-primary mb-2 me-1" onClick={() => showCurrentImage(product._id, product.image)}>
                    Imagen
                  </button>
                  <button className="btn btn-outline-danger mb-2" onClick={() => handleViewProduct(product)}>
                    Detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {selectedProduct && (
          <ProductDetailModal product={selectedProduct} onClose={handleCloseModal} />
        )}
      </div>
      <nav>
        <ul className="pagination justify-content-center">
          {Array.from({ length: Math.ceil(productos.length / productsPerPage) }, (_, i) => (
            <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
              <button onClick={() => paginate(i + 1)} className="page-link">
                {i + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};


export const AddProducto = () => {
  const [productoData, setProductoData] = useState({
    nombre: '',
    precio: '',
    stock: '',
    descripcion: '',
    imagen: null
  });

  const [previewImagen, setPreviewImagen] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductoData({ ...productoData, [name]: value });
  };

  const handleImagenChange = (e) => {
    const imagen = e.target.files[0];
    setProductoData({ ...productoData, imagen });
    setPreviewImagen(URL.createObjectURL(imagen));
  };

  const upLoadingImagen = async () => {
    const data = new FormData();
    data.append("file", productoData.imagen);
    data.append("upload_preset", "ecoImages");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/djy0fxyoq/image/upload",
        data
      );

      const imageUrl = res.data.secure_url;

      return imageUrl;
    } catch (error) {
      console.error("Error al cargar la imagen:", error);
      throw new Error("Error al cargar la imagen");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nombre, precio, stock, descripcion, imagen } = productoData;

    if (!nombre || !precio || !stock || !descripcion || !imagen) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Por favor completa todos los campos',
      });
      return;
    }

    try {
      // Subir la imagen a Cloudinary
      const imageUrl = await upLoadingImagen();

      // Realizar la solicitud POST para agregar el producto con la URL de la imagen
      const data = {
        name: nombre,
        price: precio,
        stock: stock,
        description: descripcion,
        image: imageUrl // Agregamos la URL de la imagen
      };

      const response = await axios.post('https://ecoserver-zopz.onrender.com/addproductos', data);

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: '¡Producto agregado!',
          text: 'El producto ha sido agregado exitosamente.'
        });

        // Limpiar los campos del formulario después de la inserción exitosa
        setProductoData({
          nombre: '',
          precio: '',
          stock: '',
          descripcion: '',
          imagen: null
        });
        setPreviewImagen('');
      } else {
        throw new Error('Error al agregar el producto');
      }
    } catch (error) {
      console.error('Error al agregar el producto:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al agregar el producto. Por favor, intenta de nuevo más tarde.'
      });
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <h2>Subir Imagen</h2>
          <input
            type="file"
            name="imagen"
            onChange={handleImagenChange}
            className="form-control mb-3"
          />
          {previewImagen && (
            <img src={previewImagen} alt="Preview" className="img-fluid w-100" />
          )}
        </div>

        <div className="col-md-6 mt-md-5">
          <h2 className="text-center">Añadir Producto</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">Nombre del Producto</label>
              <input
                type="text"
                className="form-control"
                id="nombre"
                name="nombre"
                value={productoData.nombre}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="precio" className="form-label">Precio</label>
              <input
                type="number"
                className="form-control"
                id="precio"
                name="precio"
                value={productoData.precio}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="stock" className="form-label">Stock</label>
              <input
                type="number"
                className="form-control"
                id="stock"
                name="stock"
                value={productoData.stock}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="descripcion" className="form-label">Descripción</label>
              <textarea
                className="form-control"
                id="descripcion"
                name="descripcion"
                value={productoData.descripcion}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-danger w-100">Guardar Producto</button>
          </form>
        </div>
      </div>
    </div>
  );
};

const ProductDetailModal = ({ product, onClose }) => {
  return (
    <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Detalles del Producto: {product.name}</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <p><strong>Nombre del Producto:</strong> {product.name}</p>
            <p><strong>Precio:</strong> ${product.price}</p>
            <p><strong>Stock:</strong> {product.stock}</p>
            <p><strong>Descripción:</strong> {product.description}</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

