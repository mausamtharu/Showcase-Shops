<script lang="ts">
	import { toast } from '$lib/stores/toast.svelte';
</script>

<!-- Toast Container -->
<div class="fixed bottom-6 right-6 z-[100] flex flex-col gap-2" aria-live="polite">
	{#each toast.toasts as t (t.id)}
		<div
			class="flex items-start gap-3 p-4 rounded-xl shadow-elevated animate-slide-in-right max-w-sm w-full"
			style="background: var(--color-surface); border: 1px solid var(--color-border); min-width: 280px;"
			role="alert"
		>
			<!-- Icon -->
			<div
				class="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
				style={t.type === 'success'
					? 'background: rgba(34,197,94,0.15);'
					: t.type === 'error'
						? 'background: rgba(239,68,68,0.15);'
						: t.type === 'warning'
							? 'background: rgba(245,158,11,0.15);'
							: 'background: rgba(59,130,246,0.15);'}
			>
				{#if t.type === 'success'}
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2.5">
						<polyline points="20 6 9 17 4 12" />
					</svg>
				{:else if t.type === 'error'}
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2.5">
						<line x1="18" y1="6" x2="6" y2="18" />
						<line x1="6" y1="6" x2="18" y2="18" />
					</svg>
				{:else if t.type === 'warning'}
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2.5">
						<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
						<line x1="12" y1="9" x2="12" y2="13"/>
						<line x1="12" y1="17" x2="12.01" y2="17"/>
					</svg>
				{:else}
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2.5">
						<circle cx="12" cy="12" r="10"/>
						<line x1="12" y1="8" x2="12" y2="12"/>
						<line x1="12" y1="16" x2="12.01" y2="16"/>
					</svg>
				{/if}
			</div>

			<!-- Content -->
			<div class="flex-1 min-w-0">
				<p class="font-semibold text-sm font-heading">{t.title}</p>
				{#if t.message}
					<p class="text-xs mt-0.5" style="color: rgba(250,250,249,0.6);">{t.message}</p>
				{/if}
			</div>

			<!-- Close -->
			<button
				onclick={() => toast.remove(t.id)}
				aria-label="Close notification"
				class="shrink-0 w-6 h-6 flex items-center justify-center rounded-md transition-colors"
				style="color: rgba(250,250,249,0.4);"
			>
				<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
					<line x1="18" y1="6" x2="6" y2="18" />
					<line x1="6" y1="6" x2="18" y2="18" />
				</svg>
			</button>
		</div>
	{/each}
</div>
