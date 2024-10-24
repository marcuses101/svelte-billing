<script lang="ts">
    interface Props {
        data: any;
    }

    let { data }: Props = $props();
</script>

<div class="rounded-xl p-4 shadow-xl bg-neutral text-neutral-content">
	<pre>
        <code class="max-w-none block">
{JSON.stringify(data, null, 2)}
        </code>
    </pre>
</div>
