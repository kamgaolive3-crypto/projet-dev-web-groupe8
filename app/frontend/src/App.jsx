import Login from "./vues/pages/page_connexion";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signin from './vues/pages/page_inscription'; // Import de votre page

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. La page principale / première page lors de la visite du site */}
        <Route path="/" element={<Login />} />

        {/* 2. Vos autres pages */}
        <Route path="/page_inscription" element={<Signin />} />
      </Routes>
    </BrowserRouter>
  );
}