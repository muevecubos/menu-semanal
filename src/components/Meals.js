import React,{useState} from 'react';

let alphabet = [];
var i = 'A'.charCodeAt(0), j = 'Z'.charCodeAt(0);
for (; i <= j; ++i) {
   alphabet.push(String.fromCharCode(i));
}


export default function Meals() {
	const [currentLetter,setCurrentLetter] = useState(false);
	const filterByLetter = (letter)=>{
		if (letter == currentLetter){
			setCurrentLetter(false)
			return;
		} 
		setCurrentLetter(letter);

	}

	const filtered = currentLetter === false ? alphabet : alphabet.filter(letter=>letter === currentLetter);

  return (
    <div className="flex flex-col justify-center mx-2">
    	Gestion de meals
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
	    				{letter}
	    			</div>
	    			<div>Arroz Caldoso</div>
	    			<div>Arroz Cubana</div>
	    		</div>
    			)}
    		</div>
    	</div>
    </div>);
}