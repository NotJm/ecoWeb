import React from 'react';
import GoogleMapReact from 'google-map-react';

export const Map = ({width, height}) => {
  const defaultProps = {
    center: {
      lat: 21.1555463,
      lng: -98.3990471
    },
    zoom: 16
  };

  return (
    <div style={{ height: height, width: width }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyDGyPPwyZj-5DOTn7X1ItSg-tdQrce8C1Q" }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      ></GoogleMapReact>
    </div>
  );
};
