
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  Dimensions,
  TextInput,
  Image,
  Modal,
  KeyboardAvoidingView,
} from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import authService from "../../services/authService";
import { getErrorMessage } from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { SPACING, FONT_SIZES, COLORS, BORDER_RADIUS, SHADOWS } from "../../constants/theme";

let districtsCache = null;
let districtsPromise = null;

const getDistrictsCached = () => {
  if (districtsCache) return Promise.resolve(districtsCache);
  if (!districtsPromise) {
    districtsPromise = authService.getDistricts()
      .then(res => {
        districtsCache = Array.isArray(res) ? res : res?.data || [];
        return districtsCache;
      })
      .catch(err => {
        console.warn("Failed to load districts cache in ComplaintDetailScreen:", err);
        districtsPromise = null; // retry
        return [];
      });
  }
  return districtsPromise;
};

const wardsCache = {};
const wardsPromises = {};

const getWardsCached = (districtId) => {
  if (!districtId) return Promise.resolve([]);
  if (wardsCache[districtId]) return Promise.resolve(wardsCache[districtId]);
  if (!wardsPromises[districtId]) {
    wardsPromises[districtId] = authService.getWardsByDistrict(districtId)
      .then(res => {
        wardsCache[districtId] = Array.isArray(res) ? res : res?.data || [];
        return wardsCache[districtId];
      })
      .catch(err => {
        console.warn(`Failed to load wards cache for district ${districtId} in ComplaintDetailScreen:`, err);
        wardsPromises[districtId] = null; // retry
        return [];
      });
  }
  return wardsPromises[districtId];
};

const getCleanDistrict = (c) => {
  if (!c) return "Not Available";
  const val = c.districtName || c.district_name || c.district?.name || c.district;
  if (typeof val === "string" && val.trim() && !/^[0-9a-fA-F]{24}$/.test(val)) return val;
  return "Not Available";
};

const getCleanWard = (c) => {
  if (!c) return "Not Available";
  const val = c.wardName || c.ward_name || c.ward?.ward_name || c.ward?.name || c.ward;
  if (typeof val === "string" && val.trim() && !/^[0-9a-fA-F]{24}$/.test(val)) return val;
  if (c.ward && typeof c.ward === "object") {
    return c.ward.ward_name || c.ward.name || (c.ward.ward_number != null ? `Ward #${c.ward.ward_number}` : "Not Available");
  }
  return "Not Available";
};

const getCleanId = (c) => {
  if (!c) return "Not Available";
  return c.complaint_id || c.complaintId || (c._id && !/^[0-9a-fA-F]{24}$/.test(c._id) ? c._id : "Not Available");
};
import * as ImagePicker from '../../services/ImagePicker';

import { API_URL } from "../../constants/endpoints";
import { resolveImageUri } from "../../utils/imageUri";
import { getComplaintStatusMeta, normalizeComplaintStatus } from "../../utils/status";
import { ImageViewer } from "../../components";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

/* ── Design tokens ── */
const PRIMARY       = "#2563EB";
const PRIMARY_LIGHT = "#EFF6FF";
const GRAY_50       = "#F9FAFB";
const GRAY_100      = "#F3F4F6";
const GRAY_200      = "#E5E7EB";
const GRAY_400      = "#9CA3AF";
const GRAY_500      = "#6B7280";
const GRAY_600      = "#4B5563";
const GRAY_800      = "#1F2937";
const ERROR         = "#DC2626";

/* ── Status config ── */
const STATUS_CONFIG = {
  pending:     { color: "#D97706", bg: "#FFFBEB", border: "#FDE68A", icon: "clock-outline",           label: "Pending"     },
  open:        { color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE", icon: "folder-open-outline",     label: "Open"        },
  assigned:    { color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE", icon: "account-hard-hat-outline", label: "Assigned"   },
  in_progress: { color: "#0891B2", bg: "#ECFEFF", border: "#A5F3FC", icon: "progress-wrench",         label: "In Progress" },
  resolved:    { color: "#059669", bg: "#ECFDF5", border: "#A7F3D0", icon: "check-circle-outline",    label: "Resolved"    },
  closed:      { color: "#6B7280", bg: "#F3F4F6", border: "#E5E7EB", icon: "archive-outline",         label: "Closed"      },
  rejected:    { color: "#DC2626", bg: "#FEF2F2", border: "#FECACA", icon: "close-circle-outline",    label: "Rejected"    },
};

const PRIORITY_CONFIG = {
  low:      { color: "#059669", bg: "#ECFDF5", icon: "arrow-down-circle-outline" },
  medium:   { color: "#D97706", bg: "#FFFBEB", icon: "minus-circle-outline"      },
  high:     { color: "#DC2626", bg: "#FEF2F2", icon: "arrow-up-circle-outline"   },
  critical: { color: "#7C2D12", bg: "#FFF7ED", icon: "alert-circle-outline"      },
};

function getStatus(key) {
  return getComplaintStatusMeta(key);
}
function getPriority(key) {
  return PRIORITY_CONFIG[(key || "").toLowerCase()] || PRIORITY_CONFIG.medium;
}

/* ── Helpers ── */
function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) +
    "  " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

function humaniseType(type) {
  if (!type) return "Complaint";
  const t = String(type).toLowerCase();
  if (t === "garbage_waste") return "Garbage / Waste";
  if (t === "street_light") return "Street Light";
  if (t === "road_waterlogging") return "Road Waterlogging";
  if (t === "construction_block") return "Construction Block";
  if (t === "drainage_issue") return "Drainage Issue";
  return (type || "Complaint").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/* ── Sub-components ── */
function StatusBadge({ status }) {
  const cfg = getStatus(status);
  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg, borderColor: cfg.border }]}>
      <Icon name={cfg.icon} size={13} color={cfg.color} />
      <Text style={[styles.badgeText, { color: cfg.color }]}>{cfg.label}</Text>
    </View>
  );
}

function PriorityBadge({ priority, aiPriority }) {
  const finalPriority = aiPriority?.priority || priority || "Unknown";
  const rawPriority = String(finalPriority).toLowerCase();
  
  const isHigh = rawPriority === "high";
  const isMed = rawPriority === "medium";
  const isLow = rawPriority === "low";
  
  const label = isHigh ? "🔴 High" : isMed ? "🟡 Medium" : isLow ? "🟢 Low" : "⚪ Unknown";
  const cfg = PRIORITY_CONFIG[rawPriority] || { color: "#6B7280", bg: "#F3F4F6" };
  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg, borderColor: "transparent" }]}>
      <Icon name={cfg.icon} size={13} color={cfg.color} />
      <Text style={[styles.badgeText, { color: cfg.color, fontWeight: "bold" }]}>
        {label}
      </Text>
    </View>
  );
}

