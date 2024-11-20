
import React, { useEffect, useState } from 'react';
import { GoArrowUpRight } from "react-icons/go";
import { GrAdd, GrSubtract } from "react-icons/gr";
// import { FaCopy, FaCheck } from "react-icons/fa";
import { GrCopy } from "react-icons/gr";
import { delay } from '@/components';

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
  const iOpened = iconOpened ?? <GrSubtract />;
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

interface IconChangedProps {
  isStart: boolean;
  onFinished?: () => void;
}

export const IconChanged: React.FC<IconChangedProps> = ({ isStart, onFinished }) => {
  const [step, setStep] = useState(0);
  const maxStep = 4;

  useEffect(() => {
    if (!isStart) {
      setStep(0);
      return;
    }

    setStep(1);
  }, [isStart])

  useEffect(() => {
    if (isStart && step > 0) {
      delay(500).then(() => {
        const curStep = step + 1;
        if (curStep > maxStep) {
          if (onFinished) onFinished();
          setStep(0);
          return;
        } else {
          setStep(curStep);
        }
      });
    }
  }, [isStart, onFinished, step])


  const stepClass = (curStep: number) => {
    switch (curStep) {
      case 1:
        return 'animate-ping opacity-75';
      case 4:
        return 'animate-ping opacity-75';
      default:
        return '';
    }
  }

  // const stepContent = (curStep: number) => {
  //   switch (curStep) {
  //     case 0:
  //       return <FaCopy />;
  //     case 1:
  //       return <FaCopy />;
  //     case 2:
  //       return <FaCopy />;
  //     case 3:
  //       return <FaCopy />;
  //     case 4:
  //       return <FaCheck />;
  //     default:
  //       return <FaCopy />;
  //   }
  // }

  return (
    <div className='h-[16px] w-[16px] flex flex-col items-center justify-center'>
      <div className={stepClass(step)}>
        {step in [0, 1] ? <GrCopy /> : <div className='text-orange-500' >Copied </div>}
      </div></div>
  );
}

















export default IconTurned;