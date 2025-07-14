import React from "react";
import {useNavigate} from "react-router-dom";
import {URL} from "../utils/getURL.js";
export default function SignIn(){
    const [user,setUser] = React.useState({
        email:"",
        password:""
    });
    const navigate = useNavigate();
    function handle(e){
        setUser({...user,[e.target.name]:e.target.value});
    }
    async function Register(){
        const res = await fetch(`${URL}/user/login`,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(user)
        });
        const data = await res.json();
        localStorage.setItem("token",data.token);
        console.log(data);
        navigate("/course");
    }
    return(
        <section className="w-full h-[calc(100vh-5rem)] flex items-center justify-center"> 
            <section className="form w-6/12 h-6/12 border-white p-4 flex flex-col gap-4">
                <fieldset className="w-full py-4 px-4 border border-[#333333]">
                    <legend className="text-white text-xl">Email</legend>
                    <input name="email" onChange={handle} type="text" className="w-full px-2  bg-white py-1 text-md" />
                </fieldset>
                <fieldset className="w-full py-4 px-4 border border-[#333333]">
                    <legend className="text-white text-xl">Password</legend>
                    <input name="password" onChange={handle} type="text" className="w-full bg-white px-2 py-1 text-md" />
                </fieldset>
                <button onClick={Register} className="text-center bg-gradient-to-r from-[#26272b] px-2 py-1 to-[#292b31] rounded text-white">Sign IN</button>
            </section>
        </section>
    )
}