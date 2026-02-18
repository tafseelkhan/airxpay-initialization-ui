// src/components/onboarding/FinalStepScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  Surface,
  HelperText,
  IconButton
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useMerchantOnboarding } from '../../../hooks/useMerchantOnboarding';
import { CreateMerchantPayload, BusinessType } from '../../../types/merchantTypes';
import { UI_TEXTS } from '../../../etc/constants';

interface FinalStepScreenProps {
  publicKey: string;
  onSuccess: (response: any) => void;
  onError?: (error: any) => void;
  initialData?: Partial<CreateMerchantPayload>;
}

export const FinalStepScreen: React.FC<FinalStepScreenProps> = ({
  publicKey,
  onSuccess,
  onError,
  initialData = {}
}) => {
  const { loading, error, createMerchant, initialize, clearError } = useMerchantOnboarding();
  
  const [formData, setFormData] = useState<CreateMerchantPayload>({
    merchantName: initialData.merchantName || '',
    merchantEmail: initialData.merchantEmail || '',
    merchantPhone: initialData.merchantPhone || '',
    businessName: initialData.businessName || '',
    businessType: initialData.businessType || 'individual',
    businessCategory: initialData.businessCategory || '',
    country: initialData.country || 'India',
    nationality: initialData.nationality || 'Indian',
    mode: initialData.mode || 'test',
    ...initialData
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Initialize SDK with public key
  useEffect(() => {
    if (publicKey) {
      initialize(publicKey);
    }
  }, [publicKey]);

  // Handle errors
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error.userMessage);
      onError?.(error);
      clearError();
    }
  }, [error]);

  const validateField = (field: keyof CreateMerchantPayload, value: any): string | undefined => {
    switch (field) {
      case 'merchantName':
        if (!value?.trim()) return 'Merchant name is required';
        if (value.length < 2) return 'Name must be at least 2 characters';
        return undefined;
      
      case 'merchantEmail':
        if (!value?.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Invalid email format';
        return undefined;
      
      case 'merchantPhone':
        if (value && !/^\+?[1-9]\d{1,14}$/.test(value.replace(/[\s-]/g, ''))) {
          return 'Invalid phone number';
        }
        return undefined;
      
      case 'businessName':
        if (formData.businessType === 'company' && !value?.trim()) {
          return 'Business name is required for companies';
        }
        return undefined;
      
      default:
        return undefined;
    }
  };

  const handleChange = (field: keyof CreateMerchantPayload, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user types
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleBlur = (field: keyof CreateMerchantPayload) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setFieldErrors(prev => ({
      ...prev,
      [field]: error || ''
    }));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    const fieldsToValidate: (keyof CreateMerchantPayload)[] = ['merchantName', 'merchantEmail'];
    
    if (formData.businessType === 'company') {
      fieldsToValidate.push('businessName');
    }

    fieldsToValidate.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) errors[field] = error;
    });

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const response = await createMerchant(formData);
    
    if (response) {
      onSuccess(response);
    }
  };

  const isFormValid = (): boolean => {
    const requiredFields: (keyof CreateMerchantPayload)[] = ['merchantName', 'merchantEmail'];
    if (formData.businessType === 'company') {
      requiredFields.push('businessName');
    }

    const allFilled = requiredFields.every(field => {
      const value = formData[field];
      return value && value.toString().trim().length > 0;
    });

    const noErrors = Object.keys(fieldErrors).length === 0;

    return allFilled && noErrors;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <LinearGradient
        colors={['#FFFFFF', '#F8F9FA']}
        style={styles.gradient}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <Surface style={styles.headerCard}>
            <View style={styles.headerIcon}>
              <LinearGradient
                colors={['#0066CC', '#0099FF']}
                style={styles.iconGradient}
              >
                <IconButton icon="check-circle" size={24} iconColor="#FFFFFF" />
              </LinearGradient>
            </View>
            <View style={styles.headerText}>
              <Text style={styles.title}>{UI_TEXTS.FINAL_STEP.TITLE}</Text>
              <Text style={styles.subtitle}>{UI_TEXTS.FINAL_STEP.SUBTITLE}</Text>
            </View>
          </Surface>

          {/* Form Card */}
          <Surface style={styles.formCard}>
            {/* Progress Indicator */}
            <View style={styles.progressContainer}>
              <View style={styles.progressStep}>
                <View style={[styles.progressDot, styles.progressDotCompleted]}>
                  <IconButton icon="check" size={12} iconColor="#FFFFFF" />
                </View>
                <Text style={styles.progressText}>Basic</Text>
              </View>
              <View style={styles.progressLine} />
              <View style={styles.progressStep}>
                <View style={[styles.progressDot, styles.progressDotCompleted]}>
                  <IconButton icon="check" size={12} iconColor="#FFFFFF" />
                </View>
                <Text style={styles.progressText}>KYC</Text>
              </View>
              <View style={styles.progressLine} />
              <View style={styles.progressStep}>
                <View style={[styles.progressDot, styles.progressDotCompleted]}>
                  <IconButton icon="check" size={12} iconColor="#FFFFFF" />
                </View>
                <Text style={styles.progressText}>Bank</Text>
              </View>
              <View style={styles.progressLine} />
              <View style={styles.progressStep}>
                <LinearGradient
                  colors={['#0066CC', '#0099FF']}
                  style={styles.progressDotActive}
                />
                <Text style={styles.progressTextActive}>Final</Text>
              </View>
            </View>

            {/* Review Section */}
            <View style={styles.reviewSection}>
              <Text style={styles.reviewTitle}>Review Your Information</Text>
              
              <View style={styles.reviewItem}>
                <Text style={styles.reviewLabel}>Business Name</Text>
                <Text style={styles.reviewValue}>
                  {formData.businessName || formData.merchantName}
                </Text>
              </View>

              <View style={styles.reviewItem}>
                <Text style={styles.reviewLabel}>Contact Email</Text>
                <Text style={styles.reviewValue}>{formData.merchantEmail}</Text>
              </View>

              {formData.merchantPhone && (
                <View style={styles.reviewItem}>
                  <Text style={styles.reviewLabel}>Phone</Text>
                  <Text style={styles.reviewValue}>{formData.merchantPhone}</Text>
                </View>
              )}

              <View style={styles.reviewItem}>
                <Text style={styles.reviewLabel}>Business Type</Text>
                <Text style={styles.reviewValue}>
                  {formData.businessType === 'company' ? 'Company' : 'Individual'}
                </Text>
              </View>

              <View style={styles.reviewItem}>
                <Text style={styles.reviewLabel}>Country</Text>
                <Text style={styles.reviewValue}>{formData.country}</Text>
              </View>

              <View style={styles.reviewItem}>
                <Text style={styles.reviewLabel}>Mode</Text>
                <View style={[
                  styles.modeBadge,
                  formData.mode === 'live' ? styles.liveBadge : styles.testBadge
                ]}>
                  <Text style={[
                    styles.modeText,
                    formData.mode === 'live' ? styles.liveText : styles.testText
                  ]}>
                    {formData.mode?.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>

            {/* Terms Agreement */}
            <View style={styles.termsContainer}>
              <IconButton icon="checkbox-marked-circle" size={20} iconColor="#10B981" />
              <Text style={styles.termsText}>
                I confirm that all information provided is accurate and complete.
              </Text>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!isFormValid() || loading) && styles.submitButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={!isFormValid() || loading}
            >
              <LinearGradient
                colors={isFormValid() && !loading ? ['#0066CC', '#0099FF'] : ['#9CA3AF', '#9CA3AF']}
                style={styles.submitGradient}
              >
                {loading ? (
                  <View style={styles.loadingContent}>
                    <ActivityIndicator size="small" color="#FFFFFF" />
                    <Text style={styles.submitButtonText}>
                      {UI_TEXTS.FINAL_STEP.PROCESSING}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.submitButtonText}>
                    {UI_TEXTS.FINAL_STEP.CREATE_BUTTON}
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Surface>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
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
    padding: 16,
    paddingBottom: 32,
  },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
  },
  headerIcon: {
    marginRight: 12,
  },
  iconGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    elevation: 2,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
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
  progressLine: {
    width: 20,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 4,
  },
  progressText: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 4,
  },
  progressTextActive: {
    fontSize: 10,
    color: '#0066CC',
    marginTop: 4,
    fontWeight: '600',
  },
  reviewSection: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  reviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  reviewLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  reviewValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  modeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveBadge: {
    backgroundColor: '#FEE2E2',
  },
  testBadge: {
    backgroundColor: '#FEF3C7',
  },
  modeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  liveText: {
    color: '#DC2626',
  },
  testText: {
    color: '#D97706',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    color: '#065F46',
    marginLeft: 8,
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loadingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});