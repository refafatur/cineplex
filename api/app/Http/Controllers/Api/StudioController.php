<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Studio;
use App\Models\Seat;
use Illuminate\Http\Request;

class StudioController extends Controller
{
    public function index()
    {
        return response()->json(Studio::withCount('seats')->get());
    }

    public function show(Studio $studio)
    {
        return response()->json($studio->load('seats'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'capacity' => 'required|integer|min:1',
        ]);

        $studio = Studio::create($validated);

        // Auto-generate seats based on capacity
        $rows    = range('A', 'Z');
        $seatsPerRow = 10;
        $totalSeats  = $validated['capacity'];
        $count   = 0;

        foreach ($rows as $row) {
            for ($num = 1; $num <= $seatsPerRow; $num++) {
                if ($count >= $totalSeats) break 2;
                Seat::create([
                    'studio_id' => $studio->id,
                    'row'       => $row,
                    'number'    => $num,
                ]);
                $count++;
            }
        }

        return response()->json($studio->load('seats'), 201);
    }

    public function update(Request $request, Studio $studio)
    {
        $validated = $request->validate([
            'name'     => 'sometimes|string|max:255',
            'capacity' => 'sometimes|integer|min:1',
        ]);

        $studio->update($validated);
        return response()->json($studio);
    }

    public function destroy(Studio $studio)
    {
        $studio->delete();
        return response()->json(['message' => 'Studio deleted']);
    }
}
