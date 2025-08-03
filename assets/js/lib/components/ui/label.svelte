<script>
  import { cn } from "$lib/utils.js";

  export let htmlFor = "";
</script>

<label
  for={htmlFor}
  class={cn(
    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
    $$props.class
  )}
  {...$$restProps}
>
  <slot />
</label>
