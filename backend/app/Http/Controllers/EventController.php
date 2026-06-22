<?php

namespace App\Http\Controllers;

use App\Models\Event;

class EventController extends BasePublishableController
{
    protected function getModelClass(): string
    {
        return Event::class;
    }

    public function upcoming()
    {
        return response()->json(Event::upcoming()->take(6)->get());
    }
}
