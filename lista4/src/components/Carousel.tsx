import {type ReactNode, useState } from 'react';

import { Carousel as Car, initMDB } from "mdb-ui-kit/js/mdb.es.min.js";
import { useEffect } from 'react';

interface Props {
    children: ReactNode[];
}

function Carousel({ children }: Props) {

    useEffect(() => {
      initMDB({ Carousel: Car });
    }, []);

    const items =
            children.map((item, index) => (
              <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                  {item}
              </div>
            ))

    return (
        <>
          {/*??????????????????????????*/}
        <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />
        <div id="carouselMaterialStyle" className="carousel slide carousel-fade" data-mdb-ride="carousel" data-mdb-carousel-init>

        <div className="carousel-inner rounded-5 shadow-4-strong">
          {items}
        </div>

        <button className="carousel-control-prev" type="button" data-mdb-target="#carouselMaterialStyle" data-mdb-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-mdb-target="#carouselMaterialStyle" data-mdb-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
        </button>
        </div>
        </>
    )
}

export default Carousel;
