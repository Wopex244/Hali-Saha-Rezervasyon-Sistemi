import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trophy, Clock, Check, ArrowRight, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "@/components/Layout";

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
  image?: string;
}

const Home = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("Tümü");

  useEffect(() => {
    fetch("/api/fields")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setFields(data);
      })
      .catch((err) => console.error("Error fetching fields:", err));
  }, []);

  const cities = ["Tümü", ...new Set(fields.map(f => f.city))];

  const filteredFields = fields.filter(field => {
    const matchesSearch = field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === "Tümü" || field.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center bg-primary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-primary-foreground" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-2 border-primary-foreground rounded-full" />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 px-4 py-2 rounded-full mb-6">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium">Türkiye'nin En Büyük Halı Saha Platformu</span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl mb-6 tracking-tight font-extrabold uppercase">
              MAÇINI <span className="text-yellow-400">HEMEN</span><br />PLANLA
            </h1>

            <p className="text-primary-foreground/90 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Dilediğin sahada, dilediğin saatte yerini ayırt.
              Saha arama ve kolay rezervasyonun keyfini çıkar.
            </p>

            <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                <Input
                  placeholder="Saha adı veya ilçe ara..."
                  className="bg-transparent border-white/20 pl-10 h-12 text-white placeholder:text-white/60 focus-visible:ring-yellow-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <select
                  className="bg-white/20 border border-white/20 rounded-md px-4 h-12 text-white outline-none cursor-pointer focus:ring-2 focus:ring-yellow-400"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  {cities.map(city => (
                    <option key={city} value={city} className="text-black">{city}</option>
                  ))}
                </select>
                <Button className="h-12 px-8 bg-yellow-400 text-primary hover:bg-yellow-500 font-bold shrink-0">
                  KEŞFET
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fields Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div className="animate-fade-in">
              <h2 className="text-4xl font-bold mb-2 uppercase">Popüler Sahalar</h2>
              <p className="text-muted-foreground">
                Senin için seçtiğimiz en kaliteli halı sahalar.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFields.length > 0 ? (
              filteredFields.map((field) => (
                <div key={field.id} className="group bg-card border border-border rounded-xl overflow-hidden shadow-soft hover:shadow-card transition-all duration-300 flex flex-col">
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    {field.image ? (
                      <img src={field.image} alt={field.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/10">
                        <Trophy className="w-12 h-12 text-primary/20" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm">
                      {field.pricing.weekday}₺ / Saat
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-primary text-sm font-semibold mb-2">
                      <MapPin className="w-4 h-4" />
                      {field.city}, {field.district}
                    </div>
                    <h3 className="text-xl font-bold mb-4 uppercase tracking-tight">{field.name}</h3>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {field.features.slice(0, 3).map(feature => (
                        <span key={feature} className="text-[10px] px-2 py-1 bg-secondary text-secondary-foreground rounded uppercase font-bold">
                          {feature}
                        </span>
                      ))}
                    </div>

                    <Button asChild className="w-full mt-auto font-bold group">
                      <Link to={`/randevu?field_id=${field.id}`}>
                        REZERVASYON YAP
                        <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-muted-foreground italic">Aradığınız kriterlere uygun saha bulunamadı.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center mb-6 rotate-3">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3 uppercase">7/24 Rezervasyon</h3>
              <p className="text-primary-foreground/70 text-sm">Sıra beklemeden saniyeler içinde yerini ayırt.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center mb-6 -rotate-3">
                <Check className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3 uppercase">Anlık Müsaitlik</h3>
              <p className="text-primary-foreground/70 text-sm">Sahaların gerçek zamanlı doluluk durumunu gör.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center mb-6 rotate-3">
                <Trophy className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3 uppercase">Onaylı Sahalar</h3>
              <p className="text-primary-foreground/70 text-sm">Sadece kaliteli ve güvenilir sahalar.</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
