"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export default function UsersAdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: 0, name: "", email: "", password: "", role: "pelanggan" });
  const [isEditing, setIsEditing] = useState(false);

  const [toastMessage, setToastMessage] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const fetchUsers = async () => {
    try {
      const data = await api("/users");
      setUsers(data);
    } catch (error) {
      console.error(error);
      alert("Gagal memuat pengguna.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = (user?: User) => {
    if (user) {
      setFormData({ id: user.id, name: user.name, email: user.email, password: "", role: user.role });
      setIsEditing(true);
    } else {
      setFormData({ id: 0, name: "", email: "", password: "", role: "pelanggan" });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api(`/users/${formData.id}`, {
          method: "PUT",
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            role: formData.role,
            ...(formData.password ? { password: formData.password } : {}), // only send password if not empty
          }),
        });
        showToast("✅ Pengguna berhasil diperbarui!");
      } else {
        await api("/users", {
          method: "POST",
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role,
          }),
        });
        showToast("✅ Pengguna baru berhasil ditambahkan!");
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error: any) {
      alert(error.data?.message || "Gagal menyimpan data pengguna.");
    }
  };

  const promptDelete = (id: number) => {
    setUserToDelete(id);
    setDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (userToDelete === null) return;
    try {
      await api(`/users/${userToDelete}`, { method: "DELETE" });
      fetchUsers();
      showToast("🗑️ Pengguna berhasil dihapus!");
      setDeleteModalOpen(false);
    } catch (error: any) {
      alert(error.data?.message || "Gagal menghapus pengguna.");
    }
  };

  if (loading) return <div className="p-8 text-center text-zinc-500">Memuat data pengguna...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">Manajemen Pengguna</h1>
          <p className="text-zinc-500 text-sm mt-1">Kelola akses Admin, Kasir, dan Pelanggan.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-red-600 hover:bg-red-700 text-white font-bold h-10 gap-2 rounded-xl">
          <Plus className="w-4 h-4" /> Tambah Pengguna
        </Button>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-400 font-bold uppercase bg-zinc-900/80 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Nama</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                  <td className="px-6 py-4 font-mono text-zinc-500">#{user.id}</td>
                  <td className="px-6 py-4 font-bold text-zinc-200">{user.name}</td>
                  <td className="px-6 py-4 text-zinc-400">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
                      user.role === 'admin' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                      user.role === 'kasir' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                      'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenModal(user)}
                      className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => promptDelete(user.id)}
                      className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                    Tidak ada pengguna ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <Card className="w-full max-w-md bg-zinc-950 border-zinc-800 shadow-2xl">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white uppercase tracking-wider">{isEditing ? "Edit Pengguna" : "Tambah Pengguna"}</h2>
                <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)} className="h-8 w-8 p-0 px-2 text-zinc-500 hover:text-white">✕</Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-zinc-400 text-xs uppercase font-bold">Nama Lengkap</Label>
                  <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-zinc-900 border-zinc-800 h-12 text-white" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-zinc-400 text-xs uppercase font-bold">Email</Label>
                  <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-zinc-900 border-zinc-800 h-12 text-white" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-zinc-400 text-xs uppercase font-bold">
                    Password {isEditing && <span className="text-zinc-600 normal-case font-normal">(Kosongkan jika tidak ingin diubah)</span>}
                  </Label>
                  <Input id="password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder={isEditing ? "••••••••" : "Min. 6 Karakter"}
                    className="bg-zinc-900 border-zinc-800 h-12 text-white placeholder:text-zinc-700" 
                    required={!isEditing} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-zinc-400 text-xs uppercase font-bold">Role Akses</Label>
                  <select id="role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 h-12 rounded-lg px-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600">
                    <option value="pelanggan">Pelanggan Biasa</option>
                    <option value="kasir">Kasir (Bisa Konfirmasi Pemesanan)</option>
                    <option value="admin">Admin (Akses Penuh)</option>
                  </select>
                </div>

                {formData.role === "admin" && (
                  <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 p-3 rounded-lg mt-2">
                    <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-400 font-medium leading-relaxed">
                      Perhatian: Memberikan role Admin berarti memberikan akses penuh ke seluruh pengelolaan sistem ini.
                    </p>
                  </div>
                )}

                <div className="pt-4 flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}
                    className="flex-1 bg-transparent border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 h-12">Batal</Button>
                  <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold h-12 shadow-[0_0_15px_rgba(220,38,38,0.3)]">
                    Simpan
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <Card className="w-full max-w-sm bg-zinc-950 border-zinc-800 shadow-2xl">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">Hapus Pengguna?</h2>
              <p className="text-zinc-400 text-sm">
                Tindakan ini tidak dapat dibatalkan. Pengguna akan dihapus permanen dari sistem.
              </p>
              <div className="pt-4 flex gap-3">
                <Button variant="outline" onClick={() => setDeleteModalOpen(false)}
                  className="flex-1 bg-transparent border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 h-11">Batal</Button>
                <Button onClick={executeDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold h-11 shadow-[0_0_15px_rgba(220,38,38,0.3)]">
                  Ya, Hapus
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300 bg-zinc-900 border border-zinc-800 shadow-2xl rounded-xl px-6 py-4 flex items-center gap-3">
          <span className="text-white font-medium text-sm">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
