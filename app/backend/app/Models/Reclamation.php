<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reclamation extends Model
{
      protected $table = 'reclamation';
    protected $primaryKey = 'Id_reclamation';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'Id_reclamation',
        'motif_reclamation',
        'description_reclamation',
        'statut_reclamation',
        'reponse_reclamation',
        'Id_utilisateur',
        'Id_commande',
        'Id_traitant',
        'date_traitement',
        'Id_gerant',
        'date_decision',
        'decision',
        'Id_admin_traitant',
        'date_traitement_admin',
        'Id_admin_decideur',
        'date_decision_admin',
        'decision_admin',
    ];

    protected $casts = [
        'date_reclamation'      => 'datetime',
        'date_traitement'       => 'datetime',
        'date_decision'         => 'datetime',
        'date_traitement_admin' => 'datetime',
        'date_decision_admin'   => 'datetime',
    ];

    // Étudiant qui dépose la réclamation
    public function etudiant(): BelongsTo
    {
        return $this->belongsTo(Etudiant::class, 'Id_utilisateur', 'Id_utilisateur');
    }

    public function commande(): BelongsTo
    {
        return $this->belongsTo(Commande::class, 'Id_commande', 'Id_commande');
    }

    // Employé qui traite
    public function traitant(): BelongsTo
    {
        return $this->belongsTo(Employe::class, 'Id_traitant', 'Id_utilisateur');
    }

    // Gérant qui décide
    public function gerant(): BelongsTo
    {
        return $this->belongsTo(Gerant::class, 'Id_gerant', 'Id_utilisateur');
    }

    // Circuit administrateur
    public function adminTraitant(): BelongsTo
    {
        return $this->belongsTo(Administrateur::class, 'Id_admin_traitant', 'Id_utilisateur');
    }

    public function adminDecideur(): BelongsTo
    {
        return $this->belongsTo(Administrateur::class, 'Id_admin_decideur', 'Id_utilisateur');
    }  
}
