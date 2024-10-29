import { Button, Input, Divider } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import models from "@/services/models";
import { Loading } from "@/components";
import { FaUser } from "react-icons/fa";



export default function Profile() {
    const [userName, setUserName] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const areaTitle = (title: string) => {
        return (<div>
            <h1 className="text-xl font-thin text-gray-700 my-4">{title}</h1>
        </div>);
    }

    const showMessage = (message: string, isError: boolean = true) => {
        setMessage(message);
        setIsError(isError);
    }

    const handleChangePassword = async () => {
        const oldPassword = (document.getElementById('oldPassword') as HTMLInputElement).value;
        const newPassword = (document.getElementById('newPassword') as HTMLInputElement).value;
        const confirmPassword = (document.getElementById('confirmPassword') as HTMLInputElement).value;
        if (!oldPassword || !newPassword || !confirmPassword) {
            showMessage('All fields are required');
            return;
        }
        if (newPassword !== confirmPassword) {
            showMessage('New passwords do not match');
            return;
        }

        const response = await models.auth.changePassword(oldPassword, newPassword);
        if (response.ok) {
            showMessage('Password changed successfully', false);
        } else {
            showMessage('Error changing password');
        }

    }

    const handleLogout = () => {
        const userConfirmed = window.confirm("Are you sure you want to logout?");
        if (userConfirmed) {
            models.auth.logout();
        }
    };

    useEffect(() => {
        models.auth.me().then((user) => {
            if (user) {
                setUserName(user.name);
            } else {
                setUserName('None');
            }
            setIsLoading(false);
        });
    }
        , []);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="flex">
            <div className="flex flex-col w-[200px] p-4">
                <h1 className="text-2xl font-thin text-gray-700 my-4">Profile</h1>
                <div className="flex h-10 items-center">
                    <FaUser className="mr-2 text-gray-700" />
                    <div className="text-lg font-thin text-gray-700"> {userName}</div>
                </div>

            </div>
            <div className="flex flex-col justify-start items-start w-full p-4">
                <div className="w-[300px] text-gray-400">
                    {areaTitle("Change Password")}
                    <div className="mb-4">
                        <Input id="oldPassword"
                            type="password"
                            isClearable
                            label="Old Password"
                            fullWidth
                            size="sm"
                        />
                    </div>
                    <div className="mb-4">
                        <Input id="newPassword"
                            type="password"
                            isClearable
                            label="New Password"
                            fullWidth
                            size="sm"
                        />
                    </div>
                    <div className="mb-4">
                        <Input id="confirmPassword"
                            type="password"
                            isClearable
                            label="Confirm Password"
                            fullWidth
                            size="sm"
                        />
                    </div>
                    {message && (
                        <div className={`${isError ? 'text-red-500' : 'text-green-500'} my-4`}>
                            {message}
                        </div>
                    )}
                    <div className="mt-10">
                        <Button fullWidth onClick={handleChangePassword} >
                            Change Password
                        </Button>
                    </div>
                </div>
                <Divider className="my-10 w-full" />
                <div className="w-[300px]">
                    {areaTitle("Logout")}
                    <Button color="danger" fullWidth
                        onClick={handleLogout} >
                        Logout
                    </Button>
                </div>

            </div></div>
    );
}