<script lang="ts">
	import { onMount } from 'svelte'

	export let data: import('./$types').PageData

	onMount(async () => {
		document.querySelectorAll('pre code').forEach((el) => {
			window.hljs.highlightElement(el)
		})
	})
</script>

<svelte:head>
	<meta name="description" content={data.description}>
	<meta name="keywords" content={data.keywords}>
</svelte:head>

{@html data.content}
