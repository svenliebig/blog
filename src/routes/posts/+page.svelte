<script lang="ts">
	export let data: import('./$types').PageData
	console.log(data)
</script>

<h1>Posts</h1>

<ul>
	{#each data.posts as post}
		<li>
			<a href="/posts/{post.name}">{post.name}</a>
		</li>
	{/each}
</ul>

<style>
	ul {
		padding: 0;
	}
	li {
		list-style: none;
	}
</style>
