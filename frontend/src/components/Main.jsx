import React from "react";
import { URL } from "../utils/getURL";
import { useNavigate } from "react-router-dom";

export default function Main() {
  const navigate = useNavigate();
  const [dataa, setDataa] = React.useState(null);
  React.useEffect(() => {
    async function datasss() {
      try {
        const res = await fetch(`${URL}/items`, {
          method: "GET",
        });
        const data = await res.json();
        setDataa(data);
        console.log(data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    }
    datasss();
  }, []);

  function handle(e) {
    const { name, value } = e.target;
    setDataa((prev) => ({
      ...prev,
      [name]: name === "price" || name === "discount" ? Number(value) : value,
    }));
  }
  return (
    <div className="w-full py-8 flex flex-col gap-8">{
        dataa.map((item,index)=>{
          return(
          <div onClick={navigate(`/item/${index}`)} key={item}>
            <h1 className="">Price : {item.price}</h1>
            <h1 className="">Discount : {item.discount}</h1>
          </div>)
        })
      }
    </div>
  )
}

