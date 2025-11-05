<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Traits\HasRoles;

class Agent extends Model
{
    use HasFactory,HasRoles;
    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function services()
    {
        return $this->hasMany(Service::class, 'created_by', 'user_id');
    }

    public function reviews()
    {
        return $this->hasMany(CustomerReview::class, 'agent_id');
    }


}
