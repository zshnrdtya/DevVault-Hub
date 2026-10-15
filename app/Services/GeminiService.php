<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class GeminiService
{
    protected ?string $apiKey;

    protected string $model;

    protected string $baseUrl;

    public function __construct()
    {
        $this->apiKey = config('services.gemini.key');
        $this->model = config('services.gemini.model', 'gemini-3.8-flash');
        $this->baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
    }

    /**
     * Analyze code snippet and generate metadata.
     *
     * @param  array<int, string>  $categoryNames
     * @return array{title: string, language: string, category_name: string, description: string, tags: array<int, string>}
     */
    public function analyzeSnippet(string $code, array $categoryNames = []): array
    {
        $categoryContext = empty($categoryNames)
            ? 'Tidak ada kategori spesifik yang tersedia.'
            : 'Pilihan kategori vault saat ini: '.implode(', ', $categoryNames).'.';

        $systemPrompt = <<<PROMPT
Anda adalah asisten AI teknis untuk DevVault, pusat manajemen snippet kode developer.
Tugas Anda adalah menganalisis potongan kode yang diberikan dan menghasilkan metadata terstruktur.

Aturan Copywriting Wajib (Rules-Raditya CODE):
1. DILARANG menggunakan kata klise AI seperti: elevate, empower, unlock, delve, showcase, game-changer, seamless, cutting-edge, revolutionary, robust, landscape.
2. DILARANG menggunakan karakter em dash (\u{2014}) atau en dash (\u{2013}). Gunakan tanda hubung biasa ('-') jika diperlukan.
3. Deskripsi harus terdiri dari 1 hingga 2 kalimat padat, jelas, faktual, dalam Bahasa Indonesia, menjelaskan fungsi teknis kode secara langsung tanpa basa-basi atau meta-komentar.
4. Judul harus singkat (3 sampai 7 kata), deskriptif, dan konkret (contoh: "Helper Debounce Event JavaScript", "Middleware Otentikasi JWT").
5. Bahasa pemrograman (language) harus berupa identifier huruf kecil standar (contoh: php, javascript, typescript, python, sql, bash, go, rust, html, css, dockerfile).
6. Tags harus berupa 2 hingga 5 kata kunci huruf kecil tanpa tanda pagar (#).
7. Kategori: Pilih nama kategori yang paling sesuai dari daftar berikut jika cocok: {$categoryContext}. Jika tidak ada yang cocok, berikan nama kategori singkat dan logis.

Format output WAJIB JSON murni tanpa markdown dengan skema berikut:
{
  "title": "Judul deskriptif singkat",
  "language": "identifier_bahasa",
  "category_name": "Nama Kategori",
  "description": "Deskripsi teknis singkat 1-2 kalimat.",
  "tags": ["tag1", "tag2", "tag3"]
}
PROMPT;

        return $this->sendRequest($systemPrompt, $code, [
            'title' => 'Snippet Kode Baru',
            'language' => 'text',
            'category_name' => 'General',
            'description' => 'Snippet kode tanpa deskripsi spesifik.',
            'tags' => ['code', 'snippet'],
        ]);
    }

    /**
     * Analyze prompt and generate metadata.
     *
     * @param  array<int, string>  $categoryNames
     * @return array{title: string, category_name: string, description: string, tags: array<int, string>}
     */
    public function analyzePrompt(string $promptText, array $categoryNames = []): array
    {
        $categoryContext = empty($categoryNames)
            ? 'Tidak ada kategori spesifik yang tersedia.'
            : 'Pilihan kategori vault saat ini: '.implode(', ', $categoryNames).'.';

        $systemPrompt = <<<PROMPT
Anda adalah asisten AI untuk DevVault.
Tugas Anda adalah menganalisis instruksi prompt AI dan menghasilkan metadata terstruktur.

Aturan Copywriting Wajib (Rules-Raditya CODE):
1. DILARANG menggunakan kata klise AI: elevate, empower, unlock, delve, showcase, game-changer, seamless, cutting-edge, robust.
2. DILARANG menggunakan karakter em dash (\u{2014}) atau en dash (\u{2013}). Gunakan tanda hubung biasa ('-').
3. Deskripsi harus 1 hingga 2 kalimat padat, jelas, dalam Bahasa Indonesia, menjelaskan tujuan prompt.
4. Judul harus singkat (3 sampai 6 kata) dan jelas.
5. Tags harus berupa 2 hingga 5 kata kunci huruf kecil tanpa tanda pagar (#).
6. Kategori: Cocokkan dengan salah satu: {$categoryContext}, atau berikan nama kategori singkat.

Format output WAJIB JSON murni tanpa markdown:
{
  "title": "Judul prompt singkat",
  "category_name": "Nama Kategori",
  "description": "Deskripsi tujuan prompt 1-2 kalimat.",
  "tags": ["tag1", "tag2"]
}
PROMPT;

        return $this->sendRequest($systemPrompt, $promptText, [
            'title' => 'Prompt Baru',
            'category_name' => 'AI Prompts',
            'description' => 'Prompt instruksi untuk model AI.',
            'tags' => ['ai', 'prompt'],
        ]);
    }

    /**
     * Analyze resource URL or text and generate metadata.
     *
     * @param  array<int, string>  $categoryNames
     * @return array{title: string, note: string, category_name: string, tags: array<int, string>}
     */
    public function analyzeResource(string $content, array $categoryNames = []): array
    {
        $categoryContext = empty($categoryNames)
            ? 'Tidak ada kategori spesifik yang tersedia.'
            : 'Pilihan kategori vault saat ini: '.implode(', ', $categoryNames).'.';

        $systemPrompt = <<<PROMPT
Anda adalah asisten AI untuk DevVault.
Tugas Anda adalah menganalisis URL tautan referensi developer atau teks dokumentasi dan menghasilkan metadata bookmark terstruktur.

Aturan Copywriting Wajib (Rules-Raditya CODE):
1. DILARANG menggunakan kata klise AI: elevate, empower, unlock, delve, showcase, game-changer, seamless, cutting-edge, robust.
2. DILARANG menggunakan karakter em dash (\u{2014}) atau en dash (\u{2013}). Gunakan tanda hubung biasa ('-').
3. Catatan (note) harus 1 hingga 2 kalimat ringkas dalam Bahasa Indonesia tentang isi referensi.
4. Judul harus singkat dan merepresentasikan resource secara tepat.
5. Tags harus berupa 2 hingga 5 kata kunci huruf kecil tanpa tanda pagar (#).
6. Kategori: Cocokkan dengan salah satu: {$categoryContext}, atau berikan nama kategori singkat.

Format output WAJIB JSON murni tanpa markdown:
{
  "title": "Nama Resource Bersih",
  "category_name": "Nama Kategori",
  "note": "Catatan singkat 1-2 kalimat mengenai referensi ini.",
  "tags": ["tag1", "tag2"]
}
PROMPT;

        $result = $this->sendRequest($systemPrompt, $content, [
            'title' => 'Bookmark Baru',
            'category_name' => 'Resources',
            'note' => 'Referensi tautan pengembang.',
            'tags' => ['resource', 'link'],
        ]);

        return [
            'title' => $result['title'] ?? 'Bookmark Baru',
            'category_name' => $result['category_name'] ?? 'Resources',
            'note' => $result['note'] ?? ($result['description'] ?? 'Referensi tautan pengembang.'),
            'tags' => $result['tags'] ?? ['resource'],
        ];
    }

    /**
     * Send prompt to Gemini API with robust JSON parsing and anti-slop cleaning.
     *
     * @param  array<string, mixed>  $fallback
     * @return array<string, mixed>
     */
    protected function sendRequest(string $systemPrompt, string $userContent, array $fallback): array
    {
        if (empty($this->apiKey)) {
            throw new RuntimeException('Kunci API Gemini (GEMINI_API_KEY) belum dikonfigurasi di file .env.');
        }

        $candidateModels = array_unique([
            $this->model,
            'gemini-flash-lite-latest',
            'gemini-3.1-flash-lite',
            'gemini-3.5-flash-lite',
        ]);

        $truncatedContent = mb_substr($userContent, 0, 15000);
        $lastException = null;

        foreach ($candidateModels as $candidateModel) {
            $url = "{$this->baseUrl}/{$candidateModel}:generateContent?key={$this->apiKey}";

            try {
                $response = Http::timeout(15)->post($url, [
                    'contents' => [
                        [
                            'role' => 'user',
                            'parts' => [
                                ['text' => $systemPrompt."\n\nKonten input:\n".$truncatedContent],
                            ],
                        ],
                    ],
                    'generationConfig' => [
                        'responseMimeType' => 'application/json',
                        'temperature' => 0.2,
                    ],
                ]);

                if (! $response->successful()) {
                    Log::warning("Gemini model {$candidateModel} returned status {$response->status()}: ".$response->body());
                    if (in_array($response->status(), [503, 429, 500, 404])) {
                        continue;
                    }
                    throw new RuntimeException('Gagal menghubungi Gemini API: '.$response->status());
                }

                $body = $response->json();
                $rawText = $body['candidates'][0]['content']['parts'][0]['text'] ?? '';

                if (empty($rawText)) {
                    continue;
                }

                $parsed = json_decode($rawText, true);

                if (! is_array($parsed)) {
                    continue;
                }

                return $this->cleanSanitizeOutput($parsed);
            } catch (\Throwable $e) {
                $lastException = $e;
                Log::warning("Gemini model {$candidateModel} attempt failed: ".$e->getMessage());
            }
        }

        if ($lastException) {
            Log::error('All Gemini model attempts failed: '.$lastException->getMessage());
            throw new RuntimeException('Layanan Gemini AI sedang sibuk. Silakan coba beberapa saat lagi.');
        }

        return $fallback;
    }

    /**
     * Sanitize output to prevent em dashes or en dashes.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    protected function cleanSanitizeOutput(array $data): array
    {
        $sanitized = [];

        foreach ($data as $key => $value) {
            if (is_string($value)) {
                $sanitized[$key] = $this->sanitizeText($value);
            } elseif (is_array($value)) {
                $sanitized[$key] = array_map(function ($item) {
                    return is_string($item) ? $this->sanitizeText($item) : $item;
                }, $value);
            } else {
                $sanitized[$key] = $value;
            }
        }

        return $sanitized;
    }

    /**
     * Replace forbidden dashes and trim.
     */
    protected function sanitizeText(string $text): string
    {
        return trim(str_replace(["\u{2014}", "\u{2013}"], '-', $text));
    }
}
