<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use App\Models\Ticket;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    public function index()
    {
        return response()->json(Schedule::with(['movie', 'studio'])->get());
    }

    public function show(Schedule $schedule)
    {
        // Load seats and mark which are booked for this schedule
        $schedule->load(['movie', 'studio.seats']);
        $bookedSeatIds = Ticket::whereHas('booking', function ($q) use ($schedule) {
            $q->where('schedule_id', $schedule->id)->whereIn('status', ['pending', 'paid']);
        })->pluck('seat_id');

        $seats = $schedule->studio->seats->map(function ($seat) use ($bookedSeatIds) {
            return array_merge($seat->toArray(), ['is_booked' => $bookedSeatIds->contains($seat->id)]);
        });

        return response()->json([
            'schedule' => $schedule,
            'seats'    => $seats,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'movie_id'   => 'required|exists:movies,id',
            'studio_id'  => 'required|exists:studios,id',
            'date'       => 'required|date',
            'start_time' => 'required',
            'end_time'   => 'required',
            'price'      => 'required|numeric|min:0',
        ]);

        $schedule = Schedule::create($validated);
        return response()->json($schedule->load(['movie', 'studio']), 201);
    }

    public function update(Request $request, Schedule $schedule)
    {
        $validated = $request->validate([
            'movie_id'   => 'sometimes|exists:movies,id',
            'studio_id'  => 'sometimes|exists:studios,id',
            'date'       => 'sometimes|date',
            'start_time' => 'sometimes',
            'end_time'   => 'sometimes',
            'price'      => 'sometimes|numeric|min:0',
        ]);

        $schedule->update($validated);
        return response()->json($schedule->load(['movie', 'studio']));
    }

    public function destroy(Schedule $schedule)
    {
        $schedule->delete();
        return response()->json(['message' => 'Schedule deleted']);
    }
}
