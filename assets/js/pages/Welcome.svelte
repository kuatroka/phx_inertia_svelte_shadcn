<script>
  import Card from "$lib/components/ui/card.svelte";
  import CardHeader from "$lib/components/ui/card-header.svelte";
  import CardTitle from "$lib/components/ui/card-title.svelte";
  import CardDescription from "$lib/components/ui/card-description.svelte";
  import CardContent from "$lib/components/ui/card-content.svelte";
  import CardFooter from "$lib/components/ui/card-footer.svelte";
  import Table from "$lib/components/ui/table.svelte";
  import TableHeader from "$lib/components/ui/table-header.svelte";
  import TableBody from "$lib/components/ui/table-body.svelte";
  import TableRow from "$lib/components/ui/table-row.svelte";
  import TableHead from "$lib/components/ui/table-head.svelte";
  import TableCell from "$lib/components/ui/table-cell.svelte";

  let { message } = $props();

  const tableData = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Editor" },
  ];
</script>

<div class="container mx-auto p-6 space-y-6">
  <h1 class="text-3xl font-bold">Hello, {message}</h1>
  <p class="text-muted-foreground">Testing shadcn-svelte components with Phoenix + Inertia.js</p>

  <!-- Two Cards -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <Card>
      <CardHeader>
        <CardTitle>Welcome Card</CardTitle>
        <CardDescription>This is the first test card using shadcn-svelte components.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This card demonstrates the basic card structure with header, content, and footer sections.</p>
      </CardContent>
      <CardFooter>
        <p class="text-sm text-muted-foreground">Card footer content</p>
      </CardFooter>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Features Card</CardTitle>
        <CardDescription>This is the second test card showcasing more content.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul class="list-disc list-inside space-y-2">
          <li>Phoenix backend</li>
          <li>Inertia.js for SPA-like experience</li>
          <li>Svelte 5 frontend</li>
          <li>shadcn-svelte UI components</li>
          <li>Tailwind CSS styling</li>
        </ul>
      </CardContent>
      <CardFooter>
        <p class="text-sm text-muted-foreground">All working together!</p>
      </CardFooter>
    </Card>
  </div>

  <!-- Table -->
  <Card>
    <CardHeader>
      <CardTitle>Users Table</CardTitle>
      <CardDescription>A sample table showing user data with shadcn-svelte table components.</CardDescription>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {#each tableData as user}
            <TableRow>
              <TableCell>{user.id}</TableCell>
              <TableCell class="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
            </TableRow>
          {/each}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</div>
