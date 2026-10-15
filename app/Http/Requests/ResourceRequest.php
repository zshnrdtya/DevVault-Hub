<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ResourceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $userId = $this->user()?->id;

        return [
            'title' => ['required', 'string', 'min:3', 'max:150'],
            'url' => ['required', 'url:http,https', 'max:2048'],
            'note' => ['nullable', 'string', 'max:2000'],
            'category_id' => [
                'nullable',
                Rule::exists('categories', 'id')
                    ->where('user_id', $userId)
                    ->where('type', 'resource'),
            ],
            'tags' => ['nullable', 'array', 'max:10'],
            'tags.*' => ['string', 'min:1', 'max:30'],
            'is_favorite' => ['nullable', 'boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Judul bookmark wajib diisi.',
            'title.min' => 'Judul bookmark minimal 3 karakter.',
            'title.max' => 'Judul bookmark maksimal 150 karakter.',
            'url.required' => 'URL tautan wajib diisi.',
            'url.url' => 'Format URL harus valid dengan skema http:// atau https://.',
            'url.max' => 'URL maksimal 2048 karakter.',
            'note.max' => 'Catatan maksimal 2000 karakter.',
            'category_id.exists' => 'Kategori yang dipilih tidak valid.',
            'tags.max' => 'Maksimal 10 tag per bookmark.',
        ];
    }
}
