<script lang="ts">
	import { onMount } from 'svelte'

	export let data: import('./$types').PageData

	onMount(async () => {
		document.querySelectorAll('pre code').forEach((el) => {
			window.hljs.highlightElement(el)
		})
	})
</script>

{@html data.content}
