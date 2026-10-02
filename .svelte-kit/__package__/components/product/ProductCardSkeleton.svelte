<script lang="ts">
	import Skeleton from '../ui/Skeleton.svelte';
</script>

<div class="card overflow-hidden">
	<div class="aspect-square shimmer"></div>
	<div class="p-4 space-y-3">
		<Skeleton height="h-3" width="w-1/3" />
		<Skeleton height="h-4" width="w-4/5" />
		<Skeleton height="h-3" width="w-2/3" />
		<Skeleton height="h-5" width="w-1/2" />
	</div>
</div>
