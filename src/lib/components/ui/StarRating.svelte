<script lang="ts">
	import { getStarArray } from '$lib/utils';

	let { rating, count, size = 'sm' }: { rating: number; count?: number; size?: 'xs' | 'sm' | 'md' } = $props();

	const stars = $derived(getStarArray(rating));
	const starSize = $derived(size === 'xs' ? 12 : size === 'sm' ? 14 : 18);
</script>

<div class="flex items-center gap-1.5">
	<div class="flex items-center gap-0.5">
		{#each stars as star}
			<svg width={starSize} height={starSize} viewBox="0 0 24 24">
				{#if star === 'full'}
					<polygon
						points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
						fill="var(--color-gold)"
						stroke="var(--color-gold)"
						stroke-width="1"
					/>
				{:else if star === 'half'}
					<defs>
						<linearGradient id="half-star">
							<stop offset="50%" stop-color="var(--color-gold)" />
							<stop offset="50%" stop-color="transparent" />
						</linearGradient>
					</defs>
					<polygon
						points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
						fill="url(#half-star)"
						stroke="var(--color-gold)"
						stroke-width="1"
					/>
				{:else}
					<polygon
						points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
						fill="none"
						stroke="var(--color-border)"
						stroke-width="1.5"
					/>
				{/if}
			</svg>
		{/each}
	</div>
	{#if count !== undefined}
		<span class="text-xs" style="color: rgba(250,250,249,0.5);">({count})</span>
	{/if}
</div>
