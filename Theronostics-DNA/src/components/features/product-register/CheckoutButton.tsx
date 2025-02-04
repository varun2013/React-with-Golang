// components/product/CheckoutButton.tsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faSpinner } from "@fortawesome/free-solid-svg-icons";

interface CheckoutButtonProps {
  loading: boolean;
  disabled: boolean;
  onCheckout: () => void;
}

export const CheckoutButton: React.FC<CheckoutButtonProps> = ({
  loading,
  disabled,
  onCheckout
}) => {
  return (
    <div className="d-flex justify-content-end mb-4">
      <button
        type="submit"
        onClick={onCheckout}
        className={loading || disabled? "disabled-btn" : "filled-btn"}
        disabled={loading || disabled}
      >
        {loading ? (
          <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
        ) : (
          <>
            <span className="me-2">
              <FontAwesomeIcon icon={faShoppingCart} />
            </span>
            Proceed To Checkout
          </>
        )}
      </button>
    </div>
  );
};
