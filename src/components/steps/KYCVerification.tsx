// components/steps/KYCVerification.tsx

import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  Button,
  HelperText,
  Chip,
  Surface,
  IconButton,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import FileUploader from '../common/FileUploader';
import { Seller, Mode, KYCStatus, KYCDocuments } from '../../types/sellertypes';

interface KYCVerificationProps {
  initialData: Partial<Seller>;
  mode: Mode;
  kycStatus: KYCStatus;
  onNext: (data: Partial<Seller>) => void;
  onBack: () => void;
}

interface DocumentConfig {
  key: keyof KYCDocuments;
  label: string;
  required: boolean;
  description?: string;
  icon: string;
}

const REQUIRED_DOCUMENTS: DocumentConfig[] = [
  { key: 'panCardUrl', label: 'PAN Card', required: true, icon: 'card-account-details', description: 'Clear image of PAN card' },
  { key: 'aadhaarUrl', label: 'Aadhaar Card', required: true, icon: 'card-bulleted', description: 'Both sides of Aadhaar' },
  { key: 'selfieUrl', label: 'Selfie', required: true, icon: 'face', description: 'Clear front-facing photo' },
  { key: 'addressProofUrl', label: 'Address Proof', required: false, icon: 'home', description: 'Utility bill or rent agreement' },
  { key: 'businessRegistrationUrl', label: 'Business Registration', required: false, icon: 'file-document', description: 'GST, MSME, or company registration' },
  { key: 'gstCertificateUrl', label: 'GST Certificate', required: false, icon: 'file-certificate', description: 'If applicable' },
];

