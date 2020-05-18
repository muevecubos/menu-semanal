import React,{useState,useEffect} from 'react';
import {hot} from 'react-hot-loader';
import * as firebase from "firebase/app";
import "firebase/firestore";

import {getMonday,formatDate} from './menu_common';

import {ReactComponent as Lunch} from './css/haw-weather.svg';
import {ReactComponent as Dinner} from './css/meteorology.svg';

import * as MenuPlanner from './components/MenuPlanner';


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

const lunch_time = [
  {key:'lunch',label:'Almuerzo'},
  {key:'dinner',label:'Cena'},
];

var db = firebase.firestore();

function App() {
  const [isAdding,toggleAdding] = useState(false);

  const [currentMenu,setCurrentMenu] = useState(null);

  const [meals,setMeals] = useState([])

  const [meal,changeMeal] = useState('');
  const [meal_type,setMealType] = useState('lunch');
  const [show_day,setShowDay] = useState(false);
  const [day_number,setDayNumber] = useState(null);

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


  const toggleadd = (day_key,meal_type)=> {
    changeMeal('');
    setMealType(meal_type);
    toggleAdding(day_key);

  }

  const viewDay = (day,week_day)=>{
    setShowDay(day);
    setDayNumber(week_day);
  }

  
  const addToDay = (e,day_key,dish) => {
    if (e != undefined)e.preventDefault();

    if (currentMenu[day_key][meal_type] == undefined) currentMenu[day_key][meal_type] = [];
    currentMenu[day_key][meal_type].push(dish);
    toggleadd(false);  

    let themenu = db.collection("menus").doc(currentMenu.id);
    themenu.update({
        [day_key+'.'+meal_type]: firebase.firestore.FieldValue.arrayUnion(dish)
    });
  }

  const removeMeal = (day,meal_type,meal) => {

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
    //changeMeal('');
  }

  let filteredmeals = meal != '' ? 
    meals.filter(m=>{
      let r = RegExp(meal,'i');
      return r.test(m.name);
    }) : 
    meals;

  filteredmeals = filteredmeals.sort((a,b)=>(a.name < b.name ? -1 : 1));


  if (show_day !== false) {

    const day_showing = currentMenu[show_day];
    const day_name = week.find(d=>d.key == show_day);

    return (
      <div className="bg-blue-100 w-full" style={{height:'100vh'}}>
        <div className="flex flex-col w-3/4 mx-16 py-4 ">

        <div className="flex border-b-4 border-gray-300 pb-2">
          <div className="border border-black w-8 text-center font-bold text-xl" style={{borderTop:"5px solid red"}}>
            {day_number}
          </div>
          <div className="text-2xl flex justify-center flex-grow">
            {day_name.day}
          </div>
        </div>



        {isAdding !== false && (
          <div className="fixed inset-0 w-full items-end flex " style={{backgroundColor:'rgba(0,0,0,0.5)'}}>
            <div className="bg-blue-100 w-full p-2 " style={{height: "65vh"}}>
              <button className="float-right bg-red-600 text-white font-bold p-1 rounded" onClick={()=>toggleadd(false)}>X</button>
              <form className="flex flex-col items-center" onSubmit={e=>{e.preventDefault(); createMeal()}}> 
                <input className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-2 block w-3/4 appearance-none leading-normal"  autoComplete="off" onChange={(e)=>changeMeal(e.target.value)} placeholder="Escribe para filtrar o crear"/>
                <div className="w-3/4 overflow-y-scroll" style={{height:"50vh"}}>
                {filteredmeals.map((meal,i) => (
                  <div key={i} className="border border-blue-500 bg-blue-200 p-2 m-1 cursor-pointer" onClick={()=>addToDay(undefined,isAdding,meal)}>
                    {meal.name}
                  </div>
                ))}
                </div>
                <div className="flex justify-end">
                  <button className="bg-blue-500 py-1 px-2 rounded text-white hover:bg-blue-600">Crear nuevo plato</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {currentMenu != null && lunch_time.map((lt,i)=>{
          const meals = day_showing[lt.key] || [];
          return (
            <div className="border-2 border-blue-500 bg-blue-300 rounded p-2 mb-2 shadow-xl">

              <div className="flex justify-center cursor-pointer  rounded" onClick={()=>toggleadd(show_day,lt.key)}>
                <div className="w-1/5">
                  {lt.key == 'lunch' && <Lunch className="w-8" />}
                  {lt.key == 'dinner' && <Dinner className="w-8" />}
                  
                </div>
                <div className="flex flex-grow ml-4 text-2xl"> {lt.label}</div>
              </div>

              <div className="flex flex-col pl-8">
              { meals.map ( meal => (
                <p key={meal.id} className="pl-4">
                  {meal.name} <button onClick={()=>removeMeal(day_name.key,lt.key,meal)} className="text-white bg-red-400 rounded-full w-4 h-4 text-xs">X</button>
                </p>
              ))}
              </div>
            </div>
          );
        })}
          <div className="flex justify-end">
            <button className="bg-blue-500 py-1 px-2 mx-1 rounded text-white hover:bg-blue-600" onClick={()=>setShowDay(false)}>Atrás</button>

          </div>
        </div> 
      </div> 
    )

  }
  
  if (!currentMenu) return null;

  const day_month = new Date(currentMenu.date.seconds*1000);
  

  return (
    <div className="p-2 flex flex-col items-center bg-blue-100">
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

      {currentMenu && week.map( (day,i) => {
        const day_month = new Date(currentMenu.date.seconds*1000);
        const week_day = new Date(day_month.setDate(day_month.getDate()+parseInt(i))).getDate();
        return(
          <div key={i} className="mb-2 flex flex-row w-3/4 bg-blue-300 rounded shadow-xl border-2 border-blue-500 cursor-pointer" onClick={()=>viewDay(day.key,week_day)}>

            <div className="flex flex-col items-center justify-center w-12 py-2 ">
              <span className="text-xs">{day.day.substr(0,3)}</span>
              <MenuPlanner.CalendarDay day={week_day} />
            </div>

            <div className="flex items-center border-l-2 border-gray-300 flex-grow pl-2">
              <div className="">
                {currentMenu != null && lunch_time.map((lt,i)=>{
                  const meals = currentMenu[day.key][lt.key];

                  if (meals == undefined || meals.length==0) return null;

                  return (
                    <div className="flex mb-2 flex-grow">
                      {lt.key == 'lunch' && <Lunch className="w-6" />}
                      {lt.key == 'dinner' && <Dinner className="w-6" />}
                      <div>
                      { meals.map ( meal => (
                        <p key={meal.id} className="pl-4">
                          {meal.name}
                        </p>
                      ))}
                      </div>
                    </div>
                  );

                })}
              </div>
            </div>
          </div>
        )

      })}
    </div>
  );
}

export default hot(module)(App);
