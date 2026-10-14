<?php

namespace App\Models;

use Database\Factories\TagFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

#[Fillable(['user_id', 'name', 'slug'])]
class Tag extends Model
{
    /** @use HasFactory<TagFactory> */
    use HasFactory;

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return MorphToMany<Snippet, $this>
     */
    public function snippets(): MorphToMany
    {
        return $this->morphedByMany(Snippet::class, 'taggable');
    }

    /**
     * @return MorphToMany<Prompt, $this>
     */
    public function prompts(): MorphToMany
    {
        return $this->morphedByMany(Prompt::class, 'taggable');
    }

    /**
     * @return MorphToMany<resource, $this>
     */
    public function resources(): MorphToMany
    {
        return $this->morphedByMany(Resource::class, 'taggable');
    }
}
