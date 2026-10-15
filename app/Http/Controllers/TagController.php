<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TagController extends Controller
{
    /**
     * Update or merge a tag.
     */
    public function update(Request $request, Tag $tag): RedirectResponse
    {
        abort_unless($tag->user_id === $request->user()->id, 403);

        $validated = $request->validate([
            'name' => ['required', 'string', 'min:1', 'max:50'],
        ]);

        $cleanName = strtolower(trim($validated['name']));
        $newSlug = Str::slug($cleanName);

        // Check if user already has another tag with this slug
        $existingTag = $request->user()->tags()
            ->where('slug', $newSlug)
            ->where('id', '!=', $tag->id)
            ->first();

        if ($existingTag) {
            // Merge relations from $tag to $existingTag
            $existingTag->snippets()->syncWithoutDetaching($tag->snippets()->pluck('snippets.id')->toArray());
            $existingTag->prompts()->syncWithoutDetaching($tag->prompts()->pluck('prompts.id')->toArray());
            $existingTag->resources()->syncWithoutDetaching($tag->resources()->pluck('resources.id')->toArray());

            $tag->delete();

            return back()->with('success', "Tag digabungkan ke #{$existingTag->name}.");
        }

        $tag->update([
            'name' => $cleanName,
            'slug' => $newSlug,
        ]);

        return back()->with('success', 'Nama tag berhasil diperbarui.');
    }

    /**
     * Remove the specified tag from storage.
     */
    public function destroy(Request $request, Tag $tag): RedirectResponse
    {
        abort_unless($tag->user_id === $request->user()->id, 403);

        $tag->delete();

        return back()->with('success', 'Tag berhasil dihapus dari vault.');
    }
}
