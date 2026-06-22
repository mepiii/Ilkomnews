<?php

namespace App\Http\Controllers;

use App\Models\Career;
use Illuminate\Http\Request;

class CareerController extends Controller
{
    public function index(Request $request)
    {
        $query = Career::published()->latest('deadline');

        if ($request->has('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        if ($request->has('search')) {
            $search = addcslashes($request->search, '%_');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('company', 'like', "%{$search}%");
            });
        }

        return response()->json($query->paginate(12));
    }

    public function show($id)
    {
        return response()->json(Career::published()->where('id', $id)->orWhere('slug', $id)->firstOrFail());
    }

    public function types()
    {
        return response()->json(Career::published()->distinct()->pluck('type'));
    }

    public function locations()
    {
        return response()->json(Career::published()->distinct()->pluck('location'));
    }
}
