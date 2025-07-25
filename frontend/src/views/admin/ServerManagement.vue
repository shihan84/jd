<template>
  <div class="server-management">
    <h2>Flussonic Server Management</h2>
    
    <!-- Form to add a new server -->
    <form @submit.prevent="addServer">
      <h3>Add New Server</h3>
      <input v-model="newServer.name" placeholder="Server Name" required />
      <input v-model="newServer.url" placeholder="Flussonic URL (e.g., http://your-server:8080)" required />
      <input v-model="newServer.username" placeholder="Username" required />
      <input v-model="newServer.password" type="password" placeholder="Password" required />
      <button type="submit">Add Server</button>
    </form>

    <!-- List of existing servers -->
    <h3>Existing Servers</h3>
    <ul v-if="servers.length > 0">
      <li v-for="server in servers" :key="server.id">
        <span>{{ server.name }} ({{ server.url }})</span>
        <button @click="getStreams(server.id)" :disabled="isLoadingStreams">View Streams</button>
        
        <!-- Stream List for the selected server -->
        <div v-if="selectedServerId === server.id" class="stream-list">
          <h4>Streams</h4>
          <div v-if="isLoadingStreams">Loading streams...</div>
          <div v-if="streamsError" class="error">{{ streamsError }}</div>
          <ul v-if="streams.length > 0">
            <li v-for="stream in streams" :key="stream.name">
              {{ stream.name }}
            </li>
          </ul>
          <div v-if="!isLoadingStreams && streams.length === 0 && !streamsError">
            No streams found on this server.
          </div>
          <button @click="closeStreamsView">Close</button>
        </div>
      </li>
    </ul>
    <p v-else>No servers have been added yet.</p>

  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      newServer: {
        name: '',
        url: '',
        username: '',
        password: ''
      },
      servers: [],
      selectedServerId: null,
      streams: [],
      isLoadingStreams: false,
      streamsError: null,
    };
  },
  methods: {

    async fetchServers() {
      try {
        const response = await axios.get('/api/admin/servers');
        this.servers = response.data;
      } catch (error) {
        console.error("Error fetching servers:", error);
      }
    },
    async addServer() {
      try {
        await axios.post('/api/admin/servers', this.newServer);
        this.newServer = { name: '', url: '', username: '', password: '' }; // Reset form
        await this.fetchServers(); // Refresh the list
      } catch (error) {
        console.error("Error adding server:", error);
        // Show detailed error from backend if available
        alert(error.response?.data?.detail || 'An unexpected error occurred while adding the server.');
      }
    },
    async getStreams(serverId) {
      // If the same server's streams are already open, close them. Otherwise, fetch.
      if (this.selectedServerId === serverId) {
        this.closeStreamsView();
        return;
      }

      this.selectedServerId = serverId;
      this.isLoadingStreams = true;
      this.streams = [];
      this.streamsError = null;

      try {
        const response = await axios.get(`/api/admin/servers/${serverId}/streams`);
        this.streams = response.data;
      } catch (error) {
        console.error(`Error fetching streams for server ${serverId}:`, error);
        this.streamsError = error.response?.data?.detail || 'Failed to fetch streams.';
      } finally {
        this.isLoadingStreams = false;
      }
    },
    closeStreamsView() {
      this.selectedServerId = null;
      this.streams = [];
      this.streamsError = null;
    }
  },

  mounted() {
    this.fetchServers();
  }
};
</script>

<style scoped>
.server-management {
  padding: 20px;
}
form {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  width: 300px;
}
input {
  margin-bottom: 10px;
  padding: 8px;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  padding: 10px;
  border: 1px solid #eee;
  margin-bottom: 10px;
  border-radius: 4px;
}
li span {
  margin-right: 10px;
}
.error {
  color: #d9534f;
  margin-top: 10px;
}
.stream-list {
  margin-top: 15px;
  padding: 10px;
  border-top: 1px solid #ccc;
}
</style>
