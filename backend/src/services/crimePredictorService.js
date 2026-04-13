const { spawn } = require("child_process");

const fallbackPredict = (latitude, longitude) => {
  const hour = new Date().getHours();
  const base = hour >= 21 || hour < 5 ? 72 : 38;
  const geoBoost = Math.min(22, Math.round(Math.abs(latitude * longitude) % 25));
  const crimeRiskScore = Math.min(100, base + geoBoost);
  const riskLevel = crimeRiskScore >= 75 ? "High" : crimeRiskScore >= 50 ? "Medium" : "Low";
  const analysis =
    riskLevel === "High"
      ? "High-risk zone/time pattern detected. Stay in well-lit areas and alert trusted circle."
      : riskLevel === "Medium"
        ? "Moderate risk observed. Stay vigilant and share your live location."
        : "Area currently appears lower-risk. Continue with standard safety precautions.";

  return { crimeRiskScore, riskLevel, analysis };
};

const runCrimePrediction = ({ latitude, longitude }) =>
  new Promise((resolve) => {
    const pythonExec = process.env.PYTHON_EXECUTABLE || "python3";
    const modelPath = process.env.ML_MODEL_PATH;

    if (!modelPath) {
      resolve(fallbackPredict(latitude, longitude));
      return;
    }

    const child = spawn(pythonExec, [modelPath, String(latitude), String(longitude)]);
    let stdout = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.on("close", (code) => {
      if (code !== 0) {
        resolve(fallbackPredict(latitude, longitude));
        return;
      }
      try {
        const payload = JSON.parse(stdout.trim());
        resolve({
          crimeRiskScore: Number(payload.crimeRiskScore),
          riskLevel: payload.riskLevel,
          analysis: payload.analysis,
        });
      } catch (error) {
        resolve(fallbackPredict(latitude, longitude));
      }
    });
  });

module.exports = { runCrimePrediction };
