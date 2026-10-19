// mise en page des vues connexion/inscription selon la maquette :
// fond beige plein #E0CCA2 ; grande carte "verre" rgba(217,217,217,0.1) r82px ;
// carte interieure blanche r25px qui porte les formulaires
export default function AuthFond({ children }) {
    return (
        <div
            className="flex min-h-screen items-center justify-center bg-beige p-4 md:p-8"
        >
            {/* enveloppe verre (coefficients de la maquette) */}
            <div className="w-full max-w-[900px] rounded-[50px] bg-[#d9d9d9]/10 p-6 backdrop-blur-sm md:rounded-[82px] md:p-14">
                {children}
            </div>
        </div>
    );
}

// carte blanche inside : bg white/10? la maquette affiche un panneau clair
// rgba(217,217,217,0) qui laisse voir le fond beige, coins r25px
export function AuthCarte({ children, className = "" }) {
    return (
        <div
            className={
                "rounded-[25px] bg-white/25 p-6 backdrop-blur-md md:p-8 " + className
            }
        >
            {children}
        </div>
    );
}
