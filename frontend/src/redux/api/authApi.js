import { createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { userApi } from "./userApi";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api/v1"}),
    tagTypes: ["User"],
    endpoints: (builder) => ({
        login: builder.mutation({
            query(body) {
                return {
                    url: "/login",
                    method: "POST",
                    body
                }
            },
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    await dispatch(userApi.endpoints.getProfile.initiate(null));
                } catch (error) {
                    console.log(error);
                }
            }
        }),
        register: builder.mutation({
            query(body) {
                return {
                    url: "/register",
                    method: "POST",
                    body
                }
            },
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    await dispatch(userApi.endpoints.getProfile.initiate(null));
                } catch (error) {
                    console.log(error);
                }
            }
        }),
        logout: builder.query({
            query:() => "/logout"
        }),
        getUsers: builder.query({
            query:() => `/admin/users`,
            providesTags: ["User"]
        }),
        getUserDetails: builder.query({
            query: (id) => `/admin/users/${id}`,
            providesTags: ["User"],
        }),
        updateUser: builder.mutation({
            query({ id, body}) {
              return {
                url: `/admin/users/${id}`,
                method: "PUT",
                body
              }
            },
            invalidatesTags: ["User"]
        }),
        deleteUser: builder.mutation({
            query(id) {
              return {
                url: `/admin/users/${id}`,
                method: "DELETE",
              }
            },
            invalidatesTags: ["User"]
        }),
    })
})

export const { 
    useLoginMutation, 
    useRegisterMutation, 
    useLazyLogoutQuery,
    useGetUsersQuery,
    useGetUserDetailsQuery,
    useUpdateUserMutation,
    useDeleteUserMutation
} = authApi;