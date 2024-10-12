import React from 'react'
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import {GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { app } from '../firebase';

function Gauth() {
    const dispatch=useDispatch();
    const handleGoogle=async()=>{
    try{
        const provider=new GoogleAuthProvider();
        const auth=getAuth(app);

        const result=await signInWithPopup(auth,provider);

        const res=await fetch('/server/auth/google',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({name:result.user.displayName,email:result.user.email,photo:result.user.photoURL})
        })
        const data=await res.json();
        dispatch(signInSuccess(data));
    }
    catch(error){
        console.log("Could not sign in",error);
    }
 }
  return (
    <button type='button'onClick={handleGoogle} className='bg-orange-500 text-white p-3 rounded-lg uppercase hover:opacity-95'>Login with Google</button>
  )
}

export default Gauth