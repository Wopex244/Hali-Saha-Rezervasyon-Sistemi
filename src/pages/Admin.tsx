import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, User, Phone, Check, X, LogOut, Trophy, RefreshCw, Settings, Plus, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Reservation {
  id: string;
  field_id: string;
  ad: string;
  soyad: string;
  telefon: string;
  tarih: string;
  saat: string;
  fiyat: number;
  durum: string;
  created_at: string;
}

interface Field {
  id: string;
  name: string;
  city: string;
  district: string;
  features: string[];
  pricing: {
    weekday: number;
    weekend: number;
    night_extra: number;
  };
  time_slots: string[];
  status: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAdmin, isFieldOwner, isLoading, signOut } = useAuth();

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [myFields, setMyFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || (!isAdmin && !isFieldOwner))) {
      navigate("/giris");
    }
  }, [user, isAdmin, isFieldOwner, isLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch fields
      const fieldQuery = isAdmin ? "" : `?owner_id=${user?.id}`;
      const fieldsRes = await fetch(`/api/fields${fieldQuery}`);
      const fieldsData = await fieldsRes.json();
      setMyFields(Array.isArray(fieldsData) ? fieldsData : []);

      // Fetch reservations
      const resQuery = isAdmin ? "?all=true" : `?owner_id=${user?.id}`; // API handles owner filter internally if query param is set
      const reservationsRes = await fetch(`/api/reservations${resQuery}`);
      const resData = await reservationsRes.json();
      setReservations(Array.isArray(resData) ? resData : []);
    } catch (error) {
      toast({ title: "Hata", description: "Veriler yüklenemedi.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/reservations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, durum: newStatus })
      });
      if (!res.ok) throw new Error();
      setReservations(reservations.map(r => r.id === id ? { ...r, durum: newStatus } : r));
      toast({ title: "Başarılı", description: "Durum güncellendi." });
    } catch (error) {
      toast({ title: "Hata", description: "Güncelleme yapılamadı.", variant: "destructive" });
    }
  };

  if (isLoading || loading) return <div className="min-h-screen flex items-center justify-center"><RefreshCw className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="bg-primary text-white shadow-card sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <span className="font-bold text-xl uppercase tracking-tighter">Saha Yönetim</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm border-r pr-4 border-white/20 hidden md:block">{user?.email} ({isAdmin ? 'Admin' : 'Saha Sahibi'})</span>
            <Button variant="ghost" size="sm" onClick={() => signOut()} className="hover:bg-white/10"><LogOut className="w-4 h-4 mr-2" /> Çıkış</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="reservations" className="space-y-8">
          <TabsList className="bg-white p-1 rounded-xl shadow-sm border">
            <TabsTrigger value="reservations" className="rounded-lg font-bold uppercase py-2">Rezervasyonlar</TabsTrigger>
            <TabsTrigger value="fields" className="rounded-lg font-bold uppercase py-2">Sahalarım</TabsTrigger>
            <TabsTrigger value="stats" className="rounded-lg font-bold uppercase py-2">İstatistikler</TabsTrigger>
          </TabsList>

          <TabsContent value="reservations" className="animate-fade-in space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold uppercase">Gelen Rezervasyonlar</h2>
              <Button onClick={fetchData} variant="outline" size="sm"><RefreshCw className="w-4 h-4 mr-2" /> Yenile</Button>
            </div>

            {reservations.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border italic text-muted-foreground">Henüz rezervasyon bulunmuyor.</div>
            ) : (
              <div className="grid gap-4">
                {reservations.map(res => (
                  <div key={res.id} className="bg-white border rounded-xl p-6 shadow-soft hover:shadow-card transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 font-bold text-lg">
                        <User className="w-4 h-4 text-primary" /> {res.ad} {res.soyad}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground font-medium">
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {res.telefon}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {format(new Date(res.tarih), "d MMMM yyyy", { locale: tr })}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {res.saat}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Badge className={cn("px-4 py-1 uppercase font-bold", res.durum === 'beklemede' ? 'bg-yellow-100 text-yellow-700' : res.durum === 'onaylandi' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
                        {res.durum.toUpperCase()}
                      </Badge>
                      {res.durum === 'beklemede' && (
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleUpdateStatus(res.id, 'onaylandi')} className="bg-green-600 hover:bg-green-700"><Check className="w-4 h-4" /></Button>
                          <Button size="sm" variant="destructive" onClick={() => handleUpdateStatus(res.id, 'iptal')}><X className="w-4 h-4" /></Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="fields" className="animate-fade-in space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold uppercase">Yönetilen Sahalar</h2>
              <Button className="font-bold"><Plus className="w-4 h-4 mr-2" /> Yeni Saha Ekle</Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myFields.map(field => (
                <div key={field.id} className="bg-white border rounded-xl overflow-hidden shadow-soft">
                  <div className="p-6">
                    <h3 className="text-xl font-bold uppercase mb-2 tracking-tight">{field.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mb-4"><MapPin className="w-3 h-3" /> {field.city}, {field.district}</p>
                    <div className="flex justify-between items-center border-t pt-4">
                      <Badge variant="outline" className="uppercase">{field.status}</Badge>
                      <Button variant="ghost" size="sm" className="text-primary font-bold">DÜZENLE</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="stats" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-2xl shadow-soft border border-green-100">
                <p className="text-sm text-muted-foreground font-bold uppercase mb-1">Toplam Rezervasyon</p>
                <p className="text-4xl font-black text-primary">{reservations.length}</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-soft border border-blue-100">
                <p className="text-sm text-muted-foreground font-bold uppercase mb-1">Onaylanan Maçlar</p>
                <p className="text-4xl font-black text-blue-600">{reservations.filter(r => r.durum === 'onaylandi').length}</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-soft border border-yellow-100">
                <p className="text-sm text-muted-foreground font-bold uppercase mb-1">Toplam Kazanç</p>
                <p className="text-4xl font-black text-yellow-600">{reservations.filter(r => r.durum === 'onaylandi').reduce((acc, curr) => acc + curr.fiyat, 0).toLocaleString('tr-TR')}₺</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
