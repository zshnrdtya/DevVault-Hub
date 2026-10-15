<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Services\GeminiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class AiGenerateController extends Controller
{
    public function __construct(
        protected GeminiService $geminiService
    ) {}

    /**
     * Handle AI metadata generation for snippets, prompts, or resources.
     */
    public function generate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => ['required', 'string', 'in:snippet,prompt,resource'],
            'content' => ['required', 'string', 'min:3', 'max:50000'],
        ]);

        $user = $request->user();
        $categories = Category::where('user_id', $user->id)->get(['id', 'name', 'slug']);
        $categoryNames = $categories->pluck('name')->all();

        try {
            $type = $validated['type'];
            $content = $validated['content'];

            $result = match ($type) {
                'snippet' => $this->geminiService->analyzeSnippet($content, $categoryNames),
                'prompt' => $this->geminiService->analyzePrompt($content, $categoryNames),
                'resource' => $this->geminiService->analyzeResource($content, $categoryNames),
            };

            // Attempt matching category_id
            $suggestedCat = $result['category_name'] ?? '';
            $result['category_id'] = '';

            if (! empty($suggestedCat)) {
                $matched = $categories->first(function ($cat) use ($suggestedCat) {
                    $catLower = Str::lower($cat->name);
                    $sugLower = Str::lower($suggestedCat);

                    return $catLower === $sugLower
                        || Str::contains($catLower, $sugLower)
                        || Str::contains($sugLower, $catLower);
                });

                if ($matched) {
                    $result['category_id'] = $matched->id;
                    $result['category_name'] = $matched->name;
                }
            }

            return response()->json([
                'success' => true,
                'data' => $result,
            ]);
        } catch (\Throwable $e) {
            Log::error('AI Generate Controller Exception: '.$e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Gagal menghasilkan metadata AI: '.$e->getMessage(),
            ], 500);
        }
    }
}
