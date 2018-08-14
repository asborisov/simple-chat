<div class="message">
    <span class="info">{stamp}</span>
    {msg}
</div>

<style>
    .message {
        display: block;
    }
    .message .info {
        color: dimgray;
    }
</style>

<script>
    const formatNumber = input => `${input < 10 ? "0" : ""}${input}`;
    const formatDate = (date) => {
        return formatNumber(date.getDate()) + '.' + formatNumber(date.getMonth()) +
            '.' + formatNumber(date.getFullYear()) + ' ' + formatNumber(date.getHours()) +
            ':' + formatNumber(date.getMinutes()) + ':' + formatNumber(date.getSeconds());
    };
    export default {
        immutable: true,
        computed: {
            stamp: ({ message }) => `${message.author} [${formatDate(message.date)}]`,
            msg: ({ message }) => `${message.author && ': '}${message.text}`,
        }
    }
</script>