import { Link } from "react-router-dom";
import logoFooter from "../../public/maq/maq_logo_footer.png";

// footer maquette : bande #F3F3F3 (1280x237 desktop) ;
// logo 186x75 + "Mon Miam Miam" Instrument Serif 20px ;
// colonne contacts (Contacts/Aide/FAQs?) + colonne liens, Inter 15px #535353
export default function Footer() {
    return (
        <footer className="w-full bg-band">
            <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start justify-between gap-6 px-6 py-8 sm:flex-row md:px-10">
                {/* bloc logo */}
                <div className="flex flex-col gap-2">
                    <img
                        src={logoFooter}
                        alt="logo Mon Miam Miam"
                        className="w-40 self-start rounded-[15px] object-cover md:w-[186px]"
                    />
                    <span className="font-instrument text-lg text-black md:text-xl">
                        Mon Miam Miam
                    </span>
                </div>

                {/* colonne contacts : Contacts / Aide / FAQs */}
                <div className="flex flex-col gap-3 font-sans text-sm text-encre md:text-[15px]">
                    <a href="tel:699956789">Contacts: 699956789 / 600089887</a>
                    <Link to="/Reclamation">Aide</Link>
                    <a href="#">FAQs?</a>
                </div>

                {/* colonne liens legaux */}
                <div className="flex flex-col gap-3 font-sans text-sm text-encre md:text-[15px]">
                    <a href="#">Mentions legales</a>
                    <a href="#">Responsabilite sociale</a>
                    <a href="#">A propos de nous</a>
                </div>
            </div>
        </footer>
    );
}
