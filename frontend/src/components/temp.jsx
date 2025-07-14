import React from "react";
import { useParams } from "react-router-dom";
export default function Card(){
    const {id} = Number(useParams());
    const [dataa, setDataa] = React.useState({
        price:"",discount:""
    });
    
    function handle(e){
        setDataa({...dataa,[e.target.name]:e.target.value});
    }
    async function updateOne() {
      try {
        const d = {
            id,
            email:dataa.email,
            password:dataa.password
        };
      await fetch(`${URL}/item`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(d),
      });
    } catch (err) {
      console.error("Failed to update data:", err);
    }
  }

  React.useEffect(()=>{
    async function f(){

        const tt = await fetch(`${URL}/item`, {
            method: "GET"
        });
        const d = await tt.json();
        console.log(d);
    }
    f();
  },[]);
  return(
    <section className="w-full h-[calc(100vh-5rem)] flex flex-col gap-4 items-center justify-center">
        <h1 className=""></h1>
      <label className="text-white flex gap-4" htmlFor="price">
        Price
        <input
          id="price"
          type="number"
          className="bg-white p-2"
          onChange={handle}
          name="price"
          value={dataa.price}
        />
      </label>
      <label className="text-white flex gap-4" htmlFor="discount">
        Discount
        <input
          id="discount"
          type="number"
          onChange={handle}
          className="bg-white p-2"
          name="discount"
          value={dataa.discount}
        />
      </label>
      <button className="text-white bg-black p-4 rounded" onClick={updateOne}>
        Update
      </button>
    </section>
  )
}