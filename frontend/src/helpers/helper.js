export const getPriceQueryParams = (searchParams, key, value) => {
    const hasValueInParam = searchParams.has(key);

    if(value && hasValueInParam) {
        searchParams.set(key, value)
    } else if(value) {
        searchParams.append(key, value)
    } else if(hasValueInParam) {
        searchParams.delete(key)
    }

    return searchParams;
};


export const calculateOrderCost = (cartItems) => {
    const itemsPrice = cartItems?.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    const shippingPrice = itemsPrice > 200 ? 0 : 25;

    const taxPrice = Number(0.06 * itemsPrice.toFixed(2)); 

    const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

    return {
        itemsPrice,
        shippingPrice,
        taxPrice: Number(taxPrice).toFixed(2),
        totalPrice
    }
};