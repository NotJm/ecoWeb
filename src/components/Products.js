import React, { useState, useEffect } from "react";
import axios from "axios";


export const ProductsManagementTable = () => {
  const [productos, setProductos] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    stock: 0,
    description: "",
  });

  useEffect(() => {
    axios.get("https://ecoserver-zopz.onrender.com/productos")
      .then(response => {
        setProductos(response.data);
      })
      .catch(error => console.error("Error fetching products:", error));
  }, []);

  const handleEdit = (product) => {
    setEditingProduct({ ...product });
  };

  const handleSaveEdit = () => {
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
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct({ ...editingProduct, [name]: value });
  };
// //////////////////////
  return (
    <div className="container mt-5">
      <h2 className="text-light">Lista de productos</h2>
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
            {productos.map((product) => (
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
                    product.price
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
                      <button className="btn btn-success" onClick={handleSaveEdit}>
                        Guardar
                      </button>
                      <button className="btn btn-danger" onClick={handleCancelEdit}>
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-primary" onClick={() => handleEdit(product)}>
                        Editar
                      </button>
                      <button className="btn btn-danger" onClick={() => handleDelete(product._id)}>
                        Eliminar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  // /////////////////////
};