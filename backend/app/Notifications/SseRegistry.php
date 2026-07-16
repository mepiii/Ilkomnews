<?php

namespace App\Notifications;

// ponytail: in-memory, single-process. Multi-worker/horizontally scaled deployments need Redis pub/sub instead.

class SseRegistry
{
    /** @var array<string, array<int, callable>> */
    private static array $streams = [];

    /**
     * Register a stream closure for a trackingId. Returns the registered closure
     * handle so it can be unregistered later.
     *
     * @param callable $stream
     * @return callable
     */
    public static function register(string $trackingId, callable $stream): callable
    {
        self::$streams[$trackingId][] = $stream;

        return $stream;
    }

    public static function unregister(string $trackingId, callable $stream): void
    {
        if (!isset(self::$streams[$trackingId])) {
            return;
        }

        self::$streams[$trackingId] = array_filter(
            self::$streams[$trackingId],
            fn ($s) => $s !== $stream
        );

        if (empty(self::$streams[$trackingId])) {
            unset(self::$streams[$trackingId]);
        }
    }

    /**
     * Push a notification to every live stream for the trackingId.
     *
     * @param mixed $notification
     */
    public static function push(string $trackingId, $notification): void
    {
        if (!isset(self::$streams[$trackingId])) {
            return;
        }

        foreach (self::$streams[$trackingId] as $stream) {
            $stream($notification);
        }
    }
}
