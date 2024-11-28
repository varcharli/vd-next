import { Image } from "@nextui-org/react";
import React from "react";
import nullImage from "@/public/images/user.svg";

interface MyAvatarProps {
    src?: string;
    title?: string;
}

const MyAvatar: React.FC<MyAvatarProps> = ({ src, title }) => {
    console.log('src:', src);
    src = src || nullImage;
    return <div className="flex flex-col items-center justify-center ">
        <div className={`w-[100px] h-[100px] rounded-full bg-slate-200 border-1 border-slate-300`} >
            <Image src={src} alt="" className="rounded-full w-[100px] h-[100px] " referrerPolicy='no-referrer' style={{ objectFit: 'cover' }} />
        </div>
        {title && <h2 className={`w-[100px] text-center`}>{title}</h2>}
    </div>;
};

export default MyAvatar;