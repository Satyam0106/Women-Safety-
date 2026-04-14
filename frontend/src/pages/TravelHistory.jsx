import { useEffect, useState } from "react";
import api from "../api/client";
import DashboardFooterNav from "../components/DashboardFooterNav";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const TravelHistory = () => {
  const [history, setHistory] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get("/history");
        setHistory(data);
        
        // Group data to prevent duplicate place points unless returning later
        const processed = [];
        const seenLocations = new Set();
        
        for (const item of data) {
           const locKey = `${item.latitude.toFixed(3)},${item.longitude.toFixed(3)}`;
           
           if (!seenLocations.has(locKey)) {
             seenLocations.add(locKey);
             processed.push(item);
           }
        }
        
        // We take the latest 10 unique locations and reverse them for chronological X-axis progression
        const displayItems = processed.slice(0, 10).reverse();
        
        // Batch reverse geocode with a try-catch for each item
        const dataWithPlaces = await Promise.all(displayItems.map(async (item) => {
          let placeName = `Loc: ${item.latitude.toFixed(2)}, ${item.longitude.toFixed(2)}`;
          try {
             // Basic fetch to Nominatim OSM mapping
             const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${item.latitude}&lon=${item.longitude}`);
             const geo = await res.json();
             if (geo && geo.address) {
                placeName = geo.address.suburb || geo.address.neighbourhood || geo.address.city || geo.address.town || geo.address.state || placeName;
             }
          } catch(e) {
             console.warn("Geocoding failed for item", e);
          }
          return {
             place: placeName,
             risk: item.crimeRiskScore,
             ...item
          };
        }));
        
        setChartData(dataWithPlaces);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistory();
  }, []);

  return (
    <div className="dashboard-shell">
      <header className="dashboard-topbar">
        <div>
          <h2>Travel History Dashboard</h2>
          <p>Visited locations, risk predictions, and analysis insights</p>
        </div>
      </header>

      <main className="dashboard-main history-layout">
        <section className="history-list card-like">
          {loading ? (
             <p className="placeholder-note">Loading history...</p>
          ) : history.length === 0 ? (
             <p className="placeholder-note">No travel history available yet.</p>
          ) : (
            history.map((item) => (
              <article key={item._id} className="history-item">
                <div>
                  <h4>
                    {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
                  </h4>
                  <p>{new Date(item.timestamp).toLocaleString()}</p>
                </div>
                <div>
                  <p>
                    <strong>Risk:</strong> {item.riskLevel} ({item.crimeRiskScore})
                  </p>
                  <p>{item.analysis}</p>
                </div>
              </article>
            ))
          )}
        </section>

        <section className="history-chart card-like">
          <h3>Dynamic Risk Trend</h3>
          <div className="dynamic-chart-wrapper" style={{ width: "100%", height: 350, marginTop: "1rem" }}>
             {loading ? (
                <p className="placeholder-note" style={{ textAlign: "center", paddingTop: "50px" }}>Compiling risk chart data...</p>
             ) : chartData.length === 0 ? (
                <p className="placeholder-note" style={{ textAlign: "center", paddingTop: "50px" }}>Not enough unique location data to plot.</p>
             ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <defs>
                      <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#881337" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis 
                       dataKey="place" 
                       stroke="#cbd5e1" 
                       fontSize={12} 
                       tickLine={false}
                       axisLine={false}
                       tick={{ fill: '#94a3b8' }}
                       angle={-15}
                       textAnchor="end"
                       dy={10}
                    />
                    <YAxis 
                       stroke="#cbd5e1" 
                       fontSize={12}
                       tickLine={false}
                       axisLine={false}
                       domain={[0, 10]}
                       ticks={[0, 2, 4, 6, 8, 10]}
                    />
                    <Tooltip 
                       contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                       itemStyle={{ color: '#fda4af', fontWeight: 'bold' }}
                       labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                    />
                    <Area 
                       type="monotone" 
                       dataKey="risk" 
                       name="Risk Level"
                       stroke="#f43f5e" 
                       strokeWidth={3}
                       fillOpacity={1} 
                       fill="url(#colorRisk)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
             )}
          </div>
        </section>
      </main>

      <DashboardFooterNav />
    </div>
  );
};

export default TravelHistory;
