import React, { useState, useEffect, useContext, useRef } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Modal,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  Animated,
  Dimensions,
  TextInput,
} from "react-native";
import { LinearGradient } from 'react-native-linear-gradient';
import * as Location from '../../services/Location';
import { Alert, Image } from "react-native";
import * as ImagePicker from '../../services/ImagePicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const EMPTY_FORM = {
  ward_id: "",
  complaint_type: "",
  description: "",
  latitude: "12.9850",
  longitude: "79.1650",
  address: "15 Temple Street, Kanchipuram",
  landmark: "Near Central Library",
  citizen_note: "",
  priority: "MEDIUM",
};
import { COLORS, FONT_SIZES, SPACING, SHADOWS } from "../../constants/theme";
import authService from "../../services/authService";
import { AuthContext } from "../../context/AuthContext";
import { getErrorMessage } from "../../services/api";
import { resolveImageUri } from "../../utils/imageUri";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const PRIMARY       = "#2563EB";
const PRIMARY_DARK  = "#1D4ED8";
const PRIMARY_LIGHT = "#EFF6FF";
const ERROR         = "#DC2626";
const GRAY_50       = "#F9FAFB";
const GRAY_100      = "#F3F4F6";
const GRAY_200      = "#E5E7EB";
const GRAY_400      = "#9CA3AF";
const GRAY_600      = "#4B5563";
const GRAY_800      = "#1F2937";

const DEFAULT_DISTRICT_ID = "6a156a1258884d22663b2a06";

const COMPLAINT_TYPES = [
  { value: "garbage_waste",      label: "Garbage / Waste",      icon: "trash-can-outline",   color: "#0891B2" },
  { value: "road_damage",        label: "Road Damage",          icon: "road-variant",         color: "#DC2626" },
  { value: "pothole",            label: "Pothole",              icon: "road-variant",         color: "#DC2626" },
  { value: "street_light",       label: "Street Light",         icon: "lightbulb-on-outline", color: "#D97706" },
  { value: "drainage_issue",     label: "Drainage Issue",       icon: "pipe-disconnected",    color: "#0891B2" },
  { value: "road_waterlogging",   label: "Road Waterlogging",    icon: "water-outline",        color: "#0052CC" },
  { value: "construction_block", label: "Construction Block",   icon: "hammer-wrench",        color: "#D97706" },
];

const PRIORITIES = [
  { value: "LOW",    label: "Low",    color: "#059669", bg: "#D1FAE5", icon: "arrow-down-circle-outline" },
  { value: "MEDIUM", label: "Medium", color: "#D97706", bg: "#FEF3C7", icon: "minus-circle-outline"      },
  { value: "HIGH",   label: "High",   color: "#DC2626", bg: "#FFE4E6", icon: "arrow-up-circle-outline"   },
];

// ─── REUSABLE FIELD ───────────────────────────────────────────────────────────
// Single consistent input pattern used everywhere — icon + TextInput, no nesting tricks
const Field = ({ label, icon, error, children, style }) => (
  <View style={[styles.fieldGroup, style]}>
    {label && <Text style={styles.fieldLabel}>{label}</Text>}
    {children}
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);

const InputField = ({
  label, icon, placeholder, value, onChangeText,
  multiline, numberOfLines, keyboardType, error, editable = true, rightElement, style,
}) => (
  <Field label={label} error={error} style={style}>
    <View style={[
      styles.inputWrap,
      multiline && styles.inputWrapMulti,
      error      && styles.inputError,
      !editable  && styles.inputDisabled,
    ]}>
      <Icon
        name={icon}
        size={16}
        color={value ? PRIMARY : GRAY_400}
        style={multiline ? { marginTop: SPACING.xs } : undefined}
      />
      <TextInput
        style={[styles.textInput, multiline && styles.textInputMulti]}
        placeholder={placeholder}
        placeholderTextColor={GRAY_400}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        numberOfLines={numberOfLines}
        keyboardType={keyboardType}
        editable={editable}
        textAlignVertical={multiline ? "top" : "center"}
        autoCorrect={false}
      />
      {rightElement}
    </View>
  </Field>
);

// ─── SUCCESS MODAL ────────────────────────────────────────────────────────────
const SuccessModal = ({ visible, complaint, onView, onDone }) => {
  const scaleAnim   = useRef(new Animated.Value(0.7)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const checkAnim   = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim,   { toValue: 1, tension: 65, friction: 8, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 220,             useNativeDriver: true }),
      ]).start(() => {
        Animated.spring(checkAnim, { toValue: 1, tension: 80, friction: 6, useNativeDriver: true }).start();
      });
    } else {
      scaleAnim.setValue(0.7);
      opacityAnim.setValue(0);
      checkAnim.setValue(0);
    }
  }, [visible]);

  const complaintId = complaint?.complaint_id || complaint?._id || "—";

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      <Animated.View style={[ss.overlay, { opacity: opacityAnim }]}>
        <Animated.View style={[ss.sheet, { transform: [{ scale: scaleAnim }] }]}>

          <View style={ss.checkCircleOuter}>
            <View style={ss.checkCircleInner}>
              <Animated.View style={{ transform: [{ scale: checkAnim }] }}>
                <Icon name="check-bold" size={38} color="#fff" />
              </Animated.View>
            </View>
            <View style={ss.pulseRing} />
          </View>

          <Text style={ss.successTitle}>Complaint Submitted Successfully</Text>

          <View style={ss.aiAnalysisContainer}>
            <View style={ss.aiHeaderRow}>
              <Text style={ss.aiSectionTitle}>AI Analysis</Text>
              <Text style={ss.verifiedBadge}>✅ Image Verified</Text>
            </View>
            
            {(() => {
              const aiPriorityObj = complaint?.ai_priority || complaint?.ai?.priority_prediction;
              const rawPriority = aiPriorityObj?.priority || complaint?.final_priority || complaint?.priority || "Medium";
              const confidence = aiPriorityObj?.confidence || 0;
              const reason = aiPriorityObj?.reason || "Priority predicted by AI.";
              
              const emojiPriority = String(rawPriority).toUpperCase() === "HIGH" ? "🔴 High" :
                                    String(rawPriority).toUpperCase() === "MEDIUM" ? "🟡 Medium" : "🟢 Low";
              
              return (
                <View style={ss.aiDetails}>
                  <View style={ss.aiFieldBlock}>
                    <Text style={ss.aiFieldLabel}>Priority</Text>
                    <Text style={ss.aiFieldValue}>{emojiPriority}</Text>
                  </View>
                  
                  <View style={ss.aiFieldBlock}>
                    <Text style={ss.aiFieldLabel}>Reason</Text>
                    <Text style={ss.aiFieldValue}>{reason}</Text>
                  </View>
                  
                  <View style={ss.aiFieldBlock}>
                    <Text style={ss.aiFieldLabel}>Confidence</Text>
                    <Text style={ss.aiFieldValue}>{confidence}%</Text>
                  </View>
                </View>
              );
            })()}
          </View>

          <View style={ss.idPill}>
            <Icon name="identifier" size={14} color={PRIMARY} />
            <Text style={ss.idText}>Complaint ID: {complaintId}</Text>
          </View>

          <View style={ss.actionRow}>
            <TouchableOpacity style={ss.btnSecondary} onPress={onDone} activeOpacity={0.8}>
              <Text style={ss.btnSecondaryText}>Done</Text>
            </TouchableOpacity>
            <TouchableOpacity style={ss.btnPrimary} onPress={onView} activeOpacity={0.85}>
              <Icon name="eye-outline" size={16} color="#fff" />
              <Text style={ss.btnPrimaryText}>View Complaint</Text>
            </TouchableOpacity>
          </View>

        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

