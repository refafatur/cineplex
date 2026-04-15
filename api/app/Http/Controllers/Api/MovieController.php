<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Movie;
use Illuminate\Http\Request;

class MovieController extends Controller
{
    public function index()
    {
        return response()->json(Movie::latest()->get());
    }

    public function show(Movie $movie)
    {
        return response()->json($movie->load('schedules.studio'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'            => 'required|string|max:255',
            'description'      => 'nullable|string',
            'poster'           => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
            'thumbnail'        => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
            'trailer'          => 'nullable|mimetypes:video/mp4,video/quicktime,video/webm|max:5120',
            'duration_minutes' => 'required|integer|min:1',
            'status'           => 'required|in:showing,coming_soon',
        ]);

        if ($request->hasFile('poster')) {
            $path = $request->file('poster')->store('posters', 'public');
            $validated['poster'] = url('storage/' . $path);
        }
        
        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('thumbnails', 'public');
            $validated['thumbnail'] = url('storage/' . $path);
        }

        if ($request->hasFile('trailer')) {
            $path = $request->file('trailer')->store('trailers', 'public');
            $validated['trailer'] = url('storage/' . $path);
        }

        $movie = Movie::create($validated);
        return response()->json($movie, 201);
    }

    public function update(Request $request, Movie $movie)
    {
        $validated = $request->validate([
            'title'            => 'sometimes|string|max:255',
            'description'      => 'nullable|string',
            'poster'           => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
            'thumbnail'        => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
            'trailer'          => 'nullable|mimetypes:video/mp4,video/quicktime,video/webm|max:5120',
            'duration_minutes' => 'sometimes|integer|min:1',
            'status'           => 'sometimes|in:showing,coming_soon',
        ]);

        if ($request->hasFile('poster')) {
            $path = $request->file('poster')->store('posters', 'public');
            $validated['poster'] = url('storage/' . $path);
        } else {
            unset($validated['poster']);
        }
        
        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('thumbnails', 'public');
            $validated['thumbnail'] = url('storage/' . $path);
        } else {
            unset($validated['thumbnail']);
        }

        if ($request->hasFile('trailer')) {
            $path = $request->file('trailer')->store('trailers', 'public');
            $validated['trailer'] = url('storage/' . $path);
        } else {
            unset($validated['trailer']);
        }

        $movie->update($validated);
        return response()->json($movie);
    }

    public function destroy(Movie $movie)
    {
        $movie->delete();
        return response()->json(['message' => 'Movie deleted']);
    }
}
