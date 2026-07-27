import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, FONT_SIZES, SPACING } from "../../constants/theme";
import { getComplaintStatusMeta } from "../../utils/status";

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

const getWardDisplayLabel = (complaint) => {
  const wardValue = complaint?.ward_id || complaint?.ward_name || complaint?.ward;

  if (typeof wardValue === "string" && wardValue.trim()) return wardValue;
  if (wardValue && typeof wardValue === "object") {
    if (typeof wardValue.ward_name === "string" && wardValue.ward_name.trim()) return wardValue.ward_name;
    if (typeof wardValue.name === "string" && wardValue.name.trim()) return wardValue.name;
    if (wardValue.ward_number != null) return `Ward #${wardValue.ward_number}`;
  }

  return "Ward not provided";
};

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export const ComplaintCard = ({ complaint, onPress }) => {
  const type      = complaint?.complaint_type || "OTHER";
  const typeMeta  = TYPE_META[type] || TYPE_META.OTHER;
  const status    = getComplaintStatusMeta(complaint?.status);
  const title     = formatType(complaint?.complaint_type || complaint?.title || "Complaint");
  
  const address   = complaint?.address || "Address not provided";
  const id        = complaint?.complaint_id || complaint?._id || "";
  const date      = formatDate(complaint?.created_at || complaint?.createdAt);
  const ward      = getWardDisplayLabel(complaint);
  const citizen   = complaint?.user_id?.name || complaint?.citizen_name || "Citizen";
  const priority  = complaint?.priority || "MEDIUM";

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
              <Icon name="flag-outline" size={14} color={priority === "HIGH" ? "#DC2626" : priority === "MEDIUM" ? "#D97706" : "#059669"} />
              <Text style={{ color: "#64748B", fontSize: FONT_SIZES.xs }}>{priority}</Text>
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
              <Icon name="map-marker-outline" size={14} color="#64748B" />
              <Text style={{ color: "#64748B", fontSize: FONT_SIZES.xs }}>{ward}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4, width: "100%", marginTop: 2 }}>
              <Icon name="map-marker-radius-outline" size={14} color="#64748B" />
              <Text numberOfLines={1} style={{ color: "#64748B", fontSize: FONT_SIZES.xs, flex: 1 }}>{address}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ComplaintCard;