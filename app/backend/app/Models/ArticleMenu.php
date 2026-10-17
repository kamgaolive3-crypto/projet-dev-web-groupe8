<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ArticleMenu extends Model
{
    protected $table = 'article_menu';
    protected $primaryKey ='Id_article';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;
    protected $fillable = [
        'Id_article',
        'nom_article',
        'description',
        'prix_article',
        'categories_article',
        'disponibilite_article',
        'Menu_du_jour',
        'Id_restaurant',
    ];
    protected $casts = [
        'disponibilite_article'=> 'boolean',
        'Menu_du_jour'=> 'boolean',
    ];

    public function restaurants(){
        return $this->belongsTo(Restaurant::class, 'Id_restaurant', 'Id_restaurant');
    }
}
