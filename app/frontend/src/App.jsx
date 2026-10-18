import Login from "./vues/pages/page_connexion";
import Accueil from "./vues/pagesE/Accueil"
import Menu from "./vues/pagesE/Menu"
import Panier from "./vues/pagesE/Panier"
import Fideliter from "./vues/pagesE/Fideliter"
import LayoutE from "./composantE/Layout";
import LayoutA from "./composantA/Layout";
import TableauBord from "./vues/pagesA/TableauBord";
import Commandes from "./vues/pagesA/Commandes";
import Livraisons from "./vues/pagesA/Livraisons";
import Employes from "./vues/pagesA/Employes";
import MenuA from "./vues/pagesA/Menu";
import Evenement from "./vues/pagesA/Evenement";
import Parametre from "./vues/pagesA/Parametre";
import ReclamationA from "./vues/pagesA/Reclamation";
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import Signin from './vues/pages/page_inscription';
import Reclamation from "./vues/pagesE/Reclamation"
import Historique from "./vues/pagesE/Historique"
import { FournisseurAuth, useAuth } from "./services/auth";
import BanniereCookies from "./composant/BanniereCookies";

// garde de l espace personnel : une connexion est exigee avec un role du staff
// (employe, gerant, administrateur) ; l etudiant reste sur son espace public
function RouteStaff({ roles = ["employe", "gerant", "administrateur"] }) {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        // non connecte : on renvoie a la connexion en gardant la page demandee
        return <Navigate to="/page_connexion" state={{ de: location.pathname }} replace />;
    }
    if (!roles.includes(user.role)) {
        // role insuffisant : retour a l accueil
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
}

export default function App() {
  return (
    <FournisseurAuth>
      <BrowserRouter>
        <BanniereCookies />
        <Routes>
          {/* 1. Espace de visite (etudiant + visiteur) */}
          <Route element={<LayoutE />}>
            <Route path="/" element={<Accueil />} />
            <Route path="/Menu" element={<Menu />}/>
            <Route path="/Panier" element={<Panier />}/>
            <Route path="/Fideliter" element={<Fideliter />}/>
            <Route path="/Reclamation" element={<Reclamation />}/>
            <Route path="/Historique" element={<Historique />}/>
          </Route>

          {/* 2. Espace personnel (employe / gerant / administrateur) : protege */}
          <Route element={<RouteStaff />}>
            <Route element={<LayoutA/>}>
              <Route path="/TableauBord" element={<TableauBord />}/>
              <Route path="/Commandes" element={<Commandes />}/>
              <Route path="/Livraisons" element={<Livraisons />}/>
              <Route path="/Employes" element={<Employes />}/>
              <Route path="/MenuA" element={<MenuA />}/>
              <Route path="/Evenement" element={<Evenement />}/>
              <Route path="/Parametre" element={<Parametre />}/>
              <Route path="/ReclamationA" element={<ReclamationA />}/>
            </Route>
          </Route>

          {/* 3. Authentification */}
          <Route path="/page_connexion" element={<Login />} />
          <Route path="/page_inscription" element={<Signin />} />
        </Routes>
      </BrowserRouter>
    </FournisseurAuth>
  );
}
