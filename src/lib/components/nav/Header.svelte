<script lang="ts">
  import { resolve } from '$app/paths';
  import { Menu, X } from '@lucide/svelte';
  import { fade } from 'svelte/transition';

  interface Props {
    user: { id?: string; username?: string };
    onlogout?: () => void;
  }

  let { user, onlogout }: Props = $props();
  let open = $state(false);

  function toggle() {
    open = !open;
  }

  function close() {
    open = false;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && open) {
      close();
    }
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
  ];
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- Gradient blur backdrop -->
<div
  class="pointer-events-none fixed top-0 left-0 z-40 h-24 w-full mask-[linear-gradient(to_bottom,black_60%,transparent)]
         backdrop-blur-md"
></div>

<!-- Overlay -->
{#if open}
  <button
    class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
    onclick={close}
    aria-label="Close navigation"
    tabindex="-1"
    transition:fade={{ duration: 200 }}
  >
  </button>
{/if}

<!-- Nav -->
<nav
  class="fixed top-4 left-1/2 z-50 -translate-x-1/2 border border-border bg-card
         transition-all duration-300 ease-out
         {open
    ? 'w-[min(calc(100vw-2rem),32rem)] rounded-2xl p-4 shadow-xl'
    : 'w-[min(calc(100vw-2rem),22rem)] rounded-3xl px-5 py-2 shadow-lg'}"
  aria-label="Navigation"
>
  <!-- Top row: username + toggle -->
  <div class="flex items-center gap-3">
    <span
      class="min-w-0 truncate text-sm font-medium text-foreground
             {open ? '' : 'max-w-32'}"
    >
      {user.id ? `Welcome, ${user.username ?? 'User'}` : 'Welcome Guest'}
    </span>

    <button
      class="ml-auto flex shrink-0 items-center justify-center rounded-full p-1.5
             text-foreground transition-colors hover:bg-accent"
      onclick={toggle}
      aria-expanded={open}
      aria-label={open ? 'Close menu' : 'Open menu'}
    >
      <div class="transition-transform duration-300 {open ? 'rotate-90' : 'rotate-0'}">
        {#if open}
          <X class="size-5" />
        {:else}
          <Menu class="size-5" />
        {/if}
      </div>
    </button>
  </div>

  <!-- Links (grid row transition for smooth height) -->
  <div
    class="grid transition-[grid-template-rows] duration-300 ease-out
           {open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}"
  >
    <div class="overflow-hidden">
      <div class="mt-3 flex flex-col gap-1">
        {#each navLinks as link, i (link.href)}
          <a
            href={resolve(link.href as Parameters<typeof resolve>[0])}
            onclick={close}
            class="rounded-lg px-3 py-2 text-sm font-medium text-foreground
                   transition-all duration-100 hover:bg-accent
                   {open ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'}"
            style="transition-delay: {open ? 80 + i * 50 : 0}ms"
          >
            {link.label}
          </a>
        {/each}

        <!-- Separator -->
        <div
          class="my-1 h-px bg-border transition-opacity duration-100
                 {open ? 'opacity-100' : 'opacity-0'}"
          style="transition-delay: {open ? 80 + navLinks.length * 50 : 0}ms"
        ></div>

        <!-- Auth actions -->
        {#if user.id}
          <button
            onclick={() => {
              close();
              onlogout?.();
            }}
            class="rounded-lg px-3 py-2 text-left text-sm font-medium text-foreground
                   transition-all duration-100 hover:bg-accent
                   {open ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'}"
            style="transition-delay: {open ? 80 + (navLinks.length + 1) * 50 : 0}ms"
          >
            Logout
          </button>
        {:else}
          <a
            href={resolve('/auth/login')}
            onclick={close}
            class="rounded-lg px-3 py-2 text-sm font-medium text-foreground
                   transition-all duration-100 hover:bg-accent
                   {open ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'}"
            style="transition-delay: {open ? 80 + (navLinks.length + 1) * 50 : 0}ms"
          >
            Login
          </a>
        {/if}
      </div>
    </div>
  </div>
</nav>
