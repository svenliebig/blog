<script lang="ts">
	import { onMount } from "svelte"


	let postName: string = ""
	onMount(() => postName = location.pathname.replace("/", "").replace(/-/g, " "))
</script>

<nav class="breadcrumb">
	<ul>
		<li>
			<a href="/">Posts</a>
		</li>
		<li>
			{postName}
		</li>
	</ul>
</nav>

<svelte:head>
	<title>{postName}</title>
</svelte:head>

<div class="post-container">
	<slot />
</div>

<style>
	.post-container, .breadcrumb {
		max-width: var(--content-width);
		padding: 0 var(--content-spacing);
		margin: 0 auto;
	}

	.breadcrumb ul {
		margin: 0;
		padding: 0;
		font-size: 0.8rem;
	}

	.breadcrumb ul li {
		list-style: none;
		display: inline-flex;
	}

	.breadcrumb ul li:not(:last-of-type)::after {
		margin-left: 0.3rem;
		content: "▶";
		font-size: 0.7rem;
		align-self: center;
	}
</style>
