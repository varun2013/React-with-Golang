import { useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import { BillingDetails } from "../../../types/product-register.type";

interface OrderSummaryTableProps {
  productName: string;
  productPrice: number;
  productGstPrice: number;
  formValues: Partial<BillingDetails>;
}

export const OrderSummaryTable: React.FC<OrderSummaryTableProps> = ({
  productName,
  productPrice,
  formValues,
  productGstPrice,
}) => {
  const { records } = useAppSelector(
    (state: RootState) => state.manageQuantityDiscount
  );

  const quantity = formValues.quantity ? parseInt(formValues.quantity) : 0;

  // Find the applicable discount
  const applicableDiscount = records
    .filter((record) => quantity >= record.quantity) // Only consider records where quantity matches or exceeds
    .reduce(
      (max, record) =>
        record.discount_percentage > max ? record.discount_percentage : max,
      0
    ); // Find the highest discount percentage

  const discountPercentage = applicableDiscount || 0;
  const gstPercentage = (productGstPrice / (productPrice-productGstPrice)) * 100; // GST percentage calculation
  const gstAmount = productGstPrice * quantity;
  const subtotal = productPrice * quantity - gstAmount;
  const discountAmount = (subtotal * discountPercentage) / 100;
  const totalAfterDiscount = subtotal - discountAmount;
  const grandTotal = totalAfterDiscount + gstAmount;

  const renderAddress = (
    address: string | undefined,
    townCity: string | undefined,
    region: string | undefined,
    country: string | undefined,
    postcode: string | undefined
  ) => {
    const addressParts = [address, townCity, region, country, postcode]
      .filter(Boolean)
      .join(", ");
    return addressParts ? <span>{addressParts}</span> : null;
  };

  return (
    <div className="table-responsive">
      <table className="table product-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <h4>
                {productName} x {quantity}
              </h4>
              {formValues && (
                <>
                  {formValues.first_name && (
                    <p className="m-0">
                      Full Name:{" "}
                      <span>
                        {formValues.first_name + " " + formValues.last_name}
                      </span>
                    </p>
                  )}
                  {formValues.email && (
                    <p className="m-0">
                      Email: <span>{formValues.email}</span>
                    </p>
                  )}
                  {formValues.phone_number && (
                    <p className="m-0">
                      Phone: <span>{formValues.phone_number}</span>
                    </p>
                  )}
                  {(formValues.street_address ||
                    formValues.town_city ||
                    formValues.region ||
                    formValues.country ||
                    formValues.postcode) && (
                    <p className="m-0">
                      Current Address:{" "}
                      {renderAddress(
                        formValues.street_address,
                        formValues.town_city,
                        formValues.region,
                        formValues.country,
                        formValues.postcode
                      )}
                    </p>
                  )}
                  {(formValues.shipping_address ||
                    formValues.shipping_town_city ||
                    formValues.shipping_region ||
                    formValues.shipping_country ||
                    formValues.shipping_postcode) && (
                    <p className="m-0">
                      Shipping Address:{" "}
                      {renderAddress(
                        formValues.shipping_address,
                        formValues.shipping_town_city,
                        formValues.shipping_region,
                        formValues.shipping_country,
                        formValues.shipping_postcode
                      )}
                    </p>
                  )}

                  {formValues.type === "clinic" && formValues.clinic_id && (
                    <p className="m-0">
                      Clinic ID: <span>{formValues.clinic_id}</span>
                    </p>
                  )}
                </>
              )}
            </td>
            <td>${subtotal.toFixed(2)}</td>
          </tr>
          {discountPercentage > 0 && (
            <tr>
              <td>
                Discount
                {discountPercentage === 0
                  ? " %"
                  : "(" + discountPercentage + "%" + ")"}{" "}
              </td>
              <td>-${discountAmount.toFixed(2)}</td>
            </tr>
          )}
          <tr>
            <td>
              {discountPercentage > 0 ? "Subtotal After Discount" : "Subtotal"}
            </td>
            <td>${totalAfterDiscount.toFixed(2)}</td>
          </tr>
          <tr>
            <td>
              GST
              {gstPercentage === 0
                ? "%"
                : "(" + gstPercentage.toFixed(2) + "%" + ")"}
            </td>
            <td>${gstAmount.toFixed(2)}</td>
          </tr>

          <tr>
            <td>
              <strong>Total</strong>
            </td>
            <td>
              ${grandTotal.toFixed(2)}{" "}
              <span className="gst-text">{`(includes $${gstAmount.toFixed(
                2
              )} GST)`}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
