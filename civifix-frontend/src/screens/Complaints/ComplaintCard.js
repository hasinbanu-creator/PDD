import React, { useState, useEffect, useContext } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, FONT_SIZES, SPACING } from "../../constants/theme";
import { getComplaintStatusMeta } from "../../utils/status";
import authService from "../../services/authService";
import { AuthContext } from "../../context/AuthContext";

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
        console.warn("Failed to load districts cache in ComplaintCard:", err);
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
        console.warn(`Failed to load wards cache for district ${districtId} in ComplaintCard:`, err);
        wardsPromises[districtId] = null; // retry
        return [];
      });
  }
  return wardsPromises[districtId];
};

// ─── STATUS CONFIG ────────────────────────────────────────────────────────────

const STATUS = {
  OPEN:     { label: "Pending",     color: "#D97706", bg: "#FEF3C7", icon: "clock-outline"          },
  WORKING:  { label: "In Progress", color: "#0052CC", bg: "#DBEAFE", icon: "progress-wrench"         },
  APPROVAL: { label: "In Review",   color: "#0891B2", bg: "#CFFAFE", icon: "eye-check-outline"       },
  CLOSED:   { label: "Resolved",    color: "#059669", bg: "#D1FAE5", icon: "check-circle-outline"    },
  REJECTED: { label: "Rejected",    color: "#DC2626", bg: "#FFE4E6", icon: "close-circle-outline"    },
};

// ─── TYPE CONFIG ──────────────────────────────────────────────────────────────

const TYPE_META = {
  ROAD_DAMAGE:  { icon: "road-variant",         color: "#DC2626" },
  POTHOLE:      { icon: "road-variant",         color: "#DC2626" },
  GARBAGE:      { icon: "trash-can-outline",    color: "#0891B2" },
  STREETLIGHT:  { icon: "lightbulb-on-outline", color: "#D97706" },
  WATER_SUPPLY: { icon: "water-outline",        color: "#0052CC" },
  DRAINAGE:     { icon: "pipe-disconnected",    color: "#0891B2" },
  SANITATION:   { icon: "broom",                color: "#0891B2" },
  TREE_CUTTING: { icon: "tree-outline",         color: "#059669" },
  CONSTRUCTION: { icon: "hammer-wrench",        color: "#D97706" },
  OTHER:        { icon: "alert-circle-outline", color: "#6B7280" },
};

