import { createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { setIsAuthenticated, setLoading, setUser } from "../features/userSlice";

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api/v1"}),
    tagTypes: ["User"],
    endpoints: (builder) => ({
        getProfile: builder.query({
            query: () => `/profile`,
            transformResponse: (result) => result.user,
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setUser(data))
                    dispatch(setIsAuthenticated(true))
                    dispatch(setLoading(false))
                } catch (error) {
                    dispatch(setLoading(false))
                    console.log(error);
                }
            },
            providesTags: ["User"]
        }),
        updateProfile: builder.mutation({
            query(body) {
                return {
                    url: "profile/update",
                    method: "PUT",
                    body
                }
            },
            invalidatesTags: ["User"]
        })
    })
})

export const { useGetProfileQuery, useUpdateProfileMutation } = userApi;