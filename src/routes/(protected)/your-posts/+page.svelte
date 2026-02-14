<script lang="ts">
  import { getYourPosts } from './posts.remote';
</script>

<ol>
  {#each await getYourPosts() as post (post.id)}
    <li>{post.title}</li>
  {/each}
</ol>
