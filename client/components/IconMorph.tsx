
import React, { useState } from 'react';
import { GoArrowUpRight } from "react-icons/go";
import { GrAdd ,GrSubtract} from "react-icons/gr";

interface IconTurnedProps {
  onClick?: () => void;
  text?: string;
  faIcon?: React.ReactNode;
}

const IconTurned: React.FC<IconTurnedProps> = ({ onClick, text, faIcon }) => {
  const icon = <div className='w-[16px] h-[16px]'> {faIcon ?? <GoArrowUpRight />}</div>;
  const [isStart, setIsStart] = useState(false);

  const handelEnter = () => {
    setIsStart(true);
  }

  const handelLeave = () => {
    setIsStart(false);
  }

  return (
    <div className='flex items-center gap-3 cursor-pointer text-slate-500 hover:text-slate-800'
      onMouseEnter={handelEnter}
      onMouseLeave={handelLeave}
      onClick={onClick}>
      {text ?? ''}
      <div>
        {<div className={`transition transform duration-500
            ${isStart ? "rotate-45" : "rotate-0"}`} >
          {icon}
        </div>}
      </div>
    </div>
  );
}


interface IconOpenedProps {
  isOpened?: boolean;
  text?: string;
  iconOpened?: React.ReactNode;
  iconClosed?: React.ReactNode;
}

export const IconOpened: React.FC<IconOpenedProps> = ({ isOpened, iconOpened, iconClosed }) => {
  const iOpened = iconOpened ?? <GrSubtract/>;
  const iClosed = iconClosed ?? <GrAdd />;

  return (
    <div className='text-slate-500 font-thin p-2  hover:bg-slate-100 rounded-md  ' >
      <div className={`transition transform duration-500 
        ${isOpened ? "rotate-180" : "rotate-90"} `}>
        {isOpened ? iOpened : iClosed}
      </div>
    </div>
  );
}

















export default IconTurned;