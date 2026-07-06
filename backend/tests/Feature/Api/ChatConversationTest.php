<?php

namespace Tests\Feature\Api;

use App\Models\ChatConversation;
use App\Models\ChatMessage;
use App\Models\News;
use App\Services\RAGPipeline;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\RateLimiter;
use Mockery;
use Tests\TestCase;

class ChatConversationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Seed published news so keyword fallback can find context for "ILKOM"
        News::factory()->create([
            'title' => 'ILKOM NEWS Terbuka',
            'summary' => 'FASILKOM membuka pendaftaran mahasiswa baru.',
            'published' => true,
            'slug' => 'ilkom-news-terbuka',
        ]);

        // Mock RAGPipeline so retrieveOnly() returns context
        // (avoids EmbeddingService / external API calls)
        $mock = Mockery::mock(RAGPipeline::class);
        $mock->shouldReceive('retrieveOnly')
            ->andReturn('[Berita] ILKOM NEWS Terbuka - FASILKOM');
        $this->app->instance(RAGPipeline::class, $mock);

        // Clear rate limits
        RateLimiter::clear('chat:min:ip:127.0.0.1');
        RateLimiter::clear('chat:hr:ip:127.0.0.1');
        RateLimiter::clear('chat:day:ip:127.0.0.1');
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_chat_persists_conversation_and_messages()
    {
        $response = $this->postJson('/api/chat', [
            'message' => 'Apa itu ILKOM?',
            'session_id' => 'conv-test-001',
        ]);

        // No active LLM providers → 503, but conversation + user message
        // are created before the provider check.
        $response->assertStatus(503);

        $this->assertDatabaseHas('chat_conversations', [
            'session_id' => 'conv-test-001',
        ]);

        // User message is saved; assistant message requires a live LLM call
        $this->assertDatabaseHas('chat_messages', [
            'conversation_id' => ChatConversation::where('session_id', 'conv-test-001')->value('id'),
            'role' => 'user',
            'content' => 'Apa itu ILKOM?',
        ]);
    }

    public function test_chat_creates_new_conversation_for_new_session_id()
    {
        $this->postJson('/api/chat', [
            'message' => 'Apa itu ILKOM?',
            'session_id' => 'session-aaa',
        ]);

        $this->postJson('/api/chat', [
            'message' => 'Apa itu ILKOM?',
            'session_id' => 'session-bbb',
        ]);

        $this->assertDatabaseCount('chat_conversations', 2);
    }

    public function test_chat_message_has_correct_role()
    {
        $this->postJson('/api/chat', [
            'message' => 'Apa itu ILKOM?',
            'session_id' => 'role-test-001',
        ]);

        $conversationId = ChatConversation::where('session_id', 'role-test-001')->value('id');

        // User message is persisted immediately
        $this->assertDatabaseHas('chat_messages', [
            'conversation_id' => $conversationId,
            'role' => 'user',
            'content' => 'Apa itu ILKOM?',
        ]);

        // Assistant message is only saved after a successful LLM response,
        // so with no providers active we only have the user message.
        $this->assertDatabaseCount('chat_messages', 1);
    }
}
