"use client";

import { useEffect, useState } from "react";
import { getAuditLogs, AuditLog } from "@/lib/admin";

const ACTION_LABELS: Record<string, string> = {
  USER_ACTIVATED: "User Activated",
  USER_DEACTIVATED: "User Deactivated",
  ROLE_UPDATED: "Role Updated",
  USER_DELETED: "User Deleted",
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const res = await getAuditLogs();
      if (res.success) {
        setLogs(res.logs);
      } else {
        setError(res.message || "Failed to load audit logs");
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-serif mb-4">Audit Logs</h1>

      {loading && <p>Loading audit logs...</p>}
      {!loading && error && <p className="text-red-600">{error}</p>}
      {!loading && !error && logs.length === 0 && (
        <p className="text-gray-500">No admin actions have been logged yet.</p>
      )}

      {!loading && logs.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2 pr-4">Action</th>
                <th className="py-2 pr-4">Performed By</th>
                <th className="py-2 pr-4">Target User</th>
                <th className="py-2 pr-4">Details</th>
                <th className="py-2 pr-4">When</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id} className="border-b">
                  <td className="py-2 pr-4">{ACTION_LABELS[log.action] || log.action}</td>
                  <td className="py-2 pr-4">
                    {log.performedBy?.username} ({log.performedBy?.email})
                  </td>
                  <td className="py-2 pr-4">
                    {log.targetUser
                      ? `${log.targetUser.username} (${log.targetUser.email})`
                      : "—"}
                  </td>
                  <td className="py-2 pr-4">
                    {log.details ? JSON.stringify(log.details) : "—"}
                  </td>
                  <td className="py-2 pr-4">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
