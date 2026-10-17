<?php

namespace App\Http\Controllers;

use App\Models\ArticleMenu;
use Illuminate\Http\Request;

class ArticleMenuController extends Controller
{
    /**
     * affiche tous les article 
     * GET/api/articlemenu: liste
     */
    public function index()
    {
        return ArticleMenu::all();
    }

    /**
     * Store a newly created resource in storage.
     * POST/api/articlemenu: creer 
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'Id_article'            => ['required', 'regex:/^[A-Z]{3}[0-9]{3}$/', 'unique:article_menu,Id_article'],
            'nom_article'           => 'required|string|max:150',
            'description'           => 'nullable|string',
            'prix_article'          => 'required|integer|min:0',
            'categories_article'    => 'required|in:plat,boisson,dessert,accompagnement,autre',
            'disponibilite_article' => 'boolean',
            'Menu_du_jour'          => 'boolean',
            'Id_restaurant'         => 'required|exists:restaurant,Id_restaurant',
        ]);
        $article = ArticleMenu::create($data);
        return response() ->json($article, 201);
    }

    /**
     * afficher un article precis
     * GET/api/article: n seul
     */
    public function show(string $id)
    {
        return ArticleMenu::findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     * PUT/api/article: modifier
     */
    public function update(Request $request, string $id)
    {
        $article = ArticleMenu::findOrFail($id);
        $data = $request->validate([
            'Id_article'            => ['required', 'regex:/^[A-Z]{3}[0-9]{3}$/', 'unique:article_menu,Id_article'],
            'nom_article'           => 'required|string|max:150',
            'description'           => 'nullable|string',
            'prix_article'          => 'required|integer|min:0',
            'categories_article'    => 'required|in:plat,boisson,dessert,accompagnement,autre',
            'disponibilite_article' => 'boolean',
            'Menu_du_jour'          => 'boolean',
            'Id_restaurant'         => 'required|exists:restaurant,Id_restaurant',
        ]);

        $article->update($data);
        return $article;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        ArticleMenu::findOrFail( $id )->delete();
        return response () ->jsaon(['message'=> 'article supprimer']);
    }
}
