<script lang="ts">
	const categories = ['Electronics', 'Fashion', 'Home & Living', 'Books', 'Sports', 'Beauty'];
</script>

<footer style="background: var(--color-surface); border-top: 1px solid var(--color-border);">
	<!-- Main Footer -->
	<div class="container py-16">
		<div class="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
			<!-- Brand -->
			<div class="lg:col-span-1">
				<div class="mb-4 flex items-center gap-2">
					<div class="bg-gradient-gold flex h-9 w-9 items-center justify-center rounded-lg">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="var(--color-black)">
							<path
								d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
								stroke="currentColor"
								stroke-width="2"
								fill="none"
							/>
							<path d="M9 22V12h6v10" stroke="currentColor" stroke-width="2" fill="none" />
						</svg>
					</div>
					<span class="font-heading text-gradient-gold text-xl font-bold">ShowCase</span>
				</div>
				<p class="mb-6 text-sm leading-relaxed" style="color: rgba(250,250,249,0.5);">
					Premium e-commerce platform connecting local shops in Nepalgunj, Banke with customers
					across Nepal.
				</p>
				<div class="flex gap-3">
					{#each ['facebook', 'instagram', 'twitter'] as social}
						<a
							href="https://{social}.com"
							target="_blank"
							rel="noopener"
							class="flex h-9 w-9 items-center justify-center rounded-lg border transition-all duration-200"
							style="background: var(--color-surface-2); border-color: var(--color-border);"
							onmouseenter={(e) =>
								((e.currentTarget as HTMLElement).style.borderColor = 'var(--color-gold)')}
							onmouseleave={(e) =>
								((e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)')}
						>
							<span class="text-gold text-xs font-bold">{social[0].toUpperCase()}</span>
						</a>
					{/each}
				</div>
			</div>

			<!-- Categories -->
			<div>
				<h3 class="font-heading text-gold mb-4 text-sm font-semibold tracking-wider uppercase">
					Categories
				</h3>
				<ul class="space-y-2.5">
					{#each categories as cat}
						<li>
							<a
								href="/products?category={cat.toLowerCase().replace(/\s/g, '-')}"
								class="text-sm transition-colors duration-150"
								style="color: rgba(250,250,249,0.5);"
								onmouseenter={(e) => ((e.target as HTMLElement).style.color = 'var(--color-gold)')}
								onmouseleave={(e) =>
									((e.target as HTMLElement).style.color = 'rgba(250,250,249,0.5)')}
							>
								{cat}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Quick Links -->
			<div>
				<h3 class="font-heading text-gold mb-4 text-sm font-semibold tracking-wider uppercase">
					Quick Links
				</h3>
				<ul class="space-y-2.5">
					{#each [{ href: '/products', label: 'All Products' }, { href: '/shops', label: 'Explore Shops' }, { href: '/account/orders', label: 'Track Order' }, { href: '/account/wishlist', label: 'My Wishlist' }, { href: '/owner/onboarding', label: 'Open Your Shop' }] as link}
						<li>
							<a
								href={link.href}
								class="text-sm transition-colors duration-150"
								style="color: rgba(250,250,249,0.5);"
								onmouseenter={(e) => ((e.target as HTMLElement).style.color = 'var(--color-gold)')}
								onmouseleave={(e) =>
									((e.target as HTMLElement).style.color = 'rgba(250,250,249,0.5)')}
							>
								{link.label}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Contact -->
			<div>
				<h3 class="font-heading text-gold mb-4 text-sm font-semibold tracking-wider uppercase">
					Contact
				</h3>
				<ul class="space-y-3">
					<li class="flex items-start gap-3">
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="var(--color-gold)"
							stroke-width="2"
							class="mt-0.5 shrink-0"
						>
							<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
							<circle cx="12" cy="10" r="3" />
						</svg>
						<span class="text-sm" style="color: rgba(250,250,249,0.5);"
							>Nepalgunj, Banke<br />Nepal</span
						>
					</li>
					<li class="flex items-center gap-3">
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="var(--color-gold)"
							stroke-width="2"
						>
							<path
								d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.09a16 16 0 006 6l1.27-.35a2 2 0 012.11.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
							/>
						</svg>
						<span class="text-sm" style="color: rgba(250,250,249,0.5);">+977 081-XXXXXX</span>
					</li>
					<li class="flex items-center gap-3">
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="var(--color-gold)"
							stroke-width="2"
						>
							<path
								d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
							/>
							<polyline points="22,6 12,13 2,6" />
						</svg>
						<span class="text-sm" style="color: rgba(250,250,249,0.5);">info@showcaseshops.com</span
						>
					</li>
				</ul>
			</div>
		</div>
	</div>

	<!-- Bottom Bar -->
	<div class="border-t" style="border-color: var(--color-border);">
		<div class="container flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
			<p class="text-xs" style="color: rgba(250,250,249,0.35);">
				© 2025 ShowCase Shops. Built by Mausam Tharu · BCA 4th Sem Project, Tribhuvan University
			</p>
			<div class="flex items-center gap-1">
				<span class="text-xs" style="color: rgba(250,250,249,0.35);">Secure payments via</span>
				<div class="ml-2 flex items-center gap-2">
					{#each ['eSewa', 'Khalti', 'COD'] as method}
						<span class="badge badge-gold text-xs">{method}</span>
					{/each}
				</div>
			</div>
		</div>
	</div>
</footer>
