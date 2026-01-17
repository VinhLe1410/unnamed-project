<script lang="ts">
  import favicon from '$lib/assets/favicon.svg';
  import './layout.css';

  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { authClient } from '$lib/auth-client';
  import { Button } from '$lib/components/ui/button';
  import { LogIn, LogOut, UserPlus } from '@lucide/svelte';
  import { getUser } from './user.remote';

  let { children } = $props();

  const user = $derived(await getUser());

  function handleLogout() {
    authClient.signOut({
      fetchOptions: {
        onSuccess: async () => {
          getUser().refresh();
          goto(resolve('/auth/login'));
        },
      },
    });
  }
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<header class="border-b bg-background">
  <div class="container mx-auto flex h-14 items-center justify-center gap-4 px-4">
    {#if !user.id}
      <Button variant="ghost" href="/auth/login">
        <LogIn class="size-4" />
        Login
      </Button>
    {/if}
    <Button variant="ghost" href="/auth/signup">
      <UserPlus class="size-4" />
      Sign Up
    </Button>
    {#if user.id}
      <Button variant="ghost" onclick={handleLogout}>
        <LogOut class="size-4" />
        Logout
      </Button>
    {/if}
  </div>
</header>

<main>
  {@render children()}
</main>
