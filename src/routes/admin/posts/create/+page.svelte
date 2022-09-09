<script lang="ts">
	export let data: import('./$types').PageServerData
	export let errors: import('./$types').Errors

	let title: string
</script>

<div class="container">
	<h1>Posts</h1>

	<form method="post" action="/admin/posts/create" on:submit={() => undefined}>
		<div>
			<input name="title" bind:value={title} />
			{title}
			{#if errors?.title}
				<span class="error">Fehler</span>
			{/if}
		</div>
		<div>
			<textarea name="content" />
			{#if errors?.content}
				<span class="error">Fehler</span>
			{/if}
		</div>
		<button type="submit">sub</button>
	</form>

	<ul>
		{#each data.posts as post}
			<li>
				<a href="/posts/{post.title}">{post.title}</a><button
					on:click={() => fetch(`/api/posts/${post.title}`, { method: 'DELETE' })}>x</button
				>
			</li>
		{/each}
	</ul>
</div>

<style>
</style>
