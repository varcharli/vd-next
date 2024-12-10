import { Image } from "@nextui-org/react";
import React from "react";
import nullImage from "@/public/images/user.svg";

interface MyAvatarProps {
    src?: string;
    title?: string;
    size?: number;
}

const MyAvatar: React.FC<MyAvatarProps> = ({ src, title,size }) => {
    size = size || 100;
    console.log('src:', src);
    src = src || nullImage;
    return <div className="flex flex-col items-center justify-center ">
        <div>
            <Image src={src} alt="" className={`w-[${size}px] h-[${size}px] border-1 border-gray-500 `}
                radius="full"
                referrerPolicy='no-referrer' style={{ objectFit: 'cover' }} />
        </div>
        {title && <h2 className={`w-[${size}px] text-center`}>{title}</h2>}
    </div>;
};

export default MyAvatar;