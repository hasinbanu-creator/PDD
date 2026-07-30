import React, { useContext, useEffect, useMemo, useState, useCallback } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { LinearGradient } from 'react-native-linear-gradient';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../context/AuthContext";
import { Screen } from "../../components";
import { COLORS, FONT_SIZES, SHADOWS, SPACING } from "../../constants/theme";
import authService from "../../services/authService";
import { normalizeComplaintStatus, getComplaintStatusMeta } from "../../utils/status";

// ─── UTILITIES ───────────────────────────────────────────────────────────────

const getItems = (payload, keys = ["data", "items", "list"]) => {
  if (Array.isArray(payload)) return payload;
  for (const k of keys) if (Array.isArray(payload?.[k])) return payload[k];
  return [];
};

const initials = (name = "") =>
  name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "?";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

// STATUS_STYLES removed to use getComplaintStatusMeta from utils/status as the single source of truth

const TYPE_META = {
  ROAD_DAMAGE:  { icon: "road-variant",         color: "#DC2626", title: "Road Damage"      },
  POTHOLE:      { icon: "road-variant",         color: "#DC2626", title: "Pothole"          },
  GARBAGE:      { icon: "trash-can-outline",    color: "#0891B2", title: "Waste Collection" },
  STREETLIGHT:  { icon: "lightbulb-on-outline", color: COLORS.primary, title: "Street Light" },
  WATER_SUPPLY: { icon: "water-outline",        color: COLORS.primary, title: "Water Supply" },
  DRAINAGE:     { icon: "pipe-disconnected",    color: "#0891B2", title: "Drainage"         },
  SANITATION:   { icon: "broom",                color: "#0891B2", title: "Sanitation"       },
  TREE_CUTTING: { icon: "tree-outline",         color: "#059669", title: "Tree Issue"       },
  CONSTRUCTION: { icon: "hammer-wrench",        color: "#D97706", title: "Construction"     },
  OTHER:        { icon: "alert-outline",        color: "#DC2626", title: "Civic Issue"      },
};

const ROLE_META = {
  SUPER_ADMIN:    { label: "Super Admin",    color: COLORS.primary, bg: "#DBEAFE" },
  DISTRICT_ADMIN: { label: "District Admin", color: "#7C3AED",      bg: "#EDE9FE" },
  INSPECTOR:      { label: "Inspector",      color: "#0F8A83",      bg: "#DDF8F5" },
  WORKER:         { label: "Worker",         color: "#059669",      bg: "#D1FAE5" },
  CITIZEN:        { label: "Citizen",        color: "#D97706",      bg: "#FEF3C7" },
};

const getWardDisplayLabel = (complaint) => {
  const wardValue = complaint?.ward_id || complaint?.ward_name || complaint?.ward;

  if (typeof wardValue === "string" && wardValue.trim()) return wardValue;
  if (wardValue && typeof wardValue === "object") {
    if (typeof wardValue.ward_name === "string" && wardValue.ward_name.trim()) return wardValue.ward_name;
    if (typeof wardValue.name === "string" && wardValue.name.trim()) return wardValue.name;
    if (wardValue.ward_number != null) return `Ward #${wardValue.ward_number}`;
  }

  return "Assigned Ward";
};

const ROLE_GRADIENT = {
  SUPER_ADMIN:    ["#0052CC", "#172B4D"],
  DISTRICT_ADMIN: ["#5B21B6", "#2D1B69"],
  INSPECTOR:      ["#0F8A83", "#0B6E69"],
  WORKER:         ["#065F46", "#022C22"],
  CITIZEN:        ["#0052CC", "#172B4D"],
};

const ROLE_GREETING = {
  SUPER_ADMIN:    { title: "Civifix", sub: "Super Admin Panel"    },
  DISTRICT_ADMIN: { title: "Civifix", sub: "District Admin Panel" },
  INSPECTOR:      { title: "Civifix", sub: "Inspector Dashboard"  },
  WORKER:         { title: "Civifix", sub: "Worker Dashboard"     },
  CITIZEN:        { title: "Civifix", sub: "Citizen Platform"     },
};

// ─── SHARED MICRO-COMPONENTS ─────────────────────────────────────────────────

const Avatar = ({ name, size = 44, color = COLORS.primary }) => (
  <View style={{
    width: size, height: size, borderRadius: size / 2,
    backgroundColor: `${color}22`, alignItems: "center", justifyContent: "center",
  }}>
    <Text style={{ color, fontSize: size * 0.36, fontWeight: "900" }}>{initials(name)}</Text>
  </View>
);

const Pill = ({ label, color, bg }) => (
  <View style={{ backgroundColor: bg, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 }}>
    <Text style={{ color, fontSize: 10, fontWeight: "800" }}>{label}</Text>
  </View>
);

const SectionTitle = ({ left, right, onRight, rightComponent }) => (
  <View style={{
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    marginTop: SPACING.xl, marginBottom: SPACING.sm,
  }}>
    <Text style={{ color: COLORS.textDark, fontSize: FONT_SIZES.sm, fontWeight: "800" }}>{left}</Text>
    {rightComponent ? rightComponent : (
      right && (
        <TouchableOpacity onPress={onRight}>
          <Text style={{ color: COLORS.primary, fontSize: FONT_SIZES.xs, fontWeight: "800" }}>{right}</Text>
        </TouchableOpacity>
      )
    )}
  </View>
);

const MetricCard = ({ icon, value, label, color, bg }) => (
  <View style={{
    flex: 1, backgroundColor: COLORS.card, borderRadius: 12, padding: SPACING.md,
    alignItems: "center", ...SHADOWS.md, minHeight: 84,
  }}>
    <View style={{
      width: 32, height: 32, borderRadius: 10, backgroundColor: bg ?? `${color}15`,
      alignItems: "center", justifyContent: "center", marginBottom: 6,
    }}>
      <Icon name={icon} size={17} color={color} />
    </View>
    <Text style={{ color: COLORS.textDark, fontSize: FONT_SIZES.lg, fontWeight: "900" }}>{value ?? "—"}</Text>
    <Text style={{ color: COLORS.textLight, fontSize: 9.5, fontWeight: "700", textAlign: "center", marginTop: 1 }}>{label}</Text>
  </View>
);

