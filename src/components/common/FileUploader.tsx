// components/common/FileUploader.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { Mode } from '../../types/merchantTypes';

interface FileUploaderProps {
  label: string;
  required?: boolean;
  description?: string;
  icon?: string;
  value?: string;
  onUpload: (file: any) => void;
  onRemove: () => void;
  uploading?: boolean;
  mode?: Mode;
  accept?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  label,
  required = false,
  description,
  value,
  onUpload,
  onRemove,
  uploading = false,
  mode = 'test',
  accept = 'image/*',
}) => {
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        onUpload(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera permissions');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        onUpload(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const showOptions = () => {
    Alert.alert(
      `Upload ${label}`,
      'Choose an option',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Gallery', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleRemove = () => {
    Alert.alert(
      'Remove Document',
      `Are you sure you want to remove ${label}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: onRemove }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>

      {value ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: value }} style={styles.preview} />
          <View style={styles.previewActions}>
            <TouchableOpacity onPress={showOptions} style={styles.changeButton}>
              <Text style={styles.changeButtonText}>Change</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleRemove} style={styles.removeButton}>
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.uploadArea}
          onPress={showOptions}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator size="small" color="#0066CC" />
          ) : (
            <>
              <Text style={styles.uploadIcon}>📎</Text>
              <Text style={styles.uploadText}>Tap to upload</Text>
              {mode === 'test' && (
                <Text style={styles.testModeHint}>(Test mode - simulated)</Text>
              )}
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  required: {
    color: '#EF4444',
  },
  description: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  uploadArea: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  uploadIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  uploadText: {
    fontSize: 14,
    color: '#6B7280',
  },
  testModeHint: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 4,
  },
  previewContainer: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    overflow: 'hidden',
  },
  preview: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  previewActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  changeButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  changeButtonText: {
    color: '#0066CC',
    fontSize: 14,
    fontWeight: '500',
  },
  removeButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderLeftWidth: 1,
    borderLeftColor: '#E5E7EB',
  },
  removeButtonText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default FileUploader;