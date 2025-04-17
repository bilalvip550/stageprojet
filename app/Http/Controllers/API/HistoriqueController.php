<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Historique;
use Illuminate\Http\Request;

class HistoriqueController extends Controller
{
    // GET /api/historiques
    public function index()
    {
        $historiques = Historique::all();
        return response()->json($historiques);
    }

    // POST /api/historiques
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'description' => 'required|max:255',
            'change_date' => 'required|date',
            'task_id'     => 'required|integer',
        ]);

        $historique = Historique::create($validatedData);
        return response()->json([
            'message' => 'Historique created successfully',
            'data'    => $historique
        ], 201);
    }

    // GET /api/historiques/{historique}
    public function show(Historique $historique)
    {
        return response()->json($historique);
    }

    // PUT/PATCH /api/historiques/{historique}
    public function update(Request $request, Historique $historique)
    {
        $validatedData = $request->validate([
            'description' => 'required|max:255',
            'change_date' => 'required|date',
            'task_id'     => 'required|integer',
        ]);

        $historique->update($validatedData);
        return response()->json([
            'message' => 'Historique updated successfully',
            'data'    => $historique
        ]);
    }

    // DELETE /api/historiques/{historique}
    public function destroy(Historique $historique)
    {
        $historique->delete();
        return response()->json(['message' => 'Historique deleted successfully']);
    }
}
