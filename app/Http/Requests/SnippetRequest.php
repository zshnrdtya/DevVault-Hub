<?php

namespace App\Http\Requests;

use App\Enums\SnippetLanguage;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SnippetRequest extends FormRequest
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
            'description' => ['nullable', 'string', 'max:1000'],
            'code' => ['required', 'string', 'max:100000'],
            'language' => ['required', 'string', Rule::enum(SnippetLanguage::class)],
            'category_id' => [
                'nullable',
                Rule::exists('categories', 'id')
                    ->where('user_id', $userId)
                    ->where('type', 'snippet'),
            ],
            'tags' => ['nullable', 'array', 'max:10'],
            'tags.*' => ['string', 'min:1', 'max:30'],
            'is_favorite' => ['boolean'],
        ];
    }
}