function InfoRow({ icon, label, value }) {
  const { user } = React.useContext(AuthContext);
  const isInspector = user?.role === "INSPECTOR";
  const iconColor = isInspector ? "#0F8A83" : PRIMARY;
  if (!value) return null;
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIconWrap}>
        <Icon name={icon} size={15} color={iconColor} />
      </View>
      <View style={styles.infoTextWrap}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

function NoteCard({ icon, label, value, color, date }) {
  if (!value) return null;
  return (
    <View style={[styles.noteCard, { borderLeftColor: color }]}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: SPACING.xs }}>
          <Icon name={icon} size={14} color={color} />
          <Text style={[styles.noteLabel, { color }]}>{label}</Text>
        </View>
        {date && (
          <Text style={{ fontSize: 10, color: "#9CA3AF", fontWeight: "600" }}>
            {new Date(date).toLocaleString()}
          </Text>
        )}
      </View>
      <Text style={styles.noteValue}>{value}</Text>
    </View>
  );
}

function SectionTitle({ title, icon }) {
  const { user } = React.useContext(AuthContext);
  const isInspector = user?.role === "INSPECTOR";
  const iconColor = isInspector ? "#0F8A83" : PRIMARY;
  const bgColor = isInspector ? "#DDF8F5" : PRIMARY_LIGHT;
  return (
    <View style={styles.sectionTitle}>
      <View style={[styles.sectionIconWrap, { backgroundColor: bgColor }]}>
        <Icon name={icon} size={14} color={iconColor} />
      </View>
      <Text style={styles.sectionTitleText}>{title}</Text>
    </View>
  );
}

