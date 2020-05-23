import React,{useEffect,useState} from 'react';

export default function ViewMenus(props) {
	const [menus,setMenus] = useState([]);

	useEffect(()=>{
		console.log(props.uid);
		props.db.collection("menus").where("uid","==",props.uid).get().then((querySnapshot) => {
		  let data = querySnapshot.docs.map(doc=>{
		    let d = doc.data();
		    return d;
		  });
		  console.log(data);
		  setMenus(data);
		});

	},[])

	return (
		<div>
			{menus.map((menu,i)=>(
			<div key={menu.date.seconds}>
				{new Date(menu.date.seconds*1000).toLocaleString()}
			</div>
			))}
		</div>
	);
}