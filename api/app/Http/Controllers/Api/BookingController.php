<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Schedule;
use App\Models\Seat;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'admin') {
            $bookings = Booking::with(['user', 'schedule.movie', 'tickets.seat'])->latest()->get();
        } elseif ($user->role === 'kasir') {
            $bookings = Booking::with(['user', 'schedule.movie', 'tickets.seat'])->latest()->get();
        } else {
            $bookings = $user->bookings()->with(['schedule.movie', 'tickets.seat'])->latest()->get();
        }

        return response()->json($bookings);
    }

    public function show(Booking $booking)
    {
        return response()->json($booking->load(['user', 'schedule.movie', 'schedule.studio', 'tickets.seat']));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'schedule_id'    => 'required|exists:schedules,id',
            'seat_ids'       => 'required|array|min:1',
            'seat_ids.*'     => 'exists:seats,id',
            'payment_method' => 'required|string',
        ]);

        $schedule = Schedule::findOrFail($validated['schedule_id']);
        $seatIds  = $validated['seat_ids'];

        // Check if seats are already booked
        $alreadyBooked = Ticket::whereHas('booking', function ($q) use ($schedule) {
            $q->where('schedule_id', $schedule->id)->whereIn('status', ['pending', 'paid']);
        })->whereIn('seat_id', $seatIds)->exists();

        if ($alreadyBooked) {
            return response()->json(['message' => 'Beberapa kursi sudah dipesan.'], 422);
        }

        $totalPrice = $schedule->price * count($seatIds);

        DB::beginTransaction();
        try {
            $userId = $request->user()->role === 'kasir' && $request->has('user_id')
                ? $request->user_id
                : $request->user()->id;

            $status = $request->user()->role === 'kasir' ? 'paid' : 'pending';

            $booking = Booking::create([
                'user_id'        => $userId,
                'schedule_id'    => $schedule->id,
                'total_price'    => $totalPrice,
                'status'         => $status,
                'payment_method' => $validated['payment_method'],
            ]);

            foreach ($seatIds as $seatId) {
                Ticket::create([
                    'booking_id' => $booking->id,
                    'seat_id'    => $seatId,
                ]);
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Terjadi kesalahan: ' . $e->getMessage()], 500);
        }

        return response()->json($booking->load(['schedule.movie', 'tickets.seat']), 201);
    }

    public function updateStatus(Request $request, Booking $booking)
    {
        $request->validate(['status' => 'required|in:pending,paid,cancelled']);
        $booking->update(['status' => $request->status]);
        return response()->json($booking);
    }

    public function searchByCode($code)
    {
        $booking = Booking::with(['user', 'schedule.movie', 'schedule.studio', 'tickets.seat'])
            ->where('booking_code', $code)
            ->first();

        if (!$booking) {
            return response()->json(['message' => 'Kode booking tidak ditemukan.'], 404);
        }

        return response()->json($booking);
    }
}
