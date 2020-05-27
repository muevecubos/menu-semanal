import {getMonday,formatDate} from '../menu_common';

const days = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
const meal_time = ['lunch','dinner'];

export const generateMenu = (db,uid,date,mealsdb,cb) => {
	let meals = {};

	mealsdb.forEach(m=>{
		meals[m.id] = {...m,times:0};
	});

	console.log('Not used',meals);

	// Find all menus
	db.collection("menus").where("uid", "==", uid)
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(doc => {
       let d = doc.data(); 
      

       days.map((day,i)=> {
       	meal_time.map((m_time,j)=>{
       		if (d[day][m_time] == undefined || d[day][m_time].length == 0) return null;
       			d[day][m_time].map((meal,k)=>{
       				if (meals[meal.id] == undefined) meals[meal.id] = {...meal,times:0};
       				meals[meal.id].times++;
       			})
	       	})
	      })
     });

     let sorted = Object.values(meals).sort((a,b)=>a.times < b.times ? -1 : 1).slice(0,14);

     let key = createMenu(db,uid,getMonday(date),sorted);

     if (cb != undefined) cb(key);


    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

}


export const createMenu = (db,uid,start_date,meals) => {
	const key = `${uid}${formatDate(start_date)}`;
	console.log(key);
	let newmenu = {
	  date:new Date(),
	  start_date:start_date,
	  uid:uid,
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

	if (meals != undefined) {
		let i = 0;
		days.map((day,k)=> {
      	newmenu[day] = {lunch:[],dinner:[]};
       	meal_time.map((m_time,j)=>{
       		delete meals[i].times;
       		newmenu[day][m_time].push(meals[i]);
       		i++;
       	})
    })

	}	
	console.log(newmenu);

	db.collection("menus").doc(key).set(newmenu);
	newmenu.start_date = {seconds:start_date.getTime()/1000};
	return key;

}














