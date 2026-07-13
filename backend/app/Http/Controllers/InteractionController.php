<?php

namespace App\Http\Controllers;

use App\Models\EngagementInteraction;
use App\Models\Interaction;

class InteractionController extends Controller
{
    /**
     * Get interaction stats for an item
     */
    public function stats(string $type, $id)
    {
        try {
            $interaction = Interaction::firstOrCreate(
                ['item_type' => $type, 'item_id' => (string) $id],
                ['views' => 0, 'likes' => 0, 'saves' => 0, 'shares' => 0]
            );

            $visitorId = $this->resolveVisitorId();

            $isLiked = EngagementInteraction::forItem($type, $id)
                ->where('visitor_id', $visitorId)
                ->where('type', 'love')
                ->exists();

            $isSaved = EngagementInteraction::forItem($type, $id)
                ->where('visitor_id', $visitorId)
                ->where('type', 'save')
                ->exists();

            return response()->json([
                'views' => $interaction->views ?? 0,
                'likes' => $interaction->likes ?? 0,
                'saves' => $interaction->saves ?? 0,
                'shares' => $interaction->shares ?? 0,
                'isLiked' => $isLiked,
                'isSaved' => $isSaved,
            ]);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Unable to fetch interaction stats.'], 500);
        }
    }

    /**
     * Increment view count (once per visitor)
     */
    public function incrementView(string $type, $id)
    {
        try {
            $visitorId = $this->resolveVisitorId();

            $seen = EngagementInteraction::firstOrCreate([
                'visitor_id' => $visitorId,
                'interactable_type' => $type,
                'interactable_id' => (int) $id,
                'type' => 'seen',
            ]);

            $isNew = $seen->wasRecentlyCreated;

            $interaction = Interaction::firstOrCreate(
                ['item_type' => $type, 'item_id' => (string) $id],
                ['views' => 0, 'likes' => 0, 'saves' => 0, 'shares' => 0]
            );

            if ($isNew) {
                $interaction->increment('views');
            }

            return response()->json(['views' => $interaction->views ?? 0]);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Unable to record view.'], 500);
        }
    }

    /**
     * Toggle like for the current visitor
     */
    public function toggleLike(string $type, $id)
    {
        try {
            $visitorId = $this->resolveVisitorId();

            $existing = EngagementInteraction::forItem($type, $id)
                ->where('visitor_id', $visitorId)
                ->where('type', 'love')
                ->first();

            if ($existing) {
                $existing->delete();
                $liked = false;
            } else {
                EngagementInteraction::create([
                    'visitor_id' => $visitorId,
                    'interactable_type' => $type,
                    'interactable_id' => (int) $id,
                    'type' => 'love',
                ]);
                $liked = true;
            }

            $this->syncAggregate($type, $id);

            $interaction = Interaction::firstOrCreate(
                ['item_type' => $type, 'item_id' => (string) $id],
                ['views' => 0, 'likes' => 0, 'saves' => 0, 'shares' => 0]
            );

            return response()->json([
                'liked' => $liked,
                'likes' => $interaction->likes ?? 0,
            ]);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Unable to toggle like.'], 500);
        }
    }

    /**
     * Toggle save for the current visitor
     */
    public function toggleSave(string $type, $id)
    {
        try {
            $visitorId = $this->resolveVisitorId();

            $existing = EngagementInteraction::forItem($type, $id)
                ->where('visitor_id', $visitorId)
                ->where('type', 'save')
                ->first();

            if ($existing) {
                $existing->delete();
                $saved = false;
            } else {
                EngagementInteraction::create([
                    'visitor_id' => $visitorId,
                    'interactable_type' => $type,
                    'interactable_id' => (int) $id,
                    'type' => 'save',
                ]);
                $saved = true;
            }

            $this->syncAggregate($type, $id);

            $interaction = Interaction::firstOrCreate(
                ['item_type' => $type, 'item_id' => (string) $id],
                ['views' => 0, 'likes' => 0, 'saves' => 0, 'shares' => 0]
            );

            return response()->json([
                'saved' => $saved,
                'saves' => $interaction->saves ?? 0,
            ]);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Unable to toggle save.'], 500);
        }
    }

    /**
     * Increment share count
     */
    public function incrementShare(string $type, $id)
    {
        try {
            $interaction = Interaction::firstOrCreate(
                ['item_type' => $type, 'item_id' => (string) $id],
                ['views' => 0, 'likes' => 0, 'saves' => 0, 'shares' => 0]
            );

            $interaction->increment('shares');

            return response()->json(['shares' => $interaction->shares ?? 0]);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Unable to record share.'], 500);
        }
    }

    /**
     * Recompute likes/saves aggregates from engagement_interactions.
     */
    private function syncAggregate(string $type, $id): void
    {
        $interaction = Interaction::firstOrCreate(
            ['item_type' => $type, 'item_id' => (string) $id],
            ['views' => 0, 'likes' => 0, 'saves' => 0, 'shares' => 0]
        );

        $likes = EngagementInteraction::countForItem($type, $id, 'love');
        $saves = EngagementInteraction::countForItem($type, $id, 'save');

        $interaction->likes = $likes;
        $interaction->saves = $saves;
        $interaction->save();
    }

    /**
     * Resolve the stable visitor id from request body or header.
     */
    private function resolveVisitorId(): string
    {
        // ponytail: empty string must be anonymous too — otherwise distinct
        // visitors with a blank id merge into one real key.
        $id = (string) (request('visitor_id') ?? request()->header('X-Visitor-Id') ?? 'anon');
        return $id === '' ? 'anon' : $id;
    }
}
