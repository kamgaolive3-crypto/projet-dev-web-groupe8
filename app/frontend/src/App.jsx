import Login from "./vues/pages/page_connexion";
import Accueil from "./vues/pagesE/Accueil";
import Menu from "./vues/pagesE/Menu";
import Panier from "./vues/pagesE/Panier";
import Fideliter from "./vues/pagesE/Fideliter";
import LayoutE from "./composantE/Layout";
import LayoutA from "./composantA/Layout";
import TableauBord from "./vues/pagesA/TableauBord";
import Employes from "./vues/pagesA/Employes";
import MenuA from "./vues/pagesA/Menu";
import Evenement from "./vues/pagesA/Evenement";
import Parametre from "./vues/pagesA/Parametre";
import ReclamationA from "./vues/pagesA/Reclamation";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signin from './vues/pages/page_inscription'; // Import de votre page
import LayoutEmp from "./composantEmp/LayoutEmp";
import Commandes from "./vues/pagesEmp/Commandes";
import MenuEmp from "./vues/pagesEmp/MenuEmp";
import Reclamations from "./vues/pagesEmp/Reclamations";
import Statistiques from "./vues/pagesEmp/Statistiques";
import Reclamation from "./vues/pagesE/Reclamation";
import Historique from "./vues/pagesE/Historique";
import LayoutG from "./composantG/Layout";
import CommandesG from "./vues/pageG/CommandesG";
import EmployesG from "./vues/pageG/EmployesG";
import StatistiquesG from "./vues/pageG/StatistiquesG";
import ReclamationsG from "./vues/pageG/ReclamationsG";
import TableauBordG from "./vues/pageG/TableauBordG";

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
          <Route path="/Reclamation" element={<Reclamation />}/>
          <Route path="/Historique" element={<Historique />}/>
        </Route>
        <Route element={<LayoutA/>}>
          <Route path="/TableauBord" element={<TableauBord />}/>
          <Route path="/Employes" element={<Employes />}/>
          <Route path="/MenuA" element={<MenuA />}/>
          <Route path="/Evenement" element={<Evenement />}/>
          <Route path="/Parametre" element={<Parametre />}/>
          <Route path="/ReclamationA" element={<ReclamationA />}/>
        </Route>
        {/* 2. Vos autres pages */}
          <Route path="/page_connexion" element={<Login />} />
          <Route path="/page_inscription" element={<Signin />} />
        <Route element={<LayoutEmp />}>
          <Route path="/Commandes" element={<Commandes />} />
          <Route path="/MenuEmp" element={<MenuEmp />} />
          <Route path="/Reclamations" element={<Reclamations />} />
          <Route path="/Statistiques" element={<Statistiques />} />
        </Route>
        <Route element={<LayoutG />}>
          <Route path="/TableauBordG" element={<TableauBordG />} />
          <Route path="/CommandesG" element={<CommandesG />} />
          <Route path="/EmployesG" element={<EmployesG />} />
          <Route path="/StatistiquesG" element={<StatistiquesG />} />
          <Route path="/ReclamationsG" element={<ReclamationsG />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}