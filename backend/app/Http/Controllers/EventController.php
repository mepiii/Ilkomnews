<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $query = Event::published()->latest('date');

        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        return response()->json($query->paginate(12));
    }

    public function upcoming()
    {
        return response()->json(Event::upcoming()->take(6)->get());
    }

    public function show($id)
    {
        return response()->json(Event::published()->where('id', $id)->orWhere('slug', $id)->firstOrFail());
    }

    public function categories()
    {
        return response()->json(Event::published()->distinct()->pluck('category'));
    }
}
