// components/product/ProductInfo.tsx
interface ProductInfoProps {
  name: string;
  description: string;
  price: number;
  gstPrice: number;
  image: string;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({
  name,
  description,
  price,
  image,
  gstPrice,
}) => {
  return (
    <section className="product-details-sec mt-5">
      <div className="container">
        <div className="row row-gap-3">
          <div className="col-lg-12">
            <p className="product-detail-heading">Product Details</p>
            <hr className="black-line mb-4" />
          </div>

          <div className="col-lg-4">
            <div className="product-img">
              <img src={image} className="img-fluid" alt={name} width={200} />
            </div>
          </div>
          <div className="col-lg-7">
            <div className="product-description">
              <h2 className="mt-3 mb-3 mt-lg-0">{name}</h2>
              <p className="mb-4"> {description}</p>
              <h3>
                ${price} <span> {`(includes $${gstPrice} GST)`}</span>
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
