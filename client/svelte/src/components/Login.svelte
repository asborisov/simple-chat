<div class="login">
    <form on:submit="fire('submit', event)">
        <input type="text" placeholder="Enter you login"/>
        <input type="submit" value="Enter"/>
    </form>
    {#if $loginError}
    <div class="error">{$loginError}</div>
    {/if}
</div>

<style>
    .login {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
    }
    .login .error {
        color: red;
    }
</style>
