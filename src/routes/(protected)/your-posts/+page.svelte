<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Plus, Search } from '@lucide/svelte';
  import PostCard from './_components/PostCard.svelte';
  import { getYourPosts } from './posts.remote';

  const posts = await getYourPosts();
</script>

<div class="min-h-screen bg-background p-8">
  <div class="mx-auto max-w-7xl">
    <!-- Header -->
    <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <!-- Left: Title + Count Badge -->
      <div class="flex items-center gap-3">
        <h1 class="text-3xl font-bold text-foreground">My Posts</h1>
        <span class="inline-flex items-center rounded-full bg-primary/15 px-3 py-1 text-sm font-medium text-primary">
          {posts.length} Total
        </span>
      </div>

      <!-- Right: Search + Create Button -->
      <div class="flex items-center gap-3">
        <div class="relative">
          <Search class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input type="text" placeholder="Search posts..." class="w-full pl-9 sm:w-64" disabled />
        </div>
        <Button class="gap-2" disabled>
          <Plus class="size-4" />
          Create New Post
        </Button>
      </div>
    </div>

    <!-- Posts Grid -->
    {#if posts.length > 0}
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {#each posts as post (post.id)}
          <PostCard {post} />
        {/each}
      </div>
    {:else}
      <!-- Empty State -->
      <div class="flex min-h-100 flex-col items-center justify-center text-center">
        <div class="rounded-full bg-muted p-6">
          <svg class="size-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h2 class="mt-6 text-xl font-semibold text-foreground">No posts yet</h2>
        <p class="mt-2 max-w-sm text-sm text-muted-foreground">
          Get started by creating your first post. Share your thoughts and ideas with the world.
        </p>
      </div>
    {/if}
  </div>
</div>