// ─── DROPDOWN ─────────────────────────────────────────────────────────────────
const Dropdown = ({ label, placeholder, value, items, onSelect, error, renderItem, keyExtractor, loading: dropLoading }) => {
  const [open, setOpen] = useState(false);
  const selected = items.find((i) => (i.value ?? i._id ?? i) === value);

  return (
    <Field label={label} error={error}>
      <TouchableOpacity
        onPress={() => !dropLoading && setOpen(true)}
        activeOpacity={0.78}
        style={[styles.inputWrap, error && styles.inputError, open && styles.inputFocused]}
      >
        {dropLoading ? (
          <ActivityIndicator size="small" color={PRIMARY} />
        ) : selected?.icon ? (
          <View style={[styles.dropIconWrap, { backgroundColor: (selected.color || PRIMARY) + "18" }]}>
            <Icon name={selected.icon} size={15} color={selected.color ?? PRIMARY} />
          </View>
        ) : (
          <View style={styles.dropIconWrap}>
            <Icon name="format-list-bulleted" size={15} color={GRAY_400} />
          </View>
        )}
        <Text style={[styles.textInput, !selected && { color: GRAY_400 }]}>
          {dropLoading
            ? "Loading…"
            : selected ? (selected.label ?? selected.ward_name) : placeholder}
        </Text>
        <Icon name={open ? "chevron-up" : "chevron-down"} size={18} color={GRAY_400} />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setOpen(false)}>
          <View style={styles.dropSheet}>
            <View style={styles.dropHandle} />
            <Text style={styles.dropSheetTitle}>{label}</Text>
            <FlatList
              data={items}
              keyExtractor={keyExtractor ?? ((item, i) => item._id ?? item.value ?? String(i))}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={styles.dropSep} />}
              renderItem={({ item }) => {
                const isSel = (item.value ?? item._id ?? item) === value;
                return renderItem
                  ? renderItem({ item, isSelected: isSel, onSelect: (v) => { onSelect(v); setOpen(false); } })
                  : (
                    <TouchableOpacity
                      onPress={() => { onSelect(item.value ?? item._id ?? item); setOpen(false); }}
                      style={[styles.dropItem, isSel && styles.dropItemActive]}
                    >
                      {item.icon && (
                        <View style={[styles.dropItemIcon, { backgroundColor: (item.color || PRIMARY) + "15" }]}>
                          <Icon name={item.icon} size={17} color={item.color ?? PRIMARY} />
                        </View>
                      )}
                      <Text style={[styles.dropItemText, isSel && styles.dropItemTextActive]}>
                        {item.label ?? item.ward_name ?? item}
                      </Text>
                      {isSel && <Icon name="check-circle" size={18} color={PRIMARY} />}
                    </TouchableOpacity>
                  );
              }}
              ListEmptyComponent={
                <View style={styles.dropEmpty}>
                  <Icon name="database-off-outline" size={28} color={GRAY_400} />
                  <Text style={styles.dropEmptyText}>No options available</Text>
                </View>
              }
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </Field>
  );
};

// ─── SECTION HEADER ───────────────────────────────────────────────────────────
const SectionHeader = ({ icon, title, subtitle }) => (
  <View style={styles.sectionHeader}>
    <View style={styles.sectionIconWrap}>
      <Icon name={icon} size={16} color={PRIMARY} />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {!!subtitle && <Text style={styles.sectionSub}>{subtitle}</Text>}
    </View>
  </View>
);

const FormCard = ({ children }) => <View style={styles.card}>{children}</View>;

