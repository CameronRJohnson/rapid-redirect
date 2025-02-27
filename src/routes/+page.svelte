<script lang="ts">
  import { supabase } from "$lib/supabaseClient";

  export let data: { users: { id: number; name: string; times_visited: number; redirect: string }[] };

  let create = "";
  let searchQuery = "";
  let copiedId: number | null = null;
  let sortBy = "name"; // Default sorting column
  let sortOrder = "asc"; // Default order
  export const prerender = true;

  function generateRandomString(length: number) {
    const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  
  async function addUser() {
    if (!create.trim()) return;

    const userName = create;
    create = "";

    const randomString = generateRandomString(8);
    const redirectUrl = `https://rapidreboot.com/${randomString}`;

    const { data: newUser, error } = await supabase
      .from("users")
      .insert([{ name: userName, times_visited: 1, redirect: redirectUrl }])
      .select()
      .single();

    if (error) {
      console.error("Error adding user:", error);
      return;
    }

    data = { users: [...data.users, newUser] };
  }

  async function removeUser(id: number) {
    const { error } = await supabase.from("users").delete().match({ id });

    if (error) {
      console.error("Error removing user:", error);
      return;
    }

    data = { users: data.users.filter(user => user.id !== id) };
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      event.preventDefault();
      addUser();
    }
  }

  async function copyToClipboard(url: string, id: number) {
    try {
      await navigator.clipboard.writeText(url);
      copiedId = id;
      setTimeout(() => copiedId = null, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }

  function sortUsers(column: keyof typeof data.users[0]) {
  if (sortBy === column) {
    sortOrder = sortOrder === "asc" ? "desc" : "asc";
  } else {
    sortBy = column;
    sortOrder = "asc";
  }

  data.users.sort((a, b) => {
    let valA = a[column];
    let valB = b[column];

    // Ensure proper case-insensitive sorting for strings
    if (typeof valA === "string") valA = valA.toLowerCase();
    if (typeof valB === "string") valB = valB.toLowerCase();

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });
}


  function filteredUsers() {
    return data.users.filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }
</script>

<style>
.header-row {
    font-weight: bold;
    background-color: #e9ecef;
    border-bottom: 2px solid #ccc;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.sort-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 14px;
    margin-left: 5px;
    color: blue;
}

.sort-btn:hover {
    color: darkblue;
}
</style>

<div class="container">
  <h1>Rapid Redirect</h1>

  <form on:submit|preventDefault={addUser}>
    <input 
      type="text" 
      bind:value={create} 
      placeholder="Create New User" 
      aria-label="Create New User"
      on:keydown={handleKeyDown}
    />
  </form>

  <input 
    type="text" 
    bind:value={searchQuery} 
    placeholder="Search User Database" 
    aria-label="Search User Database"
  />

  <h2 class="h2">
    Database
  </h2>

  <div class="user-list">
    <!-- Mini Header Row with Sorting Buttons -->
    <div class="user-row header-row">
      <div class="name-column">
        Name
        <button class="sort-btn" on:click={() => sortUsers("name")}>&#x2195;</button>
      </div>

      <div class="times_visited_column">
        Times Visited
        <button class="sort-btn" on:click={() => sortUsers("times_visited")}>&#x2195;</button>
      </div>

      <div class="redirect-column">
        Redirection Link
        <button class="sort-btn" on:click={() => sortUsers("redirect")}>&#x2195;</button>
      </div>

      <div class="remove-column"></div> <!-- Empty for spacing -->
    </div>

    {#if filteredUsers().length > 0}
      {#each filteredUsers() as user}
        <div class="user-row">
          <!-- Name on the far left -->
          <div class="name-column">{user.name}</div>

          <div class="times_visited_column">
            Visited {user.times_visited} {#if user.times_visited === 1} time {:else} times {/if}
          </div>

          <!-- Redirect URL in the center -->
          <div class="redirect-column">
            {user.redirect} 
            <button class="copy-btn" on:click={() => copyToClipboard(user.redirect, user.id)}>📋</button>
          </div>

          <!-- "Copied" tooltip -->
          {#if copiedId === user.id}
            <span class="tooltip">Copied!</span>
          {/if}

          <!-- Remove button (X) on the far right -->
          <button class="remove-btn" on:click={() => removeUser(user.id)}>✖</button>
        </div>
      {/each}
    {:else}
      <p class="user-row">No users found.</p>
    {/if}
  </div>
</div>
