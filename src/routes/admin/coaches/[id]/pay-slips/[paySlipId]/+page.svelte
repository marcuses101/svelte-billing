<script lang="ts">
	import PaySlipDisplay from '$lib/components/PaySlipDisplay.svelte';

	export let data;
</script>

<PaySlipDisplay data={data.paySlip} />
