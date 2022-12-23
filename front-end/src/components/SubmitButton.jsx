import React from 'react';
import PropTypes from 'prop-types';

function SubmitButton({ handleCheckout, selectedOption }) {
  return (
    <button
      type="button"
      className="btn-finalizar"
      data-testid="customer_checkout__button-submit-order"
      onClick={ () => handleCheckout() }
      disabled={ selectedOption === 'seller' }
    >
      FINALIZAR PEDIDO
    </button>
  );
}

SubmitButton.propTypes = {
  handleCheckout: PropTypes.func.isRequired,
  selectedOption: PropTypes.string.isRequired,
};

export default SubmitButton;
