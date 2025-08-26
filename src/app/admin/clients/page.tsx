"use client";

import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Client, createColumns } from "./columns-simple";
import { DataTable } from "./data-table";
import { CreateClientDialog } from "./create-client-dialog";
import { 
  getClients, 
  createClient, 
  updateClient,
  mapBackendClientToFrontend,
  mapFrontendFormToBackend,
  mapFrontendUpdateToBackend 
} from "@/lib/api/clients";
import { CreateClientForm } from "@/types/Client";
import { useAuth } from "@/context/AuthContext";

function ClientsPageContent() {
  const { getAccessToken } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch clients from backend
  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getAccessToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await getClients(token);
      const mappedClients = response.clients.map(mapBackendClientToFrontend);
      setClients(mappedClients);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError(err instanceof Error ? err.message : 'Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  // Load clients on component mount
  useEffect(() => {
    fetchClients();
  }, []);

  const handleCreateClient = async (newClientData: Omit<Client, "id">) => {
    try {
      const token = getAccessToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Convert frontend format to backend format
      const backendData = mapFrontendFormToBackend(newClientData as CreateClientForm);
      
      // Create client via API
      const createdClient = await createClient(backendData, token);
      const mappedClient = mapBackendClientToFrontend(createdClient);
      
      // Add to local state
      setClients(prev => [mappedClient, ...prev]);
      
      console.log("Client créé:", mappedClient);
    } catch (err) {
      console.error('Error creating client:', err);
      setError(err instanceof Error ? err.message : 'Failed to create client');
    }
  };

  const handleUpdateClient = async (updatedClient: Client) => {
    try {
      const token = getAccessToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Convert frontend format to backend format for updates
      const backendData = mapFrontendUpdateToBackend(updatedClient);
      
      // Update client via API
      const updatedBackendClient = await updateClient(updatedClient.id, backendData, token);
      const mappedClient = mapBackendClientToFrontend(updatedBackendClient);
      
      // Update local state
      setClients(prev => 
        prev.map(client => 
          client.id === updatedClient.id ? mappedClient : client
        )
      );
      
      console.log("Client modifié:", mappedClient);
    } catch (err) {
      console.error('Error updating client:', err);
      setError(err instanceof Error ? err.message : 'Failed to update client');
    }
  };

  const columns = createColumns(handleUpdateClient);

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Chargement des clients...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={fetchClients}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Clients</h1>
          <p className="text-muted-foreground">
            Gérez les informations de vos clients et leurs permis de conduire.
          </p>
        </div>
        
        <CreateClientDialog onSave={handleCreateClient} />
      </div>
      
      <div className="mt-8">
        <DataTable columns={columns} data={clients} />
      </div>
    </div>
  );
}

export default function ClientsPage() {
  return (
    <ProtectedRoute>
      <ClientsPageContent />
    </ProtectedRoute>
  );
}