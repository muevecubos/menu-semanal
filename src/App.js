import React,{useState,useEffect} from 'react';
import {hot} from 'react-hot-loader';
import firebase from 'firebase';
import {firestore} from 'firebase';

import {getMonday,formatDate} from './menu_common';

// Initialize Cloud Firestore through Firebase
if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain:  process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID
  });
}

const uid = 'user';

const week = [
  {day:'Lunes',key:'monday'},
  {day:'Martes',key:'tuesday'},
  {day:'Miércoles',key:'wednesday'},
  {day:'Jueves',key:'thursday'},
  {day:'Viernes',key:'friday'},
  {day:'Sábado',key:'saturday'},
  {day:'Domingo',key:'sunday'}
];


var db = firebase.firestore();

function App() {
  const [isAdding,toggleAdding] = useState(false);

  const [currentMenu,setCurrentMenu] = useState(null);

  const [meals,setMeals] = useState([])

  const [meal,changeMeal] = useState('');
  const [meal_type,setMealType] = useState('lunch');

  useEffect(()=>{

    db.collection("meals").get().then((querySnapshot) => {
      let data = querySnapshot.docs.map(doc=>{
        let d = doc.data();
        d.id = doc.id;
        return d;
      });
      setMeals(data);
    });

    const key = `${uid}${formatDate(getMonday("2020-07-03"))}`;

   
    let doc = db.collection("menus").doc(key).get().then(doc=>{

      if (doc.exists) {
        let d = doc.data();
        d.id = doc.id;
        setCurrentMenu(d);
      } else {

        let newmenu = {
          date:new Date(),
          meals:[],
          lunch:[],
          dinner:[],
          monday:{},
          tuesday:{},
          wednesday:{},
          thursday:{},
          friday:{},
          saturday:{},
          sunday:{},
        };
        db.collection("menus").doc(key).set(newmenu);


        setCurrentMenu(newmenu);
      }
    });
  },[])


  const toggleadd = (value,meal_type)=> {
    changeMeal('');
    setMealType(meal_type);
    toggleAdding(value == undefined  ? !isAdding : value);

  }

  
  const addToDay = (e,day,dish) => {
    e.preventDefault();

    if (currentMenu[week[day].key][meal_type] == undefined) currentMenu[week[day].key][meal_type] = [];
    currentMenu[week[day].key][meal_type].push(dish);
    toggleadd(false);  

    let themenu = db.collection("menus").doc(currentMenu.id);
    themenu.update({
        [week[day].key+'.'+meal_type]: firebase.firestore.FieldValue.arrayUnion(dish)
    });
  }

  const removeMeal = (day,meal_type,meal) => {
    console.log(day,meal);
    currentMenu[day][meal_type] = currentMenu[day][meal_type].filter(m=>m.id != meal.id);

    let themenu = db.collection("menus").doc(currentMenu.id);
    themenu.update({
        [day+'.'+meal_type]: firebase.firestore.FieldValue.arrayRemove(meal)
    });


    setCurrentMenu({...currentMenu});
  }

  const createMeal = ()=>{

    db.collection("meals").add({
        name: meal,
    })
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
        setMeals([...meals,{id:docRef.id,name:meal}]);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
    changeMeal('');
  }

  let filteredmeals = meal != '' ? 
    meals.filter(m=>{
      let r = RegExp(meal,'i');
      return r.test(m.name);
    }) : 
    meals;

  filteredmeals = filteredmeals.sort((a,b)=>(a.name < b.name ? -1 : 1));

  return (
    <div className="p-2 flex flex-col items-center">
      {isAdding !== false && (
        <div className="fixed inset-0 w-full items-center flex justify-center" style={{backgroundColor:'rgba(0,0,0,0.5)'}}>
          <div className="bg-white w-3/4 p-2 rounded" style={{height: "75vh"}}>
            <button className="float-right bg-red-600 text-white font-bold p-1 rounded" onClick={()=>toggleadd(false)}>X</button>
            <form onSubmit={e=>{e.preventDefault(); createMeal()}}> 
              <input className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-2 block w-3/4 appearance-none leading-normal"  autoComplete="off" onChange={(e)=>changeMeal(e.target.value)} placeholder="Escribe para filtrar o crear"/>
              {filteredmeals.map((meal,i) => (
                <div key={i}><a href="" onClick={e=>addToDay(e,isAdding,meal)}>{meal.name}</a></div>
              ))}
              <div><button className="bg-blue-500 py-1 px-2 rounded text-white hover:bg-blue-600">Crear nuevo plato</button></div>
            </form>
          </div>
        </div>
      )}

      {week.map( (day,i) => {

        return(
          <div key={i} className="mb-2 flex flex-col w-3/4">
            <h2 className="text-2xl underline">{day.day}</h2>
            <div className="flex justify-between">
              <div className="">
                {currentMenu != null && Object.keys(currentMenu[day.key]).map( (meal_type, j) => {
                  
                  const meals = currentMenu[day.key][meal_type];

                  return (
                    <div>
                      <h3>{meal_type}</h3>
                      { meals.map ( meal => (
                        <p key={meal.id} className="pl-4">
                          {meal.name} <button onClick={()=>removeMeal(day.key,meal_type,meal)} className="text-white bg-red-400 rounded-full w-4 h-4 text-xs">X</button>
                        </p>
                      ))}
                    </div>
                  );
                })}
              </div>
              <div>
                <button className="bg-blue-500 py-1 px-2 mx-1 rounded text-white hover:bg-blue-600" onClick={()=>toggleadd(i,'lunch')}>Almuerzo</button>
                <button className="bg-blue-500 py-1 px-2 rounded text-white hover:bg-blue-600" onClick={()=>toggleadd(i,'dinner')}>Cena</button>
              </div>
            </div>
          </div>
        )

      })}
    </div>
  );
}

export default hot(module)(App);
