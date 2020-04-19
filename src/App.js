import React,{useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {hot} from 'react-hot-loader';

function App() {
  const [isAdding,toggleAdding] = useState(false);
  const [menu,setMenu] = useState([
    {day:'Lunes',menu:[]},{day:'Martes',menu:[]},{day:'Miércoles',menu:[]},{day:'Jueves',menu:[]},{day:'Viernes',menu:[]},{day:'Sábado',menu:[]},{day:'Domingo',menu:[]}
  ]); 

  const [meals,setMeals] = useState([
    'Arroz',
    'Puré con hamburguesas'
  ])

  const [meal,changeMeal] = useState('');
  
  const addToDay = (e,day,dish) => {
    e.preventDefault();
    menu[day]['menu'].push(dish);
    setMenu([...menu]);
    toggleAdding(false);  
  }

  const createMeal = ()=>{
    setMeals([...meals,meal]);
    changeMeal('');
  }

  const filteredmeals = meal != '' ? 
    meals.filter(m=>{
      let r = RegExp(meal,'i');
      return r.test(m);
    }) : 
    meals;

  if ( isAdding !== false )
  return (
    <div>
      <form onSubmit={e=>{e.preventDefault(); createMeal()}}> 
        <input onChange={(e)=>changeMeal(e.target.value)} placeholder="Escribe para filtrar o crear"/>
        {filteredmeals.map((meal,i) => (
          <div key={i}><a href="" onClick={e=>addToDay(e,isAdding,meal)}>{meal}</a></div>
        ))}
        <div><button onClick={createMeal}>Crear nuevo plato</button></div>
      </form>
      <button onClick={()=>toggleAdding(false)}>Cerrar</button>
    </div>
  )

  return (
    <div className="App">
      {menu.map( (day,i) => {

        return(
          <div key={i}>
            <h2>{day.day}</h2>
            {day.menu.map( (dish, j) => (
              <p key={j}>
                {dish}
              </p>
            ))}
            <button onClick={()=>toggleAdding(i)}>Añadir</button>
          </div>
        )

      })}
    </div>
  );
}

export default hot(module)(App);
