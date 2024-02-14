import React, { useState } from 'react';
import { Link } from "react-router-dom";

const SideMenu = () => {

    const menuItems = [
        {
            name: "Profile",
            url: "/profile",
            icon: "fas fa-user"
        },
        {
            name: "Update Profile",
            url: "/profile/update_profile",
            icon: "fas fa-user"
        },
        {
            name: "Upload Avatar",
            url: "/profile/upload_avatar",
            icon: "fas fa-user-circle"
        },
        {
            name: "Update Password",
            url: "/profile/update_password",
            icon: "fas fa-lock"
        },
    ];

    const [activeMenuItem, setActiveMenuItem] = useState(location.pathname);

    const handleMenuItemClick = (menuItemUrl) => {
        setActiveMenuItem(menuItemUrl)
    };

    return (
        <div className="list-group mt-5 pl-4">
            {menuItems.map((menuItem, index) => (
                <Link
                    key={index}
                    to={menuItem.url}
                    className={
                        `fw-bold list-group-item list-group-item-action 
                        ${activeMenuItem.includes(menuItem.url) ? "active" : ""}`
                    }
                    aria-current={activeMenuItem.includes(menuItem.url) ? "true" : "false"}
                    onClick={() => handleMenuItemClick(menuItem.url)}
                >
                    <i className={`${menuItem.icon} fa-fw pe-2`}></i>
                    {menuItem.name}
                </Link>
            ))}
        </div>
    )
}

export default SideMenu