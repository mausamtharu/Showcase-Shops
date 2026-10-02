<script lang="ts">
	let { class: className = '', width = 'w-full', height = 'h-4', rounded = 'rounded-lg' } = $props<{
		class?: string;
		width?: string;
		height?: string;
		rounded?: string;
	}>();
</script>

<div class="shimmer {width} {height} {rounded} {className}"></div>
