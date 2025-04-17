<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Documentpath;
use Illuminate\Http\Request;

class DocumentpathController extends Controller
{
    // GET /api/documentpaths
    public function index()
    {
        $documentpaths = Documentpath::all();
        return response()->json($documentpaths);
    }

    // POST /api/documentpaths
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'document_path' => 'required|max:255',
            'task_id'       => 'required|integer',
            'hist_id'       => 'nullable|integer',
        ]);

        $document = Documentpath::create($validatedData);
        return response()->json([
            'message' => 'Document created successfully',
            'data'    => $document
        ], 201);
    }

    // GET /api/documentpaths/{documentpath}
    public function show(Documentpath $documentpath)
    {
        return response()->json($documentpath);
    }

    // PUT/PATCH /api/documentpaths/{documentpath}
    public function update(Request $request, Documentpath $documentpath)
    {
        $validatedData = $request->validate([
            'document_path' => 'required|max:255',
            'task_id'       => 'required|integer',
            'hist_id'       => 'nullable|integer',
        ]);

        $documentpath->update($validatedData);
        return response()->json([
            'message' => 'Document updated successfully',
            'data'    => $documentpath
        ]);
    }

    // DELETE /api/documentpaths/{documentpath}
    public function destroy(Documentpath $documentpath)
    {
        $documentpath->delete();
        return response()->json(['message' => 'Document deleted successfully']);
    }
}
