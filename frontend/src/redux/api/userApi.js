import { createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { setIsAuthenticated, setUser } from "../features/userSlice";

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api/v1"}),
    endpoints: (builder) => ({
        getProfile: builder.query({
            query: () => `/profile`,
            transformResponse: (result) => result.user,
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setUser(data))
                    dispatch(setIsAuthenticated(true))
                } catch (error) {
                    console.log(error);
                }
            }
        })
    })
})

export const { useGetProfileQuery } = userApi;