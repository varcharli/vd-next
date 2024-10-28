import React from "react";
import { Spinner } from "@nextui-org/react";

export const Loading = () => {
    return (
        <div className="flex flex-col items-center justify-center h-[50vh]">
            <Spinner color="default" size="lg" />
            <p className="text-gray-500 py-6">Loading...</p>
        </div>
    );
}