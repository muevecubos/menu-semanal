import React,{useState} from 'react';

import {
  Link
} from "react-router-dom";

let alphabet = [];
var i = 'A'.charCodeAt(0), j = 'Z'.charCodeAt(0);
for (; i <= j; ++i) {
   alphabet.push(String.fromCharCode(i));
}


export default function Meals({meals,mealDelete}) {

	const [currentLetter,setCurrentLetter] = useState(false);
	const filterByLetter = (letter)=>{
		if (letter == currentLetter){
			setCurrentLetter(false)
			return;
		} 
		setCurrentLetter(letter);

	}

    let mealsAlpha = [];
    let sortedMeal = meals.sort((a,b)=>a.name < b.name ? -1:1);

    alphabet.forEach(letter=>{
        let d = {
            letter:letter,
            meals: sortedMeal.filter(m=>{
                let r = RegExp(`^${letter}`,'i');
                return r.test(m.name);
            })
        };
        mealsAlpha.push(d);
    })

    const deleteMeal = (e,meal_id) => {
        e.preventDefault();
        mealDelete(meal_id);
    }

	const filtered = currentLetter === false ? mealsAlpha : mealsAlpha.filter(letter=>letter.letter === currentLetter);

  return (
    <div className="flex flex-col justify-center mx-2">
    	Gestion de meals <Link to="/">Atrás</Link>
    	<div>
    		<input className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-2 block w-3/4 appearance-none leading-normal"  autoComplete="off"  placeholder="Escribe para filtrar o crear"/>
    		<div className="flex flex-col w-6 absolute right-0 mr-2">
    			{alphabet.map((letter,i)=>
    			<div onClick={()=>filterByLetter(letter)} className="w-6 h-6 cursor-pointer flex justify-center rounded mb-1 text-white bg-blue-600">{letter}</div>
    			)}
    		</div>
    		<div>
    			List of meals
    			{filtered.map((letter,i)=>
    			<div className="flex flex-col">
	    			<div className="border-b-2 text-lg border-blue-600 w-1/5">
	    				{letter.letter}
	    			</div>
                    {letter.meals.map((meal,k)=>
	    			<div key={meal.id}>{meal.name} <a className="text-red-500" onClick={e=>deleteMeal(e,meal.id)} href="">Eliminar</a></div>
                    )}
	    		</div>
    			)}
    		</div>
    	</div>
    </div>);
}