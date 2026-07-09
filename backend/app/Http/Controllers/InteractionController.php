<?php

namespace App\Http\Controllers;

use App\Models\Interaction;
use Illuminate\Http\Request;

class InteractionController extends Controller
{
    /**
     * Get interaction stats for an item
     */
    public function stats(string $type, $id)
    {
        $stats = Interaction::firstOrCreate(
            ['item_type' => $type, 'item_id' => $id],
            ['views' => 0, 'likes' => 0, 'saves' => 0, 'shares' => 0]
        );

        return response()->json([
            'views' => $stats->views,
            'likes' => $stats->likes,
            'saves' => $stats->saves,
            'shares' => $stats->shares,
        ]);
    }

    /**
     * Increment view count
     */
    public function incrementView(string $type, $id)
    {
        $stats = Interaction::firstOrCreate(
            ['item_type' => $type, 'item_id' => $id],
            ['views' => 0, 'likes' => 0, 'saves' => 0, 'shares' => 0]
        );

        $stats->increment('views');

        return response()->json(['views' => $stats->views]);
    }

    /**
     * Toggle like (increment or decrement)
     */
    public function toggleLike(string $type, $id)
    {
        $stats = Interaction::firstOrCreate(
            ['item_type' => $type, 'item_id' => $id],
            ['views' => 0, 'likes' => 0, 'saves' => 0, 'shares' => 0]
        );

        // Note: This just increments the aggregate count
        // The actual like state is tracked in localStorage on the frontend
        $stats->increment('likes');

        return response()->json([
            'liked' => true,
            'likes' => $stats->likes,
        ]);
    }

    /**
     * Toggle save (increment or decrement)
     */
    public function toggleSave(string $type, $id)
    {
        $stats = Interaction::firstOrCreate(
            ['item_type' => $type, 'item_id' => $id],
            ['views' => 0, 'likes' => 0, 'saves' => 0, 'shares' => 0]
        );

        // Note: This just increments the aggregate count
        // The actual save state is tracked in localStorage on the frontend
        $stats->increment('saves');

        return response()->json([
            'saved' => true,
            'saves' => $stats->saves,
        ]);
    }

    /**
     * Increment share count
     */
    public function incrementShare(string $type, $id)
    {
        $stats = Interaction::firstOrCreate(
            ['item_type' => $type, 'item_id' => $id],
            ['views' => 0, 'likes' => 0, 'saves' => 0, 'shares' => 0]
        );

        $stats->increment('shares');

        return response()->json(['shares' => $stats->shares]);
    }
}