const ComplaintItem = ({ complaint, index, total, onPress }) => {
  const type   = complaint.complaint_type || "OTHER";
  const meta   = TYPE_META[type] || TYPE_META.OTHER;
  const status = getComplaintStatusMeta(complaint.status);
  const title  = complaint.title || complaint.type || meta.title;
  const desc   = complaint.description || "No description provided";

  return (
    <TouchableOpacity
      activeOpacity={0.78}
      onPress={onPress}
      style={{
        flexDirection: "row", alignItems: "center",
        paddingHorizontal: SPACING.md, paddingVertical: SPACING.md,
        borderBottomWidth: index === total - 1 ? 0 : 1,
        borderBottomColor: COLORS.border,
      }}
    >
      <View style={{
        width: 34, height: 34, borderRadius: 8,
        backgroundColor: `${meta.color}14`,
        alignItems: "center", justifyContent: "center", marginRight: SPACING.md,
      }}>
        <Icon name={meta.icon} size={18} color={meta.color} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text numberOfLines={1} style={{ color: COLORS.textDark, fontSize: FONT_SIZES.md, fontWeight: "800" }}>{title}</Text>
        <Text numberOfLines={1} style={{ color: COLORS.textLight, fontSize: FONT_SIZES.xs, fontWeight: "600" }}>{desc}</Text>
        <Text style={{ color: COLORS.textLight, fontSize: 9.5, fontWeight: "700", marginTop: 2 }}>
          {complaint.complaint_id || complaint._id || "#CIV-NEW"}
        </Text>
      </View>
      <View style={{ alignItems: "flex-end", gap: 4 }}>
        <View style={{ backgroundColor: status.bg, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4 }}>
          <Text style={{ color: status.color, fontSize: 9.5, fontWeight: "800" }}>{status.label}</Text>
        </View>
        <Icon name="chevron-right" size={14} color={COLORS.textLight} />
      </View>
    </TouchableOpacity>
  );
};

const InfoItem = ({ icon, iconColor, iconBg, primary, secondary, badge, badgeColor, badgeBg, index, total }) => (
  <View style={{
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.md,
    borderBottomWidth: index === total - 1 ? 0 : 1,
    borderBottomColor: COLORS.border,
  }}>
    <View style={{
      width: 34, height: 34, borderRadius: 8,
      backgroundColor: iconBg ?? `${iconColor}14`,
      alignItems: "center", justifyContent: "center", marginRight: SPACING.md,
    }}>
      <Icon name={icon} size={17} color={iconColor} />
    </View>
    <View style={{ flex: 1, minWidth: 0 }}>
      <Text numberOfLines={1} style={{ color: COLORS.textDark, fontSize: FONT_SIZES.md, fontWeight: "700" }}>{primary}</Text>
      {!!secondary && <Text numberOfLines={1} style={{ color: COLORS.textLight, fontSize: FONT_SIZES.xs }}>{secondary}</Text>}
    </View>
    {badge && (
      <View style={{ backgroundColor: badgeBg ?? "#F1F5F9", borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 }}>
        <Text style={{ color: badgeColor ?? COLORS.textLight, fontSize: 9.5, fontWeight: "800" }}>{badge}</Text>
      </View>
    )}
  </View>
);

const ListCard = ({ children, empty, emptyLabel }) => (
  <View style={{ backgroundColor: COLORS.card, borderRadius: 12, overflow: "hidden", ...SHADOWS.md }}>
    {children}
    {empty && (
      <View style={{ padding: SPACING.xl, alignItems: "center" }}>
        <Icon name="clipboard-text-outline" size={28} color={COLORS.border} />
        <Text style={{ color: COLORS.textLight, fontSize: FONT_SIZES.xs, marginTop: 8, textAlign: "center" }}>
          {emptyLabel || "No items yet."}
        </Text>
      </View>
    )}
  </View>
);

const QuickActionBtn = ({ icon, title, color, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.82}
    onPress={onPress}
    style={{
      width: "48%", minHeight: 100, borderRadius: 16,
      backgroundColor: COLORS.card, alignItems: "center",
      justifyContent: "center", paddingHorizontal: 8,
      paddingVertical: 12, ...SHADOWS.md,
    }}
  >
    <View style={{
      width: 44, height: 44, borderRadius: 22,
      backgroundColor: `${color}14`, alignItems: "center",
      justifyContent: "center", marginBottom: 8,
    }}>
      <Icon name={icon} size={22} color={color} />
    </View>
    <Text
      numberOfLines={2}
      adjustsFontSizeToFit
      minimumFontScale={0.8}
      style={{ color: COLORS.textDark, fontSize: 12, lineHeight: 15, fontWeight: "800", textAlign: "center" }}
    >
      {title}
    </Text>
  </TouchableOpacity>
);

// ─── USER PROFILE CARD ───────────────────────────────────────────────────────

