<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import { Pencil } from '@lucide/svelte';

  interface Props {
    post: {
      title: string;
      body: string;
      updatedAt: Date;
    };
  }

  let { post }: Props = $props();

  function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  }

  // Get a short excerpt from the body (first ~150 characters)
  const excerpt = $derived(post.body.length > 150 ? post.body.slice(0, 150).trim() + '...' : post.body);
</script>

<Card.Root class="group transition-shadow hover:shadow-md">
  <Card.Header>
    <div class="mb-1 text-xs text-muted-foreground">
      Last edited {formatDate(post.updatedAt)}
    </div>
    <Card.Title class="line-clamp-2 text-xl">{post.title}</Card.Title>
  </Card.Header>

  <Card.Content>
    <p class="line-clamp-3 text-sm text-muted-foreground">
      {excerpt}
    </p>
  </Card.Content>

  <Card.Footer class="justify-end gap-2">
    <button
      class="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      aria-label="Edit post"
    >
      <Pencil class="size-4" />
    </button>
  </Card.Footer>
</Card.Root>
