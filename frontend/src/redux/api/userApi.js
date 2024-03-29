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
        }),
        uploadAvatar: builder.mutation({
            query(body) {
                return {
                    url: "/upload_avatar",
                    method: "PUT",
                    body
                }
            },
            invalidatesTags: ["User"]
        }),
        updatePassword: builder.mutation({
            query(body) {
                return {
                    url: "/password/update",
                    method: "PUT",
                    body
                }
            }
        }),
        forgotPassword: builder.mutation({
            query(body) {
                return {
                    url: "/password/forgot",
                    method: "POST",
                    body
                }
            }
        }),
        resetPassword: builder.mutation({
            query({token, body}) {
                return {
                    url: `/password/reset/${token}`,
                    method: "PUT",
                    body
                }
            }
        })
    })
})

export const { 
    useGetProfileQuery, 
    useUpdateProfileMutation,
    useUploadAvatarMutation,
    useUpdatePasswordMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation
} = userApi;