<script lang="ts">
  import favicon from '$lib/assets/favicon.svg';
  import './layout.css';

  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { authClient } from '$lib/auth-client';
  import { Header } from '$lib/components/nav';
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

<Header {user} onlogout={handleLogout} />

<main class="pt-16">
  {@render children()}
</main>
