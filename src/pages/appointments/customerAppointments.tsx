import { Button } from "primereact/button";
import { Carousel } from "primereact/carousel";
import { useEffect, useState } from "react";
import { ProductService } from "./service/ProductService";

const CustomerAppointments: NextPage = () => {
  const [products, setProducts] = useState([]);
  const responsiveOptions = [
    {
      breakpoint: "1199px",
      numVisible: 3,
      numScroll: 3,
    },
    {
      breakpoint: "991px",
      numVisible: 2,
      numScroll: 2,
    },
    {
      breakpoint: "767px",
      numVisible: 1,
      numScroll: 1,
    },
  ];

  useEffect(() => {
    ProductService.getProductsSmall().then((data) =>
      setProducts(data.slice(0, 9))
    );
  }, []);

  const appointments = (appointment) => {
    return (
      <div className="product-item">
        <div className="product-item-content">
          <div className="mb-3">
            <img
              src={`https://primefaces.org/cdn/primereact/images/product/${product.image}`}
              alt={product.name}
              className="product-image"
            />
          </div>
          <div>
            <h4 className="mb-1">{product.name}</h4>
            <h6 className="mt-0 mb-3">${product.price}</h6>
            <span
              className={`product-badge status-${product.inventoryStatus.toLowerCase()}`}
            >
              {product.inventoryStatus}
            </span>
            <div className="car-buttons mt-5">
              <Button
                icon="pi pi-search"
                className="p-button p-button-rounded mr-2"
              />
              <Button
                icon="pi pi-star-fill"
                className="p-button-success p-button-rounded mr-2"
              />
              <Button
                icon="pi pi-cog"
                className="p-button-help p-button-rounded"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/*Scheduled Appointments*/}
      <div className="card">
        <Carousel
          value={products}
          numVisible={3}
          numScroll={3}
          responsiveOptions={responsiveOptions}
          itemTemplate={productTemplate}
        />
      </div>

      {/*Pending Appointments*/}
      <div className="card">
        <Carousel
          value={products}
          numVisible={3}
          numScroll={3}
          responsiveOptions={responsiveOptions}
          itemTemplate={productTemplate}
        />
      </div>

      {/*Previous Appointments*/}
      <div className="card">
        <Carousel
          value={products}
          numVisible={3}
          numScroll={3}
          responsiveOptions={responsiveOptions}
          itemTemplate={productTemplate}
        />
      </div>
    </div>
  );
};

export default CustomerAppointments;
