import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";

type DriverPing = {
  id: string;
  driver_id: string;
  lat: number;
  lng: number;
  heading?: number | null;
  speed?: number | null;
  recorded_at?: string | null;
};

type StatusCounts = Record<string, number>;

export default function AdminLive() {
  const [latestByDriver, setLatestByDriver] = useState<Record<string, DriverPing>>({});
  const [statusCounts, setStatusCounts] = useState<StatusCounts>({});
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const mapElRef = useRef<HTMLDivElement | null>(null);
  const mapInstRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);

  useEffect(() => {
    // Prefetch last known pings (last 100)
    (async () => {
      const { data } = await supabase
        .from("driver_locations")
        .select("id, driver_id, lat, lng, heading, speed, recorded_at")
        .order("recorded_at", { ascending: false })
        .limit(100);
      const map: Record<string, DriverPing> = {};
      (data || []).forEach((r) => {
        if (!map[r.driver_id]) map[r.driver_id] = r as DriverPing;
      });
      setLatestByDriver(map);
    })();

    // Subscribe to realtime inserts
    const ch = supabase
      .channel("driver_locations_live")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "driver_locations" },
        (payload) => {
          const r = payload.new as DriverPing;
          setLatestByDriver((prev) => ({ ...prev, [r.driver_id]: r }));
        },
      )
      .subscribe();
    channelRef.current = ch;
    return () => {
      channelRef.current?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let timer: any;
    const fetchCounts = async () => {
      const statuses = [
        "awaiting_pickup_customer",
        "in_transit_to_facility",
        "arrived_at_facility",
        "processing",
        "ready_for_delivery",
        "in_transit_to_customer",
        "delivered",
      ];
      const results = await Promise.all(
        statuses.map((s) => supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", s)),
      );
      const counts: StatusCounts = {};
      results.forEach((r, idx) => (counts[statuses[idx]] = r.count || 0));
      setStatusCounts(counts);
    };
    fetchCounts();
    timer = setInterval(fetchCounts, 15000);
    return () => clearInterval(timer);
  }, []);

  const drivers = useMemo(() => Object.values(latestByDriver), [latestByDriver]);

  // Lazy-load Leaflet (CDN) and render markers
  useEffect(() => {
    const ensureLeaflet = async () => {
      if ((window as any).L) return;
      // load CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
      // load JS
      await new Promise<void>((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => resolve();
        document.body.appendChild(script);
      });
    };
    const initMap = async () => {
      await ensureLeaflet();
      if (!mapElRef.current) return;
      const L = (window as any).L as any;
      if (!mapInstRef.current) {
        mapInstRef.current = L.map(mapElRef.current).setView([52.3676, 4.9041], 11);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(mapInstRef.current);
      }
      // Render markers layer
      if (markersLayerRef.current) {
        markersLayerRef.current.clearLayers();
      } else {
        markersLayerRef.current = (window as any).L.layerGroup().addTo(mapInstRef.current);
      }
      const list = Object.values(latestByDriver);
      if (list.length > 0) {
        const L = (window as any).L as any;
        const bounds = L.latLngBounds([]);
        list.forEach((d) => {
          const m = L.marker([d.lat, d.lng]);
          m.bindPopup(`Driver ${d.driver_id.slice(0, 8)}<br/>${Number(d.lat).toFixed(5)}, ${Number(d.lng).toFixed(5)}`);
          m.addTo(markersLayerRef.current);
          bounds.extend([d.lat, d.lng]);
        });
        mapInstRef.current.fitBounds(bounds.pad(0.2));
      }
    };
    initMap();
    // no cleanup to preserve map instance while navigating
  }, [latestByDriver]);

  return (
    <div className="min-h-screen bg-white">
      <header className="hidden">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-black hover:text-primary transition-colors">Home</Link>
            <Link to="/orders" className="text-black hover:text-primary transition-colors">Orders</Link>
          </div>
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <img src="https://cdn.builder.io/api/v1/image/assets%2F0ba0452a2d1340e7b84136d8ed253a1b%2Fb6e642e462f04f14827396626baf4d5e?format=webp&width=800" alt="eazyy logo" className="h-8 w-auto" />
          </div>
          <div className="flex items-center space-x-6"></div>
        </nav>
      </header>

      <main className="px-4 lg:px-16 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-medium text-black mb-2">Live Operations</h1>
            <p className="text-gray-600">Driver locations and live order status</p>
          </div>

          {/* Status Counters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {Object.entries(statusCounts).map(([k, v]) => (
              <div key={k} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="text-sm text-gray-500">{k.replace(/_/g, " ")}</div>
                <div className="text-2xl font-bold text-black">{v}</div>
              </div>
            ))}
          </div>

          {/* Live Map */}
          <div className="rounded-xl border border-gray-200 overflow-hidden mb-8">
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 text-sm text-gray-600">Driver Map</div>
            <div ref={mapElRef} style={{ height: 380, width: '100%' }} />
          </div>

          {/* Drivers list */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <h3 className="font-medium text-black">Drivers (latest pings)</h3>
              <div className="text-sm text-gray-500">{drivers.length} online</div>
            </div>
            <div className="divide-y divide-gray-100">
              {drivers.length === 0 && (
                <div className="p-6 text-gray-500">No driver locations yet.</div>
              )}
              {drivers.map((d) => (
                <div key={d.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-black">Driver {d.driver_id.slice(0, 8)}</div>
                    <div className="text-sm text-gray-600">{Number(d.lat).toFixed(5)}, {Number(d.lng).toFixed(5)}</div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {d.recorded_at ? new Date(d.recorded_at).toLocaleTimeString() : ""}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


