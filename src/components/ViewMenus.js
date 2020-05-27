import React,{useEffect,useState} from 'react';
import {
  Link
} from "react-router-dom";

export default function ViewMenus(props) {
	const [menus,setMenus] = useState([]);

	useEffect(()=>{
		console.log(props.uid);
		props.db.collection("menus").where("uid","==",props.uid).get().then((querySnapshot) => {
		  let data = querySnapshot.docs.map(doc=>{
		    let d = doc.data();
		    d.id = doc.id;
		    return d;
		  });
		  console.log(data);
		  setMenus(data);
		});

	},[])

	return (
		<div>
			{menus.map((menu,i)=>(
			<div key={menu.date.seconds} className="m-2">
				{new Date(menu.start_date.seconds*1000).toLocaleString()}
				<Link className="ml-2 bg-blue-500 px-2 py-1 rounded" to={`/menu/${menu.id}`}>Ver</Link>
			</div>
			))}
		</div>
	);
}