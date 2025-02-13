import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";

interface Subscriber {
  _id: string;
  chatId: number;
  email: string;
}

const Dashboard = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [newApiKey, setNewApiKey] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Authorization token is missing.");
          return;
        }

        // Fetch subscribers
        const { data: subscriberData } = await axios.get("http://localhost:3002/api/admin/subscribers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Subscriber data:", subscriberData);  // Log the response
        setSubscribers(subscriberData);

        // Fetch current bot API key
        const { data: apiData } = await axios.get("http://localhost:3002/api/admin/api-key", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("API key data:", apiData);  // Log the response
        setApiKey(apiData.apiKey);
      } catch (err: any) {
        console.error("Error fetching data:", err);  // Log error details
        setError(err.response?.data?.message || "");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (subscriberId: string) => {
    if (!confirm("Are you sure you want to delete this subscriber?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authorization token is missing.");
        return;
      }

      await axios.delete(`http://localhost:3002/api/admin/subscribers/${subscriberId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubscribers(subscribers.filter((sub) => sub._id !== subscriberId));
      toast.success("Subscriber deleted successfully!");
    } catch (err: any) {
      console.error("Error deleting subscriber:", err);  // Log error details
      toast.error(err.response?.data?.message || "Failed to delete subscriber.");
    }
  };

  const handleApiKeyChange = async () => {
    if (!newApiKey) {
      return toast.error("API key cannot be empty.");
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authorization token is missing.");
        return;
      }

      const response = await axios.put(
        "http://localhost:3002/api/admin/api-key",
        { apiKey: newApiKey },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("API key update response:", response.data);  // Log the response
      setApiKey(newApiKey);
      setNewApiKey("");
      toast.success("API key updated successfully!");
    } catch (err: any) {
      console.error("Error updating API key:", err);  // Log error details
      toast.error(err.response?.data?.message || "Failed to update API key.");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* API Key Management */}
      <div className="p-4 bg-gray-100 rounded-md shadow-md">
        <h2 className="text-xl font-semibold">Bot API Key</h2>
        <p className="mb-2 text-sm text-gray-600">Current API Key: <span className="font-mono">{apiKey}</span></p>
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Enter new API key"
            value={newApiKey}
            onChange={(e) => setNewApiKey(e.target.value)}
          />
          <Button onClick={handleApiKeyChange} className="bg-blue-500">
            Update API Key
          </Button>
        </div>
      </div>

      {/* Subscriber List */}
      <div className="p-4 bg-white rounded-md shadow-md">
        <h2 className="text-xl font-semibold">Subscribers</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Chat ID</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscribers.map((subscriber) => (
              <TableRow key={subscriber._id}>
                <TableCell>{subscriber.chatId}</TableCell>
                <TableCell>{subscriber.email}</TableCell>
                <TableCell>
                  <Button onClick={() => handleDelete(subscriber._id)} className="bg-red-500">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Dashboard;
