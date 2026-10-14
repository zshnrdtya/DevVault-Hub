<?php

namespace App\Policies;

use App\Models\Prompt;
use App\Models\User;

class PromptPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Prompt $prompt): bool
    {
        return $user->id === $prompt->user_id;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Prompt $prompt): bool
    {
        return $user->id === $prompt->user_id;
    }

    public function delete(User $user, Prompt $prompt): bool
    {
        return $user->id === $prompt->user_id;
    }

    public function restore(User $user, Prompt $prompt): bool
    {
        return $user->id === $prompt->user_id;
    }

    public function forceDelete(User $user, Prompt $prompt): bool
    {
        return $user->id === $prompt->user_id;
    }
}
