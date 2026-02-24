import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Calendar, Clock, User, Phone, Trophy, Check, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, addDays, isBefore, startOfToday } from "date-fns";
import { tr } from "date-fns/locale";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

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
}

const Randevu = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fieldIdFromUrl = searchParams.get("field_id");

  const { toast } = useToast();
  const { user } = useAuth();
  const [step, setStep] = useState(fieldIdFromUrl ? 2 : 1);

  const [formData, setFormData] = useState({
    ad: user?.user_metadata?.ad || "",
    soyad: user?.user_metadata?.soyad || "",
    telefon: user?.user_metadata?.telefon || "",
    field_id: fieldIdFromUrl || "",
    tarih: undefined as Date | undefined,
    saat: "",
  });

  const [fields, setFields] = useState<Field[]>([]);
  const [fieldsLoading, setFieldsLoading] = useState(true);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/fields")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setFields(data);
      })
      .catch((err) => console.error("Error fetching fields:", err))
      .finally(() => setFieldsLoading(false));
  }, []);

  useEffect(() => {
    if (formData.tarih && formData.field_id) {
      fetchBookedSlots(formData.tarih, formData.field_id);
    }
  }, [formData.tarih, formData.field_id]);

  const fetchBookedSlots = async (date: Date, field_id: string) => {
    setLoadingSlots(true);
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const response = await fetch(`/api/reservations?date=${formattedDate}&field_id=${field_id}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setBookedSlots(data?.map((item: any) => item.saat) || []);
    } catch (error) {
      console.error("Error fetching slots:", error);
      setBookedSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const selectedField = fields.find(f => f.id === formData.field_id);

  const handleSubmit = async () => {
    if (!formData.ad || !formData.soyad || !formData.telefon || !formData.field_id || !formData.tarih || !formData.saat) {
      toast({ title: "Hata", description: "Lütfen tüm alanları doldurun.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const isWeekend = formData.tarih.getDay() === 0 || formData.tarih.getDay() === 6;
      let price = isWeekend ? selectedField?.pricing.weekend : selectedField?.pricing.weekday;

      const hour = parseInt(formData.saat.split(":")[0]);
      if (hour >= 20 || hour <= 2) { // 20:00 - 02:00 considered night
        price = (price || 0) + (selectedField?.pricing.night_extra || 0);
      }

      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          user_id: user?.id || null,
          tarih: format(formData.tarih, 'yyyy-MM-dd'),
          fiyat: price
        }),
      });

      if (!response.ok) {
        if (response.status === 409) {
          toast({ title: "Hata", description: "Bu saat dilimi dolu.", variant: "destructive" });
          fetchBookedSlots(formData.tarih, formData.field_id);
          setFormData({ ...formData, saat: "" });
          return;
        }
        throw new Error('Something went wrong');
      }
      setIsSuccess(true);
    } catch (error) {
      toast({ title: "Hata", description: "Rezervasyon oluşturulamadı.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center px-4">
          <div className="text-center animate-scale-in max-w-lg">
            <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-card">
              <Check className="w-12 h-12" />
            </div>
            <h1 className="text-4xl font-bold mb-4 uppercase">REZERVASYON ALINDI</h1>
            <p className="text-muted-foreground mb-10">Saha sahibi onayladıktan sonra tarafınıza bilgi verilecektir.</p>
            <Button onClick={() => navigate("/")} size="lg" className="px-12 font-bold uppercase transition-all hover:scale-105">Ana Sayfaya Dön</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-[80vh] py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-center mb-16">
            <div className="flex items-center gap-6">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl transition-all shadow-sm", step >= s ? "bg-primary text-white" : "bg-white text-muted-foreground")}>
                    {s}
                  </div>
                  {s < 3 && <div className={cn("w-16 h-1 mx-2 rounded-full", step > s ? "bg-primary" : "bg-white")} />}
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-xl mx-auto">
            {step === 1 && (
              <div className="animate-slide-up space-y-6">
                <div className="bg-card border border-border rounded-2xl p-8 shadow-soft">
                  <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 uppercase"><User className="w-6 h-6 text-primary" /> Oyuncu Bilgileri</h2>
                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Ad</Label>
                        <Input placeholder="Adınız" value={formData.ad} onChange={(e) => setFormData({ ...formData, ad: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Soyad</Label>
                        <Input placeholder="Soyadınız" value={formData.soyad} onChange={(e) => setFormData({ ...formData, soyad: e.target.value })} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Telefon</Label>
                      <Input type="tel" placeholder="05XX XXX XX XX" value={formData.telefon} onChange={(e) => setFormData({ ...formData, telefon: e.target.value })} />
                    </div>
                  </div>
                </div>
                <Button className="w-full h-14 text-lg font-bold uppercase shadow-card" disabled={!formData.ad || !formData.soyad || !formData.telefon} onClick={() => setStep(2)}>Saha Seçimine Geç</Button>
              </div>
            )}

            {step === 2 && (
              <div className="animate-slide-up space-y-6">
                <div className="bg-card border border-border rounded-2xl p-8 shadow-soft">
                  <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 uppercase"><Trophy className="w-6 h-6 text-primary" /> Halı Saha Seçin</h2>
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {fieldsLoading ? <p>Sahalar yükleniyor...</p> : fields.map(field => (
                      <button key={field.id} onClick={() => setFormData({ ...formData, field_id: field.id })} className={cn("w-full p-5 rounded-xl border-2 text-left transition-all hover:bg-muted/50", formData.field_id === field.id ? "border-primary bg-primary/5" : "border-border shadow-sm")}>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-lg uppercase tracking-tight">{field.name}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" /> {field.city}, {field.district}</p>
                          </div>
                          <p className="font-bold text-primary">{field.pricing.weekday}₺<span className="text-xs text-muted-foreground ml-1">/ saat</span></p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1 h-14 font-bold" onClick={() => setStep(1)}>GERİ</Button>
                  <Button className="flex-1 h-14 font-bold uppercase shadow-card" disabled={!formData.field_id} onClick={() => setStep(3)}>Tarih Seçimine Geç</Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-slide-up space-y-6">
                <div className="bg-card border border-border rounded-2xl p-8 shadow-soft">
                  <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 uppercase"><Calendar className="w-6 h-6 text-primary" /> Tarih ve Saat</h2>
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <Label>Maç Günü</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-full h-12 justify-start text-lg font-medium", !formData.tarih && "text-muted-foreground")}>
                            <Calendar className="mr-3 h-5 w-5 text-primary" />
                            {formData.tarih ? format(formData.tarih, "d MMMM yyyy", { locale: tr }) : "Hangi gün?"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="center">
                          <CalendarComponent mode="single" selected={formData.tarih} onSelect={(d) => setFormData({ ...formData, tarih: d, saat: "" })} disabled={(d) => isBefore(d, startOfToday()) || isBefore(addDays(new Date(), 30), d)} />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {formData.tarih && (
                      <div className="space-y-4">
                        <Label>Müsait Saatler</Label>
                        {loadingSlots ? <p className="text-center py-4">Saha müsaitliği kontrol ediliyor...</p> : (
                          <div className="grid grid-cols-3 gap-2">
                            {selectedField?.time_slots.map(time => {
                              const isTaken = bookedSlots.includes(time);
                              return (
                                <button key={time} disabled={isTaken} onClick={() => setFormData({ ...formData, saat: time })} className={cn("h-12 rounded-lg border-2 font-bold transition-all flex items-center justify-center gap-2", isTaken ? "bg-muted text-muted-foreground line-through opacity-50" : formData.saat === time ? "border-primary bg-primary text-white shadow-card" : "border-border hover:border-primary/50 bg-white")}>
                                  <Clock className="w-4 h-4" /> {time}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1 h-14 font-bold" onClick={() => setStep(2)}>GERİ</Button>
                  <Button className="flex-1 h-14 font-bold uppercase shadow-card" disabled={!formData.tarih || !formData.saat || isSubmitting} onClick={handleSubmit}>{isSubmitting ? "PLANLANIYOR..." : "REZERVASYONU TAMAMLA"}</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Randevu;
