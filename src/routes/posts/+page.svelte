<script lang="ts">
	export let data: import('./$types').PageData
</script>

<svelte:head>
	<title>Sven Liebig - Tech Blog</title>
	<meta name="description" content="A technical blog by Sven Liebig writing about different frontend technology related topics.">
</svelte:head>

<div class="container">
	<h1>Posts</h1>

	<ul>
		{#each data.posts as post}
			<li>
				<a href="/posts/{post.name}">{post.name}</a>
			</li>
		{/each}
	</ul>
</div>

<style>
	ul {
		padding: 0;
	}
	li {
		list-style: none;
	}

	.container {
		max-width: var(--content-width);
		padding: 0 var(--content-spacing);
		margin: 0 auto;
	}
</style>
