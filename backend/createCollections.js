const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const User = require("./src/models/User");
const EmergencyContact = require("./src/models/EmergencyContact");
const Incident = require("./src/models/Incident");
const IncidentLog = require("./src/models/IncidentLog");
const LocationHistory = require("./src/models/LocationHistory");
const TrustedCircle = require("./src/models/TrustedCircle");

async function createCollections() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Connected Successfully.");

    console.log("Forcing creation of collections...");
    await User.createCollection();
    console.log("- Users created");
    await EmergencyContact.createCollection();
    console.log("- EmergencyContacts created");
    await Incident.createCollection();
    console.log("- Incidents created");
    await IncidentLog.createCollection();
    console.log("- IncidentLogs created");
    await LocationHistory.createCollection();
    console.log("- LocationHistories created");
    await TrustedCircle.createCollection();
    console.log("- TrustedCircles created");

    console.log("✅ All collections successfully initialized on Atlas!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

createCollections();
