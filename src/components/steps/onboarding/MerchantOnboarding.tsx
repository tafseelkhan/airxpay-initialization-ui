// src/components/steps/onboarding/MerchantOnboarding.tsx

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { 
  ActivityIndicator, 
  Snackbar, 
  Text, 
  Surface,
  IconButton,
  Avatar,
} from 'react-native-paper';

import { LinearGradient } from 'expo-linear-gradient';
import StepIndicator from '../../common/StepIndicator';
import BasicDetailsForm from '../../steps/BasicDetailsForm';
import KYCVerification from '../../steps/KYCVerification';
import BankDetails from '../../steps/BankDetails';
import { FinalStepScreen } from '../onboarding/FinalStepScreen';
import { OnboardingCompleteScreen } from '../OnboardingComplete';
import { Merchant, MerchantOnboardingProps, StepConfig, FormErrors, StepCompletion } from '../../../types/merchantTypes';
import { useAirXPaySafe } from '../../../contexts/AirXPayProvider';
import { verifyPublicKey } from '../../../api/merchantProxy';

const { width } = Dimensions.get('window');

// Extend StepConfig to include icon
interface ExtendedStepConfig extends StepConfig {
  icon?: string;
}

// Extend MerchantOnboardingProps to include onSubmitToBackend
interface ExtendedMerchantOnboardingProps extends MerchantOnboardingProps {
  onSubmitToBackend?: (data: any) => Promise<any>; // ✅ Add this prop
}

// ✅ 5 STEPS - Added Final Step
const STEPS: ExtendedStepConfig[] = [
  { id: 1, name: 'Basic Details', key: 'basic', isRequired: true, icon: 'account' },
  { id: 2, name: 'KYC Verification', key: 'kyc', isRequired: true, icon: 'shield-account' },
  { id: 3, name: 'Bank Details', key: 'bank', isRequired: true, icon: 'bank' },
  { id: 4, name: 'Final Review', key: 'final', isRequired: true, icon: 'file-document' },
  { id: 5, name: 'Complete', key: 'complete', isRequired: false, icon: 'check-circle' },
];

// Default logo - can be overridden via props
const DEFAULT_LOGO = require('../../../assets/images/airxpay.png');

