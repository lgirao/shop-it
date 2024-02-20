import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingInfo } from '../../redux/features/cartSlice';
import { useNavigate } from 'react-router-dom';
import MetaData from '../layout/MetaData';

const Shipping = () => {
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [phoneNo, setPhoneNo] = useState("");

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { shippingInfo } = useSelector((state) => state.cart);

  useEffect(() => {
    if (shippingInfo) {
      setAddress(shippingInfo?.address);
      setCity(shippingInfo?.city);
      setState(shippingInfo?.state);
      setZipCode(shippingInfo?.zipCode);
      setPhoneNo(shippingInfo?.phoneNo);
    }
  }, [shippingInfo]);

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(saveShippingInfo({ address, city, state, zipCode, phoneNo }));

    navigate("/confirm_order");
  }

  return (
    <>
    <MetaData title={"Shipping Info"} />
    <div className="row wrapper mb-5">
      <div className="col-10 col-lg-5">
        <form
          className="shadow rounded bg-body"
          onSubmit={submitHandler}
        >
          <h2 className="mb-4">Shipping Info</h2>
          <div className="mb-3">
            <label htmlFor="address_field" className="form-label">Address</label>
            <input
              type="text"
              id="address_field"
              className="form-control"
              name="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="city_field" className="form-label">City</label>
            <input
              type="text"
              id="city_field"
              className="form-control"
              name="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="state_field" className="form-label">City</label>
            <input
              type="text"
              id="state_field"
              className="form-control"
              name="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="zip_code_field" className="form-label">Zip Code</label>
            <input
              type="number"
              id="zip_code_field"
              className="form-control"
              name="zipCode"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="phone_field" className="form-label">Phone No</label>
            <input
              type="tel"
              id="phone_field"
              className="form-control"
              name="phoneNo"
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
              required
            />
          </div>

          {/* <div className="mb-3">
            <label htmlFor="country_field" className="form-label">Country</label>
            <select
              id="country_field"
              className="form-select"
              name="country"
              required
            >
              <option value="Country1">Country1</option>
              <option value="Country2">Country2</option>
            </select>
          </div> */}

          <button id="shipping_btn" type="submit" className="btn w-100 py-2">
            CONTINUE
          </button>
        </form>
      </div>
    </div>
    </>
  )
}

export default Shipping;