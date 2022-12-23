/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import productsStore from '../store/products.store';
import checkoutStore from '../store/checkout.store';
import { getUserLocalStorage } from '../helpers/localStorage';
import makeRequest from '../helpers/axios.integration';
import Table from './Table';
import CheckoutSComponent from '../styles/checkout.style';
import SubmitButton from './SubmitButton';

function Checkout() {
  const { id, token } = getUserLocalStorage();
  const { cart } = productsStore((state) => state);
  const { sellers, fetchSellers } = checkoutStore((state) => state);
  const [selectedOption, setSelectedOption] = useState('seller');
  const [sellerId, setSellerId] = useState(0);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryNumber, setDeliveryNumber] = useState('');
  const [display, setDisplay] = useState(false);
  const navigate = useNavigate();
  const tresMil = 3000;

  const totalPrice = cart
    .reduce((prev, curr) => prev + (parseFloat(curr.price) * curr.quantity), 0)
    .toFixed(2);

  const handleCheckout = async () => {
    const order = await makeRequest('checkout/order', 'post', {
      userId: id,
      sellerId,
      totalPrice,
      deliveryAddress,
      deliveryNumber,
      cart }, token);
    setDisplay(true);
    setTimeout(() => {
      navigate(`/customer/orders/${order.id}`);
    }, tresMil);
  };

  const handleChange = (event) => {
    console.log(selectedOption);
    setSelectedOption(event.target.value);
    setSellerId(Number(event.target.value));
  };

  useEffect(async () => {
    fetchSellers(token);
  }, []);

  useEffect(() => {
    console.log('The component was rendered or updated');
  }, [selectedOption]);

  return (
    <CheckoutSComponent>
      {
        display && (
          <div>
            <h1>Compra realizada com sucesso!</h1>
          </div>
        )
      }
      <div
        className="title_finalizar_pedido"
      >
        <h3>Finalizar Pedido</h3>
      </div>
      <container>
        <Table page="checkout" />
        <div
          className="container-total-a-pagar"
        >
          <div
            className="total-finalizado"
          >
            <h2>
              Total:
            </h2>
            <p>
              R$
            </p>
            <h2
              data-testid="customer_checkout__element-order-total-price"
            >
              {`${Math.trunc(totalPrice)}`}
            </h2>
            <p
              className="cents"
            >
              {`${Math.trunc((totalPrice - (Math.trunc(totalPrice))) * 100)}`}
            </p>
          </div>
        </div>

      </container>
      <div
        className="title_finalizar_pedido"
      >
        <h3>Detalhes e Endereço para Entrega</h3>
      </div>
      <div
        className="seller_details"
      >
        <label htmlFor="seller">
          P. Vendedora Responsável
          <select
            data-testid="customer_checkout__select-seller"
            name="seller"
            id="seller"
            onChange={ handleChange }
            // onChange={ ({ target: { value } }) => setSellerId(Number(value)) }
          >
            <option value="seller">Escolha seu vendedor</option>
            {
              sellers.map((seller) => (
                <option key={ seller.id } value={ seller.id }>{seller.name}</option>
              ))
            }
          </select>
        </label>
        <label htmlFor="address">
          Endereço
          <input
            type="text"
            data-testid="customer_checkout__input-address"
            placeholder="Digite seu endereço"
            onChange={ ({ target: { value } }) => setDeliveryAddress(value) }
          />
        </label>
        <label htmlFor="number">
          Número
          <input
            type="text"
            data-testid="customer_checkout__input-address-number"
            placeholder="Digite seu número"
            onChange={ ({ target: { value } }) => setDeliveryNumber(value) }
          />
        </label>
      </div>
      <SubmitButton handleCheckout={ handleCheckout } selectedOption={ selectedOption } />
    </CheckoutSComponent>
  );
}

export default Checkout;
