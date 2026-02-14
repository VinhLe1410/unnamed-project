<script lang="ts">
  import { createPost } from '../posts.remote';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { marked } from 'marked';
  import DOMPurify from 'isomorphic-dompurify';
  import { LoaderCircle } from '@lucide/svelte';

  let bodyMarkdown = '';
</script>

<div class="min-h-screen bg-background p-6 lg:p-8">
  <div class="mx-auto max-w-screen-2xl">
    <form {...createPost} class="flex flex-col gap-6">
      <!-- Header row: title + submit -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
        <div class="flex-1">
          <Input {...createPost.fields.title.as('text')} placeholder="Post title..." class="h-11 text-lg" />
          {#each createPost.fields.title.issues() as issue (issue.message)}
            <p class="mt-2 text-sm text-destructive">{issue.message}</p>
          {/each}
        </div>
        <Button type="submit" class="sm:mt-0">Create Post</Button>
      </div>

      <!-- Editor + Preview split -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- Editor -->
        <div class="flex flex-col gap-2">
          <span class="text-xs font-medium tracking-wide text-muted-foreground uppercase"> Markdown </span>
          <textarea
            {...createPost.fields.body.as('text')}
            bind:value={bodyMarkdown}
            placeholder="Write your post in markdown..."
            class="min-h-[calc(100vh-14rem)] w-full resize-y rounded-md border
                   border-input bg-background px-4 py-3 font-mono text-sm
                   text-foreground shadow-xs outline-none
                   focus-visible:border-ring focus-visible:ring-[3px]
                   focus-visible:ring-ring/50"
          ></textarea>
          {#each createPost.fields.body.issues() as issue (issue.message)}
            <p class="text-sm text-destructive">{issue.message}</p>
          {/each}
        </div>

        <!-- Preview -->
        <div class="flex flex-col gap-2">
          <span class="text-xs font-medium tracking-wide text-muted-foreground uppercase"> Preview </span>
          <div
            class="prose prose-sm min-h-[calc(100vh-14rem)] max-w-none overflow-y-auto
                   rounded-md border border-border bg-card px-6 py-4 shadow-xs dark:prose-invert"
          >
            {#await marked.parse(bodyMarkdown)}
              <div class="flex items-center justify-center">
                <LoaderCircle class="h-4 w-4 animate-spin" />
              </div>
            {:then html}
              <!-- eslint-disable-next-line svelte/no-at-html-tags -->
              {@html DOMPurify.sanitize(html)}
            {/await}
          </div>
        </div>
      </div>
    </form>
  </div>
</div>
