"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Search, X, Shield, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { confirmDelete } from "@/components/dashboard/DeleteConfirm";
import { useSession } from "next-auth/react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "Staff";
  isActive: boolean;
  createdAt: string;
}

const ROLE_INFO: Record<string, { label: string; color: string; description: string }> = {
  Admin:   { label: "Admin",   color: "bg-red-500/10 text-red-400 border-red-500/20",     description: "Full access — user create ছাড়া সব CRUD করতে পারবে" },
  Manager: { label: "Manager", color: "bg-amber-500/10 text-amber-400 border-amber-500/20", description: "Create ও Update করতে পারবে — delete ও user create নেই" },
  Staff:   { label: "Staff",   color: "bg-slate-600/50 text-slate-300 border-slate-600",   description: "শুধু Create/Add করতে পারবে" },
};

const emptyForm = { name: "", email: "", password: "", role: "Staff" as User["role"], isActive: true };

export default function UsersPage() {
  const { data: session } = useSession();
  const currentRole = (session?.user as any)?.role;

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (currentRole === "Admin") fetchUsers();
    else setLoading(false);
  }, [currentRole]);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetch("/api/users");
    const data = await res.json();
    if (data.success) setUsers(data.data);
    setLoading(false);
  };

  const openAdd = () => {
    setEditUser(null); setForm(emptyForm); setShowPass(false); setShowModal(true);
  };

  const openEdit = (user: User) => {
    setEditUser(user);
    setForm({ name: user.name, email: user.email, password: "", role: user.role, isActive: user.isActive });
    setShowPass(false); setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim()) { toast.error("Name and email required!"); return; }
    if (!editUser && !form.password.trim()) { toast.error("Password required for new user!"); return; }
    setSaving(true);
    try {
      const payload: any = { name: form.name, email: form.email, role: form.role, isActive: form.isActive };
      if (form.password.trim()) payload.password = form.password;
      const url = editUser ? `/api/users/${editUser._id}` : "/api/users";
      const method = editUser ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) {
        toast.success(editUser ? "User updated! 🎉" : "User created! ✅");
        fetchUsers(); setShowModal(false);
      } else { toast.error(data.error || "Failed"); }
    } catch { toast.error("Network error!"); } finally { setSaving(false); }
  };

  const handleDelete = (id: string, name: string) => {
    confirmDelete(`"${name}" কে delete করতে চান?`, async () => {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) { toast.success("User deleted!"); fetchUsers(); }
      else toast.error(data.error || "Delete failed!");
    });
  };

  if (currentRole !== "Admin") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Shield className="w-12 h-12 text-slate-600 mb-4" />
        <h3 className="text-white font-semibold text-lg mb-2">Access Restricted</h3>
        <p className="text-slate-400 text-sm">Only Admin can manage users.</p>
      </div>
    );
  }

  const filtered = users.filter(
    (u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Users</h2>
          <p className="text-slate-400 text-sm mt-1">{users.length} total users</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all">
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      {/* Role Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {Object.entries(ROLE_INFO).map(([role, info]) => (
          <div key={role} className={`border rounded-xl px-4 py-3 ${info.color}`}>
            <p className="font-semibold text-sm mb-1">{info.label}</p>
            <p className="text-xs opacity-70">{info.description}</p>
          </div>
        ))}
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input type="text" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto">
        <table className="w-full min-w-[540px]">
          <thead>
            <tr className="border-b border-slate-800">
              {["User","Role","Status","Created","Actions"].map((h) => (
                <th key={h} className="text-left text-slate-400 text-xs font-medium px-5 py-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center text-slate-500 py-12">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="text-center text-slate-500 py-12">No users found</td></tr>
            ) : (
              filtered.map((user) => (
                <motion.tr key={user._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-white text-sm font-medium">{user.name}</p>
                    <p className="text-slate-400 text-xs">{user.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${ROLE_INFO[user.role]?.color}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${user.isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-400 text-xs">
                    {new Date(user.createdAt).toLocaleDateString("en-BD", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(user)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(user._id, user.name)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md">
              <div className="flex items-center justify-between p-6 border-b border-slate-800">
                <h3 className="text-white font-semibold">{editUser ? "Edit User" : "Add User"}</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
                  <input type="text" placeholder="John Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
                  <input type="email" placeholder="user@ccll.com.bd" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Password {editUser && <span className="text-slate-500 text-xs">(ফাঁকা রাখলে পরিবর্তন হবে না)</span>}
                  </label>
                  <div className="relative">
                    <input type={showPass ? "text" : "password"} placeholder="Min. 8 characters" value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <button onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Role</label>
                    <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as User["role"] })}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="Staff">Staff</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Status</label>
                    <select value={form.isActive ? "true" : "false"} onChange={(e) => setForm({ ...form, isActive: e.target.value === "true" })}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                </div>
                {/* Role description */}
                <div className={`rounded-xl px-4 py-3 border text-xs ${ROLE_INFO[form.role]?.color}`}>
                  {ROLE_INFO[form.role]?.description}
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-800">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-400 hover:text-white text-sm transition-colors">Cancel</button>
                <button onClick={handleSubmit} disabled={saving}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white px-6 py-2 rounded-xl text-sm font-medium transition-all">
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : editUser ? "Update" : "Create User"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
