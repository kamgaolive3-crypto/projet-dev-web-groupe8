// src/modeles/ModeService.js
// Comment l'étudiant reçoit sa commande : sur place ou en livraison.
//
// HÉRITAGE      : SurPlace et Livraison "héritent" de ModeService (extends).
// POLYMORPHISME : chaque classe fille répond à sa façon à fraisLivraison()
//                 et demandeHeure(). Le reste du code appelle ces méthodes
//                 sans avoir besoin de savoir quel mode est choisi.

// Classe de base "abstraite" : on ne l'utilise jamais directement.
export class ModeService {
  #code;
  #libelle;

  constructor(code, libelle) {
    if (new.target === ModeService) {
      throw new Error("ModeService est abstraite : utilise SurPlace ou Livraison");
    }
    this.#code = code;
    this.#libelle = libelle;
  }

  get code() {
    return this.#code;
  }
  get libelle() {
    return this.#libelle;
  }

  // Les classes filles DOIVENT redéfinir ces deux méthodes.
  fraisLivraison() {
    throw new Error("fraisLivraison() doit être définie dans la classe fille");
  }
  demandeHeure() {
    throw new Error("demandeHeure() doit être définie dans la classe fille");
  }
}

export class SurPlace extends ModeService {
  constructor() {
    // "sur_place" : valeur provisoire, à aligner avec le backend
    super("sur_place", "Sur place");
  }
  fraisLivraison() {
    return 0;
  }
  demandeHeure() {
    return true; // l'étudiant indique son heure d'arrivée
  }
}

export class Livraison extends ModeService {
  // 500 FCFA : valeur PROVISOIRE, à confirmer avec l'équipe (cahier des charges).
  static FRAIS_PAR_DEFAUT = 500;
  #frais;

  constructor(frais = Livraison.FRAIS_PAR_DEFAUT) {
    super("livraison", "Livraison");
    this.#frais = frais;
  }
  fraisLivraison() {
    return this.#frais;
  }
  demandeHeure() {
    return false;
  }
}
