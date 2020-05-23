import React from 'react';

export default function Home({firebaseui,firebase}) {

  var uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        console.log('Logged',authResult);
       
        // User successfully signed in.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.
        return false;
      },
    },
    'credentialHelper': firebaseui.auth.CredentialHelper.NONE,
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      //firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID

    ],
    // Terms of service url.
    // tosUrl: '<your-tos-url>',
    // Privacy policy url.
    // privacyPolicyUrl: '<your-privacy-policy-url>'
  };


  const login = () => {
    var ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth());
    ui.start('#firebaseui-auth-container', uiConfig);
  }

  return (
    <div className="flex justify-center mx-2">
    	<div className="m-4">
	      <h1 className="text-2xl">Menu Semanal: gestiona tu semana</h1>
	      <p>Con la app de <b>Menú Semanal</b> podrás crear y gestionar tus menus de forma fácil y rápida.</p>
	      <div className="flex justify-center border-b py-2 border-gray-400"><button className="bg-blue-400 px-2 py-1 text-white rounded font-bold" onClick={login}>Login</button></div>
	      <div className="flex flex-col sm:flex-row mt-4">
	      	<div className="sm:w-1/2 mb-4 ">
			 			<img className="p-2"  src="mockup.jpg" />
			      <ul className="list-disc list-inside">
			      	<li>Crea tus propios platos</li>
			      	<li>Automatiza el menú de forma inteligente</li>
			      	<li>Gestión de recetas</li>
			      	<li>Lista de la compra automática</li>

			      </ul>
		      </div>
		      <div className="flex flex-col">
		      	<p className="mb-5 text-lg">¡Regístrate gratis y empieza a planificar tu menú!</p>
		     	 <div className="flex justify-center"><button className="w-3/4 bg-blue-400 px-2 py-1 text-white rounded font-bold" onClick={login}>Entrar</button></div>
		      </div>
		     </div>
	    </div>
		  <div id="firebaseui-auth-container" className="inset-x-0 fixed"></div>
    </div>);
}