import { Platform, View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Dimensions, Alert, Modal } from 'react-native';
import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from "../../constants/theme";
import MapView, { Marker } from "react-native-maps";
import { API_URL } from "../../constants/endpoints";
import authService from "../../services/authService";
import { getErrorMessage } from "../../services/api";
import { resolveImageUri } from "../../utils/imageUri";
import { ImageViewer } from "../../components";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const ComplaintPreviewScreen = ({ route, navigation }) => {
  const { form, ward, selectedType, selectedPri, districtName } = route.params;
  const { user } = useContext(AuthContext);
  const [submitting, setSubmitting] = useState(false);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerImageUrl, setViewerImageUrl] = useState("");
  const [userDistrictName, setUserDistrictName] = useState("");

  const [duplicateMatch, setDuplicateMatch] = useState(null);
  const [duplicatePopup, setDuplicatePopup] = useState(false);
  const [supporting, setSupporting] = useState(false);

  useEffect(() => {
    if (districtName) {
      setUserDistrictName(districtName);
    } else {
      const rawDist = user?.district;
      const nameVal = user?.district_name;
      if (typeof nameVal === "string" && nameVal.trim() && !/^[0-9a-fA-F]{24}$/.test(nameVal)) {
        setUserDistrictName(nameVal);
      } else if (typeof rawDist === "string" && rawDist.trim() && !/^[0-9a-fA-F]{24}$/.test(rawDist)) {
        setUserDistrictName(rawDist);
      } else {
        const distId = user?.district_id || (typeof rawDist === "string" && /^[0-9a-fA-F]{24}$/.test(rawDist) ? rawDist : "");
        if (distId) {
          authService.getDistricts().then(list => {
            const districtsList = Array.isArray(list) ? list : list?.data || [];
            const found = districtsList.find(d => (d._id || d.id) === distId);
            if (found) {
              setUserDistrictName(found.name);
            }
          });
        }
      }
    }
  }, [districtName, user]);

  const handleSupportExisting = async () => {
    if (!duplicateMatch || !duplicateMatch.existing_complaint) return;
    setSupporting(true);
    try {
      await authService.supportComplaint(duplicateMatch.existing_complaint.id);
      Alert.alert(
        "Supported Successfully",
        `You are now supporting complaint ${duplicateMatch.matched_complaint_id}!`,
        [{ text: "OK", onPress: () => navigation.popToTop() }]
      );
      setDuplicatePopup(false);
    } catch (err) {
      Alert.alert("Already Supported", getErrorMessage(err, "You have already supported this complaint."));
    } finally {
      setSupporting(false);
    }
  };

  const handleSubmit = async (bypassDuplicateCheck = false) => {
    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("ward_id", String(form.ward_id));
      formData.append("wardId", String(form.ward_id));
      
      const wardName = ward?.ward_name ?? ward?.label ?? "";
      formData.append("ward_name", wardName);
      formData.append("wardName", wardName);

      const resolvedDistId = user?.district_id || (user?.district && /^[0-9a-fA-F]{24}$/.test(user.district) ? user.district : "");
      formData.append("district_id", resolvedDistId || "");
      formData.append("districtId", resolvedDistId || "");
      formData.append("district_name", userDistrictName || "");
      formData.append("districtName", userDistrictName || "");

      formData.append("complaint_type", String(form.complaint_type));
      formData.append("description", String(form.description));
      formData.append("priority", String(form.priority));
      formData.append("latitude", String(form.latitude));
      formData.append("longitude", String(form.longitude));
      if (form.address) formData.append("address", String(form.address));
      if (form.landmark) formData.append("landmark", String(form.landmark));
      if (form.citizen_note) formData.append("citizen_note", String(form.citizen_note).trim());
      if (form.ai_verification) {
        formData.append("ai_verification", form.ai_verification);
      }
      if (bypassDuplicateCheck) {
        formData.append("force_create", "true");
        if (duplicateMatch) {
          formData.append("duplicate_detection", JSON.stringify(duplicateMatch));
        }
      }
      
      if (Array.isArray(form.images)) {
        form.images.forEach((img, index) => {
          let fileUri = img.uri;
          if (Platform.OS === 'android' && !fileUri.startsWith('file://') && !fileUri.startsWith('content://')) {
            fileUri = 'file://' + fileUri;
          }
          let mimeType = img.type || 'image/jpeg';
          if (mimeType === 'image') mimeType = 'image/jpeg';
          formData.append("images", {
            uri: fileUri,
            name: img.name || img.fileName || `image_${index}.jpg`,
            type: mimeType
          });
        });
      }

      const created = await authService.createComplaint(formData);
      
      if (created && created.status === "duplicate_check") {
        setDuplicateMatch(created.data);
        setDuplicatePopup(true);
        setSubmitting(false);
        return;
      }
      
      navigation.replace("ComplaintSuccess", { complaint: created });
    } catch (err) {
      alert(getErrorMessage(err, "Unable to submit complaint."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} disabled={submitting}>
          <Icon name="arrow-left" size={24} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Preview Complaint</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        
        {/* Type & Priority */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View style={styles.row}>
              <View style={[styles.iconWrap, { backgroundColor: selectedType?.color + "20" }]}>
                <Icon name={selectedType?.icon} size={24} color={selectedType?.color} />
              </View>
              <Text style={styles.title}>{selectedType?.label}</Text>
            </View>
          </View>
          <Text style={styles.description}>{form.description}</Text>
        </View>

        {/* Location & Map */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Icon name="map-marker" size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Location</Text>
          </View>
          <Text style={styles.addressText}>{form.address}</Text>
          {!!form.landmark && (
            <Text style={styles.addressText}>Landmark: {form.landmark}</Text>
          )}
          <Text style={styles.wardText}>District: {userDistrictName || ""}</Text>
          <Text style={styles.wardText}>Ward: {ward?.label}</Text>

          {form.latitude && form.longitude && (
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: parseFloat(form.latitude),
                  longitude: parseFloat(form.longitude),
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
              >
                <Marker coordinate={{ latitude: parseFloat(form.latitude), longitude: parseFloat(form.longitude) }} />
              </MapView>
            </View>
          )}
        </View>



        {/* Citizen Note */}
        {form.citizen_note ? (
          <View style={styles.card}>
            <View style={styles.row}>
              <Icon name="note-text-outline" size={20} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>Additional Note</Text>
            </View>
            <Text style={styles.description}>{form.citizen_note}</Text>
          </View>
        ) : null}

        {/* Uploaded Photos */}
        {Array.isArray(form.images) && form.images.length > 0 ? (
          <View style={styles.card}>
            <View style={styles.row}>
              <Icon name="image-multiple-outline" size={20} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>Attached Photos</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
              {form.images.map((img, idx) => {
                const uri = img.uri || img;
                return (
                  <TouchableOpacity
                    key={`img-${idx}`}
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
          </View>
        ) : null}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.editBtn} onPress={() => navigation.goBack()} disabled={submitting}>
          <Text style={styles.editBtnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={submitting}>
          {submitting ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.submitBtnText}>Confirm & Submit</Text>
          )}
        </TouchableOpacity>
      </View>
      <ImageViewer
        visible={viewerVisible}
        imageUrl={viewerImageUrl}
        onClose={() => setViewerVisible(false)}
      />
      <Modal
        visible={duplicatePopup}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDuplicatePopup(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.warningIconContainer}>
              <Icon name="alert-decagram" size={48} color="#D97706" />
            </View>
            <Text style={styles.modalTitle}>Similar Complaint Found</Text>
            <Text style={styles.modalSubtitle}>A similar complaint already exists in your ward.</Text>
            
            {duplicateMatch && (
              <View style={styles.dupDetailsCard}>
                <View style={styles.dupDetailRow}>
                  <Text style={styles.dupDetailLabel}>Complaint ID:</Text>
                  <Text style={styles.dupDetailValue}>{duplicateMatch.matched_complaint_id}</Text>
                </View>
                <View style={styles.dupDetailRow}>
                  <Text style={styles.dupDetailLabel}>Status:</Text>
                  <Text style={[styles.dupDetailValue, {textTransform: 'capitalize'}]}>
                    {String(duplicateMatch.existing_complaint?.status).toLowerCase()}
                  </Text>
                </View>
                <View style={styles.dupDetailRow}>
                  <Text style={styles.dupDetailLabel}>Supported By:</Text>
                  <Text style={styles.dupDetailValue}>{duplicateMatch.existing_complaint?.support_count || 0} Citizens</Text>
                </View>
                <View style={styles.dupDetailRow}>
                  <Text style={styles.dupDetailLabel}>Similarity:</Text>
                  <Text style={[styles.dupDetailValue, {color: '#D97706', fontWeight: 'bold'}]}>{duplicateMatch.similarity}%</Text>
                </View>
                <Text style={styles.dupReasonItalic}>
                  &ldquo;{duplicateMatch.reason}&rdquo;
                </Text>
              </View>
            )}

            <TouchableOpacity 
              style={styles.supportButton}
              disabled={supporting}
              onPress={handleSupportExisting}
            >
              {supporting ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.supportButtonText}>Support Existing Complaint</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.anywayButton}
              disabled={supporting}
              onPress={() => {
                setDuplicatePopup(false);
                handleSubmit(true);
              }}
            >
              <Text style={styles.anywayButtonText}>Create New Complaint Anyway</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: "row", alignItems: "center", padding: SPACING.xl,
    backgroundColor: COLORS.card, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  backBtn: { marginRight: SPACING.md },
  headerTitle: { fontSize: FONT_SIZES.lg, fontWeight: "700", color: COLORS.textDark },
  scroll: { flex: 1 },
  scrollContent: { padding: SPACING.md },
  card: {
    backgroundColor: COLORS.card, borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg, marginBottom: SPACING.md, ...SHADOWS.sm,
  },
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: SPACING.md },
  row: { flexDirection: "row", alignItems: "center" },
  iconWrap: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", marginRight: SPACING.md },
  title: { fontSize: FONT_SIZES.lg, fontWeight: "700", color: COLORS.textDark },
  priorityBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  priorityText: { fontSize: 12, fontWeight: "700" },
  description: { fontSize: FONT_SIZES.base, color: COLORS.textLight, lineHeight: 22 },
  sectionTitle: { fontSize: FONT_SIZES.md, fontWeight: "700", color: COLORS.textDark, marginLeft: SPACING.sm },
  addressText: { fontSize: FONT_SIZES.base, color: COLORS.textDark, marginTop: SPACING.md },
  wardText: { fontSize: FONT_SIZES.sm, color: COLORS.textGray, marginTop: 4 },
  mapContainer: { height: 150, width: "100%", borderRadius: BORDER_RADIUS.md, overflow: "hidden", marginTop: SPACING.md },
  map: { flex: 1 },
  imageScroll: { marginTop: SPACING.md },
  previewImage: { width: 100, height: 100, borderRadius: BORDER_RADIUS.md, marginRight: SPACING.md },
  
  bottomBar: {
    flexDirection: "row", padding: SPACING.lg, backgroundColor: COLORS.card,
    borderTopWidth: 1, borderTopColor: COLORS.border, gap: SPACING.md,
  },
  editBtn: {
    flex: 1, paddingVertical: 14, borderRadius: BORDER_RADIUS.md,
    borderWidth: 1, borderColor: COLORS.primary, alignItems: "center",
  },
  editBtnText: { color: COLORS.primary, fontWeight: "700", fontSize: FONT_SIZES.base },
  submitBtn: {
    flex: 2, paddingVertical: 14, borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primary, alignItems: "center", justifyContent: "center",
  },
  submitBtnText: { color: COLORS.card, fontWeight: "700", fontSize: FONT_SIZES.base },

  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20
  },
  modalContent: {
    backgroundColor: '#fff', borderRadius: 24, padding: 24, width: '100%', maxWidth: 340, alignItems: 'center'
  },
  warningIconContainer: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: '#FEF3C7', justifyContent: 'center', alignItems: 'center', marginBottom: 16
  },
  modalTitle: {
    fontSize: 20, fontWeight: '800', color: '#1F2937', marginBottom: 8, textAlign: 'center'
  },
  modalSubtitle: {
    fontSize: 13, color: '#6B7280', fontWeight: '500', marginBottom: 20, textAlign: 'center'
  },
  dupDetailsCard: {
    width: '100%', backgroundColor: '#F9FAFB', borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', padding: 16, marginBottom: 20
  },
  dupDetailRow: {
    flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#F3F4F6'
  },
  dupDetailLabel: {
    fontSize: 12, fontWeight: '700', color: '#6B7280'
  },
  dupDetailValue: {
    fontSize: 12, fontWeight: '800', color: '#1F2937'
  },
  dupReasonItalic: {
    fontSize: 11, fontStyle: 'italic', fontWeight: '600', color: '#4B5563', marginTop: 10, textAlign: 'center'
  },
  supportButton: {
    width: '100%', paddingVertical: 14, borderRadius: 12, backgroundColor: COLORS.primary, alignItems: 'center', marginBottom: 10,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4
  },
  supportButtonText: {
    color: '#fff', fontWeight: '800', fontSize: 13
  },
  anywayButton: {
    width: '100%', paddingVertical: 12, borderRadius: 12, backgroundColor: '#F3F4F6', alignItems: 'center'
  },
  anywayButtonText: {
    color: '#4B5563', fontWeight: '700', fontSize: 12
  },
});

export default ComplaintPreviewScreen;
