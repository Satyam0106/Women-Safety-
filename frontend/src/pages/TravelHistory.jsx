import { useEffect, useMemo, useState } from "react";
import api from "../api/client";
import DashboardFooterNav from "../components/DashboardFooterNav";

const TravelHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    api.get("/history").then(({ data }) => setHistory(data));
  }, []);

  const maxScore = useMemo(
    () => history.reduce((max, item) => Math.max(max, item.crimeRiskScore || 0), 0) || 100,
    [history]
  );

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
          {history.map((item) => (
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
          ))}
        </section>

        <section className="history-chart card-like">
          <h3>Risk Trend</h3>
          <div className="chart-bars">
            {history.slice(0, 12).map((item) => (
              <div key={item._id} className="bar-wrap">
                <div
                  className="bar"
                  style={{ height: `${Math.max(10, (item.crimeRiskScore / maxScore) * 100)}%` }}
                />
                <span>{item.riskLevel[0]}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <DashboardFooterNav />
    </div>
  );
};

export default TravelHistory;
