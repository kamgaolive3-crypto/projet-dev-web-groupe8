<?php

namespace App\Http\Controllers;

use App\Models\ReinitialisationMdp;
use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PasswordResetController extends Controller
{
    /** Durée de validité du lien/token (dictionnaire : expiration après un délai) */
    private const DUREE_VALIDITE_MINUTES = 60;

    /**
     * demande de réinitialisation : crée un token hashé à usage unique (US-003)
     * POST /api/auth/mot-de-passe-oublie { email }
     *
     * Le token est renvoyé directement (API sans serveur mail encore configuré) ;
     * en production, l'envoyer par email (Job + config/mail.php déjà en place).
     */
    public function demander(Request $request)
    {
        $data = $request->validate([
            'email' => 'required|email|exists:utilisateur,email',
        ]);

        $utilisateur = Utilisateur::where('email', $data['email'])->first();

        // Invalide les demandes précédentes non utilisées (un seul token actif)
        ReinitialisationMdp::where('Id_utilisateur', $utilisateur->Id_utilisateur)
            ->where('utilise', false)
            ->update(['utilise' => true]);

        $token  = Str::random(48);
        $idReset = $this->genererIdReset();

        ReinitialisationMdp::create([
            'Id_reset'        => $idReset,
            'token_hash'      => hash('sha256', $token),   // jamais le token en clair en base
            'date_expiration' => now()->addMinutes(self::DUREE_VALIDITE_MINUTES),
            'utilise'         => false,
            'Id_utilisateur'  => $utilisateur->Id_utilisateur,
        ]);

        return response()->json([
            'message'  => 'Demande enregistrée. Token valide 60 minutes.',
            'token'    => $token, // à transmettre par email en production (voir commentaire)
        ], 201);
    }

    /**
     * réinitialisation effective avec le token reçu (US-003)
     * POST /api/auth/mot-de-passe-reinitialiser { token, mot_de_passe }
     * nouveau mot de passe : 8 caractères min., 1 majuscule, 1 chiffre (CDC)
     */
    public function reinitialiser(Request $request)
    {
        $data = $request->validate([
            'token'        => 'required|string|size:48',
            'mot_de_passe' => ['required', 'string', 'min:8', 'regex:/^(?=.*[A-Z])(?=.*[0-9])/'],
        ]);

        $demande = ReinitialisationMdp::where('token_hash', hash('sha256', $data['token']))
            ->where('utilise', false)
            ->where('date_expiration', '>', now())
            ->first();

        if (! $demande) {
            return response()->json(['message' => 'Token invalide ou expiré.'], 422);
        }

        DB::transaction(function () use ($demande, $data) {
            Utilisateur::where('Id_utilisateur', $demande->Id_utilisateur)
                ->update(['mot_de_passe' => $data['mot_de_passe']]); // haché par le cast 'hashed'

            $demande->update(['utilise' => true]); // usage unique
        });

        return response()->json(['message' => 'Mot de passe réinitialisé.']);
    }

    /**
     * Générateur RST00001 (domaine ID_RESET, pattern chaînes 3 lettres + 5 chiffres)
     * sans collision.
     */
    private function genererIdReset(): string
    {
        do {
            $id = 'RST' . str_pad((string) random_int(0, 99999), 5, '0', STR_PAD_LEFT);
        } while (ReinitialisationMdp::where('Id_reset', $id)->exists());

        return $id;
    }
}