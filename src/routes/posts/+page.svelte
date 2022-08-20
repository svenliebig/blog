<script lang="ts">
	export let data: import('./$types').PageData
</script>

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
		max-width: 46rem;
		padding: 0 2rem;
		margin: 0 auto;
	}
</style>