const KYCVerification: React.FC<KYCVerificationProps> = ({
  initialData,
  mode,
  kycStatus,
  onNext,
  onBack,
}) => {
  const [documents, setDocuments] = useState<Partial<KYCDocuments>>(
    initialData.kycDocuments || {}
  );
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);

  const handleDocumentUpload = async (documentKey: keyof KYCDocuments, file: any) => {
    setUploadingFor(documentKey as string);
    
    setTimeout(() => {
      setDocuments(prev => ({ ...prev, [documentKey]: file.uri || 'uploaded_file.jpg' }));
      setUploadingFor(null);
      
      if (mode === 'test') {
        Alert.alert('Test Mode', 'Document would be auto-approved in test mode');
      }
    }, 1000);
  };

  const handleDocumentRemove = (documentKey: keyof KYCDocuments) => {
    Alert.alert(
      'Remove Document',
      'Are you sure you want to remove this document?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            const updated = { ...documents };
            delete updated[documentKey];
            setDocuments(updated);
          },
        },
      ]
    );
  };

  const getKYCStatusBadge = () => {
    switch (kycStatus) {
      case 'verified':
        return (
          <View style={[styles.statusBadge, styles.verified]}>
            <IconButton icon="check-circle" size={14} iconColor="#10B981" />
            <Text style={styles.statusTextVerified}>Verified</Text>
          </View>
        );
      case 'pending':
        return (
          <View style={[styles.statusBadge, styles.pending]}>
            <IconButton icon="clock-outline" size={14} iconColor="#D97706" />
            <Text style={styles.statusTextPending}>Pending</Text>
          </View>
        );
      case 'rejected':
        return (
          <View style={[styles.statusBadge, styles.rejected]}>
            <IconButton icon="alert-circle" size={14} iconColor="#DC2626" />
            <Text style={styles.statusTextRejected}>Rejected</Text>
          </View>
        );
      default:
        return (
          <View style={[styles.statusBadge, styles.notSubmitted]}>
            <IconButton icon="clock-outline" size={14} iconColor="#6B7280" />
            <Text style={styles.statusTextNotSubmitted}>Not Submitted</Text>
          </View>
        );
    }
  };

  const isRequiredDocumentsUploaded = () => {
    return REQUIRED_DOCUMENTS
      .filter(doc => doc.required)
      .every(doc => documents[doc.key]);
  };

  const handleSubmit = () => {
    if (mode === 'test') {
      onNext({
        kycDocuments: documents,
        isKycCompleted: true,
        kycStatus: 'verified',
      });
    } else {
      onNext({
        kycDocuments: documents,
        isKycCompleted: false,
        kycStatus: 'pending',
      });
    }
  };

  const requiredDocsCount = REQUIRED_DOCUMENTS.filter(doc => doc.required).length;
  const uploadedRequiredCount = REQUIRED_DOCUMENTS.filter(doc => doc.required && documents[doc.key]).length;
  const progress = (uploadedRequiredCount / requiredDocsCount) * 100;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFFFFF', '#F8F9FA']}
        style={styles.gradient}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header Card */}
          <Surface style={styles.headerCard}>
            <View style={styles.headerIcon}>
              <IconButton
                icon="shield-account"
                size={24}
                iconColor="#0066CC"
              />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.title}>KYC Verification</Text>
              <Text style={styles.subtitle}>
                Upload your documents for verification
              </Text>
            </View>
          </Surface>

          {/* Form Card */}
          <Surface style={styles.formCard}>
            {/* Progress Steps */}
            <View style={styles.progressContainer}>
              <View style={styles.progressStep}>
                <View style={[styles.progressDot, styles.progressDotCompleted]}>
                  <IconButton icon="check" size={12} iconColor="#FFFFFF" />
                </View>
                <Text style={styles.progressTextCompleted}>Basic</Text>
              </View>
              <View style={styles.progressLine} />
              <View style={styles.progressStep}>
                <LinearGradient
                  colors={['#0066CC', '#0099FF']}
                  style={styles.progressDotActive}
                />
                <Text style={styles.progressTextActive}>KYC</Text>
              </View>
              <View style={styles.progressLine} />
              <View style={styles.progressStep}>
                <View style={[styles.progressDot, styles.progressDotInactive]} />
                <Text style={styles.progressText}>Bank</Text>
              </View>
            </View>

            {/* KYC Status */}
            <View style={styles.statusContainer}>
              <Text style={styles.statusLabel}>Status:</Text>
              {getKYCStatusBadge()}
            </View>

            {/* Upload Progress */}
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}>
                <LinearGradient
                  colors={['#0066CC', '#0099FF']}
                  style={[styles.progressFill, { width: `${progress}%` }]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </View>
              <Text style={styles.progressText}>
                {uploadedRequiredCount}/{requiredDocsCount} Required
              </Text>
            </View>

            {/* Rejection Message */}
            {kycStatus === 'rejected' && (
              <Surface style={styles.rejectionCard}>
                <View style={styles.rejectionContent}>
                  <IconButton icon="alert-circle" size={16} iconColor="#DC2626" />
                  <View style={styles.rejectionText}>
                    <Text style={styles.rejectionTitle}>KYC Rejected</Text>
                    <Text style={styles.rejectionMessage}>
                      Please upload clear, valid documents
                    </Text>
                  </View>
                </View>
              </Surface>
            )}

            {/* Document Upload Sections */}
            <View style={styles.documentsContainer}>
              {REQUIRED_DOCUMENTS.map((doc, index) => (
                <View key={doc.key} style={styles.documentItem}>
                  {index > 0 && <View style={styles.documentDivider} />}
                  <FileUploader
                    label={doc.label}
                    required={doc.required}
                    description={doc.description}
                    icon={doc.icon}
                    value={documents[doc.key]}
                    onUpload={(file) => handleDocumentUpload(doc.key, file)}
                    onRemove={() => handleDocumentRemove(doc.key)}
                    uploading={uploadingFor === doc.key}
                    mode={mode}
                  />
                </View>
              ))}
            </View>

            {/* Test Mode Notice */}
            {mode === 'test' && (
              <Surface style={styles.testModeCard}>
                <View style={styles.testModeContent}>
                  <IconButton icon="flask" size={16} iconColor="#92400E" />
                  <View style={styles.testModeText}>
                    <Text style={styles.testModeTitle}>Test Mode Active</Text>
                    <Text style={styles.testModeDescription}>
                      Auto-approved in test mode
                    </Text>
                  </View>
                </View>
              </Surface>
            )}

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={onBack}
              >
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  !isRequiredDocumentsUploaded() && styles.submitButtonDisabled
                ]}
                onPress={handleSubmit}
                disabled={!isRequiredDocumentsUploaded()}
              >
                <LinearGradient
                  colors={isRequiredDocumentsUploaded() ? ['#0066CC', '#0099FF'] : ['#9CA3AF', '#9CA3AF']}
                  style={styles.submitGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.submitButtonText}>
                    {mode === 'test' ? 'Continue' : 'Submit KYC'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Surface>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
  },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  progressStep: {
    alignItems: 'center',
  },
  progressDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressDotCompleted: {
    backgroundColor: '#10B981',
  },
  progressDotActive: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  progressDotInactive: {
    backgroundColor: '#E5E7EB',
  },
  progressLine: {
    width: 30,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 4,
  },
  progressTextCompleted: {
    fontSize: 9,
    color: '#10B981',
    marginTop: 4,
    fontWeight: '500',
  },
  progressTextActive: {
    fontSize: 9,
    color: '#0066CC',
    marginTop: 4,
    fontWeight: '600',
  },
  progressText: {
    fontSize: 9,
    color: '#9CA3AF',
    marginTop: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    height: 24,
  },
  verified: {
    backgroundColor: '#D1FAE5',
  },
  pending: {
    backgroundColor: '#FEF3C7',
  },
  rejected: {
    backgroundColor: '#FEE2E2',
  },
  notSubmitted: {
    backgroundColor: '#F3F4F6',
  },
  statusTextVerified: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '500',
    marginRight: 4,
  },
  statusTextPending: {
    fontSize: 11,
    color: '#D97706',
    fontWeight: '500',
    marginRight: 4,
  },
  statusTextRejected: {
    fontSize: 11,
    color: '#DC2626',
    fontWeight: '500',
    marginRight: 4,
  },
  statusTextNotSubmitted: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
    marginRight: 4,
  },
  progressBarContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  rejectionCard: {
    backgroundColor: '#FEE2E2',
    borderRadius: 10,
    marginBottom: 12,
    overflow: 'hidden',
  },
  rejectionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  rejectionText: {
    flex: 1,
  },
  rejectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#991B1B',
  },
  rejectionMessage: {
    fontSize: 11,
    color: '#7F1D1D',
    marginTop: 1,
  },
  documentsContainer: {
    marginBottom: 8,
  },
  documentItem: {
    marginBottom: 8,
  },
  documentDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginBottom: 8,
  },
  testModeCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 10,
    marginVertical: 8,
    overflow: 'hidden',
  },
  testModeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  testModeText: {
    flex: 1,
  },
  testModeTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
  },
  testModeDescription: {
    fontSize: 11,
    color: '#92400E',
    marginTop: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  backButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  backButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  submitButton: {
    flex: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitGradient: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default KYCVerification;