const UserProfileCard = ({ meData, user, stats }) => {
  const displayName  = meData?.name  ?? user?.name  ?? "Welcome";
  const displayEmail = meData?.email ?? user?.email ?? "";
  const role         = meData?.role  ?? user?.role  ?? "CITIZEN";
  const district     = meData?.district ?? user?.district ?? "";
  const roleMeta     = ROLE_META[role]     ?? ROLE_META.CITIZEN;
  const roleGrad     = ROLE_GRADIENT[role] ?? ROLE_GRADIENT.CITIZEN;
  const avatarColor  = roleGrad[0];

  return (
    <View style={{ backgroundColor: COLORS.card, borderRadius: 16, padding: SPACING.lg, ...SHADOWS.lg }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Avatar name={displayName} size={44} color={avatarColor} />
        <View style={{ flex: 1, marginLeft: SPACING.md, minWidth: 0 }}>
          <Text numberOfLines={1} style={{ color: COLORS.textDark, fontSize: FONT_SIZES.md, fontWeight: "900" }}>
            {displayName}
          </Text>
          {!!displayEmail && (
            <Text numberOfLines={1} style={{ color: COLORS.textLight, fontSize: FONT_SIZES.xs, marginTop: 1 }}>
              {displayEmail}
            </Text>
          )}
          <View style={{ flexDirection: "row", gap: 6, marginTop: 5, flexWrap: "wrap" }}>
            <Pill label={roleMeta.label} color={roleMeta.color} bg={roleMeta.bg} />
            {/* {!!district && <Pill label={`📍 ${district}`} color="#059669" bg="#D1FAE5" />} */}
          </View>
        </View>
      </View>

      {stats && stats.length > 0 && (
        <>
          <View style={{ height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.md }} />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {stats.map((s, i) => (
              <React.Fragment key={i}>
                {i > 0 && <View style={{ width: 1, height: 26, backgroundColor: COLORS.border }} />}
                <View style={{ flex: 1, alignItems: "center" }}>
                  <Text style={{ color: COLORS.textDark, fontSize: FONT_SIZES.lg, fontWeight: "900" }}>{s.value ?? "—"}</Text>
                  <Text style={{ color: COLORS.textLight, fontSize: 9, fontWeight: "600", marginTop: 1 }}>{s.label}</Text>
                </View>
              </React.Fragment>
            ))}
          </View>
        </>
      )}
    </View>
  );
};

// ─── ROLE DASHBOARDS ─────────────────────────────────────────────────────────

const SuperAdminDashboard = ({ navigation, meData, user }) => {
  const [stats, setStats]           = useState({});
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const [statsRes, complaintsRes] = await Promise.all([
        authService.getAdminStats?.() ?? Promise.resolve({}),
        authService.getComplaints?.() ?? Promise.resolve([]),
      ]);
      setStats(statsRes?.data ?? statsRes ?? {});
      setComplaints(getItems(complaintsRes).slice(0, 5));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const profileStats = [
    { value: stats.total_districts ?? "—", label: "Districts" },
    { value: stats.total_complaints ?? complaints.length, label: "Complaints" },
    { value: stats.total_workers ?? "—", label: "Workers" },
  ];

  const quickActions = [
    { icon: "domain-plus",   title: "Create\nDistrict",  color: COLORS.primary, onPress: () => navigation.navigate("CreateDistrictAdmin") },
    { icon: "account-plus",  title: "Create\nInspector", color: "#7C3AED",      onPress: () => navigation.navigate("CreateInspector") },
    { icon: "hammer-wrench", title: "Create\nWorker",    color: "#059669",      onPress: () => navigation.navigate("CreateWorker") },
    { icon: "chart-bar",     title: "Reports",           color: COLORS.accent,  onPress: () => navigation.navigate("Reports") },
  ];

  const metrics = [
    { icon: "map-marker-radius", value: stats.total_wards      ?? "—", label: "Total Wards", color: COLORS.primary, bg: "#DBEAFE" },
    { icon: "account-tie",       value: stats.total_inspectors ?? "—", label: "Inspectors",  color: "#0891B2",      bg: "#CFFAFE" },
    { icon: "account-hard-hat",  value: stats.total_workers    ?? "—", label: "Workers",     color: "#059669",      bg: "#D1FAE5" },
    { icon: "clipboard-list",    value: stats.total_complaints ?? complaints.length, label: "Complaints", color: "#D97706", bg: "#FEF3C7" },
  ];

  return (
    <>
      <UserProfileCard meData={meData} user={user} stats={profileStats} />
      <SectionTitle left="Quick Actions" />
      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 12 }}>
        {quickActions.map((a, i) => <QuickActionBtn key={i} {...a} />)}
      </View>
      <SectionTitle left="Overview" />
      <View style={{ flexDirection: "row", gap: SPACING.sm, flexWrap: "wrap" }}>
        {metrics.map((m, i) => (
          <View key={i} style={{ width: "47.5%" }}><MetricCard {...m} /></View>
        ))}
      </View>
      <SectionTitle left="Recent Complaints" right="View All" onRight={() => navigation.getParent()?.navigate("Complaints")} />
      <ListCard empty={!loading && complaints.length === 0} emptyLabel="No complaints yet.">
        {loading
          ? <View style={{ padding: SPACING.xl }}><ActivityIndicator color={COLORS.primary} /></View>
          : complaints.map((c, i) => (
              <ComplaintItem key={c._id || i} complaint={c} index={i} total={complaints.length}
                onPress={() => {
                  console.log("[DashboardScreen] Complaint pressed (SuperAdmin):", c._id || c.complaint_id);
                  navigation.navigate("ComplaintDetail", { complaint: c, complaintId: c._id || c.complaint_id });
                }} />
            ))
        }
      </ListCard>
    </>
  );
};

