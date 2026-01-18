<script lang="ts">
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { authClient } from '$lib/auth-client';
  import { loginSchema } from '$lib/schemas';
  import { z } from 'zod';

  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Lock, Mail } from '@lucide/svelte';
  import { getUser } from '../../user.remote';

  let email = $state('');
  let password = $state('');
  let isLoading = $state(false);

  type FieldErrors = {
    email?: string;
    password?: string;
  };
  let fieldErrors = $state<FieldErrors>({});
  let formError = $state('');

  function clearFieldError(field: keyof typeof fieldErrors) {
    fieldErrors = { ...fieldErrors, [field]: undefined };
  }

  async function login(e: Event) {
    e.preventDefault();
    fieldErrors = {};
    formError = '';

    const result = loginSchema.safeParse({
      email,
      password,
    });

    if (!result.success) {
      const tree = z.treeifyError(result.error);
      fieldErrors = {
        email: tree.properties?.email?.errors[0],
        password: tree.properties?.password?.errors[0],
      };
      return;
    }

    isLoading = true;

    try {
      await authClient.signIn.email(
        {
          email: result.data.email,
          password: result.data.password,
        },
        {
          onSuccess: async () => {
            await getUser().refresh();
            await goto(resolve('/dashboard'));
          },
          onError: (ctx) => {
            formError = ctx.error.message || 'Invalid email or password';
          },
        },
      );
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="flex min-h-screen items-center justify-center p-4">
  <Card.Root class="w-full max-w-md">
    <Card.Header>
      <Card.Title class="text-2xl">Login</Card.Title>
      <Card.Description>Welcome back! Sign in to your account</Card.Description>
    </Card.Header>
    <Card.Content>
      <form onsubmit={login} class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <Label for="email">Email</Label>
          <div class="relative">
            <Mail class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              bind:value={email}
              oninput={() => {
                clearFieldError('email');
              }}
              aria-invalid={!!fieldErrors.email}
              class="pl-9"
            />
          </div>
          {#if fieldErrors.email}
            <p class="text-sm text-destructive">{fieldErrors.email}</p>
          {/if}
        </div>

        <div class="flex flex-col gap-2">
          <Label for="password">Password</Label>
          <div class="relative">
            <Lock class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              bind:value={password}
              oninput={() => {
                clearFieldError('password');
              }}
              aria-invalid={!!fieldErrors.password}
              class="pl-9"
            />
          </div>
          {#if fieldErrors.password}
            <p class="text-sm text-destructive">{fieldErrors.password}</p>
          {/if}
        </div>

        {#if formError}
          <p class="text-sm text-destructive">{formError}</p>
        {/if}

        <Button type="submit" class="mt-2 w-full" disabled={isLoading}>
          {#if isLoading}
            Logging in...
          {:else}
            Login
          {/if}
        </Button>
      </form>
    </Card.Content>
    <Card.Footer class="justify-center">
      <p class="text-sm text-muted-foreground">
        Don't have an account?
        <a href={resolve('/auth/signup')} class="text-primary hover:underline">Sign up</a>
      </p>
    </Card.Footer>
  </Card.Root>
</div>
