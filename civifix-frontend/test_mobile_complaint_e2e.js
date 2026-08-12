module.paths.push('/Users/hasinnn/Documents/PDD/civifix-frontend/node_modules');

const fs = require('fs');
const FormData = require('form-data');
const testData = JSON.parse(fs.readFileSync('/Users/hasinnn/Documents/PDD/civifix-frontend/scratch_token.json', 'utf8'));

// Register mock modules before loading source files
const mockStorage = {
  getItem: async (key) => {
    if (key === "authToken") return testData.access_token;
    return null;
  },
  setItem: async () => {},
  removeItem: async () => {}
};

require('module').prototype.require = (function(orig) {
  return function(name) {
    if (name === '@react-native-async-storage/async-storage') {
      return mockStorage;
    }
    if (name === '@react-native-community/netinfo') {
      return {
        fetch: async () => ({ isInternetReachable: true, type: 'wifi' })
      };
    }
    if (name === 'react-native') {
      return {
        Platform: { OS: 'ios' },
        DeviceEventEmitter: { emit: () => {} }
      };
    }
    if (name === 'react-native-device-info') {
      return {
        isEmulatorSync: () => false
      };
    }
    if (name === 'react-native-config') {
      return {};
    }
    return orig.apply(this, arguments);
  };
})(require('module').prototype.require);

// Babel register to support ES imports
const babelRegister = require('@babel/register');
const register = babelRegister.default || babelRegister;
register({
  presets: ['@babel/preset-env'],
  plugins: ['@babel/plugin-transform-modules-commonjs'],
  only: [
    '/Users/hasinnn/Documents/PDD/civifix-frontend/src'
  ],
  configFile: false
});

// Import endpoints and authService using absolute paths
const { authService } = require('/Users/hasinnn/Documents/PDD/civifix-frontend/src/services/authService');
const apiModule = require('/Users/hasinnn/Documents/PDD/civifix-frontend/src/services/api');
const api = apiModule.default || apiModule;
const { getErrorMessage } = apiModule;
const { ENDPOINTS } = require('/Users/hasinnn/Documents/PDD/civifix-frontend/src/constants/endpoints');

async function run() {
  console.log("=== STARTING MOBILE COMPLAINT E2E FLOW ===");
  console.log("Access Token loaded:", testData.access_token.substring(0, 20) + "...");
  console.log("Ward ID loaded:", testData.ward_id);
  console.log("Ward Name loaded:", testData.ward_name);
  console.log("District ID loaded:", testData.district_id);

  // 1. Call verifyImage
  console.log("\n--- STEP 1: Calling verifyImage ---");
  const localImageUri = "/Users/hasinnn/Documents/PDD/Backend/real_test_garbage.jpg";
  let verifyResult = null;
  
  // Create FormData using npm form-data package
  const verifyForm = new FormData();
  verifyForm.append("image", fs.createReadStream(localImageUri), {
    filename: "complaint.jpg",
    contentType: "image/jpeg"
  });

  try {
    const response = await api.post(ENDPOINTS.VERIFY_IMAGE, verifyForm, {
      timeout: 180000,
      headers: {
        Accept: "application/json",
        ...verifyForm.getHeaders()
      }
    });
    
    // unwrapResponse extracts response.data.data or response.data
    verifyResult = response.data.data || response.data;
    
    console.log("Image Verification Result status is SUCCESS!");
    console.log("Verification Response:", JSON.stringify(verifyResult));
  } catch (err) {
    console.error("=== IMAGE VERIFICATION FAILED ===");
    console.error("Message:", err.message);
    if (err.response) {
      console.error("Response Status:", err.response.status);
      console.error("Response Data:", JSON.stringify(err.response.data));
    }
    return;
  }

  // 2. Call createComplaint
  console.log("\n--- STEP 2: Calling createComplaint ---");
  const createForm = new FormData();
  createForm.append("ward_id", testData.ward_id);
  createForm.append("wardId", testData.ward_id);
  createForm.append("ward_name", testData.ward_name);
  createForm.append("wardName", testData.ward_name);
  createForm.append("district_id", testData.district_id);
  createForm.append("districtId", testData.district_id);
  createForm.append("district_name", "Kanchipuram");
  createForm.append("districtName", "Kanchipuram");
  
  createForm.append("complaint_type", "garbage_waste");
  createForm.append("description", "Piles of plastic garbage on the roadside.");
  createForm.append("priority", "MEDIUM");
  createForm.append("latitude", "12.9716");
  createForm.append("longitude", "79.1588");
  createForm.append("address", "Gandhi Road, Kanchipuram");
  createForm.append("landmark", "Near Central Library");
  createForm.append("citizen_note", "Please clear this up quickly.");
  
  if (verifyResult) {
    createForm.append("ai_verification", JSON.stringify(verifyResult));
  }

  // Add the image file
  createForm.append("images", fs.createReadStream(localImageUri), {
    filename: "complaint.jpg",
    contentType: "image/jpeg"
  });

  try {
    const response = await api.post(ENDPOINTS.CREATE_COMPLAINT, createForm, {
      timeout: 180000,
      headers: {
        Accept: "application/json",
        ...createForm.getHeaders()
      }
    });
    const complaintResult = response.data.data || response.data;
    
    console.log("\n=== COMPLAINT CREATED SUCCESSFULLY! ===");
    console.log("Complaint Response:", JSON.stringify(complaintResult));
  } catch (err) {
    console.error("=== COMPLAINT CREATION FAILED ===");
    console.error("Message:", err.message);
    if (err.response) {
      console.error("Response Status:", err.response.status);
      console.error("Response Data:", JSON.stringify(err.response.data));
    }
  }
}

run().catch(console.error);