const DistrictAdminDashboard = ({ navigation, meData, user }) => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await authService.getDistrictAdminDashboard?.();
      setDashboard(res?.data ?? res ?? null);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const stats = dashboard?.stats ?? {};
  const wardsSummary = dashboard?.wards_summary ?? {};
  const topPerformers = dashboard?.top_performers ?? [];
  const activities = dashboard?.recent_activities ?? [];

  const profileStats = [
    { value: stats.total_complaints ?? 0, label: "Complaints" },
    { value: stats.pending ?? 0,          label: "Pending" },
    { value: stats.resolved ?? 0,         label: "Resolved" },
  ];

  const metrics = [
    { icon: "map-marker-radius", value: wardsSummary.total_wards ?? 0,       label: "Wards",        color: COLORS.primary, bg: "#DBEAFE" },
    { icon: "alert-circle",      value: wardsSummary.unassigned_wards ?? 0,  label: "Unassigned",   color: "#D97706",      bg: "#FEF3C7" },
    { icon: "checkbox-marked",   value: stats.resolved ?? 0,                 label: "Resolved",     color: "#059669",      bg: "#D1FAE5" },
    { icon: "clipboard-list",    value: stats.total_complaints ?? 0,         label: "Total",        color: "#0891B2",      bg: "#CFFAFE" },
  ];

  const L = () => <View style={{ padding: SPACING.lg }}><ActivityIndicator color={COLORS.primary} /></View>;

  return (
    <>
      <UserProfileCard meData={meData} user={user} stats={profileStats} />
      <SectionTitle left="District Overview" />
      <View style={{ flexDirection: "row", gap: SPACING.sm, flexWrap: "wrap" }}>
        {metrics.map((m, i) => <View key={i} style={{ width: "47.5%" }}><MetricCard {...m} /></View>)}
      </View>

      {topPerformers.length > 0 && (
        <>
          <SectionTitle left="Top Performers" />
          <ListCard empty={false} emptyLabel="">
            {topPerformers.map((p, i) => (
              <InfoItem key={i} index={i} total={topPerformers.length}
                icon="star" iconColor="#D97706" iconBg="#FEF3C7"
                primary={p.name || "Inspector"}
                secondary={`${p.complaints_resolved || 0} resolved`}
                badge={`#${i + 1}`} badgeColor="#D97706" badgeBg="#FEF3C7" />
            ))}
          </ListCard>
        </>
      )}

      <SectionTitle left="Recent Activity" right="View All" onRight={() => navigation.getParent()?.navigate("Complaints")} />
      <ListCard empty={!loading && activities.length === 0} emptyLabel="No activities found.">
        {loading ? <L /> : activities.slice(0, 5).map((a, i) => (
          <InfoItem key={a.id || i} index={i} total={Math.min(activities.length, 5)}
            icon="clipboard-text" iconColor={COLORS.primary} iconBg="#DBEAFE"
            primary={a.title || "Complaint"}
            secondary={a.status || ""}
            badge={a.status} badgeColor={COLORS.primary} badgeBg="#DBEAFE" />
        ))}
      </ListCard>

      <SectionTitle left="Ward Management" right="View All" onRight={() => navigation.navigate("Wards", { screen: "WardList" })} />
      <TouchableOpacity
        onPress={() => navigation.navigate("Wards", { screen: "WardList" })}
        style={{ backgroundColor: COLORS.card, borderRadius: 12, padding: SPACING.lg, ...SHADOWS.md, marginBottom: SPACING.lg }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View>
            <Text style={{ fontSize: FONT_SIZES.md, fontWeight: "700", color: COLORS.textDark }}>
              {wardsSummary.total_wards ?? 0} Total Wards
            </Text>
            <Text style={{ fontSize: FONT_SIZES.xs, color: COLORS.textLight, marginTop: 4 }}>
              {wardsSummary.active_wards ?? 0} active • {wardsSummary.unassigned_wards ?? 0} unassigned
            </Text>
          </View>
          <Icon name="chevron-right" size={20} color={COLORS.primary} />
        </View>
      </TouchableOpacity>
    </>
  );
};

