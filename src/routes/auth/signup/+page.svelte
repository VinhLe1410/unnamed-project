<script lang="ts">
  import { authClient } from '$lib/auth-client';
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';

  let error = $state('');

  async function signup(e: Event) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const email = form.email.value;
    const username = form.username.value;
    const password = form.password.value;
    const password_confirm = form.password_confirm.value;

    if (password !== password_confirm) {
      error = 'Passwords do not match';
      return;
    }

    if (!username.trim() || !email.trim()) {
      error = 'Username and email are required';
      return;
    }

    await authClient.signUp.email(
      {
        email,
        password,
        name: username,
      },
      {
        onSuccess: () => {
          goto(resolve('/'));
        },
      },
    );
  }
</script>

<h1 class="font-bold">Sign Up</h1>
<form onsubmit={signup}>
  <div class="row-auto">
    <label>
      Email
      <input required type="email" id="email" />
    </label>
  </div>
  <div class="row-auto">
    <label>
      Username
      <input required type="text" id="username" />
    </label>
  </div>
  <div class="row-auto">
    <label>
      Password
      <input required type="password" id="password" />
    </label>
  </div>
  <div class="row-auto">
    <label>
      Confirm password
      <input required type="password" id="password_confirm" />
    </label>
  </div>
  {#if error}
    <p class="text-red-500">{error}</p>
  {/if}
  <button type="submit">Sign Up</button>
</form>
