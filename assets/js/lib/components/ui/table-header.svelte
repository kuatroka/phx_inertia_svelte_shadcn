<script>
  import { cn } from "$lib/utils.js";

  let className = "";
  export { className as class };
</script>

<thead class={cn("[&_tr]:border-b", className)} {...$$restProps}>
  <slot />
</thead>
