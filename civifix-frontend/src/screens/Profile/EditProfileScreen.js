import React, { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Modal, FlatList, TouchableOpacity } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from "../../constants/theme";
import Screen from "../../components/Screen";
import Button from "../../components/Button";
import TextField from "../../components/TextField";
import { AuthContext } from "../../context/AuthContext";
import authService from "../../services/authService";
import api, { getErrorMessage } from "../../services/api";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PRIMARY   = COLORS.primary;
const GRAY_100  = "#F3F4F6";
const GRAY_400  = "#9CA3AF";
const GRAY_600  = "#4B5563";
const GRAY_800  = "#1F2937";

/* ── DistrictDropdown ── */
function DistrictDropdown({ value, districts, loading, onSelect, error, loadingError }) {
  const [open, setOpen] = useState(false);
  const selected = districts.find((d) => d._id === value || d.id === value || d.name === value);

  return (
    <>
      <TouchableOpacity
        style={[styles.inputWrap, error && styles.inputError, open && styles.inputFocused]}
        onPress={() => setOpen(true)}
        activeOpacity={0.8}
      >
        <Icon name="map-marker-outline" size={18} color={value ? PRIMARY : GRAY_400} />
        <Text style={[styles.dropdownText, !selected && styles.dropdownPlaceholder]}>
          {loading ? "Loading districts…" : selected ? selected.name : "Select district"}
        </Text>
        {loading ? (
          <ActivityIndicator size="small" color={PRIMARY} />
        ) : (
          <Icon name={open ? "chevron-up" : "chevron-down"} size={18} color={GRAY_400} />
        )}
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        >
          <View style={styles.dropdownSheet}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownHeaderText}>Select District</Text>
              <TouchableOpacity onPress={() => setOpen(false)}>
                <Icon name="close" size={20} color={GRAY_600} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={districts}
              keyExtractor={(item) => item._id || item.id}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={styles.dropdownSep} />}
              renderItem={({ item }) => {
                const itemId = item._id || item.id;
                const isSelected = itemId === value || item.name === value;
                return (
                  <TouchableOpacity
                    style={[styles.dropdownItem, isSelected && styles.dropdownItemActive]}
                    onPress={() => {
                      onSelect(itemId);
                      setOpen(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.dropdownItemLeft}>
                      <View style={[styles.districtDot, isSelected && styles.districtDotActive]} />
                      <Text style={[styles.dropdownItemName, isSelected && styles.dropdownItemNameActive]}>
                        {item.name}
                      </Text>
                    </View>
                    {isSelected && <Icon name="check-circle" size={18} color={PRIMARY} />}
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <View style={styles.dropdownEmpty}>
                  <Icon name="map-marker-off-outline" size={32} color={GRAY_400} />
                  <Text style={styles.dropdownEmptyText}>
                    {loadingError ? `Failed to load: ${loadingError}` : "No districts found"}
                  </Text>
                </View>
              }
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

/* ── WardDropdown ── */
function WardDropdown({ value, wards, loading, onSelect, error, disabled }) {
  const [open, setOpen] = useState(false);
  const selected = wards.find((w) => (w._id || w.id || w.ward_id) === value || w.ward_name === value || w.name === value);

  return (
    <>
      <TouchableOpacity
        style={[
          styles.inputWrap, 
          error && styles.inputError, 
          open && styles.inputFocused,
          disabled && { backgroundColor: GRAY_100, opacity: 0.6 }
        ]}
        onPress={() => !disabled && setOpen(true)}
        activeOpacity={0.8}
        disabled={disabled}
      >
        <Icon name="map-marker-path" size={18} color={value ? PRIMARY : GRAY_400} />
        <Text style={[styles.dropdownText, !selected && styles.dropdownPlaceholder]}>
          {loading ? "Loading wards…" : selected ? (selected.ward_number ? `${String(selected.ward_number).padStart(2, "0")} - ${selected.ward_name}` : selected.ward_name) : "Select ward"}
        </Text>
        {loading ? (
          <ActivityIndicator size="small" color={PRIMARY} />
        ) : (
          <Icon name={open ? "chevron-up" : "chevron-down"} size={18} color={GRAY_400} />
        )}
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        >
          <View style={styles.dropdownSheet}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownHeaderText}>Select Ward</Text>
              <TouchableOpacity onPress={() => setOpen(false)}>
                <Icon name="close" size={20} color={GRAY_600} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={wards}
              keyExtractor={(item) => item._id || item.id || item.ward_id}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={styles.dropdownSep} />}
              renderItem={({ item }) => {
                const itemId = item._id || item.id || item.ward_id;
                const isSelected = itemId === value || item.ward_name === value || item.name === value;
                return (
                  <TouchableOpacity
                    style={[styles.dropdownItem, isSelected && styles.dropdownItemActive]}
                    onPress={() => {
                      onSelect(itemId);
                      setOpen(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.dropdownItemLeft}>
                      <View style={[styles.districtDot, isSelected && styles.districtDotActive]} />
                      <Text style={[styles.dropdownItemName, isSelected && styles.dropdownItemNameActive]}>
                        {item.ward_number ? `${String(item.ward_number).padStart(2, "0")} - ${item.ward_name}` : item.ward_name}
                      </Text>
                    </View>
                    {isSelected && <Icon name="check-circle" size={18} color={PRIMARY} />}
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <View style={styles.dropdownEmpty}>
                  <Icon name="map-marker-off-outline" size={32} color={GRAY_400} />
                  <Text style={styles.dropdownEmptyText}>No wards found</Text>
                </View>
              }
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const EditProfileScreen = ({ navigation }) => {
  const { user, updateUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const [districts, setDistricts] = useState([]);
  const [districtsLoading, setDistrictsLoading] = useState(true);
  const [districtsError, setDistrictsError] = useState("");
  const [wards, setWards] = useState([]);
  const [wardsLoading, setWardsLoading] = useState(false);

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || "",
      mobile_number: user?.mobile_number || user?.mobile || "",
      address: user?.address || "",
      district: user?.district_id || (user?.district && typeof user.district === "object" ? (user.district._id || user.district.id) : (user?.district && /^[0-9a-fA-F]{24}$/.test(user.district) ? user.district : (user?.district || ""))),
      ward: user?.ward_id || (user?.ward && typeof user.ward === "object" ? (user.ward._id || user.ward.id) : (user?.ward && /^[0-9a-fA-F]{24}$/.test(user.ward) ? user.ward : (user?.ward || ""))),
    },
  });

  const selectedDistrict = watch("district");

  // Fetch districts on mount
  useEffect(() => {
    setDistrictsLoading(true);
    setDistrictsError("");
    api.get("/admin/districts?active_only=false")
      .then((res) => {
        setDistricts(res.data?.data || []);
        setDistrictsError("");
      })
      .catch((err) => {
        console.error("Failed to load districts in EditProfile", err);
        setDistrictsError(getErrorMessage(err));
      })
      .finally(() => {
        setDistrictsLoading(false);
      });
  }, []);

  // Map district name to ID once districts are loaded
  useEffect(() => {
    if (districts.length > 0) {
      const currentVal = watch("district");
      if (!currentVal || !/^[0-9a-fA-F]{24}$/.test(currentVal)) {
        const rawDist = user?.district;
        const found = districts.find(d => 
          (d._id || d.id) === currentVal || 
          d.name === currentVal || 
          d.name === rawDist ||
          (typeof rawDist === "object" && rawDist && (d.name === rawDist.name || (d._id || d.id) === (rawDist._id || rawDist.id)))
        );
        if (found) {
          setValue("district", found._id || found.id);
        }
      }
    }
  }, [districts, user]);

  // Map ward name to ID once wards are loaded
  useEffect(() => {
    if (wards.length > 0) {
      const currentVal = watch("ward");
      if (!currentVal || !/^[0-9a-fA-F]{24}$/.test(currentVal)) {
        const rawWard = user?.ward;
        const found = wards.find(w => 
          (w._id || w.id || w.ward_id) === currentVal || 
          w.ward_name === currentVal || 
          w.ward_name === rawWard ||
          (typeof rawWard === "object" && rawWard && (w.ward_name === rawWard.ward_name || (w._id || w.id || w.ward_id) === (rawWard._id || rawWard.id)))
        );
        if (found) {
          setValue("ward", found._id || found.id);
        }
      }
    }
  }, [wards, user]);

  // Fetch wards when selected district changes
  useEffect(() => {
    if (!selectedDistrict) {
      setWards([]);
      return;
    }
    setWardsLoading(true);
    authService.getWardsByDistrict(selectedDistrict)
      .then((data) => {
        const rawWards = Array.isArray(data) ? data : data?.data || [];
        const sortedWards = [...rawWards].sort((a, b) => {
          const numA = parseInt(a.ward_number, 10);
          const numB = parseInt(b.ward_number, 10);
          if (!isNaN(numA) && !isNaN(numB)) {
            return numA - numB;
          }
          const labelA = a.ward_name || "";
          const labelB = b.ward_name || "";
          return labelA.localeCompare(labelB, undefined, { numeric: true, sensitivity: 'base' });
        });
        setWards(sortedWards);
      })
      .catch((err) => {
        console.error("Failed to load wards in EditProfile", err);
        setWards([]);
      })
      .finally(() => {
        setWardsLoading(false);
      });
  }, [selectedDistrict]);

  const handlePickImage = async () => {
    // Placeholder for image picking if we add expo-image-picker
    alert("Profile picture update is coming soon!");
  };

  const updateProfileMutation = useMutation({
    mutationFn: (data) => authService.updateProfile(data),
    onSuccess: async (updatedUser) => {
      if (updateUser) {
        try {
          const profile = await authService.getProfile();
          updateUser(profile);
        } catch (err) {
          updateUser(updatedUser);
        }
      }
      // Invalidate any queries related to user if needed
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      navigation.goBack();
    },
  });

  const onSubmit = (data) => {
    updateProfileMutation.mutate(data);
  };

  return (
    <Screen style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Edit Profile</Text>
          <Text style={styles.subtitle}>Update your personal information</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {updateProfileMutation.isError && (
            <View style={styles.errorBox}>
              <Icon name="alert-circle-outline" size={18} color={COLORS.error} />
              <Text style={styles.errorText}>
                {updateProfileMutation.error?.message || "Failed to update profile"}
              </Text>
            </View>
          )}

          {/* Profile Picture */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Icon name="account" size={40} color={COLORS.primary} />
            </View>
            <Button
              title="Change Photo"
              onPress={handlePickImage}
              style={styles.changePhotoBtn}
              textStyle={styles.changePhotoText}
            />
          </View>

          {/* Read Only Email */}
          <TextField
            label="Email Address"
            value={user?.email || ""}
            editable={false}
            containerStyle={styles.inputField}
          />

          <Controller
            control={control}
            name="name"
            rules={{ required: "Name is required", minLength: { value: 2, message: "Name must be at least 2 characters" } }}
            render={({ field: { onChange, value } }) => (
              <TextField
                label="Full Name"
                placeholder="Enter your full name"
                value={value}
                onChangeText={onChange}
                error={errors.name?.message}
                containerStyle={styles.inputField}
              />
            )}
          />

          <Controller
            control={control}
            name="mobile_number"
            rules={{ 
              required: "Mobile number is required",
              pattern: { value: /^[0-9]{10}$/, message: "Must be a valid 10-digit number" }
            }}
            render={({ field: { onChange, value } }) => (
              <TextField
                label="Mobile Number"
                placeholder="Enter your 10-digit mobile number"
                value={value}
                onChangeText={onChange}
                keyboardType="phone-pad"
                error={errors.mobile_number?.message}
                containerStyle={styles.inputField}
              />
            )}
          />

          <Controller
            control={control}
            name="address"
            rules={{ required: "Address is required", minLength: { value: 5, message: "Address is too short" } }}
            render={({ field: { onChange, value } }) => (
              <TextField
                label="Address"
                placeholder="Enter your address"
                value={value}
                onChangeText={onChange}
                multiline
                numberOfLines={3}
                error={errors.address?.message}
                containerStyle={styles.inputField}
              />
            )}
          />

          <Controller
            control={control}
            name="district"
            rules={{ required: "District is required" }}
            render={({ field }) => (
              <View style={styles.inputField}>
                <Text style={[styles.fieldLabel, { marginBottom: 6 }]}>District</Text>
                <DistrictDropdown
                  value={field.value}
                  districts={districts}
                  loading={districtsLoading}
                  onSelect={(val) => {
                    field.onChange(val);
                    setValue("ward", "");
                  }}
                  error={errors.district?.message}
                  loadingError={districtsError}
                />
              </View>
            )}
          />

          <Controller
            control={control}
            name="ward"
            rules={{ required: "Ward is required" }}
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputField}>
                <Text style={[styles.fieldLabel, { marginBottom: 6 }]}>Ward</Text>
                <WardDropdown
                  value={value}
                  wards={wards}
                  loading={wardsLoading}
                  onSelect={onChange}
                  error={errors.ward?.message}
                  disabled={!selectedDistrict}
                />
              </View>
            )}
          />

          <Button 
            title={updateProfileMutation.isPending ? "Updating..." : "Save Changes"} 
            onPress={handleSubmit(onSubmit)} 
            disabled={updateProfileMutation.isPending}
            style={styles.submitButton}
            loading={updateProfileMutation.isPending}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flex: {
    flex: 1,
  },
  header: {
    padding: SPACING.xl,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...SHADOWS.sm,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: "800",
    color: COLORS.textDark,
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
  scrollContent: {
    padding: SPACING.xl,
    paddingBottom: SPACING.xxxl,
  },
  inputField: {
    marginBottom: SPACING.lg,
  },
  submitButton: {
    marginTop: SPACING.xl,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZES.sm,
    marginLeft: SPACING.sm,
    flex: 1,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${COLORS.primary}15`,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.md,
  },
  changePhotoBtn: {
    backgroundColor: "transparent",
    paddingVertical: 0,
  },
  changePhotoText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.sm,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.textLight,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: SPACING.xs,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: "#F9FAFB",
    gap: 12,
  },
  inputError: {
    borderColor: "#DC2626",
    backgroundColor: "#FEF2F2",
  },
  inputFocused: {
    borderColor: COLORS.primary,
    backgroundColor: "#fff",
  },
  dropdownText: {
    flex: 1,
    fontSize: 15,
    color: "#1F2937",
    fontWeight: "500",
  },
  dropdownPlaceholder: {
    color: "#bbb",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  dropdownSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "80%",
    paddingBottom: 30,
  },
  dropdownHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  dropdownHeaderText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1F2937",
  },
  dropdownSep: {
    height: 1,
    backgroundColor: "#F3F4F6",
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  dropdownItemActive: {
    backgroundColor: "#EFF6FF",
  },
  dropdownItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  districtDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#bbb",
  },
  districtDotActive: {
    backgroundColor: COLORS.primary,
  },
  dropdownItemName: {
    fontSize: 15,
    color: "#4B5563",
    fontWeight: "500",
  },
  dropdownItemNameActive: {
    color: COLORS.primary,
    fontWeight: "700",
  },
  dropdownEmpty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: 12,
  },
  dropdownEmptyText: {
    fontSize: 14,
    color: "#9CA3AF",
  },
});

export default EditProfileScreen;
