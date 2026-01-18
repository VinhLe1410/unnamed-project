<script lang="ts">
  import favicon from '$lib/assets/favicon.svg';
  import './layout.css';

  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { authClient } from '$lib/auth-client';
  import { Button } from '$lib/components/ui/button';
  import { LogIn, LogOut } from '@lucide/svelte';
  import { getUser } from './user.remote';

  let { children } = $props();

  const user = $derived(await getUser());

  async function handleLogout() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: async () => {
          await getUser().refresh();
          await goto(resolve('/'));
        },
      },
    });
  }
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<header class="border-b bg-background">
  <div class="container mx-auto flex h-14 items-center px-4">
    <div class="flex-1">
      {#if user.id}
        <span class="text-sm font-medium">Welcome {user.username}!</span>
      {/if}
    </div>
    <div class="flex gap-4">
      {#if !user.id}
        <Button variant="ghost" href="/auth/login">
          <LogIn class="size-4" />
          Login
        </Button>
      {/if}
      {#if user.id}
        <Button variant="ghost" onclick={handleLogout}>
          <LogOut class="size-4" />
          Logout
        </Button>
      {/if}
    </div>
  </div>
</header>

<main>
  {@render children()}
</main>