const formatType = (type = "") =>
  type.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  } catch { return null; }
};

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export const ComplaintCard = ({ complaint, onPress }) => {
  const type      = complaint?.complaint_type || "OTHER";
  const typeMeta  = TYPE_META[type] || TYPE_META.OTHER;
  const status    = getComplaintStatusMeta(complaint?.status);
  const title     = formatType(complaint?.complaint_type || complaint?.title || "Complaint");
  
  const address   = complaint?.address || "Address not provided";
  const id        = complaint?.complaint_id || (complaint?._id && !/^[0-9a-fA-F]{24}$/.test(complaint._id) ? complaint._id : "");
  const citizen   = complaint?.citizenName || complaint?.citizen_name || complaint?.citizen?.name || "Citizen";
  const date      = formatDate(complaint?.created_at);
  const { user } = useContext(AuthContext);
  const isInspector = user?.role === "INSPECTOR";

  const rawPriority = (complaint?.ai?.priority_prediction?.priority || complaint?.ai_priority?.priority || complaint?.final_priority || complaint?.priority || "MEDIUM").toUpperCase();
  const isHigh = rawPriority === "HIGH";
  const isMed = rawPriority === "MEDIUM";
  const isLow = rawPriority === "LOW";
  
  const priorityLabel = isHigh ? "🔴 High" : isMed ? "🟡 Medium" : isLow ? "🟢 Low" : rawPriority;
  const priorityColor = isHigh ? "#DC2626" : isMed ? "#D97706" : isLow ? "#059669" : "#64748B";

  const [district, setDistrict] = useState("Not Available");
  const [ward, setWard] = useState("Not Available");

  useEffect(() => {
    const rawDist = complaint?.district;
    const nameVal = complaint?.districtName || complaint?.district_name || complaint?.district?.name;
    if (typeof nameVal === "string" && nameVal.trim() && !/^[0-9a-fA-F]{24}$/.test(nameVal)) {
      setDistrict(nameVal);
    } else if (typeof rawDist === "string" && rawDist.trim() && !/^[0-9a-fA-F]{24}$/.test(rawDist)) {
      setDistrict(rawDist);
    } else {
      const distId = complaint?.district_id || (typeof rawDist === "string" && /^[0-9a-fA-F]{24}$/.test(rawDist) ? rawDist : "");
      if (distId) {
        getDistrictsCached().then(list => {
          const found = list.find(d => (d._id || d.id) === distId);
          if (found) {
            setDistrict(found.name);
            resolveWard(distId);
          } else {
            setDistrict("Not Available");
          }
        });
      } else {
        setDistrict("Not Available");
      }
    }

    const resolveWard = (distId) => {
      const rawWard = complaint?.ward;
      const wNameVal = complaint?.wardName || complaint?.ward_name || complaint?.ward?.ward_name || complaint?.ward?.name;
      if (typeof wNameVal === "string" && wNameVal.trim() && !/^[0-9a-fA-F]{24}$/.test(wNameVal)) {
        setWard(wNameVal);
      } else if (rawWard && typeof rawWard === "object") {
        if (typeof rawWard.ward_name === "string" && rawWard.ward_name.trim()) setWard(rawWard.ward_name);
        else if (typeof rawWard.name === "string" && rawWard.name.trim()) setWard(rawWard.name);
        else if (rawWard.ward_number != null) setWard(`Ward #${rawWard.ward_number}`);
      } else {
        const wardId = complaint?.ward_id || (typeof rawWard === "string" && /^[0-9a-fA-F]{24}$/.test(rawWard) ? rawWard : "");
        if (wardId && distId) {
          getWardsCached(distId).then(list => {
            const found = list.find(w => (w._id || w.id || w.ward_id) === wardId);
            if (found) {
              setWard(found.ward_number ? `${String(found.ward_number).padStart(2, "0")} - ${found.ward_name}` : found.ward_name);
            } else {
              setWard("Not Available");
            }
          });
        } else {
          setWard("Not Available");
        }
      }
    };

    const distId = complaint?.district_id || (typeof rawDist === "string" && /^[0-9a-fA-F]{24}$/.test(rawDist) ? rawDist : "");
    if (distId) {
      resolveWard(distId);
    }
  }, [complaint]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.78}
      style={{
        backgroundColor: "#fff",
        borderRadius: 14,
        marginBottom: SPACING.md,
        shadowColor: "#0052CC",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 8,
        elevation: 3,
        overflow: "hidden",
      }}
    >
      {/* Colored left accent bar */}
      <View style={{
        position: "absolute", left: 0, top: 0, bottom: 0,
        width: 4, backgroundColor: typeMeta.color, borderRadius: 4,
      }} />

      <View style={{ paddingLeft: SPACING.lg, paddingRight: SPACING.md, paddingVertical: SPACING.md }}>

        {/* Top row: icon + title + status pill */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: SPACING.xs }}>
          <View style={{
            width: 32, height: 32, borderRadius: 8,
            backgroundColor: `${typeMeta.color}14`,
            alignItems: "center", justifyContent: "center",
            marginRight: SPACING.sm,
          }}>
            <Icon name={typeMeta.icon} size={17} color={typeMeta.color} />
          </View>

          <Text numberOfLines={1} style={{
            flex: 1,
            fontSize: FONT_SIZES.sm,
            fontWeight: "800",
            color: "#1E293B",
          }}>
            {title}
          </Text>

          <View style={{
            flexDirection: "row", alignItems: "center",
            backgroundColor: status.bg,
            borderRadius: 999,
            paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs,
            marginLeft: 8,
          }}>
            <Icon name={status.icon} size={10} color={status.color} style={{ marginRight: SPACING.xs }} />
            <Text style={{ color: status.color, fontSize: 10, fontWeight: "800" }}>
              {status.label}
            </Text>
          </View>
        </View>

        <View style={{ paddingLeft: SPACING.xxl, marginTop: SPACING.xs }}>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: SPACING.md }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Icon name="identifier" size={14} color="#64748B" />
              <Text style={{ color: "#64748B", fontSize: FONT_SIZES.xs }}>{id}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Icon name="flag-outline" size={14} color={priorityColor} />
              <Text style={{ color: priorityColor, fontSize: FONT_SIZES.xs, fontWeight: "bold" }}>{priorityLabel}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Icon name="account-outline" size={14} color="#64748B" />
              <Text style={{ color: "#64748B", fontSize: FONT_SIZES.xs }}>{citizen}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Icon name="calendar-outline" size={14} color="#64748B" />
              <Text style={{ color: "#64748B", fontSize: FONT_SIZES.xs }}>{date}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Icon name="map-outline" size={14} color="#64748B" />
              <Text style={{ color: "#64748B", fontSize: FONT_SIZES.xs }}>{district}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Icon name="map-marker-outline" size={14} color="#64748B" />
              <Text style={{ color: "#64748B", fontSize: FONT_SIZES.xs }}>{ward}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4, width: "100%", marginTop: 2 }}>
              <Icon name="map-marker-radius-outline" size={14} color="#64748B" />
              <Text numberOfLines={1} style={{ color: "#64748B", fontSize: FONT_SIZES.xs, flex: 1 }}>
                {address}{complaint?.landmark ? ` (Landmark: ${complaint.landmark})` : ""}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ComplaintCard;