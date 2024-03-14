import React, { useState } from 'react';

const SubiendoImagenes = (props) => {
  const [imagen, setImagen] = useState("");
  const [loadingImagen, setLoadingImagen] = useState(false);

  const upLoadingImagen = async (e) => {
    const files = e.target.files;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "Products");
    setLoadingImagen(true);

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/djy0fxyoq/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      if (!res.ok) {
        console.error("Error en la carga de la imagen:", res.status, res.statusText);
        throw new Error("Error en la carga de la imagen");
      }

      const file = await res.json();
      const public_id = file.public_id;

      // Construye la URL de entrega de activos
      const imageUrl = `https://res.cloudinary.com/dotqbgiv3/image/upload/${public_id}`;

      // Usa imageUrl como desees en tu aplicación React
      setImagen(imageUrl);
    } catch (error) {
      console.error("Error al cargar la imagen:", error);
    } finally {
      setLoadingImagen(false);
    }
  };
};