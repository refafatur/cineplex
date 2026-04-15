<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Movie;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats()
    {
        $months = collect(range(1, 12));

        $revenueTrend = Booking::where('status', 'paid')
            ->whereYear('created_at', now()->year)
            ->selectRaw('MONTH(created_at) as month, sum(total_price) as total')
            ->groupBy('month')
            ->get()
            ->pluck('total', 'month');

        $monthNames = [
            1 => 'Jan', 2 => 'Feb', 3 => 'Mar', 4 => 'Apr',
            5 => 'Mei', 6 => 'Jun', 7 => 'Jul', 8 => 'Agu',
            9 => 'Sep', 10 => 'Okt', 11 => 'Nov', 12 => 'Des'
        ];

        $formattedTrend = $months->map(function ($m) use ($revenueTrend, $monthNames) {
            return [
                'date' => $monthNames[$m],
                'revenue' => $revenueTrend->get($m, 0),
            ];
        });

        return response()->json([
            'total_movies'   => Movie::count(),
            'total_users'    => User::where('role', 'pelanggan')->count(),
            'total_bookings' => Booking::count(),
            'total_revenue'  => Booking::where('status', 'paid')->sum('total_price'),
            'upcoming_schedules' => \App\Models\Schedule::where('date', '>=', now()->format('Y-m-d'))->count(),
            'recent_bookings' => Booking::with(['user', 'schedule.movie'])->latest()->take(5)->get(),
            'revenue_trend' => $formattedTrend,
        ]);
    }
}