const InspectorComplaintItem = ({ complaint, index, total, onPress }) => {
  const type   = complaint.complaint_type || "OTHER";
  const meta   = TYPE_META[type] || TYPE_META.OTHER;
  const status = getComplaintStatusMeta(complaint.status);
  const title  = meta.title;
  const desc   = complaint.description || "No description provided";
  
  const compId = complaint.complaint_id || complaint._id || "#CIV-NEW";
  const priority = complaint.priority || "MEDIUM";
  const citizenName = complaint.user_id?.name || complaint.citizen_name || "Citizen";
  const createdDate = complaint.created_at ? new Date(complaint.created_at).toLocaleDateString() : "—";
  const wardName = getWardDisplayLabel(complaint);
  const address = complaint.address || "No address provided";
  const hasImages = complaint.images && complaint.images.length > 0;

  return (
    <TouchableOpacity
      activeOpacity={0.78}
      onPress={onPress}
      style={{
        padding: SPACING.lg,
        borderBottomWidth: index === total - 1 ? 0 : 1,
        borderBottomColor: COLORS.border,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: SPACING.xs }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: SPACING.sm }}>
          <View style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: `${meta.color}15`, alignItems: "center", justifyContent: "center" }}>
            <Icon name={meta.icon} size={15} color={meta.color} />
          </View>
          <Text style={{ color: COLORS.textDark, fontSize: FONT_SIZES.md, fontWeight: "800" }}>{title}</Text>
        </View>
        <View style={{ backgroundColor: status.bg, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4 }}>
          <Text style={{ color: status.color, fontSize: 9.5, fontWeight: "800" }}>{status.label}</Text>
        </View>
      </View>
      
      <Text numberOfLines={2} style={{ color: COLORS.textLight, fontSize: FONT_SIZES.sm, marginBottom: SPACING.md, lineHeight: 20 }}>
        {desc}
      </Text>
      
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: SPACING.md }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Icon name="identifier" size={14} color={COLORS.textLight} />
          <Text style={{ color: COLORS.textLight, fontSize: FONT_SIZES.xs }}>{compId}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Icon name="flag-outline" size={14} color={priority === "HIGH" ? "#DC2626" : priority === "MEDIUM" ? "#D97706" : "#059669"} />
          <Text style={{ color: COLORS.textLight, fontSize: FONT_SIZES.xs }}>{priority}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Icon name="account-outline" size={14} color={COLORS.textLight} />
          <Text style={{ color: COLORS.textLight, fontSize: FONT_SIZES.xs }}>{citizenName}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Icon name="calendar-outline" size={14} color={COLORS.textLight} />
          <Text style={{ color: COLORS.textLight, fontSize: FONT_SIZES.xs }}>{createdDate}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Icon name="map-marker-outline" size={14} color={COLORS.textLight} />
          <Text style={{ color: COLORS.textLight, fontSize: FONT_SIZES.xs }}>{wardName}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4, width: "100%", marginTop: 4 }}>
          <Icon name="map-marker-radius-outline" size={14} color={COLORS.textLight} />
          <Text numberOfLines={1} style={{ color: COLORS.textLight, fontSize: FONT_SIZES.xs, flex: 1 }}>
            {address}{complaint.landmark ? ` (Landmark: ${complaint.landmark})` : ""}
          </Text>
        </View>
        {hasImages && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
            <Icon name="image-outline" size={14} color="#0F8A83" />
            <Text style={{ color: "#0F8A83", fontSize: FONT_SIZES.xs }}>View Images</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const InspectorDashboard = ({ navigation, meData, user }) => {
  // ── State ────────────────────────────────────────────────────────────────
  const [wards, setWards]               = useState([]);
  const [selectedWardId, setSelectedWardId] = useState("");
  const [complaints, setComplaints]     = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [stats, setStats]               = useState({ total: 0, pending: 0, in_progress: 0, resolved: 0, rejected: 0 });
  const [loadingWards, setLoadingWards] = useState(true);
  const [loadingComplaints, setLoadingComplaints] = useState(false);
  const [wardError, setWardError]       = useState(null);
  const [showPicker, setShowPicker]     = useState(false);

  // ── Load all wards on mount ──────────────────────────────────────────────
  useEffect(() => {
    loadWards();
  }, []);

  const loadWards = async () => {
    setLoadingWards(true);
    setWardError(null);
    try {
      console.log("[InspectorDashboard] Loading wards via GET /api/v1/wards...");

      const res = await authService.getAllWards({ limit: 100 });

      console.log("[InspectorDashboard] getAllWards raw result type:", typeof res, Array.isArray(res));
      console.log("[InspectorDashboard] getAllWards result keys:", res ? Object.keys(res) : "null");

      // Response after unwrapResponse: { data: [...wards], total, page, ... }
      let wardsList = [];
      if (Array.isArray(res)) {
        wardsList = res;
      } else if (Array.isArray(res?.data)) {
        wardsList = res.data;
      } else if (Array.isArray(res?.wards)) {
        wardsList = res.wards;
      }

      console.log(`[InspectorDashboard] Parsed ${wardsList.length} wards`);

      if (wardsList.length > 0) {
        console.log("[InspectorDashboard] First ward:", wardsList[0]._id, wardsList[0].ward_name);
        console.log("[InspectorDashboard] Last  ward:", wardsList[wardsList.length - 1]._id, wardsList[wardsList.length - 1].ward_name);
      } else {
        console.warn("[InspectorDashboard] No wards returned — dropdown will be empty");
      }

      setWards(wardsList);

      if (wardsList.length > 0) {
        const firstId = wardsList[0]._id || wardsList[0].id || "";
        console.log("[InspectorDashboard] Auto-selecting first ward:", firstId);
        setSelectedWardId(firstId);
      }
    } catch (err) {
      console.error("[InspectorDashboard] loadWards error:", err?.message || err);
      setWardError("Failed to load wards. Pull down to retry.");
    } finally {
      setLoadingWards(false);
    }
  };

  // ── Load complaints whenever selectedWardId changes ───────────────────────
  useEffect(() => {
    if (!selectedWardId) {
      console.log("[InspectorDashboard] No ward selected yet — skipping complaints load");
      return;
    }
    loadComplaints(selectedWardId);
    AsyncStorage.setItem("inspectorSelectedWardId", selectedWardId).catch(console.error);
  }, [selectedWardId]);

  const loadComplaints = async (wardId) => {
    setLoadingComplaints(true);
    try {
      console.log(`[InspectorDashboard] Loading complaints for ward_id=${wardId}`);
      console.log(`[InspectorDashboard] API call: GET /inspector/complaints?ward_id=${wardId}&limit=100`);

      const res = await authService.getWardComplaints({ ward_id: wardId, limit: 100 });

      console.log("[InspectorDashboard] getWardComplaints raw result:", typeof res, res ? Object.keys(res) : "null");

      // Backend returns: { complaints: [...], stats: {...}, page, total, ... }
      const complaintsList = res?.complaints || res?.data || (Array.isArray(res) ? res : []);

      console.log(`[InspectorDashboard] Parsed ${complaintsList.length} complaints`);

      complaintsList.forEach((c, i) => {
        if (i < 3) console.log(`  [complaint ${i}] id=${c.complaint_id} type=${c.complaint_type} status=${c.status}`);
      });

      console.log("[InspectorDashboard] API response for complaints before rendering:", complaintsList.map(c => ({ id: c.complaint_id || c._id, status: c.status })));
      setComplaints(complaintsList);

      // Parse stats from response
      if (res?.stats) {
        console.log("[InspectorDashboard] Stats from backend:", res.stats);
        setStats(res.stats);
      } else {
        // Compute locally
        const total      = complaintsList.length;
        const pending    = complaintsList.filter(c => ["OPEN", "PENDING"].includes(c.status)).length;
        const in_progress = complaintsList.filter(c => ["IN_PROGRESS", "WORKING", "ACCEPTED", "FIELD_VISIT", "APPROVAL"].includes(c.status)).length;
        const resolved   = complaintsList.filter(c => ["RESOLVED", "CLOSED"].includes(c.status)).length;
        const rejected   = complaintsList.filter(c => c.status === "REJECTED").length;
        setStats({ total, pending, in_progress, resolved, rejected });
      }
    } catch (err) {
      console.error("[InspectorDashboard] loadComplaints error:", err?.message || err);
      setComplaints([]);
    } finally {
      setLoadingComplaints(false);
    }
  };

  // ── Derive selected ward label ───────────────────────────────────────────
  const selectedWard = wards.find(w => (w._id || w.id) === selectedWardId);
  const selectedWardLabel = selectedWard
    ? `Ward #${selectedWard.ward_number} – ${selectedWard.ward_name}`
    : "Select a Ward";

  // ── Stat metrics ─────────────────────────────────────────────────────────
  const metrics = [
    { icon: "clipboard-list",        value: stats.total ?? 0,       label: "Total",       color: "#374151", bg: "#F3F4F6" },
    { icon: "alert-circle-outline",  value: stats.pending ?? 0,     label: "Pending",     color: "#D97706", bg: "#FEF3C7" },
    { icon: "progress-wrench",       value: stats.in_progress ?? 0, label: "In Progress", color: COLORS.primary, bg: "#DBEAFE" },
    { icon: "check-circle-outline",  value: stats.resolved ?? 0,    label: "Resolved",    color: "#059669", bg: "#D1FAE5" },
    { icon: "close-circle-outline",  value: stats.rejected ?? 0,    label: "Rejected",    color: "#DC2626", bg: "#FFE4E6" },
  ];

  // ── Loading state (wards) ─────────────────────────────────────────────────
  if (loadingWards) {
    return (
      <View style={{ alignItems: "center", paddingVertical: SPACING.xxl }}>
        <ActivityIndicator size="large" color="#0F8A83" />
        <Text style={{ color: COLORS.textLight, fontSize: FONT_SIZES.sm, marginTop: SPACING.md }}>
          Loading wards…
        </Text>
      </View>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (wardError) {
    return (
      <View style={{ alignItems: "center", paddingVertical: SPACING.xxl }}>
        <Icon name="alert-circle-outline" size={48} color="#DC2626" />
        <Text style={{ color: COLORS.textDark, fontSize: FONT_SIZES.md, fontWeight: "700", marginTop: SPACING.md }}>
          Ward Load Error
        </Text>
        <Text style={{ color: COLORS.textLight, fontSize: FONT_SIZES.sm, textAlign: "center", marginTop: 4 }}>
          {wardError}
        </Text>
        <TouchableOpacity
          onPress={loadWards}
          style={{ marginTop: SPACING.lg, backgroundColor: "#0F8A83", borderRadius: 10, paddingHorizontal: 24, paddingVertical: 10 }}
        >
          <Text style={{ color: "#FFFFFF", fontWeight: "800", fontSize: FONT_SIZES.sm }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Empty wards state ─────────────────────────────────────────────────────
  if (wards.length === 0) {
    return (
      <View style={{ alignItems: "center", paddingVertical: SPACING.xxl }}>
        <Icon name="map-marker-off-outline" size={48} color={COLORS.border} />
        <Text style={{ color: COLORS.textDark, fontSize: FONT_SIZES.md, fontWeight: "700", marginTop: SPACING.md }}>
          No Wards Available
        </Text>
        <Text style={{ color: COLORS.textLight, fontSize: FONT_SIZES.sm, textAlign: "center", marginTop: 4 }}>
          No wards found for your district.
        </Text>
      </View>
    );
  }

  console.log(`[InspectorDashboard] Rendering ${complaints.length} complaints for selectedWardId: ${selectedWardId}`);

  return (
    <>
      {/* ── User Profile Card ─────────────────────────────────────────── */}
      <UserProfileCard meData={meData} user={user} stats={[
        { value: stats.total,       label: "Total"    },
        { value: stats.pending,     label: "Pending"  },
        { value: stats.resolved,    label: "Resolved" },
      ]} />

      {/* ── Ward Selector ─────────────────────────────────────────────── */}
      <View style={{ marginTop: SPACING.lg, marginBottom: SPACING.md }}>
        <Text style={{ color: COLORS.textLight, fontSize: FONT_SIZES.xs, fontWeight: "700", textTransform: "uppercase", marginBottom: 6 }}>
          Select Ward ({wards.length} available)
        </Text>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setShowPicker(!showPicker)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: COLORS.card,
            borderRadius: 12,
            paddingHorizontal: SPACING.md,
            paddingVertical: SPACING.md,
            borderWidth: 1,
            borderColor: COLORS.border,
            ...SHADOWS.sm
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon name="map-marker-radius" size={20} color="#0F8A83" />
            <Text style={{ marginLeft: SPACING.sm, color: COLORS.textDark, fontSize: FONT_SIZES.md, fontWeight: "600" }}>
              {selectedWardLabel}
            </Text>
          </View>
          <Icon name={showPicker ? "chevron-up" : "chevron-down"} size={20} color={COLORS.textLight} />
        </TouchableOpacity>

        {showPicker && (
          <View style={{ marginTop: 8, maxHeight: 220, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, overflow: "hidden", backgroundColor: COLORS.card, ...SHADOWS.md }}>
            <ScrollView nestedScrollEnabled showsVerticalScrollIndicator>
              {wards.map((ward) => {
                const wardId = ward._id || ward.id;
                const isSelected = wardId === selectedWardId;
                return (
                  <TouchableOpacity
                    key={wardId}
                    onPress={() => {
                      setSelectedWardId(wardId);
                      setShowPicker(false);
                    }}
                    style={{
                      paddingVertical: 12,
                      paddingHorizontal: SPACING.md,
                      borderBottomWidth: 1,
                      borderBottomColor: COLORS.border,
                      backgroundColor: isSelected ? "#DDF8F5" : COLORS.card,
                    }}
                  >
                    <Text style={{
                      color: isSelected ? "#0F8A83" : COLORS.textDark,
                      fontSize: FONT_SIZES.sm,
                      fontWeight: isSelected ? "800" : "500",
                    }}>
                      Ward #{ward.ward_number} – {ward.ward_name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}
      </View>

      {/* ── Stats Row ─────────────────────────────────────────────────── */}
      <SectionTitle left="Complaint Overview" />
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: SPACING.sm }}>
        {metrics.map((m, i) => (
          <View key={i} style={{ width: "47.5%" }}>
            <MetricCard {...m} />
          </View>
        ))}
      </View>

      {/* ── Status Chips ───────────────────────────────────────────── */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: SPACING.md, marginBottom: SPACING.sm }}>
        {["All", "Pending", "In Progress", "Resolved", "Rejected"].map(status => {
          const isSelected = statusFilter === status;
          return (
            <TouchableOpacity
              key={status}
              onPress={() => setStatusFilter(status)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: isSelected ? "#0F8A83" : COLORS.card,
                borderWidth: 1,
                borderColor: isSelected ? "#0F8A83" : COLORS.border,
                marginRight: 8,
                ...SHADOWS.sm,
              }}
            >
              <Text style={{
                color: isSelected ? "#fff" : COLORS.textDark,
                fontWeight: isSelected ? "700" : "500",
                fontSize: FONT_SIZES.sm
              }}>
                {status}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── Complaints List ───────────────────────────────────────────── */}
      <SectionTitle
        left={`Complaints in Ward${selectedWard ? ` #${selectedWard.ward_number}` : ""}`}
        rightComponent={
          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity onPress={() => selectedWardId && loadComplaints(selectedWardId)}>
              <Icon name="refresh" size={20} color="#0F8A83" />
            </TouchableOpacity>
          </View>
        }
      />

      <ListCard
        empty={!loadingComplaints && complaints.filter(c => {
          if (statusFilter === "All") return true;
          if (statusFilter === "Pending") return ["OPEN", "PENDING"].includes(c.status);
          if (statusFilter === "In Progress") return ["IN_PROGRESS", "WORKING", "ACCEPTED", "FIELD_VISIT", "APPROVAL"].includes(c.status);
          if (statusFilter === "Resolved") return ["RESOLVED", "CLOSED"].includes(c.status);
          if (statusFilter === "Rejected") return c.status === "REJECTED";
          return true;
        }).length === 0}
        emptyLabel={selectedWardId
          ? `No ${statusFilter === "All" ? "" : statusFilter.toLowerCase()} complaints available for this ward.`
          : "Select a ward to view complaints."
        }
      >
        {loadingComplaints
          ? <View style={{ padding: SPACING.xl }}><ActivityIndicator color="#0F8A83" /></View>
          : complaints.filter(c => {
              if (statusFilter === "All") return true;
              if (statusFilter === "Pending") return ["OPEN", "PENDING"].includes(c.status);
              if (statusFilter === "In Progress") return ["IN_PROGRESS", "WORKING", "ACCEPTED", "FIELD_VISIT", "APPROVAL"].includes(c.status);
              if (statusFilter === "Resolved") return ["RESOLVED", "CLOSED"].includes(c.status);
              if (statusFilter === "Rejected") return c.status === "REJECTED";
              return true;
            }).map((c, i, arr) => (
              <InspectorComplaintItem
                key={c._id || c.complaint_id || i}
                complaint={c}
                index={i}
                total={arr.length}
                onPress={() => {
                  console.log("[DashboardScreen] Complaint pressed (Inspector):", c._id || c.complaint_id);
                  navigation.navigate("ComplaintDetail", { complaint: c, complaintId: c._id || c.complaint_id });
                }}
              />
            ))
        }
      </ListCard>
    </>
  );
};

const WorkerDashboard = ({ navigation, meData, user }) => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await authService.getWorkerDashboard?.();
      setDashboard(res?.data ?? res ?? null);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const tasks = dashboard?.assigned_tasks ?? {};
  const assignments = dashboard?.recent_assignments ?? [];
  const completionRate = dashboard?.completion_rate ?? 0;

  const metrics = [
    { icon: "clipboard-alert-outline", value: tasks.total ?? 0,      label: "Assigned",    color: COLORS.primary, bg: "#DBEAFE" },
    { icon: "progress-wrench",         value: tasks.pending ?? 0,    label: "Pending",     color: "#D97706",      bg: "#FEF3C7" },
    { icon: "check-circle-outline",    value: tasks.completed ?? 0,  label: "Completed",   color: "#059669",      bg: "#D1FAE5" },
  ];

  const profileStats = [
    { value: tasks.total ?? 0,     label: "Total" },
    { value: tasks.pending ?? 0,   label: "Active"   },
    { value: tasks.completed ?? 0, label: "Done"     },
  ];

  return (
    <>
      <UserProfileCard meData={meData} user={user} stats={profileStats} />
      <SectionTitle left="My Tasks" />
      <View style={{ flexDirection: "row", gap: SPACING.sm }}>
        {metrics.map((m, i) => <MetricCard key={i} {...m} />)}
      </View>
      {completionRate > 0 && (
        <>
          <SectionTitle left="Performance" />
          <View style={{ backgroundColor: COLORS.card, borderRadius: 12, padding: SPACING.lg, ...SHADOWS.md, marginBottom: SPACING.lg }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.textLight }}>Completion Rate</Text>
              <Text style={{ fontSize: FONT_SIZES.lg, fontWeight: "700", color: COLORS.primary }}>
                {completionRate}%
              </Text>
            </View>
            <View style={{ height: 6, backgroundColor: "#E5E7EB", borderRadius: 3, marginTop: SPACING.md }}>
              <View style={{
                height: "100%",
                backgroundColor: COLORS.primary,
                borderRadius: 3,
                width: `${completionRate}%`,
              }} />
            </View>
          </View>
        </>
      )}
      <SectionTitle left="Assigned Tasks" right="View All" onRight={() => navigation.getParent()?.navigate("Complaints")} />
      <ListCard empty={!loading && assignments.length === 0} emptyLabel="No tasks assigned yet.">
        {loading
          ? <View style={{ padding: SPACING.lg }}><ActivityIndicator color={COLORS.primary} /></View>
          : assignments.map((c, i) => (
              <ComplaintItem key={c._id || i} complaint={c} index={i} total={assignments.length}
                onPress={() => {
                  console.log("[DashboardScreen] Complaint pressed (Worker):", c._id || c.complaint_id);
                  navigation.navigate("ComplaintDetail", { complaint: c, complaintId: c._id || c.complaint_id });
                }} />
            ))
        }
      </ListCard>
    </>
  );
};

const CitizenDashboard = ({ navigation, meData, user }) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]       = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await authService.getComplaints?.() ?? Promise.resolve([]);
      const items = getItems(res);
      console.log("[CitizenDashboard] API response for complaints before rendering:", items.slice(0, 5).map(c => ({ id: c.complaint_id || c._id, status: c.status })));
      setComplaints(items.slice(0, 5));
    } catch (e) { console.warn(e); }
    finally { setLoading(false); }
  };

  // Re-fetch complaints every time the dashboard gains focus
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => load());
    return unsubscribe;
  }, [navigation]);

  const counts = useMemo(() => ({
    open:   complaints.filter((c) => { const s = normalizeComplaintStatus(c.status); return ["PENDING", "OPEN"].includes(s); }).length,
    active: complaints.filter((c) => { const s = normalizeComplaintStatus(c.status); return ["ASSIGNED", "IN_PROGRESS", "APPROVAL"].includes(s); }).length,
    closed: complaints.filter((c) => { const s = normalizeComplaintStatus(c.status); return ["RESOLVED", "CLOSED"].includes(s); }).length,
  }), [complaints]);

  const profileStats = [
    { value: counts.open,   label: "Pending"  },
    { value: counts.active, label: "Active"   },
    { value: counts.closed, label: "Resolved" },
  ];

  const quickActions = [
    { icon: "flask-outline",      title: "Raise\nComplaint", color: COLORS.secondary, onPress: () => navigation.navigate("CreateComplaint") },
    { icon: "magnify",            title: "Track\nStatus",    color: COLORS.primary,   onPress: () => navigation.getParent()?.navigate("Complaints") },
  ];

  return (
    <>
      <UserProfileCard meData={meData} user={user} stats={profileStats} />
      <SectionTitle left="Quick Actions" />
      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 12 }}>
        {quickActions.map((a, i) => <QuickActionBtn key={i} {...a} />)}
      </View>
      <SectionTitle left="My Complaints" right="View All" onRight={() => navigation.getParent()?.navigate("Complaints")} />
      <ListCard
        empty={!loading && complaints.length === 0}
        emptyLabel={"No complaints yet.\nTap 'Raise Complaint' to get started."}
      >
        {loading
          ? <View style={{ padding: SPACING.lg }}><ActivityIndicator color={COLORS.primary} /></View>
          : complaints.map((c, i) => (
              <ComplaintItem key={c._id || i} complaint={c} index={i} total={complaints.length}
                onPress={() => navigation.navigate("ComplaintDetail", { complaint: c })} />
            ))
        }
      </ListCard>
    </>
  );
};

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────

export const DashboardScreen = ({ navigation }) => {
  const { user, signOut }           = useContext(AuthContext);
  const [meData, setMeData]         = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // ── Safe area insets — works on both iOS and Android ──
  const insets = useSafeAreaInsets();

  useEffect(() => { loadMe(); }, []);

  const loadMe = async () => {
    try {
      const res = await authService.getMe?.();
      setMeData(res?.data ?? null);
    } catch (e) { console.error("getMe failed:", e); }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMe();
    setRefreshKey((k) => k + 1);
    setRefreshing(false);
  };

  const role     = meData?.role ?? user?.role ?? "CITIZEN";
  const gradient = ROLE_GRADIENT[role] ?? ROLE_GRADIENT.CITIZEN;
  const greeting = ROLE_GREETING[role] ?? ROLE_GREETING.CITIZEN;

  const RoleDashboard = useCallback(() => {
    const props = { navigation, meData, user };
    switch (role) {
      case "SUPER_ADMIN":    return <SuperAdminDashboard    key={refreshKey} {...props} />;
      case "DISTRICT_ADMIN": return <DistrictAdminDashboard key={refreshKey} {...props} />;
      case "INSPECTOR":      return <InspectorDashboard     key={refreshKey} {...props} />;
      case "WORKER":         return <WorkerDashboard        key={refreshKey} {...props} />;
      default:               return <CitizenDashboard       key={refreshKey} {...props} />;
    }
  }, [role, refreshKey, meData]);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/*
        ─── STATUS BAR CONFIG ────────────────────────────────────────────────
        translucent        → content renders BEHIND the status bar (Android)
        backgroundColor    → removes the default opaque bar
        barStyle           → white clock/icons on the dark gradient
        ─────────────────────────────────────────────────────────────────────
      */}
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            progressViewOffset={insets.top + 8}
            tintColor="#FFFFFF"
            colors={["#FFFFFF"]}
          />
        }
        contentContainerStyle={{ paddingBottom: SPACING.xxl + 18 }}
      >
        {/*
          ─── GRADIENT HEADER ─────────────────────────────────────────────────
          paddingTop uses insets.top (from useSafeAreaInsets):
            • iOS  → actual notch / Dynamic Island height  (e.g. 44–59 px)
            • Android → status bar height (StatusBar.currentHeight)
          This is the ONLY reliable cross-platform way to do this.
          ─────────────────────────────────────────────────────────────────────
        */}
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingHorizontal: SPACING.lg,
            paddingTop: insets.top + SPACING.md,   // ← key: push content below status bar
            paddingBottom: 72,
            borderBottomLeftRadius: 28,
            borderBottomRightRadius: 28,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            {/* Logo + title */}
            <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
              <View style={{
                width: 38, height: 38, borderRadius: 19,
                backgroundColor: "rgba(255,255,255,0.18)",
                alignItems: "center", justifyContent: "center", marginRight: SPACING.sm,
              }}>
                <Icon name="city-variant-outline" size={22} color="#FFFFFF" />
              </View>
              <View>
                <Text style={{ color: "#FFFFFF", fontSize: FONT_SIZES.xl, fontWeight: "800", letterSpacing: 0.3 }}>
                  {greeting.title}
                </Text>
                <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: FONT_SIZES.xs }}>
                  {greeting.sub}
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>

              <TouchableOpacity
                onPress={() => navigation.getParent()?.navigate("Profile")}
                style={{
                  width: 38, height: 38, borderRadius: 19,
                  backgroundColor: "rgba(255,255,255,0.15)",
                  alignItems: "center", justifyContent: "center",
                }}
              >
                <Icon name="account-outline" size={20} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => signOut()}
                style={{
                  width: 38, height: 38, borderRadius: 19,
                  backgroundColor: "rgba(255,255,255,0.15)",
                  alignItems: "center", justifyContent: "center",
                }}
              >
                <Icon name="logout" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* Role content overlapping the gradient curve */}
        <View style={{ paddingHorizontal: SPACING.lg, marginTop: -52 }}>
          <RoleDashboard />
        </View>
      </ScrollView>
    </View>
  );
};

export default DashboardScreen;