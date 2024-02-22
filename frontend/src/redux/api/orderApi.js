import { createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const orderApi = createApi({
    reducerPath: "orderApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api/v1"}),
    endpoints: (builder) => ({
        createNewOrder: builder.mutation({
          query(body) {
            return {
              url: "/orders/new",
              method: "POST",
              body
            }
          }
        }),
        stripeCheckoutSession: builder.mutation({
          query(body) {
            return {
              url: "/payment/checkout_session",
              method: "POST",
              body
            }
          }
        }),
        myOrders: builder.query({
          query: () => `/user/order`
        }),
        orderDetails: builder.query({
          query: (id) => `/orders/${id}`
        }),
    })
})

export const {  
  useCreateNewOrderMutation, 
  useStripeCheckoutSessionMutation, 
  useMyOrdersQuery,
  useOrderDetailsQuery 
} = orderApi;