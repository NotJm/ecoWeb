import React from "react";
import { IntroSection } from "./Slider";
import './css/Home.css';
import { CarouselCatalogo } from "./Catalogo";
import { CreatorCard } from "./Card";
import { VisionMisionEmpresa } from "./AcercaDe";



export const Home = () => {
    return (
        <div>
            <div className="sliderContainer">
                <IntroSection />
            </div>
            <div className="mt-5">
                <CarouselCatalogo />
            </div>
        </div>
    )
}