function HistoryItem({ item, complaint, isLast }) {
  const { user } = React.useContext(AuthContext);
  const isCitizen = user?.role === "CITIZEN";
  
  const action = (item.action || "").toUpperCase();
  const newStatus = (item.new_status || "").toUpperCase();
  
  let statusKey = "SUBMITTED";
  if (action === "CREATED" || newStatus === "PENDING" || newStatus === "OPEN") {
    statusKey = "SUBMITTED";
  } else if (newStatus === "IN_PROGRESS" || newStatus === "WORKING" || action === "ASSIGNED") {
    statusKey = "IN_PROGRESS";
  } else if (newStatus === "RESOLVED" || newStatus === "CLOSED") {
    statusKey = "RESOLVED";
  } else if (newStatus === "REJECTED") {
    statusKey = "REJECTED";
  } else if (newStatus === "REOPENED" || action === "REOPENED") {
    statusKey = "REOPENED";
  } else {
    if (action === "REJECTED") {
      statusKey = "REJECTED";
    } else if (action === "APPROVED") {
      statusKey = "RESOLVED";
    }
  }

  let title = "Complaint Submitted";
  let dotColor = "#D97706"; // Yellow
  let defaultRemarks = "Complaint submitted by citizen.";
  let dotIcon = "file-document-outline";

  if (statusKey === "IN_PROGRESS") {
    title = isCitizen ? "Work Started by Inspector" : "Work Started";
    dotColor = "#2563EB"; // Blue
    defaultRemarks = "Inspector started working on the complaint.";
    dotIcon = "progress-wrench";
  } else if (statusKey === "RESOLVED") {
    title = isCitizen ? "Complaint Resolved" : "Complaint Resolved";
    dotColor = "#059669"; // Green
    defaultRemarks = "Inspector resolved the complaint.";
    dotIcon = "check-circle-outline";
  } else if (statusKey === "REJECTED") {
    title = "Complaint Rejected";
    dotColor = "#DC2626"; // Red
    defaultRemarks = "Inspector rejected the complaint.";
    dotIcon = "close-circle-outline";
  } else if (statusKey === "REOPENED") {
    title = "Complaint Reopened";
    dotColor = "#D97706"; // Amber
    defaultRemarks = "Complaint was reopened due to low citizen satisfaction.";
    dotIcon = "alert-circle-outline";
  }

  const remarksText = item.remarks || defaultRemarks;
  
  return (
    <View style={styles.historyItem}>
      {/* timeline line */}
      <View style={styles.timelineCol}>
        <View style={[styles.timelineDot, { backgroundColor: dotColor }]}>
          <Icon
            name={dotIcon}
            size={11}
            color="#fff"
          />
        </View>
        {!isLast && <View style={styles.timelineLine} />}
      </View>
      {/* content */}
      <View style={styles.historyContent}>
        <Text style={styles.historyAction}>{title}</Text>
        
        {remarksText ? (
          <Text style={styles.historyRemarks}>{remarksText}</Text>
        ) : null}
        
        {statusKey === "RESOLVED" && complaint?.proof_images?.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
            {complaint.proof_images.map((img, idx) => {
              const uri = getFinalImageUri(img);
              return (
                <TouchableOpacity
                  key={idx}
                  activeOpacity={0.8}
                  onPress={() => {
                    setViewerImageUrl(uri);
                    setViewerVisible(true);
                  }}
                >
                  <Image source={{ uri }} style={{ width: 80, height: 80, borderRadius: 8, marginRight: 8 }} />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
        {(item.timestamp || item.created_at) && (
          <Text style={styles.historyTime}>{formatDate(item.timestamp || item.created_at)}</Text>
        )}
      </View>
    </View>
  );
}

/* ── Main Screen ── */
const getFinalImageUri = (img) => {
    let finalUri = img;
    if (img && typeof img === 'string' && !img.startsWith('http') && !img.startsWith('data:')) {
      const base = API_URL ? API_URL.replace(/\/api\/v1\/?$/, '') : '';
      // If the backend didn't include 'uploads/', we inject it.
      let path = img.startsWith('/') ? img : '/' + img;
      if (!path.startsWith('/uploads/')) {
        path = '/uploads' + path;
      }
      finalUri = `${base}${path}`;
    }
    console.log(`[ComplaintDetailScreen] Image Source: ${img} -> Final URI: ${finalUri}`);
    return finalUri;
  };

export const ComplaintDetailScreen = ({ route, navigation }) => {
  const initialComplaint = route.params?.complaint;
  const passedId = route.params?.complaintId;
  const [complaint, setComplaint] = useState(initialComplaint);
  const [resolvedDistrictName, setResolvedDistrictName] = useState("Not Available");
  const [resolvedWardName, setResolvedWardName] = useState("Not Available");

  useEffect(() => {
    if (!complaint) return;

    const rawDist = complaint.district;
    const nameVal = complaint.districtName || complaint.district_name || complaint.district?.name;
    if (typeof nameVal === "string" && nameVal.trim() && !/^[0-9a-fA-F]{24}$/.test(nameVal)) {
      setResolvedDistrictName(nameVal);
    } else if (typeof rawDist === "string" && rawDist.trim() && !/^[0-9a-fA-F]{24}$/.test(rawDist)) {
      setResolvedDistrictName(rawDist);
    } else {
      const distId = complaint.district_id || (typeof rawDist === "string" && /^[0-9a-fA-F]{24}$/.test(rawDist) ? rawDist : "");
      if (distId) {
        getDistrictsCached().then(list => {
          const found = list.find(d => (d._id || d.id) === distId);
          if (found) {
            setResolvedDistrictName(found.name);
            resolveWard(distId);
          } else {
            setResolvedDistrictName("Not Available");
          }
        });
      } else {
        setResolvedDistrictName("Not Available");
      }
    }

    const resolveWard = (distId) => {
      const rawWard = complaint.ward;
      const wNameVal = complaint.wardName || complaint.ward_name || complaint.ward?.ward_name || complaint.ward?.name;
      if (typeof wNameVal === "string" && wNameVal.trim() && !/^[0-9a-fA-F]{24}$/.test(wNameVal)) {
        setResolvedWardName(wNameVal);
      } else if (rawWard && typeof rawWard === "object") {
        if (typeof rawWard.ward_name === "string" && rawWard.ward_name.trim()) setResolvedWardName(rawWard.ward_name);
        else if (typeof rawWard.name === "string" && rawWard.name.trim()) setResolvedWardName(rawWard.name);
        else if (rawWard.ward_number != null) setResolvedWardName(`Ward #${rawWard.ward_number}`);
      } else {
        const wardId = complaint.ward_id || (typeof rawWard === "string" && /^[0-9a-fA-F]{24}$/.test(rawWard) ? rawWard : "");
        if (wardId && distId) {
          getWardsCached(distId).then(list => {
            const found = list.find(w => (w._id || w.id || w.ward_id) === wardId);
            if (found) {
              setResolvedWardName(found.ward_number ? `${String(found.ward_number).padStart(2, "0")} - ${found.ward_name}` : found.ward_name);
            } else {
              setResolvedWardName("Not Available");
            }
          });
        } else {
          setResolvedWardName("Not Available");
        }
      }
    };

    const distId = complaint.district_id || (typeof rawDist === "string" && /^[0-9a-fA-F]{24}$/.test(rawDist) ? rawDist : "");
    if (distId) {
      resolveWard(distId);
    }
  }, [complaint]);
  
  const complaintId = passedId || initialComplaint?.id || initialComplaint?._id || initialComplaint?.complaint_id;
  const [loading, setLoading]     = useState(Boolean(complaintId));
  const [error, setError]         = useState("");
  
  console.log("[ComplaintDetailScreen] Initialized with route.params:", route.params);
  console.log("[ComplaintDetailScreen] Derived complaintId:", complaintId);

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [selectedProofImages, setSelectedProofImages] = useState([]);
  const [resolveNote, setResolveNote] = useState("");
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerImageUrl, setViewerImageUrl] = useState("");

  const { user } = useContext(AuthContext);
  const isCitizen = user?.role === "CITIZEN";
  const isInspector = user?.role === "INSPECTOR";

  const [loadingFeedback, setLoadingFeedback] = useState(true);
  const [feedbackAlreadySubmitted, setFeedbackAlreadySubmitted] = useState(false);
  const [existingFeedbackData, setExistingFeedbackData] = useState(null);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    const load = async () => {
      console.log("Complaint Details screen opened");
      console.log("Complaint ID:", complaintId);
      console.log("[ComplaintDetailScreen] useEffect triggered for complaintId:", complaintId);
      if (!complaintId) { 
        console.log("[ComplaintDetailScreen] No complaintId found, skipping fetch.");
        setLoading(false); 
        setLoadingFeedback(false);
        return; 
      }
      try {
        setLoading(true);
        setError("");
        console.log(`[ComplaintDetailScreen] Fetching complaint using authService.getComplaint(${complaintId})`);
        const data = await authService.getComplaint(complaintId);
        setComplaint(data);

        // Check feedback status
        try {
          setLoadingFeedback(true);
          const fbRes = await authService.getFeedback(complaintId);
          const fbData = fbRes?.data || fbRes;
          if (fbData && (fbData.feedback || fbData.feedback_text)) {
            const fb = fbData.feedback || fbData;
            setExistingFeedbackData({
              ...fb,
              sentiment_classification: fbData.sentiment_classification || fb.sentiment_classification,
              sentiment_score: fbData.sentiment_score ?? fb.sentiment_score,
            });
            setFeedbackAlreadySubmitted(true);
          } else if (data?.feedback) {
            setExistingFeedbackData(data.feedback);
            setFeedbackAlreadySubmitted(true);
          } else {
            setFeedbackAlreadySubmitted(false);
          }
        } catch (fbErr) {
          if (data?.feedback) {
            setExistingFeedbackData(data.feedback);
            setFeedbackAlreadySubmitted(true);
          } else {
            setFeedbackAlreadySubmitted(false);
          }
        } finally {
          setLoadingFeedback(false);
        }
      } catch (err) {
        console.error("[ComplaintDetailScreen] Error fetching complaint:", err);
        setError(getErrorMessage(err, "Unable to load complaint details"));
        setLoadingFeedback(false);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [complaintId]);

  const handleSubmitFeedback = async () => {
    if (rating === 0) return alert("Please select a rating");
    if (!feedback.trim()) return alert("Please enter feedback comments");

    try {
      setSubmitting(true);
      const res = await authService.submitFeedback(complaintId, { rating, feedback: feedback.trim() });
      const resData = res?.data || res;
      const fbObj = resData?.complaint?.feedback || resData?.data?.complaint?.feedback || resData?.feedback || resData?.data?.feedback || {
        rating,
        feedback_text: feedback.trim(),
        sentiment_classification: resData?.sentiment_classification || resData?.data?.sentiment_classification || "NEUTRAL",
        sentiment_score: resData?.sentiment_score ?? resData?.data?.sentiment_score
      };

      setExistingFeedbackData(fbObj);
      setFeedbackAlreadySubmitted(true);

      const data = await authService.getComplaint(complaintId);
      setComplaint(data);
    } catch (err) {
      console.error("Mobile feedback submit error:", err);
      const msg = getErrorMessage(err, "");
      if (msg.toLowerCase().includes("already") || err.response?.status === 400 || err.response?.status === 422) {
        // DUPLICATE SUBMISSION PROTECTION: DO NOT SHOW ALERT!
        try {
          const fbRes = await authService.getFeedback(complaintId);
          const fbData = fbRes?.data || fbRes;
          if (fbData && (fbData.feedback || fbData.feedback_text)) {
            const fb = fbData.feedback || fbData;
            setExistingFeedbackData({
              ...fb,
              sentiment_classification: fbData.sentiment_classification || fb.sentiment_classification,
              sentiment_score: fbData.sentiment_score ?? fb.sentiment_score,
            });
          }
        } catch (fErr) {
          if (complaint?.feedback) {
            setExistingFeedbackData(complaint.feedback);
          }
        }
        setFeedbackAlreadySubmitted(true);
      } else {
        alert(msg || "Failed to submit feedback");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handlePriorityOverride = async (newPriority) => {
    try {
      setLoading(true);
      await authService.overrideComplaintPriority(complaintId, newPriority);
      alert("Priority overridden successfully!");
      const data = await authService.getComplaint(complaintId);
      setComplaint(data);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || "Failed to override priority";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };



  const handleAccept = async () => {
    try {
      setSubmitting(true);
      await authService.inspectorStartWork(complaintId);
      alert("Complaint accepted and is now IN PROGRESS!");
      const data = await authService.getComplaint(complaintId);
      setComplaint(data);
    } catch (err) {
      alert(getErrorMessage(err, "Failed to accept complaint"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert("Please specify a rejection reason.");
      return;
    }
    try {
      setSubmitting(true);
      setShowRejectModal(false);
      await authService.inspectorRejectComplaint(complaintId);
      await authService.inspectorAddNote(complaintId, { note: `Rejection Reason: ${rejectReason}` });
      alert("Complaint rejected successfully!");
      setRejectReason("");
      const data = await authService.getComplaint(complaintId);
      setComplaint(data);
    } catch (err) {
      alert(getErrorMessage(err, "Failed to reject complaint"));
    } finally {
      setSubmitting(false);
    }
  };

  const pickProofImages = async () => {
    if (selectedProofImages.length >= 5) {
      alert("You can attach up to 5 proof images.");
      return;
    }
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== "granted") {
      alert("Permission to access gallery is required!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 5 - selectedProofImages.length,
      quality: 0.8,
    });
    if (!result.canceled && result.assets) {
      const newImages = result.assets.map((asset) => ({
        uri: asset.uri,
        name: asset.fileName || `proof-${Date.now()}.jpg`,
        type: (asset.type === 'image' ? 'image/jpeg' : asset.type) || 'image/jpeg',
      }));
      setSelectedProofImages([...selectedProofImages, ...newImages].slice(0, 5));
    }
  };

  const takeProofPhoto = async () => {
    if (selectedProofImages.length >= 5) {
      alert("You can attach up to 5 proof images.");
      return;
    }
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.status !== "granted") {
      alert("Permission to access camera is required!");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled && result.assets) {
      const asset = result.assets[0];
      const newImage = {
        uri: asset.uri,
        name: asset.fileName || `proof-cam-${Date.now()}.jpg`,
        type: (asset.type === 'image' ? 'image/jpeg' : asset.type) || 'image/jpeg',
      };
      setSelectedProofImages([...selectedProofImages, newImage].slice(0, 5));
    }
  };

  const handleResolve = async () => {
    try {
      setSubmitting(true);
      const isReopened = normalizedStatus.toLowerCase() === "reopened" || !!complaint?.reopened_reason;
      if (selectedProofImages.length === 0) {
        const errMsg = isReopened 
          ? "Please upload a photo before proceeding with a reopened complaint." 
          : "Please attach at least one proof image.";
        alert(errMsg);
        setSubmitting(false);
        return;
      }

      const formData = new FormData();
      if (resolveNote.trim()) {
        formData.append("note", resolveNote.trim());
      }
      
      selectedProofImages.forEach((img, index) => {
        let fileUri = img.uri;
        if (Platform.OS === 'android' && !fileUri.startsWith('file://') && !fileUri.startsWith('content://')) {
          fileUri = 'file://' + fileUri;
        }
        formData.append("images", {
          uri: fileUri,
          name: img.name || `proof-${index}.jpg`,
          type: (img.type === 'image' ? 'image/jpeg' : img.type) || 'image/jpeg'
        });
      });

      await authService.inspectorResolveComplaint(complaintId, formData);
      alert("Complaint resolved successfully!");
      const data = await authService.getComplaint(complaintId);
      setComplaint(data);
    } catch (err) {
      alert(getErrorMessage(err, "Failed to resolve complaint"));
    } finally {
      setSubmitting(false);
    }
  };

  const normalizedStatus = normalizeComplaintStatus(complaint?.status);
  const statusCfg = getStatus(complaint?.status);
  // Extract citizen uploaded images or proof images
  let complaintImages = [];
  if (Array.isArray(complaint?.images) && complaint.images.length > 0) {
    complaintImages = complaint.images;
  } else if (Array.isArray(complaint?.image_urls) && complaint.image_urls.length > 0) {
    complaintImages = complaint.image_urls;
  }

  let resolutionImages = [];
  if (Array.isArray(complaint?.proof_images) && complaint.proof_images.length > 0) {
    resolutionImages = complaint.proof_images;
  }




  useEffect(() => {
    console.log("--- IMAGE LOGS ---");
    console.log("complaint.images:", complaint?.images);
    console.log("complaint.image_urls:", complaint?.image_urls);
    console.log("complaint.proof_images:", complaint?.proof_images);
  }, [complaint]);


  return (
    <View style={styles.flex}>
      <StatusBar barStyle="light-content" backgroundColor={isInspector ? "#0F8A83" : PRIMARY} />

      {/* ── HEADER ── */}
      <View style={[styles.headerBar, isInspector && { backgroundColor: "#0F8A83" }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Complaint Details</Text>
          <Text style={styles.headerSub} numberOfLines={1}>
            {complaint?.complaint_id || complaint?._id || "Loading…"}
          </Text>
        </View>
        {complaint && (
          <View style={[styles.headerStatusDot, { backgroundColor: statusCfg.color }, isInspector && { borderColor: "rgba(255,255,255,0.3)" }]} />
        )}
      </View>

      {loading ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={isInspector ? "#0F8A83" : PRIMARY} />
          <Text style={styles.centerStateText}>Loading details…</Text>
        </View>
      ) : error ? (
        <View style={styles.centerState}>
          <View style={styles.errorIconWrap}>
            <Icon name="alert-circle-outline" size={40} color={ERROR} />
          </View>
          <Text style={styles.errorTitle}>Couldn't load complaint</Text>
          <Text style={styles.errorSub}>{error}</Text>
          <TouchableOpacity style={[styles.retryBtn, isInspector && { backgroundColor: "#0F8A83" }]} onPress={() => navigation.navigate("ComplaintsHome")}>
            <Text style={styles.retryText}>Back to Complaints</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          {/* ── HERO STATUS CARD ── */}
          <View style={[styles.heroCard, { backgroundColor: statusCfg.bg, borderColor: statusCfg.border }]}>
            <View style={styles.heroTop}>
              <View style={[styles.heroIconWrap, { backgroundColor: statusCfg.color + "18" }]}>
                <Icon name="clipboard-alert-outline" size={28} color={statusCfg.color} />
              </View>
              <View style={styles.heroMeta}>
                <Text style={styles.heroType}>{humaniseType(complaint?.complaint_type)}</Text>
                <Text style={styles.heroId}>#{complaint?.complaint_id || complaint?._id}</Text>
              </View>
            </View>
            <View style={styles.heroBottom}>
              <StatusBadge status={complaint?.status} />
              <PriorityBadge priority={complaint?.priority} aiPriority={complaint?.ai_priority} />
              {complaint?.created_at && (
                <Text style={styles.heroDate}>{formatDate(complaint.created_at)}</Text>
              )}
            </View>
          </View>

          {/* ── DETAILS CARD ── */}
          <View style={styles.card}>
            <SectionTitle title="Complaint Info" icon="information-outline" />

            <InfoRow icon="account-outline"       label="Raised By"   value={complaint?.citizenName || complaint?.citizen_name || complaint?.citizen?.name || "Not Available"} />
            <InfoRow icon="text-box-outline"      label="Description" value={complaint?.description || "Not Available"} />
            <InfoRow icon="map-outline"           label="District"    value={resolvedDistrictName} />
            <InfoRow icon="map-marker-outline"    label="Ward"        value={resolvedWardName} />
            <InfoRow icon="home-outline"          label="Address"     value={complaint?.address || "Not Available"} />
            <InfoRow icon="home-map-marker"       label="Landmark"    value={complaint?.landmark || "Not Available"} />

            <InfoRow icon="identifier"            label="Complaint ID" value={getCleanId(complaint)} />
            <InfoRow icon="crosshairs-gps"        label="Coordinates"
              value={complaint?.latitude && complaint?.longitude
                ? `${complaint.latitude}, ${complaint.longitude}` : null} />

            {(() => {
              const pred = complaint?.ai_priority;
              
              const rawPriority = pred?.priority 
                ? String(pred.priority).toUpperCase() 
                : "UNKNOWN";
              
              const emojiPriority = rawPriority === "HIGH" ? "🔴 High" :
                                    rawPriority === "MEDIUM" ? "🟡 Medium" :
                                    rawPriority === "LOW" ? "🟢 Low" : "⚪ Unknown";
              
              const confidenceText = pred && pred.confidence !== undefined 
                ? `${pred.confidence}%` 
                : "--";
              
              const reasonText = pred?.reason || "AI analysis unavailable.";

              return (
                <View style={{ borderTopWidth: 1, borderTopColor: "#E5E7EB", paddingTop: SPACING.md, marginTop: SPACING.md }}>
                  <SectionTitle title="AI Priority Recommendation" icon="sparkles" />
                  
                  <View style={{ paddingLeft: SPACING.xxl, gap: 6, marginTop: 4 }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Text style={{ fontWeight: "bold", width: 100, color: "#64748B", fontSize: FONT_SIZES.sm }}>AI Priority</Text>
                      <Text style={{ fontWeight: "800", color: "#1F2937", fontSize: FONT_SIZES.sm }}>{emojiPriority}</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Text style={{ fontWeight: "bold", width: 100, color: "#64748B", fontSize: FONT_SIZES.sm }}>Confidence</Text>
                      <Text style={{ fontWeight: "600", color: "#1F2937", fontSize: FONT_SIZES.sm }}>{confidenceText}</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "flex-start", marginTop: 2 }}>
                      <Text style={{ fontWeight: "bold", width: 100, color: "#64748B", fontSize: FONT_SIZES.sm }}>Reason</Text>
                      <Text style={{ fontWeight: "600", color: "#1F2937", fontSize: FONT_SIZES.sm, flex: 1 }}>{reasonText}</Text>
                    </View>
                  </View>
                </View>
              );
            })()}

            {complaintImages.length > 0 && (
              <>
                <View style={styles.cardDivider} />
                <SectionTitle title="Attached Photos" icon="image-multiple-outline" />
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageRow}>
                  {complaintImages.map((img, idx) => {
                    const uri = getFinalImageUri(img);
                    return (
                      <TouchableOpacity
                        key={`${img}-${idx}`}
                        activeOpacity={0.8}
                        onPress={() => {
                          setViewerImageUrl(uri);
                          setViewerVisible(true);
                        }}
                      >
                        <Image source={{ uri }} style={styles.previewImage} />
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </>
            )}

            {resolutionImages.length > 0 && (
              <>
                <View style={styles.cardDivider} />
                <SectionTitle title="Proof of Resolution" icon="shield-check-outline" />
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageRow}>
                  {resolutionImages.map((img, idx) => {
                    const uri = getFinalImageUri(img);
                    return (
                      <TouchableOpacity
                        key={`resolve-${img}-${idx}`}
                        activeOpacity={0.8}
                        onPress={() => {
                          setViewerImageUrl(uri);
                          setViewerVisible(true);
                        }}
                      >
                        <Image source={{ uri }} style={styles.previewImage} />
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </>
            )}

            {/* Notes section */}
            {(complaint?.citizen_note || complaint?.worker_note ||
              complaint?.inspector_note || complaint?.rejection_reason || (complaint?.notes && complaint.notes.length > 0)) && (
              <>
                <View style={styles.cardDivider} />
                <SectionTitle title="Notes" icon="note-text-outline" />
                <NoteCard icon="account-outline"      label="Citizen Note"     value={complaint?.citizen_note}     color="#2563EB" />
                <NoteCard icon="account-hard-hat"     label="Worker Note"      value={complaint?.worker_note}      color="#7C3AED" />
                <NoteCard icon="shield-account"       label="Inspector Note"   value={complaint?.inspector_note}   color="#0891B2" />
                <NoteCard icon="close-circle-outline" label="Rejection Reason" value={complaint?.rejection_reason} color="#DC2626" />

                {complaint?.notes && complaint.notes.length > 0 && complaint.notes.map((note, idx) => {
                  const role = note.author_role || "INSPECTOR";
                  const color = role === "WORKER" ? "#7C3AED" : role === "CITIZEN" ? "#2563EB" : "#0891B2";
                  const icon = role === "WORKER" ? "account-hard-hat" : role === "CITIZEN" ? "account-outline" : "shield-account";
                  return (
                    <NoteCard
                      key={idx}
                      icon={icon}
                      label={role}
                      value={note.text}
                      color={color}
                      date={note.created_at || note.timestamp}
                    />
                  );
                })}
              </>
            )}
          </View>

          {/* ── REOPENED WARNING CARD ── */}
          {(normalizedStatus.toUpperCase() === "REOPENED" || complaint?.reopened_reason) && (
            <View style={[styles.card, { backgroundColor: "#FEF3C7", borderColor: "#F59E0B", borderWidth: 1.5, gap: 10 }]}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Icon name="alert-circle-outline" size={24} color="#D97706" />
                <View>
                  <Text style={{ fontSize: 15, fontWeight: "800", color: "#B45309" }}>REOPENED: LOW SATISFACTION</Text>
                  <Text style={{ fontSize: 11, fontWeight: "700", color: "#B45309", opacity: 0.8 }}>
                    Reason: {complaint?.reopened_reason || "NEGATIVE_CITIZEN_FEEDBACK"}
                  </Text>
                </View>
              </View>
              {complaint?.feedback && (
                <View style={{ backgroundColor: "#fff", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "#FDE68A", gap: 8 }}>
                  <Text style={{ fontSize: 13, fontWeight: "700", color: "#1F2937" }}>
                    Citizen Feedback: <Text style={{ fontWeight: "500", color: "#4B5563" }}>"{complaint.feedback.feedback_text}"</Text>
                  </Text>
                  {complaint.feedback.rating > 0 && (
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                      <Text style={{ fontSize: 12, fontWeight: "700", color: "#4B5563" }}>Rating:</Text>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Icon
                          key={i}
                          name="star"
                          size={14}
                          color={i < complaint.feedback.rating ? "#F59E0B" : "#D1D5DB"}
                        />
                      ))}
                    </View>
                  )}
                  <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 10, paddingTop: 8, borderTopWidth: 1, borderTopColor: "#F3F4F6" }}>
                    <Text style={{ fontSize: 11, fontWeight: "700", color: "#4B5563" }}>
                      Sentiment: <Text style={{ color: "#DC2626", fontWeight: "800" }}>{complaint.feedback.sentiment_classification || "NEGATIVE"}</Text>
                    </Text>
                    <Text style={{ fontSize: 11, fontWeight: "700", color: "#4B5563" }}>
                      Score: <Text style={{ color: "#DC2626", fontWeight: "800" }}>{complaint.feedback.sentiment_score ?? -0.8}</Text>
                    </Text>
                    {complaint.feedback.created_at && (
                      <Text style={{ fontSize: 10, fontWeight: "600", color: "#9CA3AF" }}>
                        {new Date(complaint.feedback.created_at).toLocaleString()}
                      </Text>
                    )}
                  </View>
                </View>
              )}
            </View>
          )}

          {/* ── CITIZEN FEEDBACK SECTION ── */}
          {isCitizen && complaint && ["closed", "resolved", "reopened"].includes(normalizedStatus.toLowerCase()) && (
            loadingFeedback ? (
              <View style={styles.card}>
                <ActivityIndicator size="small" color={PRIMARY} />
                <Text style={{ fontSize: 13, color: GRAY_500, textAlign: "center", marginTop: 8 }}>
                  Checking feedback...
                </Text>
              </View>
            ) : (feedbackAlreadySubmitted || existingFeedbackData || complaint?.feedback) ? (
              /* READ-ONLY SUBMITTED FEEDBACK UI */
              <View style={[styles.card, { backgroundColor: "#ECFDF5", borderColor: "#A7F3D0", borderWidth: 1.5 }]}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: "#D1FAE5" }}>
                  <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#059669", alignItems: "center", justifyContent: "center" }}>
                    <Icon name="check" size={20} color="#fff" />
                  </View>
                  <View>
                    <Text style={{ fontSize: 16, fontWeight: "800", color: "#064E3B" }}>Feedback Submitted ✓</Text>
                    <Text style={{ fontSize: 12, color: "#047857" }}>Thank you for your feedback.</Text>
                  </View>
                </View>

                <Text style={{ fontSize: 12, fontWeight: "700", color: GRAY_500, textTransform: "uppercase", marginBottom: 6 }}>
                  Your Rating:
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                  {[1, 2, 3, 4, 5].map((star) => {
                    const activeRating = ((existingFeedbackData || complaint.feedback)?.rating || rating || 0);
                    return (
                      <Icon
                        key={star}
                        name={star <= activeRating ? "star" : "star-outline"}
                        size={26}
                        color={star <= activeRating ? "#F59E0B" : GRAY_400}
                      />
                    );
                  })}
                  <Text style={{ fontSize: 14, fontWeight: "700", color: COLORS.textDark, marginLeft: 8 }}>
                    {((existingFeedbackData || complaint.feedback)?.rating || rating || 0)} / 5 Stars
                  </Text>
                </View>

                <Text style={{ fontSize: 12, fontWeight: "700", color: GRAY_500, textTransform: "uppercase", marginBottom: 6 }}>
                  Your Feedback:
                </Text>
                <View style={{ backgroundColor: "#FFFFFF", padding: 14, borderRadius: 12, borderWidth: 1, borderColor: "#D1FAE5", marginBottom: 12 }}>
                  <Text style={{ fontSize: 14, fontStyle: "italic", color: COLORS.textDark }}>
                    "{((existingFeedbackData || complaint.feedback)?.feedback_text || (existingFeedbackData || complaint.feedback)?.feedback || feedback)}"
                  </Text>
                </View>

                <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 12, paddingTop: 8, borderTopWidth: 1, borderTopColor: "#D1FAE5" }}>
                  {((existingFeedbackData || complaint.feedback)?.sentiment_classification || (existingFeedbackData || complaint.feedback)?.sentiment || complaint.sentiment_classification) && (
                    <Text style={{ fontSize: 12, fontWeight: "700", color: GRAY_600 }}>
                      Sentiment:{" "}
                      <Text style={{ fontWeight: "800", color: ((existingFeedbackData || complaint.feedback)?.sentiment_classification || (existingFeedbackData || complaint.feedback)?.sentiment || complaint.sentiment_classification) === "POSITIVE" ? "#059669" : ((existingFeedbackData || complaint.feedback)?.sentiment_classification || (existingFeedbackData || complaint.feedback)?.sentiment || complaint.sentiment_classification) === "NEGATIVE" ? "#DC2626" : "#2563EB" }}>
                        {(existingFeedbackData || complaint.feedback)?.sentiment_classification || (existingFeedbackData || complaint.feedback)?.sentiment || complaint.sentiment_classification}
                      </Text>
                    </Text>
                  )}
                  {((existingFeedbackData || complaint.feedback)?.sentiment_score !== undefined || complaint.sentiment_score !== undefined) && (
                    <Text style={{ fontSize: 12, fontWeight: "700", color: GRAY_600 }}>
                      Sentiment Score:{" "}
                      <Text style={{ fontWeight: "800", color: COLORS.textDark }}>
                        {(existingFeedbackData || complaint.feedback)?.sentiment_score ?? complaint.sentiment_score}
                      </Text>
                    </Text>
                  )}
                </View>
              </View>
            ) : (normalizedStatus.toLowerCase() === "resolved" || normalizedStatus.toLowerCase() === "closed") ? (
              /* EDITABLE FEEDBACK FORM */
              <View style={styles.card}>
                <SectionTitle title="Resolution Feedback" icon="star-outline" />
                <Text style={{ fontSize: 13, color: GRAY_500, marginBottom: 12 }}>
                  Rate your satisfaction with the resolution of this complaint:
                </Text>
                <View style={styles.ratingRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity key={star} onPress={() => setRating(star)}>
                      <Icon name={rating >= star ? "star" : "star-outline"} size={32} color={rating >= star ? "#F59E0B" : GRAY_400} />
                    </TouchableOpacity>
                  ))}
                </View>
                <TextInput
                  style={[styles.textInput, { marginTop: 12, minHeight: 80 }]}
                  placeholder="Tell us about your experience..."
                  placeholderTextColor={GRAY_400}
                  value={feedback}
                  onChangeText={setFeedback}
                  multiline
                  numberOfLines={3}
                />
                <TouchableOpacity
                  style={[styles.actionBtn, { height: 52, borderRadius: 14, backgroundColor: PRIMARY, marginTop: 14 }]}
                  onPress={handleSubmitFeedback}
                  disabled={submitting}
                >
                  {submitting ? <ActivityIndicator size="small" color="#fff" /> : <Text style={[styles.actionBtnText, { fontSize: 16, fontWeight: "600" }]}>Submit Feedback</Text>}
                </TouchableOpacity>
              </View>
            ) : null
          )}


          {/* ── INSPECTOR ACTIONS ── */}
          {isInspector && complaint && (
            <View style={styles.card}>
              <SectionTitle title="Inspector Actions" icon="shield-check" />
              {["new", "open", "pending"].includes(normalizedStatus.toLowerCase()) && (
                <View style={{ flexDirection: "row", gap: SPACING.md }}>
                  <TouchableOpacity style={[styles.actionBtn, { flex: 1, backgroundColor: "#059669" }]} onPress={handleAccept} disabled={submitting}>
                    {submitting ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.actionBtnText}>Accept</Text>}
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionBtn, { flex: 1, backgroundColor: ERROR }]} onPress={() => setShowRejectModal(true)} disabled={submitting}>
                    {submitting ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.actionBtnText}>Reject</Text>}
                  </TouchableOpacity>
                </View>
              )}
              {normalizedStatus.toLowerCase() === "reopened" && (
                <View>
                  <Text style={{ fontSize: 13, fontWeight: "600", color: "#666", marginBottom: 12 }}>
                    Reopened complaints cannot be rejected. Please accept and inspect.
                  </Text>
                  <TouchableOpacity style={[styles.actionBtn, { backgroundColor: "#059669" }]} onPress={handleAccept} disabled={submitting}>
                    {submitting ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.actionBtnText}>ACCEPT REOPENED COMPLAINT</Text>}
                  </TouchableOpacity>
                </View>
              )}
              {["in_progress", "working"].includes(normalizedStatus.toLowerCase()) && (
                <View style={{ marginTop: 10 }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', marginBottom: 10, color: '#333' }}>Attach Proof (Required)</Text>
                  
                  <View style={{ flexDirection: "row", gap: 10, marginBottom: 15 }}>
                    <TouchableOpacity style={[styles.actionBtn, { flex: 1, backgroundColor: '#0F8A83' }]} onPress={takeProofPhoto}>
                      <Text style={styles.actionBtnText}>Camera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, { flex: 1, backgroundColor: '#0B6E69' }]} onPress={pickProofImages}>
                      <Text style={styles.actionBtnText}>Gallery</Text>
                    </TouchableOpacity>
                  </View>

                  {selectedProofImages.length > 0 && (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 15 }}>
                      {selectedProofImages.map((img, idx) => (
                        <View key={`proof-${idx}`} style={{ position: 'relative', marginRight: 10 }}>
                          <Image source={{ uri: img.uri }} style={{ width: 80, height: 80, borderRadius: 8 }} />
                          <TouchableOpacity
                            style={{ position: 'absolute', top: -5, right: -5, backgroundColor: 'red', borderRadius: 12, width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}
                            onPress={() => setSelectedProofImages(prev => prev.filter((_, i) => i !== idx))}
                          >
                            <Icon name="close" size={16} color="white" />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </ScrollView>
                  )}

                  <TextInput
                    style={styles.textInput}
                    placeholder="Resolution notes (optional)"
                    value={resolveNote}
                    onChangeText={setResolveNote}
                    multiline
                  />

                  <TouchableOpacity 
                    style={[styles.actionBtn, { backgroundColor: selectedProofImages.length > 0 ? "#059669" : "#a1a1aa", marginTop: 10 }]} 
                    onPress={handleResolve} 
                    disabled={submitting || selectedProofImages.length === 0}
                  >
                    {submitting ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.actionBtnText}>Submit & Resolve</Text>}
                  </TouchableOpacity>
                </View>
              )}
              {["resolved", "closed", "rejected"].includes(normalizedStatus.toLowerCase()) && (
                <Text style={{ color: GRAY_500, fontSize: 14, textAlign: "center", fontStyle: "italic" }}>No actions available.</Text>
              )}
            </View>
          )}

          {/* ── HISTORY ── */}
          <View style={styles.card}>
            <SectionTitle title="Activity Timeline" icon="timeline-clock-outline" />

            {complaint?.history?.length ? (
              <View style={styles.historyList}>
                {complaint.history.map((item, idx) => (
                  <HistoryItem
                    key={item._id || idx}
                    item={item}
                    complaint={complaint}
                    isLast={idx === complaint.history.length - 1}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.emptyHistory}>
                <Icon name="timeline-outline" size={32} color={GRAY_400} />
                <Text style={styles.emptyHistoryText}>No activity yet</Text>
                <Text style={styles.emptyHistorySub}>Updates will appear here as your complaint progresses.</Text>
              </View>
            )}
          </View>

          <View style={{ height: 32 }} />
        </ScrollView>
      )}
      <ImageViewer
        visible={viewerVisible}
        imageUrl={viewerImageUrl}
        onClose={() => setViewerVisible(false)}
      />
      <Modal
        visible={showRejectModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRejectModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", padding: SPACING.lg }}
        >
          <View style={{ backgroundColor: "#fff", borderRadius: 20, width: "100%", maxWidth: 340, padding: SPACING.xl, ...SHADOWS.lg }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: SPACING.sm, marginBottom: SPACING.md }}>
              <Icon name="alert-circle-outline" size={24} color={ERROR} />
              <Text style={{ fontSize: 18, fontWeight: "800", color: COLORS.textDark }}>Reject Complaint</Text>
            </View>
            <Text style={{ fontSize: 13, color: COLORS.textLight, marginBottom: SPACING.md, lineHeight: 18 }}>
              Please specify the reason for rejecting this complaint. This reason will be recorded as an inspection note and sent to the citizen.
            </Text>
            <TextInput
              placeholder="e.g. Invalid photo, outside jurisdiction, etc."
              value={rejectReason}
              onChangeText={setRejectReason}
              multiline
              numberOfLines={4}
              style={{
                backgroundColor: "#F3F4F6",
                borderRadius: 12,
                padding: SPACING.md,
                fontSize: 14,
                color: COLORS.textDark,
                textAlignVertical: "top",
                minHeight: 80,
                borderWidth: 1,
                borderColor: "#E5E7EB",
                marginBottom: SPACING.lg,
              }}
              placeholderTextColor="#9CA3AF"
            />
            <View style={{ flexDirection: "row", gap: SPACING.md }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 12,
                  backgroundColor: "#E5E7EB",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                }}
                disabled={submitting}
              >
                <Text style={{ fontSize: 14, fontWeight: "700", color: COLORS.textDark }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 12,
                  backgroundColor: ERROR,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={handleReject}
                disabled={submitting || !rejectReason.trim()}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={{ fontSize: 14, fontWeight: "700", color: "#fff" }}>Reject</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: GRAY_50 },

  /* ── HEADER ── */
  headerBar: {
    backgroundColor: PRIMARY,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 52 : SPACING.lg,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center", justifyContent: "center",
  },
  headerCenter: { flex: 1 },
  headerTitle: { color: "#fff", fontSize: 17, fontWeight: "800", letterSpacing: -0.3 },
  headerSub:   { color: "rgba(255,255,255,0.65)", fontSize: 11, marginTop: SPACING.xs },
  headerStatusDot: {
    width: 10, height: 10, borderRadius: 5,
    borderWidth: 2, borderColor: "rgba(255,255,255,0.5)",
  },

  /* ── STATES ── */
  centerState: {
    flex: 1, alignItems: "center", justifyContent: "center", padding: SPACING.xxl, gap: SPACING.md,
  },
  centerStateText: { color: GRAY_400, fontSize: 14, marginTop: SPACING.sm },
  errorIconWrap: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: "#FEF2F2", alignItems: "center", justifyContent: "center",
    marginBottom: SPACING.xs,
  },
  errorTitle: { fontSize: 17, fontWeight: "700", color: GRAY_800 },
  errorSub:   { fontSize: 13, color: GRAY_400, textAlign: "center", lineHeight: 20 },
  retryBtn: {
    marginTop: SPACING.sm, backgroundColor: PRIMARY,
    paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md, borderRadius: 12,
  },
  retryText: { color: "#fff", fontWeight: "700", fontSize: 14 },

  scroll: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg },

  /* ── HERO CARD ── */
  heroCard: {
    borderRadius: 18,
    borderWidth: 1.5,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  heroTop: {
    flexDirection: "row", alignItems: "center", gap: SPACING.md, marginBottom: SPACING.md,
  },
  heroIconWrap: {
    width: 52, height: 52, borderRadius: 14,
    alignItems: "center", justifyContent: "center",
  },
  heroMeta: { flex: 1 },
  heroType: { fontSize: 16, fontWeight: "800", color: GRAY_800, letterSpacing: -0.2 },
  heroId:   { fontSize: 12, color: GRAY_400, marginTop: SPACING.xs, fontWeight: "500" },
  heroBottom: {
    flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: SPACING.sm,
  },
  heroDate: { fontSize: 11, color: GRAY_400, marginLeft: "auto" },

  /* ── BADGES ── */
  badge: {
    flexDirection: "row", alignItems: "center", gap: SPACING.xs,
    paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs,
    borderRadius: 20, borderWidth: 1,
  },
  badgeText: { fontSize: 11, fontWeight: "700" },

  /* ── CARD ── */
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  cardDivider: { height: 1, backgroundColor: GRAY_100, marginVertical: SPACING.lg },

  /* ── SECTION TITLE ── */
  sectionTitle: {
    flexDirection: "row", alignItems: "center", gap: SPACING.sm, marginBottom: SPACING.lg,
  },
  sectionIconWrap: {
    width: 26, height: 26, borderRadius: 7,
    backgroundColor: PRIMARY_LIGHT, alignItems: "center", justifyContent: "center",
  },
  sectionTitleText: { fontSize: 13, fontWeight: "700", color: GRAY_800, letterSpacing: 0.1 },

  /* ── INFO ROW ── */
  infoRow: {
    flexDirection: "row", alignItems: "flex-start", gap: SPACING.md, marginBottom: SPACING.md,
  },
  infoIconWrap: {
    width: 30, height: 30, borderRadius: 8,
    backgroundColor: GRAY_100, alignItems: "center", justifyContent: "center",
    marginTop: SPACING.xs, flexShrink: 0,
  },
  infoTextWrap: { flex: 1 },
  infoLabel: {
    fontSize: 10, fontWeight: "700", color: GRAY_400,
    letterSpacing: 0.6, textTransform: "uppercase",
  },
  imageRow: { marginTop: SPACING.xs },
  previewImage: {
    width: 96,
    height: 96,
    borderRadius: 12,
    marginRight: SPACING.sm,
    backgroundColor: GRAY_100,
  },
  infoValue: { fontSize: 14, color: GRAY_800, marginTop: SPACING.xs, lineHeight: 20 },

  /* ── NOTE CARD ── */
  noteCard: {
    borderLeftWidth: 3,
    backgroundColor: GRAY_50,
    borderRadius: 10,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  noteHeader: { flexDirection: "row", alignItems: "center", gap: SPACING.xs, marginBottom: SPACING.xs },
  noteLabel:  { fontSize: 11, fontWeight: "700", letterSpacing: 0.3 },
  noteValue:  { fontSize: 13, color: GRAY_600, lineHeight: 19 },

  /* ── HISTORY TIMELINE ── */
  historyList: { paddingTop: SPACING.xs },
  historyItem: { flexDirection: "row", gap: SPACING.md, marginBottom: SPACING.xs },
  timelineCol: { alignItems: "center", width: 24 },
  timelineDot: {
    width: 22, height: 22, borderRadius: 11,
    alignItems: "center", justifyContent: "center",
    zIndex: 1,
  },
  timelineLine: {
    flex: 1, width: 2, backgroundColor: GRAY_100, marginTop: SPACING.xs, marginBottom: -SPACING.xs,
  },
  historyContent: {
    flex: 1, paddingBottom: SPACING.lg,
  },
  historyAction: { fontSize: 14, fontWeight: "700", color: GRAY_800, marginBottom: SPACING.xs },
  historyStatusRow: {
    flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: SPACING.xs, marginBottom: SPACING.xs,
  },
  historyRemarks: { fontSize: 13, color: GRAY_600, lineHeight: 18, marginBottom: SPACING.xs },
  historyTime:    { fontSize: 11, color: GRAY_400 },

  /* ── EMPTY HISTORY ── */
  emptyHistory: {
    alignItems: "center", paddingVertical: SPACING.xl, gap: SPACING.xs,
  },
  emptyHistoryText: { fontSize: 14, fontWeight: "700", color: GRAY_600, marginTop: SPACING.xs },
  emptyHistorySub:  { fontSize: 12, color: GRAY_400, textAlign: "center", lineHeight: 18 },

  /* ── ACTIONS (FEEDBACK/REOPEN) ── */
  ratingRow: { flexDirection: "row", gap: SPACING.sm, marginBottom: SPACING.md },
  textInput: {
    backgroundColor: GRAY_50, borderWidth: 1, borderColor: GRAY_200,
    borderRadius: 12, padding: SPACING.md, fontSize: 14, color: GRAY_800,
    marginBottom: SPACING.md, textAlignVertical: "top",
  },
  actionBtn: {
    backgroundColor: PRIMARY, paddingVertical: 14, borderRadius: 12,
    alignItems: "center", justifyContent: "center",
  },
  actionBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  feedbackText: { fontSize: 14, color: GRAY_600, marginTop: SPACING.sm },
});

export default ComplaintDetailScreen;