// ─── PRIORITY SELECTOR ────────────────────────────────────────────────────────
const PrioritySelector = ({ value, onChange }) => (
  <Field label="Priority">
    <View style={styles.priorityRow}>
      {PRIORITIES.map((p) => {
        const sel = value === p.value;
        return (
          <TouchableOpacity
            key={p.value}
            onPress={() => onChange(p.value)}
            activeOpacity={0.78}
            style={[styles.priorityBtn, sel && { backgroundColor: p.bg, borderColor: p.color }]}
          >
            <Icon name={p.icon} size={16} color={sel ? p.color : GRAY_400} />
            <Text style={[styles.priorityLabel, sel && { color: p.color }]}>{p.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  </Field>
);

// ─── MAIN SCREEN ──────────────────────────────────────────────────────────────
export const CreateComplaintScreen = ({ route, navigation }) => {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors]             = useState({});
  const [loading, setLoading]           = useState(false);
  const [serverError, setServerError]   = useState("");
  const [wards, setWards]               = useState([]);
  const [wardsLoading, setWardsLoading] = useState(true);
  const [gpsLoading, setGpsLoading]     = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [successData, setSuccessData]   = useState(null);
  const [districts, setDistricts]       = useState([]);

  const [verifying, setVerifying] = useState(false);
  const [aiVerifiedPayload, setAiVerifiedPayload] = useState(null);
  const [verificationPopup, setVerificationPopup] = useState(null);
  const [aiVerificationError, setAiVerificationError] = useState(null);

  const verifyImage = async (imageUri) => {
    setVerifying(true);
    setVerificationPopup("loading");
    setAiVerificationError(null);
    try {
      console.log("[CreateComplaintScreen] Sending image for verification:", imageUri);
      const result = await authService.verifyImage(imageUri, form.complaint_type);
      console.log("[CreateComplaintScreen] Verification result:", JSON.stringify(result));
      
      setAiVerifiedPayload(result);
      
      if (!result) {
        setAiVerificationError("No verification data received from server.");
        setVerificationPopup("unavailable");
        return;
      }
      
      if (result.is_low_quality) {
        setVerificationPopup("low_quality");
        return;
      }
      
      if (!result.contains_civic_issue) {
        setVerificationPopup("fail");
        return;
      }
      
      // Category Mismatch check
      const formCat = String(form.complaint_type).replace(/_/g, "").toLowerCase();
      const aiCat = String(result.predicted_category).replace(/_/g, "").toLowerCase();
      
      if (formCat && aiCat && formCat !== aiCat && result.predicted_category !== "OTHER") {
        setVerificationPopup("mismatch");
      } else {
        setVerificationPopup("success");
      }
    } catch (err) {
      console.error("=== IMAGE VERIFICATION ERROR ===");
      console.error("error.message:", err.message);
      console.error("error.code:", err.code);
      if (err.response) {
        console.error("error.response.status:", err.response.status);
        console.error("error.response.data:", JSON.stringify(err.response.data));
      } else {
        console.error("error.response: undefined");
      }
      if (err.request) {
        console.error("error.request: present");
      } else {
        console.error("error.request: undefined");
      }
      console.error("Complete Axios Error Exception:", err);
      console.error("==================================");

      let errMsg = getErrorMessage(err, "AI Verification Unavailable");
      setAiVerificationError(errMsg);
      setVerificationPopup("unavailable");
    } finally {
      setVerifying(false);
    }
  };

  const isSubmitDisabled = () => {
    if (verifying) return true;
    if (selectedImages.length > 0) {
      if (!aiVerifiedPayload) return true;
      if (!aiVerifiedPayload.contains_civic_issue || aiVerifiedPayload.is_low_quality) return true;
    }
    return false;
  };

  useEffect(() => {
    const loadDistricts = async () => {
      try {
        const res = await authService.getDistricts();
        const list = Array.isArray(res) ? res : res?.data || [];
        setDistricts(list);
      } catch (err) {
        console.error("Failed to load districts", err);
      }
    };
    loadDistricts();
  }, []);

  const selectedDistrictName = districts.find(
    (d) => d._id === (user?.district_id ?? user?.district) || d.name === (user?.district_id ?? user?.district)
  )?.name ?? user?.district_name ?? (user?.district && !/^[0-9a-fA-F]{24}$/.test(user.district) ? user.district : "");

  useEffect(() => { setForm(EMPTY_FORM); }, []);

  useEffect(() => {
    fetchWards();
  }, [user?.district_id, user?.district]);

  const fetchWards = async () => {
    setWardsLoading(true);
    try {
      const districtId = user?.district_id ?? user?.district;
      if (!districtId) {
        setWards([]);
        setWardsLoading(false);
        return;
      }
      const res = await authService.getWardsByDistrict(districtId, { limit: 200 });
      const list = Array.isArray(res) ? res : res?.data || [];
      setWards(list);
    } catch (err) {
      console.error("[CreateComplaintScreen] fetchWards error:", err);
      setWards([]);
    } finally {
      setWardsLoading(false);
    }
  };

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // ── GPS — no manual fallback ──
  const handleGetLocation = async () => {
    if (gpsLoading) return;
    setGpsLoading(true);
    try {
      const perm = await Location.requestForegroundPermissionsAsync();
      if (perm.status !== 'granted') {
        Alert.alert("Permission Denied", "Location permission denied. Please allow location access in your device settings to proceed.");
        setGpsLoading(false);
        return;
      }

      let loc = await Location.getLastKnownPositionAsync().catch(() => null);
      if (!loc || !loc.coords) {
        loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High }).catch((err) => {
          console.log("DEBUG: Location fetch error:", err);
          return null;
        });
      }

      if (!loc || !loc.coords || !loc.coords.latitude || !loc.coords.longitude) {
        Alert.alert(
          "Location Unavailable",
          "Could not retrieve your GPS location. Please ensure location services / GPS are enabled on your device and try again."
        );
        setGpsLoading(false);
        return;
      }

      const latitude = loc.coords.latitude;
      const longitude = loc.coords.longitude;
      console.log("DEBUG: Authenticated GPS coordinates:", { latitude, longitude });

      updateField("latitude",  String(latitude.toFixed(6)));
      updateField("longitude", String(longitude.toFixed(6)));
      if (errors.location) setErrors((prev) => ({ ...prev, location: "" }));

      // Reverse geocode → autofill address
      let finalAddress = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
      try {
        const deduplicateAddress = (addressStr) => {
          if (!addressStr) return "";
          const rawParts = addressStr.split(",");
          const cleanedParts = [];
          const seenNormalized = new Set();
          
          for (const part of rawParts) {
            const trimmed = part.trim();
            if (!trimmed) continue;
            if (trimmed.toLowerCase() === "india") continue;
            
            let normalized = trimmed.toLowerCase();
            normalized = normalized.replace(/\b(district|municipality|taluk|state|city|town|village|county)\b/g, "");
            normalized = normalized.replace(/\s+/g, "").trim();
            
            if (!normalized) continue;
            
            let isDuplicate = false;
            for (const seen of seenNormalized) {
              if (seen.includes(normalized) || normalized.includes(seen) ||
                  (normalized.substring(0, 5) === seen.substring(0, 5))) {
                isDuplicate = true;
                break;
              }
            }
            
            if (!isDuplicate) {
              seenNormalized.add(normalized);
              cleanedParts.push(trimmed);
            }
          }
          
          if (cleanedParts.length >= 2) {
            const last = cleanedParts[cleanedParts.length - 1];
            const prev = cleanedParts[cleanedParts.length - 2];
            const isPostalCode = /^\d{6}$/.test(last);
            if (isPostalCode) {
              cleanedParts.splice(cleanedParts.length - 2, 2, `${prev} ${last}`);
            }
          }
          
          return cleanedParts.join(", ");
        };

        const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });
        console.log("DEBUG: Address response:", place);
        if (place && Object.keys(place).length > 0) {
          let formatted = "";
          
          if (place.formattedAddress) {
            formatted = deduplicateAddress(place.formattedAddress);
          }
          
          if (!formatted || formatted.split(",").length < 3) {
            const parts = [];
            let streetPart = [];
            if (place.houseNumber) streetPart.push(place.houseNumber);
            if (place.building) streetPart.push(place.building);
            if (place.street) streetPart.push(place.street);
            if (streetPart.length > 0) parts.push(streetPart.join(" "));
            
            if (place.locality) parts.push(place.locality);
            if (place.ward) parts.push(place.ward);
            
            if (place.city) {
              parts.push(place.city);
            } else if (place.district) {
              parts.push(place.district);
            }
            
            let regionPart = [];
            if (place.region) regionPart.push(place.region);
            if (place.postalCode) regionPart.push(place.postalCode);
            if (regionPart.length > 0) parts.push(regionPart.join(" "));
            
            const builtAddress = parts.length > 0 ? parts.join(", ") : "";
            formatted = deduplicateAddress(builtAddress);
          }
          
          if (formatted) {
            finalAddress = formatted;
          }
        }
      } catch (error) {
        console.error("Geocoding failed", error);
      }

      updateField("address", finalAddress);
    } catch (error) {
      console.log("DEBUG: Location error in CreateComplaintScreen:", error);
      Alert.alert("Location Error", "Could not get your location. Please ensure location services are turned on.");
    } finally {
      setGpsLoading(false);
    }
  };

  const validate = () => {
    const next = {};
    if (!form.ward_id)                          next.ward_id        = "Please select a ward";
    if (!form.complaint_type)                   next.complaint_type = "Please select a complaint type";
    if (form.description.trim().length < 10)    next.description    = "Description must be at least 10 characters";
    if (!form.latitude || !form.longitude) {
      Alert.alert("Location Required", "Please tap 'Use my current location' to fetch GPS coordinates.");
      return false;
    }
    if (!form.address || !form.address.trim())  next.address        = "Address is required";
    if (!form.landmark || !form.landmark.trim()) next.landmark       = "Landmark / Door No. is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const pickImages = async () => {
    if (selectedImages.length >= 5) {
      Alert.alert("Limit reached", "You can attach up to 5 photos.");
      return;
    }

    try {
      const permission = await ImagePicker.getMediaLibraryPermissionsAsync();
      let status = permission.status;

      if (!permission.granted) {
        const request = await ImagePicker.requestMediaLibraryPermissionsAsync();
        status = request.status;
      }

      if (status !== "granted") {
        Alert.alert("Permission needed", "Please allow access to your photo library to attach images.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        quality: 0.9,
      });

      if (result.canceled) return;

      const asset = result.assets?.[0];
      if (!asset) return;

      const picked = {
        uri: asset.uri,
        name: asset.fileName || `photo-${Date.now()}.jpg`,
        type: (asset.type === 'image' ? 'image/jpeg' : asset.type) || 'image/jpeg',
      };

      setSelectedImages([picked]);
      verifyImage(picked.uri);
    } catch (error) {
      console.log("[CreateComplaintScreen] pickImages error", error);
      Alert.alert("Gallery error", "Unable to open the photo library right now. Please try again.");
    }
  };

  const uploadImagesToServer = async () => {
    if (selectedImages.length === 0) return [];

    setUploadingImages(true);
    try {
      const encodedImages = [];
      for (const image of selectedImages) {
        try {
          const response = await fetch(image.uri);
          const blob = await response.blob();
          const base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
          encodedImages.push(base64);
        } catch (innerError) {
          console.log("[CreateComplaintScreen] base64 conversion error", innerError);
          throw innerError;
        }
      }

      return encodedImages;
    } catch (error) {
      console.log("[CreateComplaintScreen] uploadImagesToServer error", error);
      Alert.alert("Upload failed", "The image data could not be prepared for submission. Please try again.");
      throw error;
    } finally {
      setUploadingImages(false);
    }
  };

  const submit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      const nextForm = { 
        ...form, 
        images: selectedImages,
        ai_verification: aiVerifiedPayload ? JSON.stringify(aiVerifiedPayload) : null 
      };

      navigation.navigate("ComplaintPreview", {
        form: nextForm,
        ward: wardItems.find((w) => w.value === form.ward_id),
        districtName: selectedDistrictName,
        selectedType,
        selectedPri,
      });
    } catch {
      setServerError("Unable to proceed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const wardItems = wards.map((w) => {
    const idVal = w._id && typeof w._id === 'object' ? w._id.$oid ?? String(w._id) : w._id;
    return {
      ...w,
      value: String(idVal ?? w.ward_id),
      label: w.display_name ?? w.label ?? w.ward_name ?? w.name ?? idVal,
    };
  }).sort((a, b) => {
    const numA = parseInt(a.ward_number, 10);
    const numB = parseInt(b.ward_number, 10);
    if (!isNaN(numA) && !isNaN(numB)) {
      return numA - numB;
    }
    return a.label.localeCompare(b.label, undefined, { numeric: true, sensitivity: 'base' });
  });

  const selectedType = COMPLAINT_TYPES.find((t) => t.value === form.complaint_type);
  const selectedPri  = PRIORITIES.find((p) => p.value === form.priority);

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="light-content" backgroundColor={PRIMARY} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.flex}>

        {/* ── Header ── */}
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Raise a Complaint</Text>
            <Text style={styles.headerSub}>Help us fix your community</Text>
          </View>
          <View style={styles.headerIconWrap}>
            <Icon name="clipboard-plus-outline" size={20} color="#fff" />
          </View>
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          {/* ── Section 1: What's the issue ── */}
          <FormCard>
            <SectionHeader icon="alert-circle-outline" title="What's the issue?" subtitle="Type & description" />

            <Dropdown
              label="Complaint Type"
              placeholder="Select a category"
              value={form.complaint_type}
              items={COMPLAINT_TYPES}
              onSelect={(v) => updateField("complaint_type", v)}
              error={errors.complaint_type}
            />

            <InputField
              label="Description"
              icon="text-box-outline"
              placeholder="Describe the issue clearly (min 10 characters)"
              value={form.description}
              onChangeText={(v) => updateField("description", v)}
              multiline
              numberOfLines={4}
              error={errors.description}
            />
          </FormCard>

          {/* ── Section 2: Where is it ── */}
          <FormCard>
            <SectionHeader icon="map-marker-radius" title="Where is it?" subtitle="Ward, address & GPS location" />

            <InputField
              label="District"
              icon="map-outline"
              placeholder="District"
              value={selectedDistrictName}
              editable={false}
            />



            <Dropdown
              label="Ward"
              placeholder={wardsLoading ? "Loading wards…" : "Select your ward"}
              value={form.ward_id}
              items={wardItems}
              loading={wardsLoading}
              onSelect={(v) => updateField("ward_id", v)}
              error={errors.ward_id}
              keyExtractor={(item) => item._id ?? item.ward_id ?? item.value}
              renderItem={({ item, isSelected, onSelect }) => (
                <TouchableOpacity
                  onPress={() => onSelect(item.value)}
                  style={[styles.dropItem, isSelected && styles.dropItemActive]}
                >
                  <View style={[styles.dropItemIcon, { backgroundColor: PRIMARY + "12" }]}>
                    <Icon name="map-marker-outline" size={16} color={PRIMARY} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.dropItemText, isSelected && styles.dropItemTextActive]}>{item.label}</Text>
                    {item.zone && <Text style={styles.dropItemSub}>{item.zone}</Text>}
                  </View>
                  {isSelected && <Icon name="check-circle" size={17} color={PRIMARY} />}
                </TouchableOpacity>
              )}
            />

            {/* GPS button */}
            <TouchableOpacity
              style={[styles.gpsBtn, gpsLoading && styles.gpsBtnLoading]}
              onPress={handleGetLocation}
              disabled={gpsLoading}
              activeOpacity={0.8}
            >
              {gpsLoading
                ? <ActivityIndicator size="small" color={PRIMARY} />
                : <Icon name="crosshairs-gps" size={18} color={PRIMARY} />
              }
              <Text style={styles.gpsBtnText}>
                {gpsLoading ? "Getting location…" : "Use my current location"}
              </Text>
            </TouchableOpacity>

            {/* GPS filled pill — shows coords, tap × to clear */}
            {(form.latitude || form.longitude) && (
              <View style={styles.gpsFilled}>
                <Icon name="map-marker-check-outline" size={16} color="#059669" />
                <Text style={styles.gpsFilledText} numberOfLines={1}>
                  {form.latitude}, {form.longitude}
                </Text>
                <TouchableOpacity onPress={() => {
                  updateField("latitude", "");
                  updateField("longitude", "");
                }}>
                  <Icon name="close-circle-outline" size={18} color={GRAY_400} />
                </TouchableOpacity>
              </View>
            )}

            {/* Address — autofilled by GPS, still editable */}
            <InputField
              label="Address"
              icon="map-marker-radius-outline"
              placeholder="Address will be auto-filled by GPS"
              value={form.address}
              onChangeText={(v) => updateField("address", v)}
              error={errors.address}
            />

            {/* Landmark / Door No. — required */}
            <InputField
              label="Landmark / Door No."
              icon="home-map-marker"
              placeholder="Example: Near Government School, No. 64/13 Rayan Kuttai Street"
              value={form.landmark}
              onChangeText={(v) => updateField("landmark", v)}
              error={errors.landmark}
            />
          </FormCard>

          {/* ── Section 3: Additional info ── */}
          <FormCard>
            <SectionHeader icon="note-text-outline" title="Additional info" subtitle="Optional — any extra context" />
            <InputField
              label="Citizen Note"
              icon="note-edit-outline"
              placeholder="Anything else we should know?"
              value={form.citizen_note}
              onChangeText={(v) => updateField("citizen_note", v)}
              multiline
              numberOfLines={3}
            />

            <TouchableOpacity
              style={styles.uploadBtn}
              onPress={pickImages}
              disabled={uploadingImages || selectedImages.length >= 5}
              activeOpacity={0.8}
            >
              {uploadingImages ? (
                <ActivityIndicator size="small" color={PRIMARY} />
              ) : (
                <Icon name="image-multiple-outline" size={18} color={PRIMARY} />
              )}
              <Text style={styles.uploadBtnText}>
                {uploadingImages ? "Uploading…" : selectedImages.length > 0 ? `Add more photos (${selectedImages.length}/5)` : "Upload photos from gallery"}
              </Text>
            </TouchableOpacity>

            {selectedImages.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
                {selectedImages.map((image, index) => (
                  <View key={`${image.name}-${index}`} style={styles.imagePreviewWrap}>
                    <Image source={{ uri: image.uri }} style={styles.imagePreview} />
                    <TouchableOpacity
                      style={styles.removeImageBtn}
                      onPress={() => {
                        setSelectedImages([]);
                        setAiVerifiedPayload(null);
                      }}
                    >
                      <Icon name="close" size={12} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}
          </FormCard>

          {/* ── Summary preview ── */}
          {(form.complaint_type || form.ward_id) && (
            <View style={styles.summaryCard}>
              {selectedType && (
                <View style={[styles.summaryIconWrap, { backgroundColor: selectedType.color + "18" }]}>
                  <Icon name={selectedType.icon} size={20} color={selectedType.color} />
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.summaryReadyLabel}>Ready to submit</Text>
                <Text style={styles.summaryTitle} numberOfLines={1}>
                  {selectedType?.label ?? "—"}
                  {form.ward_id ? `  ·  ${wardItems.find((w) => w.value === form.ward_id)?.label ?? "Ward"}` : ""}
                </Text>
              </View>
            </View>
          )}

          {/* ── Server error ── */}
          {!!serverError && (
            <View style={styles.serverErrorBox}>
              <Icon name="alert-circle-outline" size={18} color={ERROR} />
              <Text style={styles.serverErrorText}>{serverError}</Text>
            </View>
          )}

          {/* ── Submit ── */}
          <TouchableOpacity
            onPress={submit} disabled={loading || isSubmitDisabled()}
            activeOpacity={0.85} style={[styles.submitWrap, (loading || isSubmitDisabled()) && { opacity: 0.6 }]}
          >
            <LinearGradient
              colors={[PRIMARY, PRIMARY_DARK]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.submitBtn}
            >
              <Text style={styles.submitText}>Preview & Submit</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={!!verificationPopup} transparent animationType="fade" statusBarTranslucent>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center", padding: 20 }}>
          <View style={{ backgroundColor: "#fff", borderRadius: 24, padding: 24, width: "100%", maxWidth: 340, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 6 }}>
            
            {verificationPopup === "loading" && (
              <View style={{ alignItems: "center", paddingVertical: 20 }}>
                <ActivityIndicator size="large" color={PRIMARY} style={{ marginBottom: 20 }} />
                <Text style={{ fontSize: 18, fontWeight: "900", color: "#1F2937", textAlign: "center" }}>🤖 Verifying uploaded image...</Text>
                <Text style={{ fontSize: 13, color: "#6B7280", marginTop: 8, textAlign: "center" }}>AI is verifying your image...</Text>
              </View>
            )}

            {verificationPopup === "success" && aiVerifiedPayload && (
              <View style={{ alignItems: "center" }}>
                <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: "#ECFDF5", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <Icon name="check-circle" size={32} color="#059669" />
                </View>
                <Text style={{ fontSize: 20, fontWeight: "900", color: "#1F2937", marginBottom: 6 }}>✅ Image Verified</Text>
                <Text style={{ fontSize: 13, color: "#6B7280", textAlign: "center", marginBottom: 16 }}>
                  AI has successfully verified this image as a valid civic issue.
                </Text>
                <View style={{ width: "100%", backgroundColor: "#F9FAFB", borderRadius: 16, padding: 12, borderWidth: 1, borderColor: "#E5E7EB", marginBottom: 20 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: "#E5E7EB" }}>
                    <Text style={{ fontWeight: "700", color: "#6B7280", fontSize: 12 }}>Detected Category:</Text>
                    <Text style={{ fontWeight: "900", color: "#1F2937", fontSize: 12, textTransform: "capitalize" }}>
                      {String(aiVerifiedPayload.predicted_category).replace(/_/g, " ").toLowerCase()}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 }}>
                    <Text style={{ fontWeight: "700", color: "#6B7280", fontSize: 12 }}>Confidence:</Text>
                    <Text style={{ fontWeight: "900", color: "#1F2937", fontSize: 12 }}>
                      {(() => {
                        const conf = aiVerifiedPayload.confidence;
                        return conf <= 1.0 ? `${Math.round(conf * 100)}%` : `${conf}%`;
                      })()}
                    </Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", gap: 10, width: "100%" }}>
                  <TouchableOpacity
                    style={{ flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: "#F3F4F6", alignItems: "center" }}
                    onPress={() => {
                      setSelectedImages([]);
                      setAiVerifiedPayload(null);
                      setVerificationPopup(null);
                    }}
                  >
                    <Text style={{ fontWeight: "700", color: "#4B5563", fontSize: 13 }}>Upload Another</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: PRIMARY, alignItems: "center" }}
                    onPress={() => setVerificationPopup(null)}
                  >
                    <Text style={{ fontWeight: "700", color: "#fff", fontSize: 13 }}>Continue</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {verificationPopup === "fail" && aiVerifiedPayload && (
              <View style={{ alignItems: "center" }}>
                <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: "#FEF2F2", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <Icon name="alert-triangle" size={32} color="#DC2626" />
                </View>
                <Text style={{ fontSize: 18, fontWeight: "900", color: "#1F2937", marginBottom: 6, textAlign: "center" }}>⚠ Image Verification Failed</Text>
                <Text style={{ fontSize: 13, color: "#6B7280", textAlign: "center", marginBottom: 12 }}>
                  The uploaded image does not appear to contain a civic issue.
                </Text>
                <View style={{ width: "100%", backgroundColor: "#FEF2F2", borderRadius: 12, padding: 10, borderWidth: 1, borderColor: "#FCA5A5", marginBottom: 12 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ fontWeight: "700", color: "#DC2626", fontSize: 12 }}>AI Detected:</Text>
                    <Text style={{ fontWeight: "900", color: "#DC2626", fontSize: 12, textTransform: "capitalize" }}>
                      {String(aiVerifiedPayload.predicted_category || "Unrelated Object").replace(/_/g, " ").toLowerCase()}
                    </Text>
                  </View>
                </View>
                <Text style={{ fontSize: 11, fontWeight: "800", color: "#6B7280", alignSelf: "flex-start", textTransform: "uppercase", marginBottom: 6 }}>
                  Please upload a civic issue:
                </Text>
                <View style={{ width: "100%", flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
                  {["Garbage", "Road Pothole", "Water Leakage", "Drainage Block", "Broken Light", "Damaged Park", "Illegal Dumping"].map(item => (
                    <Text key={item} style={{ backgroundColor: "#F3F4F6", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, fontSize: 10, fontWeight: "700", color: "#4B5563" }}>{item}</Text>
                  ))}
                </View>
                <TouchableOpacity
                  style={{ width: "100%", paddingVertical: 12, borderRadius: 10, backgroundColor: PRIMARY, alignItems: "center" }}
                  onPress={() => {
                    setSelectedImages([]);
                    setAiVerifiedPayload(null);
                    setVerificationPopup(null);
                  }}
                >
                  <Text style={{ fontWeight: "700", color: "#fff", fontSize: 13 }}>Upload Another Image</Text>
                </TouchableOpacity>
              </View>
            )}

            {verificationPopup === "low_quality" && (
              <View style={{ alignItems: "center" }}>
                <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: "#FFFBEB", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <Icon name="alert-circle" size={32} color="#F59E0B" />
                </View>
                <Text style={{ fontSize: 18, fontWeight: "900", color: "#1F2937", marginBottom: 6, textAlign: "center" }}>⚠ Image Quality Too Low</Text>
                <Text style={{ fontSize: 13, color: "#6B7280", textAlign: "center", marginBottom: 20 }}>
                  The uploaded image is too blurry or unclear for AI verification. Please upload a clearer image.
                </Text>
                <View style={{ flexDirection: "row", gap: 10, width: "100%" }}>
                  <TouchableOpacity
                    style={{ flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: "#F3F4F6", alignItems: "center" }}
                    onPress={() => {
                      setSelectedImages([]);
                      setAiVerifiedPayload(null);
                      setVerificationPopup(null);
                    }}
                  >
                    <Text style={{ fontWeight: "700", color: "#4B5563", fontSize: 13 }}>Retake Photo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: PRIMARY, alignItems: "center" }}
                    onPress={() => {
                      setSelectedImages([]);
                      setAiVerifiedPayload(null);
                      setVerificationPopup(null);
                    }}
                  >
                    <Text style={{ fontWeight: "700", color: "#fff", fontSize: 13 }}>Choose Another</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {verificationPopup === "mismatch" && aiVerifiedPayload && (
              <View style={{ alignItems: "center" }}>
                <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: "#FFFBEB", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <Icon name="alert-circle-outline" size={32} color="#F59E0B" />
                </View>
                <Text style={{ fontSize: 18, fontWeight: "900", color: "#1F2937", marginBottom: 6 }}>⚠ Category Mismatch</Text>
                <Text style={{ fontSize: 13, color: "#6B7280", textAlign: "center", marginBottom: 12 }}>
                  AI believes this image belongs to:
                </Text>
                <View style={{ backgroundColor: "#FFFBEB", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 12, borderWidth: 1, borderColor: "#FDE68A", marginBottom: 16 }}>
                  <Text style={{ fontSize: 16, fontWeight: "900", color: "#D97706", textTransform: "capitalize" }}>
                    {String(aiVerifiedPayload.predicted_category).replace(/_/g, " ").toLowerCase()}
                  </Text>
                </View>
                <Text style={{ fontSize: 13, fontWeight: "700", color: "#374151", textAlign: "center", marginBottom: 20 }}>
                  Would you like to update the complaint category?
                </Text>
                <View style={{ flexDirection: "row", gap: 10, width: "100%" }}>
                  <TouchableOpacity
                    style={{ flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: "#F3F4F6", alignItems: "center" }}
                    onPress={() => setVerificationPopup(null)}
                  >
                    <Text style={{ fontWeight: "700", color: "#4B5563", fontSize: 13 }}>Keep My Option</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: PRIMARY, alignItems: "center" }}
                    onPress={() => {
                      updateField("complaint_type", aiVerifiedPayload.predicted_category);
                      setVerificationPopup(null);
                    }}
                  >
                    <Text style={{ fontWeight: "700", color: "#fff", fontSize: 13 }}>Use AI Category</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {verificationPopup === "unavailable" && (
              <View style={{ alignItems: "center" }}>
                <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: "#FFFBEB", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <Icon name="alert-circle-outline" size={32} color="#F59E0B" />
                </View>
                <Text style={{ fontSize: 18, fontWeight: "900", color: "#1F2937", marginBottom: 6, textAlign: "center" }}>⚠ AI Verification Unavailable</Text>
                <Text style={{ fontSize: 13, color: "#6B7280", textAlign: "center", marginBottom: 20 }}>
                  {aiVerificationError || "Unable to verify the uploaded image at the moment. Please try again later."}
                </Text>
                <TouchableOpacity
                  style={{ width: "100%", paddingVertical: 12, borderRadius: 10, backgroundColor: PRIMARY, alignItems: "center" }}
                  onPress={() => setVerificationPopup(null)}
                >
                  <Text style={{ fontWeight: "700", color: "#fff", fontSize: 13 }}>Close</Text>
                </TouchableOpacity>
              </View>
            )}

          </View>
        </View>
      </Modal>

      <SuccessModal
        visible={!!successData}
        complaint={successData}
        onView={() => { setSuccessData(null); navigation.replace("ComplaintDetail", { complaint: successData }); }}
        onDone={() => { setSuccessData(null); navigation.goBack(); }}
      />
    </View>
  );
};

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: GRAY_50 },

  headerBar: {
    backgroundColor: PRIMARY, flexDirection: "row", alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 52 : SPACING.lg,
    paddingBottom: SPACING.lg, paddingHorizontal: SPACING.lg, gap: SPACING.md,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center", justifyContent: "center",
  },
  headerCenter: { flex: 1 },
  headerTitle:  { color: "#fff", fontSize: 18, fontWeight: "800", letterSpacing: -0.3 },
  headerSub:    { color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 1 },
  headerIconWrap: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center", justifyContent: "center",
  },

  scroll: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg },

  card: {
    backgroundColor: "#fff", borderRadius: 18, padding: SPACING.lg, marginBottom: SPACING.md,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 10, elevation: 2,
  },

  sectionHeader: { flexDirection: "row", alignItems: "center", gap: SPACING.md, marginBottom: SPACING.lg },
  sectionIconWrap: {
    width: 30, height: 30, borderRadius: 8,
    backgroundColor: PRIMARY_LIGHT, alignItems: "center", justifyContent: "center",
  },
  sectionTitle: { fontSize: 13, fontWeight: "800", color: GRAY_800 },
  sectionSub:   { fontSize: 11, color: GRAY_400, marginTop: 1 },

  // ── The one input pattern used everywhere ──
  fieldGroup: { marginBottom: SPACING.lg },
  fieldLabel: {
    fontSize: 11, fontWeight: "700", color: GRAY_600,
    letterSpacing: 0.6, marginBottom: SPACING.sm, textTransform: "uppercase",
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: GRAY_200,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,       // uniform vertical padding — no minHeight tricks
    gap: SPACING.md,
    backgroundColor: GRAY_50,
  },
  inputWrapMulti: {
    alignItems: "flex-start",  // icon top-aligns with text
    paddingVertical: SPACING.md,
  },
  inputFocused:  { borderColor: PRIMARY, backgroundColor: PRIMARY_LIGHT },
  inputError:    { borderColor: ERROR,   backgroundColor: "#FEF2F2"     },
  inputDisabled: { opacity: 0.55, backgroundColor: GRAY_100             },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: GRAY_800,
    padding: 0,             // remove default TextInput padding — spacing comes from inputWrap
    margin: 0,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  textInputMulti: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  errorText: { color: ERROR, fontSize: 11, marginTop: SPACING.xs, marginLeft: 2 },

  // ── Dropdown ──
  dropIconWrap: {
    width: 28, height: 28, borderRadius: 7,
    backgroundColor: GRAY_100, alignItems: "center", justifyContent: "center",
  },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  dropSheet: {
    backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24,
    maxHeight: SCREEN_HEIGHT * 0.6,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
  },
  dropHandle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: GRAY_200, alignSelf: "center", marginVertical: SPACING.md,
  },
  dropSheetTitle: {
    fontSize: 15, fontWeight: "800", color: GRAY_800,
    paddingHorizontal: SPACING.lg, marginBottom: SPACING.sm,
  },
  dropSep:           { height: 1, backgroundColor: GRAY_100, marginHorizontal: SPACING.lg },
  dropItem:          { flexDirection: "row", alignItems: "center", paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, gap: SPACING.md },
  dropItemActive:    { backgroundColor: PRIMARY_LIGHT },
  dropItemIcon:      { width: 34, height: 34, borderRadius: 9, alignItems: "center", justifyContent: "center" },
  dropItemText:      { flex: 1, fontSize: 14, color: GRAY_800, fontWeight: "500" },
  dropItemTextActive:{ color: PRIMARY, fontWeight: "700" },
  dropItemSub:       { fontSize: 11, color: GRAY_400, marginTop: SPACING.xs },
  dropEmpty:         { alignItems: "center", padding: SPACING.xxl, gap: SPACING.sm },
  dropEmptyText:     { color: GRAY_400, fontSize: 13 },

  // ── Priority ──
  priorityRow: { flexDirection: "row", gap: SPACING.md },
  priorityBtn: {
    flex: 1, borderRadius: 12, paddingVertical: SPACING.md,
    alignItems: "center", justifyContent: "center", gap: SPACING.xs,
    backgroundColor: GRAY_50, borderWidth: 1.5, borderColor: GRAY_200,
  },
  priorityLabel: { fontSize: 12, fontWeight: "700", color: GRAY_400 },

  // ── GPS ──
  gpsBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: SPACING.sm,
    borderWidth: 1.5, borderColor: PRIMARY, borderRadius: 12,
    paddingVertical: SPACING.md, paddingHorizontal: SPACING.md,
    backgroundColor: PRIMARY_LIGHT, marginBottom: SPACING.md,
  },
  gpsBtnLoading: { opacity: 0.7 },
  gpsBtnText:    { color: PRIMARY, fontSize: 13, fontWeight: "700" },
  gpsFilled: {
    flexDirection: "row", alignItems: "center", gap: SPACING.sm,
    backgroundColor: "#ECFDF5", borderRadius: 10,
    paddingVertical: SPACING.md, paddingHorizontal: SPACING.md,
    borderWidth: 1, borderColor: "#A7F3D0", marginBottom: SPACING.md,
  },
  gpsFilledText: { flex: 1, color: "#065F46", fontSize: 12, fontWeight: "600" },

  // ── Media ──
  uploadBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: SPACING.sm,
    borderWidth: 1.5, borderColor: PRIMARY, borderRadius: 12, borderStyle: "dashed",
    paddingVertical: SPACING.md, paddingHorizontal: SPACING.md,
    backgroundColor: PRIMARY_LIGHT, marginBottom: SPACING.md,
  },
  uploadBtnText: { color: PRIMARY, fontSize: 13, fontWeight: "700" },
  imageScroll: { flexDirection: "row", marginTop: SPACING.sm },
  imagePreviewWrap: { marginRight: SPACING.md, position: "relative" },
  imagePreview: { width: 80, height: 80, borderRadius: 8 },
  removeImageBtn: {
    position: "absolute", top: -8, right: -8, width: 24, height: 24,
    borderRadius: 12, backgroundColor: ERROR, alignItems: "center", justifyContent: "center",
    borderWidth: 2, borderColor: "#fff",
  },

  // ── Summary ──
  summaryCard: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: PRIMARY_LIGHT, borderRadius: 14,
    borderWidth: 1, borderColor: "#BFDBFE",
    padding: SPACING.md, marginBottom: SPACING.md, gap: SPACING.md,
  },
  summaryIconWrap:   { width: 40, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  summaryReadyLabel: { fontSize: 10, color: GRAY_400, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },
  summaryTitle:      { fontSize: 13, color: GRAY_800, fontWeight: "700", marginTop: SPACING.xs },
  summaryPriBadge:   { borderRadius: 20, paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs },
  summaryPriText:    { fontSize: 11, fontWeight: "800" },

  // ── Server error ──
  serverErrorBox: {
    flexDirection: "row", alignItems: "center", gap: SPACING.sm,
    backgroundColor: "#FEF2F2", borderRadius: 12, padding: SPACING.md, marginBottom: SPACING.md,
  },
  serverErrorText: { color: ERROR, fontSize: 12, flex: 1, fontWeight: "600" },

  // ── Submit ──
  submitWrap: { borderRadius: 14, overflow: "hidden" },
  submitBtn:  { paddingVertical: SPACING.lg, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: SPACING.sm },
  submitText: { color: "#fff", fontSize: 15, fontWeight: "900", letterSpacing: 0.5 },
});

