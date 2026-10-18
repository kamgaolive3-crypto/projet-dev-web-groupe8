<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cookies extends Model
{
    protected $table = 'cookies';
    protected $primaryKey ='Id_cookies'; 
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;
    protected $fillable = [
        'Id_cookies',
        'date_cookies',
        'date_expiration',
        'utilise',
        'Id_utilisateur',
    ];

    protected $casts = [
        'utilise'=> 'boolean',
    ];

    public function utilisateurs(){
        return $this->belongsTo(Utilisateur::class,'Id_utilisateur','Id_utilisateur');
    }
}
