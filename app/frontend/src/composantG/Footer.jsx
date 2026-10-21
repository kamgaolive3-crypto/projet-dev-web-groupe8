import logo from "../assets/logo.png";
import x from "../assets/xlogo.png"
import facebook from "../assets/facebooklogo.png"
import ig from "../assets/iglogo.png"

export default function Footer(){
    return(
        <footer className="w-full bg-grey border-t border-grey-300">
            <div className="flex justify-between items-center gap-2 px-2">
                <div className="flex flex-col gap-1">
                    <img src={logo} alt="logo mon miam miam" className="w-15 rounded-[10px] m-2 mb-0"/>
                    <p className="text-xs p-2 pt-0 text-secondary">Mon Miam Miam</p>
                </div>
                <div className="flex flex-col gap-0.5 mx-2 my-2 text-sm">
                    <a href="#">Mentions legales</a>
                    <a href="#">Responsabliter sociale</a>
                    <a href="#">A propos de nous</a>
                </div>
                <div className="flex flex-col gap-0.5 mx-2 my-2 text-sm">
                    <p>Contacs: 699987807 / 600008998</p>
                    <a href="#">Aide</a>
                    <a href="#">FAQs?</a>
                </div>
                <div className="flex items-center justify-center gap-2 mx-2 my-2">
                    <a href="#">
                        <img src={x} alt="lien x" className="w-7" />
                    </a>
                    <a href="#">
                        <img src={facebook} alt="lien facebook" className="w-7"/>
                    </a>
                    <a href="#">
                        <img src={ig} alt="lien ig" className="w-7" />
                    </a>
                </div>
            </div>
        </footer>
    )
}