import React, { useEffect } from 'react'
import MetaData from '../layout/MetaData';
import toast from 'react-hot-toast';
import CheckoutSteps from './CheckoutSteps';
import { useCreateNewOrderMutation, useStripeCheckoutSessionMutation } from '../../redux/api/orderApi';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { calculateOrderCost } from "../../helpers/helper.js";

const PaymentMethod = () => {

  //const [createNewOrder, { isLoading, error, isSuccess }] = useCreateNewOrderMutation();

  const [stripeCheckoutSession, { data: checkoutData, error: checkoutError, isLoading } ] = useStripeCheckoutSessionMutation();

  const navigate = useNavigate();

  const { shippingInfo, cartItems } = useSelector((state) => state.cart);

  useEffect(() => {
    if(checkoutData) {
      window.location.href = checkoutData?.url;
    }

    if(checkoutError) {
      toast.error(checkoutError?.data?.message)
    }

  }, [checkoutData, checkoutError]);

  const submitHandler = (e) => {
    e.preventDefault();

    const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calculateOrderCost(cartItems);

    const orderData = {
      shippingInfo,
      orderItems: cartItems,
      itemsPrice,
      shippingAmount: shippingPrice,
      taxAmount: taxPrice,
      totalAmount: totalPrice,
    }

    stripeCheckoutSession(orderData);
  }

  // useEffect(() => {
  //   if(error) {
  //     toast.error(error?.data?.message)
  //   }

  //   if(isSuccess) {
  //     navigate("/");
  //   }

  // }, [error, isSuccess]);

  return (
    <>
    <MetaData title={"Payment"} />
    <CheckoutSteps shipping confirmOrder payment />
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form
          className="shadow rounded bg-body"
          onSubmit={submitHandler}
        >
          <h2 className="mb-4">Select Payment Method</h2>

          {/* <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="payment_mode"
              id="codradio"
              value="COD"
            />
            <label className="form-check-label" htmlFor="codradio">
              Cash on Delivery
            </label>
          </div> */}
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="payment_mode"
              id="cardradio"
              value="Card"
            />
            <label className="form-check-label" htmlFor="cardradio">
              Card - VISA, MasterCard
            </label>
          </div>

          <button id="shipping_btn" type="submit" className="btn py-2 w-100" disabled={isLoading}>
            CONTINUE
          </button>
        </form>
      </div>
    </div>
    </>
  )
}

export default PaymentMethod;