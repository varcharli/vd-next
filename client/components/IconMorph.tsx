
import React, { useState } from 'react';

import { GoArrowUpRight } from "react-icons/go";


interface IconTurnedProps {
  onClick?: () => void;
  text?: string;
  faIcon?: React.ReactNode;
}

const IconTurned: React.FC<IconTurnedProps> = ({ onClick, text,faIcon }) => {
  const icon = <div className='w-[16px] h-[16px]'> { faIcon ?? <GoArrowUpRight />}</div>;
  const [isStart, setIsStart] = useState(false);
  const [isEnter, setIsEnter] = useState(false);

  const handelEnter = () => {
    setIsEnter(true);
    setIsStart(true);
  }

  const handelLeave = () => {
    setIsEnter(true);
    setIsStart(false);
  }

  return (
    <div className='flex items-center gap-3 cursor-pointer text-slate-500 hover:text-slate-800'
      onMouseEnter={handelEnter}
      onMouseLeave={handelLeave}
      onClick={onClick}>
      {text ?? ''}
      <div>
        {
          <div className={isEnter ?
            isStart ? 'transition transform duration-500 rotate-45 '
              : 'transition transform duration-500 rotate-0'
            : ''} >
            {icon}
          </div>

        }
      </div>
    </div>
  );
}

export default IconTurned;