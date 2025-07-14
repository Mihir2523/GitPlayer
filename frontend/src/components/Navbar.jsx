import { Link } from "react-router-dom"
export default function Navbar(){
    return(
        <header className="w-full h-16 bg-black flex items-center justify-between border-b-[1px] border-[#706d6d]">
            <section className="logo flex items-center justify-center h-full px-8">
                <img src="vite.svg" alt="Logo" className="w-[30px] h-[30px]" />
            </section>
            <section className="flex gap-8">
                <Link to="/signin" className="text-center bg-gradient-to-r from-[#26272b] px-2 py-1 to-[#17191f] rounded text-white">SignIn</Link>
                <Link to="/" className="text-center bg-gradient-to-r from-[#26272b] px-2 py-1 to-[#17191f] rounded text-white">Register</Link>
            </section>    
        </header>
    )
}