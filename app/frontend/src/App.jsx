import Login from "./vues/pages/page_connexion";
import Accueil from "./vues/pagesE/Accueil"
import Menu from "./vues/pagesE/Menu"
import Panier from "./vues/pagesE/Panier"
import Fideliter from "./vues/pagesE/Fideliter"
import LayoutE from "./composantE/Layout";
import LayoutA from "./composantA/Layout";
import TableauBord from "./vues/pagesA/TableauBord";
import Employes from "./vues/pagesA/Employes";
import MenuA from "./vues/pagesA/Menu";
import Promotion from "./vues/pagesA/Promotion";
import Parametre from "./vues/pagesA/Parametre";
import ReclamationA from "./vues/pagesA/Reclamation";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signin from './vues/pages/page_inscription'; // Import de votre page

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. La page principale / première page lors de la visite du site 
        et pages qui utilisateur ainsi que l'accueil*/}
        <Route element={<LayoutE />}>
          <Route path="/" element={<Accueil />} />
          <Route path="/Menu" element={<Menu />}/>
          <Route path="/Panier" element={<Panier />}/>
          <Route path="/Fideliter" element={<Fideliter />}/>
        </Route>
        <Route element={<LayoutA/>}>
          <Route path="/TableauBord" element={<TableauBord />}/>
          <Route path="/Employes" element={<Employes />}/>
          <Route path="/MenuA" element={<MenuA />}/>
          <Route path="/Promotion" element={<Promotion />}/>
          <Route path="/Parametre" element={<Parametre />}/>
          <Route path="/ReclamationA" element={<ReclamationA />}/>
        </Route>
        {/* 2. Vos autres pages */}
        <Route path="/page_connexion" element={<Login />} />
        <Route path="/page_inscription" element={<Signin />} />
      </Routes>
    </BrowserRouter>
  );
}