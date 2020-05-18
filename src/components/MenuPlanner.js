import React from 'react';

export const CalendarDay = ({day}) => {

	return (
		<div className="border border-black w-8 bg-white text-center font-bold text-xl" style={{borderTop:"5px solid red"}}>
          {day}
        </div>
	)
}
