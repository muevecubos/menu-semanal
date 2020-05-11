import React,{useState,useEffect} from 'react';
import './App.css';
import {hot} from 'react-hot-loader';
import firebase from 'firebase';
import {firestore} from 'firebase';

// Initialize Cloud Firestore through Firebase

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain:  process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID
  });
}

var db = firebase.firestore();

function App() {
  const [isAdding,toggleAdding] = useState(false);
  const [menu,setMenu] = useState([
    {day:'Lunes',key:'monday',menu:[]},
    {day:'Martes',key:'tuesday',menu:[]},
    {day:'Miércoles',key:'wednesday',menu:[]},
    {day:'Jueves',key:'thursday',menu:[]},
    {day:'Viernes',key:'friday',menu:[]},
    {day:'Sábado',key:'saturday',menu:[]},
    {day:'Domingo',key:'sunday',menu:[]}
  ]); 
  
  const [currentMenu,setCurrentMenu] = useState(null);

  const [meals,setMeals] = useState([])

  const [meal,changeMeal] = useState('');

  useEffect(()=>{

    db.collection("meals").get().then((querySnapshot) => {
      let data = querySnapshot.docs.map(doc=>{
        let d = doc.data();
        d.id = doc.id;
        return d;
      });
      setMeals(data);
    });

    db.collection("menus").get().then((querySnapshot) => {
      let data = querySnapshot.docs.map(doc=>{
        let d = doc.data();
        d.id = doc.id;
        setCurrentMenu(d);
        return d;
      });

      if (data.length == 0) {
        let newmenu = {
          date:new Date(),
          monday:[],
          tuesday:[],
          wednesday:[],
          thursday:[],
          friday:[],
          saturday:[],
          sunday:[],
        };

        db.collection("menus").add(newmenu)
        .then(function(docRef) {
          console.log("Document written with ID: ", docRef.id);
          setCurrentMenu(docRef);
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
      }


    });


  },[])

  
  const addToDay = (e,day,dish) => {
    e.preventDefault();
    currentMenu[menu[day].key].push(dish);
    menu[day]['menu'].push(dish);
    setMenu([...menu]);
    toggleAdding(false);  

    let themenu = db.collection("menus").doc(currentMenu.id);
    // Atomically add a new region to the "regions" array field.
    themenu.update({
        [menu[day].key]: firebase.firestore.FieldValue.arrayUnion(dish)
    });


  }

  const createMeal = ()=>{

    db.collection("meals").add({
        name: meal,
    })
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
        setMeals([...meals,{id:docRef.if,name:meal}]);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });


    
    changeMeal('');
  }

  const filteredmeals = meal.name != '' ? 
    meals.filter(m=>{
      let r = RegExp(meal.name,'i');
      return r.test(m);
    }) : 
    meals;

  if ( isAdding !== false )
  return (
    <div>
      <form onSubmit={e=>{e.preventDefault(); createMeal()}}> 
        <input autoComplete="off" onChange={(e)=>changeMeal(e.target.value)} placeholder="Escribe para filtrar o crear"/>
        {filteredmeals.map((meal,i) => (
          <div key={i}><a href="" onClick={e=>addToDay(e,isAdding,meal)}>{meal.name}</a></div>
        ))}
        <div><button>Crear nuevo plato</button></div>
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
            {currentMenu != null && currentMenu[day.key].map( (dish, j) => (
              <p key={j}>
                {dish.name}
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
