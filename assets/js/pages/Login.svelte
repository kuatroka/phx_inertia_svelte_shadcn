<script>
  import { router, page } from '@inertiajs/svelte'
  import Card from '$lib/components/ui/card.svelte'
  import CardContent from '$lib/components/ui/card-content.svelte'
  import CardDescription from '$lib/components/ui/card-description.svelte'
  import CardHeader from '$lib/components/ui/card-header.svelte'
  import CardTitle from '$lib/components/ui/card-title.svelte'
  import Button from '$lib/components/ui/button.svelte'
  import Input from '$lib/components/ui/input.svelte'
  import Label from '$lib/components/ui/label.svelte'

  let email = ''
  let isSubmitting = false

  function handleSubmit() {
    if (!email.trim()) return
    
    isSubmitting = true
    router.post('/auth/request', { email }, {
      onFinish: () => {
        isSubmitting = false
      }
    })
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
  <Card class="w-full max-w-md">
    <CardHeader class="text-center">
      <CardTitle class="text-2xl font-bold">Welcome to Tetris</CardTitle>
      <CardDescription>
        Enter your email to get a magic link and start playing!
      </CardDescription>
    </CardHeader>
    
    <CardContent>
      <form on:submit|preventDefault={handleSubmit} class="space-y-4">
        <div class="space-y-2">
          <Label for="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            bind:value={email}
            placeholder="your@email.com"
            required
            disabled={isSubmitting}
          />
        </div>
        
        <Button 
          type="submit" 
          class="w-full" 
          disabled={isSubmitting || !email.trim()}
        >
          {isSubmitting ? 'Sending...' : 'Send Magic Link'}
        </Button>
      </form>
      
      {#if $page.props.flash?.info}
        <div class="mt-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-800 text-sm">
          {$page.props.flash.info}
        </div>
      {/if}
      
      {#if $page.props.flash?.error}
        <div class="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">
          {$page.props.flash.error}
        </div>
      {/if}
    </CardContent>
  </Card>
</div>
