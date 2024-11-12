
import React, { useState } from 'react';

import { GoArrowUpRight } from "react-icons/go";


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

export default IconTurned;