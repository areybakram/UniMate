import { Ionicons } from "@expo/vector-icons";
import { decode } from "base64-arraybuffer";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import { LinearGradient } from "expo-linear-gradient";
import React, { useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthContext } from "../Context/AuthContext";
import { supabase } from "../supabaseClient";

interface UploadModalProps {
  visible: boolean;
  onClose: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ visible, onClose }) => {
  const { user } = useContext(AuthContext) || {};
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] =
    useState<DocumentPicker.DocumentPickerResult | null>(null);
  const [form, setForm] = useState({
    title: "",
    type: "note",
    course_name: "",
    course_teacher: "",
    course_teacher_email: "",
    course_code: "",
    batch: "FA22-BSC",
    tags: "",
    description: "",
  });

  const types = [
    { id: "note", label: "Note", icon: "document-text" },
    { id: "book", label: "Book", icon: "book" },
    { id: "past_paper", label: "Past Paper", icon: "reader" },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Upload Content</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.form}
          >
            {/* Type Selection */}
            <Text style={styles.label}>Content Type</Text>
            <View style={styles.typeRow}>
              {types.map((t) => (
                <TouchableOpacity
                  key={t.id}
                  style={[
                    styles.typeBox,
                    form.type === t.id && styles.activeTypeBox,
                  ]}
                  onPress={() => setForm({ ...form, type: t.id })}
                >
                  <Ionicons
                    name={t.icon as any}
                    size={24}
                    color={form.type === t.id ? "#fff" : "#64748b"}
                  />
                  <Text
                    style={[
                      styles.typeLabel,
                      form.type === t.id && styles.activeTypeLabel,
                    ]}
                  >
                    {t.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Database Midterm Notes"
              value={form.title}
              onChangeText={(t) => setForm({ ...form, title: t })}
            />

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Batch</Text>
                <TextInput
                  style={styles.input}
                  placeholder="FA22-BSC"
                  value={form.batch}
                  onChangeText={(t) =>
                    setForm({ ...form, batch: t.toUpperCase() })
                  }
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Course Code</Text>
                <TextInput
                  style={styles.input}
                  placeholder="CS310"
                  value={form.course_code}
                  onChangeText={(t) =>
                    setForm({ ...form, course_code: t.toUpperCase() })
                  }
                />
              </View>
            </View>

            <Text style={styles.label}>Course Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Database Systems"
              value={form.course_name}
              onChangeText={(t) => setForm({ ...form, course_name: t })}
            />

            <Text style={styles.label}>Course Teacher</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Dr. Ahmad"
              value={form.course_teacher}
              onChangeText={(t) => setForm({ ...form, course_teacher: t })}
            />

            <Text style={styles.label}>Course Teacher Email</Text>
            <TextInput
              style={styles.input}
              placeholder="teacher@university.edu"
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.course_teacher_email}
              onChangeText={(t) =>
                setForm({ ...form, course_teacher_email: t })
              }
            />

            <Text style={styles.label}>Tags (comma separated)</Text>
            <TextInput
              style={styles.input}
              placeholder="sql, database, midterm"
              value={form.tags}
              onChangeText={(t) => setForm({ ...form, tags: t })}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Tell others what this content is about..."
              multiline
              numberOfLines={4}
              value={form.description}
              onChangeText={(t) => setForm({ ...form, description: t })}
            />
            {/* File Picker */}
            <Text style={styles.label}>Attachment</Text>
            <TouchableOpacity
              style={[
                styles.filePicker,
                selectedFile?.assets && styles.filePickerActive,
              ]}
              onPress={async () => {
                const result = await DocumentPicker.getDocumentAsync({
                  type: [
                    "application/pdf",
                    "application/msword",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    "application/zip",
                  ],
                });
                if (!result.canceled) {
                  setSelectedFile(result);
                }
              }}
            >
              <Ionicons
                name={
                  selectedFile?.assets
                    ? "document-attach"
                    : "cloud-upload-outline"
                }
                size={32}
                color="#3b82f6"
              />
              <Text style={styles.filePickerText}>
                {selectedFile?.assets
                  ? selectedFile.assets[0].name
                  : "Select File (PDF, DOCX, ZIP)"}
              </Text>
              {selectedFile?.assets && (
                <Text style={styles.fileSize}>
                  {(selectedFile.assets[0].size! / (1024 * 1024)).toFixed(2)} MB
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitButton, isUploading && styles.disabledBtn]}
              onPress={async () => {
                if (
                  !selectedFile?.assets ||
                  !form.title ||
                  !form.course_teacher_email
                ) {
                  Alert.alert(
                    "Error",
                    "Please fill all required fields and select a file.",
                  );
                  return;
                }

                setIsUploading(true);
                try {
                  const file = selectedFile.assets[0];
                  const fileExt = file.name.split(".").pop();
                  const fileName = `${Math.random()}.${fileExt}`;
                  const filePath = `repository/${fileName}`;

                  // Proper way to upload file from Expo in React Native
                  const base64 = await FileSystem.readAsStringAsync(file.uri, {
                    encoding: "base64",
                  });
                  const { data: storageData, error: storageError } =
                    await supabase.storage
                      .from("repository")
                      .upload(filePath, decode(base64), {
                        contentType: file.mimeType,
                      });

                  if (storageError) throw storageError;

                  const {
                    data: { publicUrl },
                  } = supabase.storage
                    .from("repository")
                    .getPublicUrl(filePath);

                  const { error: dbError } = await supabase
                    .from("repository_items")
                    .insert({
                      uploader_id: user?.id,
                      title: form.title.trim(),
                      description: form.description.trim(),
                      type: form.type,
                      batch: form.batch.trim(),
                      course_name: form.course_name.trim(),
                      course_teacher_name: form.course_teacher.trim(),
                      course_teacher_email: form.course_teacher_email
                        .toLowerCase()
                        .trim(),
                      course_code: form.course_code.toUpperCase().trim(),
                      tags: form.tags
                        ? form.tags.split(",").map((t) => t.trim())
                        : [],
                      file_url: publicUrl,
                      status: user?.role === "teacher" ? "approved" : "pending",
                    });

                  if (dbError) throw dbError;

                  Alert.alert(
                    "Success",
                    user?.role === "teacher"
                      ? "Document uploaded successfully!"
                      : "Document submitted for approval!",
                  );
                  onClose();
                  // Reset form
                  setForm({
                    title: "",
                    type: "note",
                    course_name: "",
                    course_teacher: "",
                    course_teacher_email: "",
                    course_code: "",
                    batch: "FA22-BSC",
                    tags: "",
                    description: "",
                  });
                  setSelectedFile(null);
                } catch (error: any) {
                  Alert.alert(
                    "Error",
                    error.message || "Failed to upload document",
                  );
                } finally {
                  setIsUploading(false);
                }
              }}
              disabled={isUploading}
            >
              <LinearGradient
                colors={["#1e40af", "#3b82f6"]}
                style={styles.submitGradient}
              >
                {isUploading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitText}>Upload to Library</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: "90%",
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
  },
  closeButton: {
    padding: 5,
  },
  form: {
    padding: 25,
    paddingBottom: 50,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#475569",
    marginBottom: 8,
  },
  typeRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  typeBox: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  activeTypeBox: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  typeLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#64748b",
    marginTop: 5,
  },
  activeTypeLabel: {
    color: "#fff",
  },
  input: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 15,
    fontSize: 15,
    color: "#1e293b",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    gap: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  filePicker: {
    backgroundColor: "#eff6ff",
    borderRadius: 15,
    padding: 30,
    alignItems: "center",
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: "#3b82f6",
    marginBottom: 30,
  },
  filePickerActive: {
    backgroundColor: "#f0fdf4",
    borderColor: "#10b981",
    borderStyle: "solid",
  },
  filePickerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3b82f6",
    marginTop: 10,
  },
  fileSize: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 5,
  },
  submitButton: {
    width: "100%",
  },
  disabledBtn: {
    opacity: 0.6,
  },
  submitGradient: {
    height: 55,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default UploadModal;
