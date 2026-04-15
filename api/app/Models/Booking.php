<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'schedule_id',
        'booking_code',
        'total_price',
        'status',
        'payment_method',
    ];

    protected static function booted()
    {
        static::creating(function ($booking) {
            if (!$booking->booking_code) {
                $booking->booking_code = 'CPX-' . strtoupper(bin2hex(random_bytes(4)));
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function schedule()
    {
        return $this->belongsTo(Schedule::class);
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }
}