// ─── SUCCESS MODAL STYLES ─────────────────────────────────────────────────────
const ss = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center", alignItems: "center", paddingHorizontal: SPACING.xl,
  },
  sheet: {
    backgroundColor: "#fff", borderRadius: 28, padding: SPACING.xxl,
    width: "100%", alignItems: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18, shadowRadius: 24, elevation: 12,
  },
  checkCircleOuter:   { marginBottom: SPACING.xl, alignItems: "center", justifyContent: "center" },
  checkCircleInner:   { width: 80, height: 80, borderRadius: 40, backgroundColor: "#059669", alignItems: "center", justifyContent: "center", zIndex: 2 },
  pulseRing:          { position: "absolute", width: 100, height: 100, borderRadius: 50, backgroundColor: "#059669", opacity: 0.15 },
  successTitle:       { fontSize: 22, fontWeight: "900", color: GRAY_800, marginBottom: SPACING.sm, letterSpacing: -0.4, textAlign: "center" },
  successSub:         { fontSize: 14, color: GRAY_600, textAlign: "center", lineHeight: 22, marginBottom: SPACING.lg },
  successHighlight:   { color: PRIMARY, fontWeight: "800" },
  idPill:             { flexDirection: "row", alignItems: "center", gap: SPACING.sm, backgroundColor: PRIMARY_LIGHT, borderRadius: 20, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderWidth: 1, borderColor: "#BFDBFE", marginBottom: SPACING.xl },
  idText:             { color: PRIMARY, fontSize: 12, fontWeight: "700" },
  aiAnalysisContainer: {
    backgroundColor: GRAY_50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: GRAY_200,
    padding: SPACING.md,
    width: "100%",
    marginBottom: SPACING.lg,
    alignSelf: "stretch",
  },
  aiHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: GRAY_200,
    paddingBottom: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  aiSectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: GRAY_600,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  verifiedBadge: {
    fontSize: 11,
    fontWeight: "700",
    color: "#059669",
  },
  aiDetails: {
    gap: SPACING.sm,
  },
  aiFieldBlock: {
    gap: 2,
  },
  aiFieldLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: GRAY_400,
    textTransform: "uppercase",
    letterSpacing: 0.2,
  },
  aiFieldValue: {
    fontSize: 12,
    fontWeight: "600",
    color: GRAY_800,
    lineHeight: 18,
  },
  actionRow:          { flexDirection: "row", gap: SPACING.md, width: "100%" },
  btnSecondary:       { flex: 1, paddingVertical: SPACING.md, borderRadius: 12, borderWidth: 1.5, borderColor: GRAY_200, alignItems: "center", justifyContent: "center" },
  btnSecondaryText:   { color: GRAY_600, fontSize: 14, fontWeight: "700" },
  btnPrimary:         { flex: 2, paddingVertical: SPACING.md, borderRadius: 12, backgroundColor: PRIMARY, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: SPACING.xs },
  btnPrimaryText:     { color: "#fff", fontSize: 14, fontWeight: "800" },
});

export default CreateComplaintScreen;