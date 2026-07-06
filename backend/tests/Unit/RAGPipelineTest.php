<?php

namespace Tests\Unit;

use App\Services\EmbeddingService;
use App\Services\LLMRouter;
use App\Services\RAGPipeline;
use App\Services\VectorSearchService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\DB;
use Mockery;
use Tests\TestCase;

class RAGPipelineTest extends TestCase
{
    use RefreshDatabase;

    private function createRAGPipeline(): RAGPipeline
    {
        $embeddingMock = Mockery::mock(EmbeddingService::class);
        $embeddingMock->shouldReceive('generate')
            ->andReturn(['embedding' => array_fill(0, 384, 0.1)]);
        $embeddingMock->shouldReceive('cosineSimilarity')
            ->andReturn(0.0);
        App::instance(EmbeddingService::class, $embeddingMock);

        $vectorSearch = new VectorSearchService($embeddingMock);
        $llmRouter = Mockery::mock(LLMRouter::class);

        return new RAGPipeline($llmRouter, $vectorSearch, $embeddingMock);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_retrieve_only_returns_null_for_empty_index()
    {
        $pipeline = $this->createRAGPipeline();

        $result = $pipeline->retrieveOnly('Apa itu ILKOM?');

        $this->assertNull($result);
    }

    public function test_retrieve_only_returns_context_when_chunks_exist()
    {
        // Seed knowledge_chunks — chunk_text must contain the query as substring
        // because hybridSearch uses LIKE "%{query}%" for keyword matching
        DB::table('knowledge_chunks')->insert([
            'source_type' => 'news',
            'source_id' => 1,
            'chunk_text' => 'Apa itu ILKOM? ILKOM adalah Fakultas Ilmu Komputer Universitas Sriwijaya.',
            'summary' => 'Tentang ILKOM UNSRI',
            'embedding' => null,
            'embedding_model' => null,
            'token_count' => 20,
        ]);

        $pipeline = $this->createRAGPipeline();

        $result = $pipeline->retrieveOnly('Apa itu ILKOM?');

        $this->assertNotNull($result);
        $this->assertNotEmpty($result);
    }
}
