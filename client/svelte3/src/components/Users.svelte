<script>
	export let users;
</script>

<style>
    .users {
        width: 20vw;
    }
</style>

<div class="users">
{#each users as user}
    <div>{user}</div>
{/each}
</div>