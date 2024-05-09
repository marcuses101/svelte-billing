<script lang="ts">
	import BackButton from '$lib/components/BackButton.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PaySlipDisplay from '$lib/components/PaySlipDisplay.svelte';

	export let data;
</script>

<PageHeader title="Pay Slip">
	<BackButton href="/pay-slips">Back</BackButton>
</PageHeader>
<PaySlipDisplay data={data.paySlip} />
