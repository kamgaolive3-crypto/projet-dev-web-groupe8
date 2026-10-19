import { Outlet } from "react-router-dom";
import Header from "./Header"
import Footer from "./Footer"

// layout de l espace etudiant : fond general creme #F8F7F6 (maquette)
export default function Layout() {
    return(
        <div className="flex min-h-screen flex-col bg-creme">
            <Header />

            <main className="flex-1">
                <Outlet />
            </main>

            <Footer />
        </div>
    )

}
