<script>
	import PageHeader from '$lib/components/PageHeader.svelte';
	let { data } = $props();
</script>

<PageHeader title={`Email "${data.email}" Confirmed`} subTitle="You may close this tab" />
