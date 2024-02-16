import React, { useEffect, useState } from 'react';
import { useUpdatePasswordMutation } from '../../redux/api/userApi';
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import UserLayout from '../layout/UserLayout';
import MetaData from "../layout/MetaData";

const UpdatePassword = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const [updatePassword, { isLoading, error, isSuccess }] = useUpdatePasswordMutation();

    useEffect(() => {
        if (error) {
            toast.error(error?.data?.message)
        }

        if (isSuccess) {
            toast.success("Password updated");
            navigate("/profile");
        }
    }, [error, isSuccess]);

    const submitHandler = (e) => {
        e.preventDefault();

        if(password.length < 6) {
            return toast.error("Your password must be 6 or more characters")
        }

        const userData = {
            oldPassword,
            password
        }

        updatePassword(userData);
    }

    return (
        <>
        <MetaData title={"Update Password"} />

        <UserLayout>
            <div className="row wrapper">
                <div className="col-10 col-lg-8">
                    <form className="shadow rounded bg-body" onSubmit={submitHandler}>
                        <h2 className="mb-4">Update Password</h2>
                        <div className="mb-3">
                            <label htmlFor="old_password_field" className="form-label">
                                Old Password
                            </label>
                            <input
                                type="password"
                                id="old_password_field"
                                className="form-control"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="new_password_field" className="form-label">
                                New Password
                            </label>
                            <input
                                type="password"
                                id="new_password_field"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="btn update-btn w-100" disabled={isLoading}>
                            {isLoading ? "Updating..." : "Update Password"}
                        </button>
                    </form>
                </div>
            </div>
        </UserLayout>
        </>
    )
}

export default UpdatePassword