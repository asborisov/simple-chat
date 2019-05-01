<script>
	export let message;

	function formatNumber(input) { 
		return `${input < 10 ? "0" : ""}${input}`
	};
    function formatDate(date) {
        return formatNumber(date.getDate()) + '.' + formatNumber(date.getMonth()) +
            '.' + formatNumber(date.getFullYear()) + ' ' + formatNumber(date.getHours()) +
            ':' + formatNumber(date.getMinutes()) + ':' + formatNumber(date.getSeconds());
    };

    $: stamp = `${message.author} [${formatDate(message.date)}]`;
    $: msg = `${message.author && ': '}${message.text}`;
</script>

<style>
    .message {
        display: block;
    }
    .message .info {
        color: dimgray;
    }
</style>

<div class="message">
    <span class="info">{stamp}</span>
    {msg}
</div>