const MerchantOnboardingSheet: React.FC<ExtendedMerchantOnboardingProps> = ({
  merchantId,
  mode,
  isKycCompleted,
  isBankDetailsCompleted,
  kycStatus,
  status,
  initialStep = 1,
  initialData = {},
  onNext,
  onBack,
  onComplete,
  onSubmitToBackend, // ✅ Add this prop
  loading: externalLoading = false,
}) => {
  // Get configuration from provider
  const airXPay = useAirXPaySafe();
  
  // Local state for provider verification
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValidProvider, setIsValidProvider] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(initialStep / STEPS.length)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // State management
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [merchantData, setMerchantData] = useState<Partial<Merchant>>({
    mode,
    kycStatus,
    isKycCompleted,
    isBankDetailsCompleted,
    status,
    ...initialData,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showError, setShowError] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isWaitingForBackend, setIsWaitingForBackend] = useState<boolean>(false);
  
  // ✅ New state for merchant creation response
  const [merchantResponse, setMerchantResponse] = useState<any>(null);

  // Track completion status of each step dynamically
  const [stepCompletion, setStepCompletion] = useState<StepCompletion>(() => {
    const basicCompleted = !!(
      initialData.merchantName && 
      initialData.merchantName.trim() !== '' &&
      initialData.merchantEmail && 
      initialData.merchantEmail.trim() !== ''
    );
    
    return {
      basic: basicCompleted,
      kyc: isKycCompleted || false,
      bank: isBankDetailsCompleted || false,
      final: false, // ✅ Final step initially incomplete
    };
  });

  // Verify public key on mount
  useEffect(() => {
    const verifyProviderConfig = async () => {
      console.log('🔍 Starting AirXPay provider verification...');
      
      if (!airXPay) {
        console.error('❌ AirXPayProvider is undefined - context not found');
        setVerificationError('AirXPay provider not found in component tree. Please wrap your app with <AirXPayProvider>.');
        setIsValidProvider(false);
        setIsVerifying(false);
        return;
      }

      const { publicKey } = airXPay;
      
      if (!publicKey) {
        console.error('❌ AirXPay config missing:', { publicKey: !!publicKey });
        setVerificationError('AirXPay configuration incomplete. publicKey is required.');
        setIsValidProvider(false);
        setIsVerifying(false);
        return;
      }

      console.log('✅ AirXPay config found:', { publicKey: publicKey.substring(0, 8) + '...' });

      try {
        setIsVerifying(true);
        console.log('🔑 Verifying public key:', publicKey.substring(0, 8) + '...');
        
        await verifyPublicKey(publicKey);
        
        console.log('✅ Public key verified successfully');
        setIsValidProvider(true);
        setVerificationError(null);
      } catch (err: any) {
        console.error('❌ Public key verification failed:', err.message);
        setVerificationError(err.message || 'Invalid AirXPay public key. Please check your configuration.');
        setIsValidProvider(false);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyProviderConfig();
  }, [airXPay]);

  // Log config status after verification
  useEffect(() => {
    if (!isVerifying) {
      if (isValidProvider) {
        console.log('🚀 AirXPay provider ready - rendering onboarding');
      } else {
        console.warn('⚠️ AirXPay provider invalid - showing error state');
      }
    }
  }, [isVerifying, isValidProvider]);

  // Update progress bar animation when step changes
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: currentStep / STEPS.length,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentStep]);

  const animateStepTransition = (direction: 'next' | 'back') => {
    if (isAnimating) return;

    setIsAnimating(true);

    // Fade out and slide
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: direction === 'next' ? -50 : 50,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Reset slide position
      slideAnim.setValue(direction === 'next' ? 50 : -50);
      
      // Fade in and slide to center
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsAnimating(false);
      });
    });
  };

  const handleNext = (stepData: Partial<Merchant>) => {
    const updatedData = { ...merchantData, ...stepData };
    setMerchantData(updatedData);
    
    // Update step completion status dynamically
    if (currentStep === 1) {
      const basicCompleted = !!(
        updatedData.merchantName && 
        updatedData.merchantName.trim() !== '' &&
        updatedData.merchantEmail && 
        updatedData.merchantEmail.trim() !== ''
      );
      setStepCompletion(prev => ({ ...prev, basic: basicCompleted }));
    } else if (currentStep === 2) {
      const kycCompleted = stepData.isKycCompleted === true || stepData.kycStatus === 'verified';
      setStepCompletion(prev => ({ ...prev, kyc: kycCompleted }));
    } else if (currentStep === 3) {
      const bankCompleted = stepData.isBankDetailsCompleted === true;
      setStepCompletion(prev => ({ ...prev, bank: bankCompleted }));
    } else if (currentStep === 4) {
      // Final step - just mark as completed
      setStepCompletion(prev => ({ ...prev, final: true }));
    }
    
    // Call onNext callback with step data and current step
    onNext(stepData, currentStep);

    // Move to next step if not last step
    if (currentStep < STEPS.length) {
      animateStepTransition('next');
      setTimeout(() => {
        setCurrentStep(prev => {
          const newStep = prev + 1;
          return newStep;
        });
      }, 150);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      animateStepTransition('back');
      setTimeout(() => {
        setCurrentStep(prev => {
          const newStep = prev - 1;
          // Pass the new step to parent
          onBack(newStep);
          return newStep;
        });
      }, 150);
    }
  };

  const validateStepData = useCallback((): boolean => {
    // Validate required fields dynamically based on STEPS config
    const requiredSteps = STEPS.filter(step => step.isRequired && step.id < 5); // Exclude complete step
    const missingSteps = requiredSteps.filter(step => !stepCompletion[step.key as keyof StepCompletion]);
    
    if (missingSteps.length > 0) {
      const missingStepNames = missingSteps.map(s => s.name).join(', ');
      
      // If missing basic details, show inline error
      if (missingSteps.some(s => s.key === 'basic')) {
        setErrors({ merchantName: 'Please complete all required fields' });
        setShowError(true);
        return false;
      }
      
      // For KYC or Bank, show alert with navigation
      if (missingSteps.some(s => s.key === 'kyc')) {
        Alert.alert(
          'KYC Pending',
          'Please complete KYC verification first',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Go to KYC', 
              onPress: () => {
                animateStepTransition('next');
                setCurrentStep(2);
              }
            }
          ]
        );
        return false;
      }
      
      if (missingSteps.some(s => s.key === 'bank')) {
        Alert.alert(
          'Bank Details Pending',
          'Please add bank details first',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Go to Bank Details', 
              onPress: () => {
                animateStepTransition('next');
                setCurrentStep(3);
              }
            }
          ]
        );
        return false;
      }
      
      if (missingSteps.some(s => s.key === 'final')) {
        Alert.alert(
          'Review Pending',
          'Please review your information on the final step',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Go to Final Step', 
              onPress: () => {
                animateStepTransition('next');
                setCurrentStep(4);
              }
            }
          ]
        );
        return false;
      }
      
      setErrors({ general: `Please complete: ${missingStepNames}` });
      setShowError(true);
      return false;
    }

    return true;
  }, [stepCompletion]);

  // ✅ Handle final step success - merchant created
  const handleFinalStepSuccess = (response: any) => {
    setMerchantResponse(response);
    setStepCompletion(prev => ({ ...prev, final: true }));
    
    // Move to complete screen after short delay
    setTimeout(() => {
      setCurrentStep(5); // Move to complete screen
    }, 500);
  };

  // ✅ Handle final step error
  const handleFinalStepError = (error: any) => {
    Alert.alert('Error', error.userMessage || 'Failed to create merchant');
  };

  const handleComplete = useCallback(() => {
    // Validate all required data before completing
    if (!validateStepData()) {
      return;
    }

    // Prepare complete merchant data
    const completeMerchantData: Merchant = {
      merchantId: merchantData.merchantId || merchantData._id || merchantResponse?.merchant?.merchantId || '',
      merchantName: merchantData.merchantName || '',
      merchantEmail: merchantData.merchantEmail || '',
      merchantPhone: merchantData.merchantPhone || '',
      merchantDID: merchantData.merchantDID || '',
      businessName: merchantData.businessName,
      businessType: merchantData.businessType || 'individual',
      businessCategory: merchantData.businessCategory,
      country: merchantData.country || 'India',
      nationality: merchantData.nationality || 'Indian',
      dob: merchantData.dob,
      bankDetails: merchantData.bankDetails,
      kycDetails: merchantData.kycDetails,
      mode: mode || 'test',
      kycStatus: stepCompletion.kyc ? 'verified' : (kycStatus || 'pending'),
      isKycCompleted: stepCompletion.kyc,
      isBankDetailsCompleted: stepCompletion.bank,
      status: status || (mode === 'live' && stepCompletion.kyc && stepCompletion.bank ? 'active' : 'pending'),
      createdAt: (merchantData as any).createdAt || merchantResponse?.merchant?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Call onComplete with merchant data
    onComplete(completeMerchantData);
  }, [merchantData, mode, status, kycStatus, stepCompletion, merchantResponse, onComplete, validateStepData]);

  const getStepTitle = () => {
    const step = STEPS.find(s => s.id === currentStep);
    return step?.name || '';
  };

  const renderProviderVerification = () => {
    if (isVerifying) {
      return (
        <View style={styles.verificationContainer}>
          <LinearGradient
            colors={['#0066CC', '#0099FF']}
            style={styles.verificationCircle}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <ActivityIndicator size="large" color="#FFFFFF" />
          </LinearGradient>
          <Text style={styles.verificationText}>
            Verifying AirXPay configuration...
          </Text>
          <Text style={styles.verificationSubtext}>
            Please wait while we validate your public key
          </Text>
        </View>
      );
    }

    if (!isValidProvider) {
      return (
        <View style={styles.verificationContainer}>
          <View style={[styles.verificationCircle, { backgroundColor: '#FF4444' }]}>
            <IconButton
              icon="alert"
              size={40}
              iconColor="#FFFFFF"
              style={{ margin: 0 }}
            />
          </View>
          <Text style={[styles.verificationText, { color: '#FF4444' }]}>
            Invalid AirXPay Configuration
          </Text>
          <Text style={styles.errorMessage}>
            {verificationError || 'Invalid AirXPay public key. Please check your configuration.'}
          </Text>
        </View>
      );
    }

    return null;
  };

  const renderStep = () => {
    // Combine external loading and submitting states to prevent double loader
    const isLoading = externalLoading || isSubmitting;

    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <LinearGradient
              colors={['#0066CC', '#0099FF']}
              style={styles.loadingCircle}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <ActivityIndicator size="large" color="#FFFFFF" />
            </LinearGradient>
          </Animated.View>
          <Text style={styles.loadingText}>
            {isSubmitting ? 'Processing...' : 'Loading your information...'}
          </Text>
        </View>
      );
    }

    const stepContent = (() => {
      switch (currentStep) {
        case 1:
          return (
            <BasicDetailsForm
              initialData={merchantData}
              onNext={(data) => handleNext(data)}
              errors={errors}
              setErrors={setErrors}
            />
          );
        case 2:
          return (
            <KYCVerification
              initialData={merchantData}
              mode={mode}
              kycStatus={kycStatus}
              onNext={(data) => handleNext(data)}
              onBack={handleBack}
            />
          );
        case 3:
          return (
            <BankDetails
              initialData={merchantData}
              mode={mode}
              onNext={(data) => handleNext(data)}
              onBack={handleBack}
            />
          );
        case 4:
          return (
            <FinalStepScreen
              publicKey={airXPay?.publicKey || ''}
              onSuccess={handleFinalStepSuccess}
              onError={handleFinalStepError}
              onSubmitToBackend={onSubmitToBackend} // ✅ Pass the prop
              initialData={{
                merchantName: merchantData.merchantName,
                merchantEmail: merchantData.merchantEmail,
                merchantPhone: merchantData.merchantPhone,
                businessName: merchantData.businessName,
                businessType: merchantData.businessType,
                businessCategory: merchantData.businessCategory,
                country: merchantData.country,
                nationality: merchantData.nationality,
                mode: mode,
              }}
            />
          );
        case 5:
          return (
            <OnboardingCompleteScreen
              onContinue={handleComplete}
              onLogout={() => console.log('Logout')}
              autoFetch={true}
            />
          );
        default:
          return null;
      }
    })();

    return (
      <Animated.View
        style={[
          styles.stepContentWrapper,
          {
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        {stepContent}
      </Animated.View>
    );
  };

  // Progress bar width interpolation
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  // Check if we should show verification UI
  if (isVerifying || !isValidProvider) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
        <LinearGradient
          colors={['#F8F9FA', '#FFFFFF']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          {renderProviderVerification()}
        </LinearGradient>
      </SafeAreaView>
    );
  }

  // Normal onboarding UI when provider is valid
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      
      <LinearGradient
        colors={['#F8F9FA', '#FFFFFF']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <Surface style={styles.headerSurface}>
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                {currentStep > 1 && currentStep < 5 && (
                  <TouchableOpacity 
                    onPress={handleBack} 
                    style={styles.backButton}
                    disabled={isAnimating}
                  >
                    <IconButton
                      icon="arrow-left"
                      size={24}
                      iconColor="#0066CC"
                    />
                  </TouchableOpacity>
                )}
                <View>
                  <Text style={styles.headerTitle}>
                    {getStepTitle()}
                  </Text>
                  <Text style={styles.headerSubtitle}>
                    Step {currentStep} of {STEPS.length}
                  </Text>
                </View>
              </View>
              
              {/* Logo Section - Fixed alignment */}
              <View style={styles.logoContainer}>
                <Avatar.Image 
                  size={32} 
                  source={DEFAULT_LOGO}
                />
              </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <Animated.View 
                  style={[
                    styles.progressFill,
                    { width: progressWidth }
                  ]} 
                />
              </View>
            </View>
          </Surface>

          {/* Step Indicator */}
          <View style={styles.stepIndicatorContainer}>
            <StepIndicator
              currentStep={currentStep}
              steps={STEPS}
              mode={mode}
              isKycCompleted={stepCompletion.kyc}
              isBankDetailsCompleted={stepCompletion.bank}
            />
          </View>

          {/* Current Step Content */}
          <Surface style={styles.contentSurface}>
            <View style={styles.content}>
              {renderStep()}
            </View>
          </Surface>

          {/* Error Snackbar */}
          <Snackbar
            visible={showError}
            onDismiss={() => setShowError(false)}
            duration={5000}
            action={{
              label: 'DISMISS',
              onPress: () => setShowError(false),
              textColor: '#FFFFFF',
            }}
            style={styles.snackbar}
            theme={{ colors: { accent: '#FFFFFF' } }}
          >
            {Object.values(errors)[0] || 'An error occurred'}
          </Snackbar>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  headerSurface: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 8,
    backgroundColor: '#F0F7FF',
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#666666',
    marginTop: 2,
    fontWeight: '400',
  },
  logoContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E5E5',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0066CC',
    borderRadius: 2,
  },
  stepIndicatorContainer: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  contentSurface: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  stepContentWrapper: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  snackbar: {
    backgroundColor: '#FF4444',
    marginBottom: 16,
    borderRadius: 8,
  },
  verificationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  verificationCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  verificationText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  verificationSubtext: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
  },
});

export default MerchantOnboardingSheet;