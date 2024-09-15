<script>
	import PageHeader from '$lib/components/PageHeader.svelte';
	export let data;
</script>

<PageHeader title={`Email "${data.email}" Confirmed`} subTitle="You may close this tab" />
