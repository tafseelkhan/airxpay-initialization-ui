// components/SellerOnboardingSheet.tsx

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
import OnboardingComplete from '../../steps/OnboardingComplete';
import { Seller, SellerOnboardingProps, StepConfig, FormErrors } from '../../../types/sellertypes';
import { useAirXPaySafe } from '../../../contexts/AirXPayProvider';

const { width } = Dimensions.get('window');

// Extend StepConfig to include icon
interface ExtendedStepConfig extends StepConfig {
  icon?: string;
}

const STEPS: ExtendedStepConfig[] = [
  { id: 1, name: 'Basic Details', key: 'basic', isRequired: true, icon: 'account' },
  { id: 2, name: 'KYC Verification', key: 'kyc', isRequired: true, icon: 'shield-account' },
  { id: 3, name: 'Bank Details', key: 'bank', isRequired: true, icon: 'bank' },
  { id: 4, name: 'Complete', key: 'complete', isRequired: false, icon: 'check-circle' },
];

// Default logo - can be overridden via props
const DEFAULT_LOGO = require('../../../../../../assets/images/airxpay.png');

const SellerOnboardingSheet: React.FC<SellerOnboardingProps> = ({
  sellerId,
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
  loading: externalLoading = false,
}) => {
  // Get configuration from provider (keep intact as required)
const airXPay = useAirXPaySafe();

if (!airXPay) {
console.warn(
  'AirXPayProvider is undefined. ' +
  'Provider not found in component tree. ' +
  'Value is undefined where provider should be. ' +
  'This undefined provider will cause issues. ' +
  'Undefined context from missing provider. ' +
  'Wrap your app with <AirXPayProvider>. ' +
  'AirXPayProvider cannot be undefined. ' +
  'Undefined provider at root level missing. ' +
  'Add <AirXPayProvider> around your app. ' +
  'Fix this undefined provider immediately.'
);
}

// Access config safely
const baseUrl = airXPay?.baseUrl;
const publicKey = airXPay?.publicKey;
  // Properly use variables so TS doesn't complain
useEffect(() => {
  if (!baseUrl || !publicKey) {
    console.warn('AirXPay config is missing baseUrl or publicKey');
  } else {
    console.log('✅ AirXPay ready with baseUrl and publicKey');
  }
}, [baseUrl, publicKey]);
  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(initialStep / STEPS.length)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // State management
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [sellerData, setSellerData] = useState<Partial<Seller>>({
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

  // Track completion status of each step
  const [stepCompletion, setStepCompletion] = useState({
    basic: !!initialData.sellerName && !!initialData.sellerEmail,
    kyc: isKycCompleted || false,
    bank: isBankDetailsCompleted || false,
  });

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

  const handleNext = (stepData: Partial<Seller>) => {
    const updatedData = { ...sellerData, ...stepData };
    setSellerData(updatedData);
    
    // Update step completion status
    if (currentStep === 1) {
      setStepCompletion(prev => ({ 
        ...prev, 
        basic: !!(updatedData.sellerName && updatedData.sellerEmail) 
      }));
    } else if (currentStep === 2) {
      setStepCompletion(prev => ({ ...prev, kyc: true }));
    } else if (currentStep === 3) {
      setStepCompletion(prev => ({ ...prev, bank: true }));
    }
    
    // Call onNext callback with step data and current step
    onNext(stepData, currentStep);

    // Move to next step if not last step
    if (currentStep < STEPS.length) {
      animateStepTransition('next');
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 150);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      animateStepTransition('back');
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        onBack(currentStep);
      }, 150);
    }
  };

  const validateStepData = useCallback((): boolean => {
    // Validate required fields
    if (!sellerData.sellerName || !sellerData.sellerEmail) {
      setErrors({ sellerName: 'Seller name and email are required' });
      setShowError(true);
      return false;
    }

    if (mode === 'live') {
      if (!stepCompletion.kyc) {
        Alert.alert(
          'KYC Pending',
          'Please complete KYC verification first',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Go to KYC', onPress: () => setCurrentStep(2) }
          ]
        );
        return false;
      }
      if (!stepCompletion.bank) {
        Alert.alert(
          'Bank Details Pending',
          'Please add bank details first',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Go to Bank Details', onPress: () => setCurrentStep(3) }
          ]
        );
        return false;
      }
    }

    return true;
  }, [sellerData, mode, stepCompletion]);

  const handleComplete = useCallback(() => {
    // Validate all required data before completing
    if (!validateStepData()) {
      return;
    }

  if (!baseUrl || !publicKey) {
    Alert.alert(
      'Configuration Error',
      'AirXPay baseUrl or publicKey is missing. Please check provider setup.'
    );
    return;
  }
    // Show loading state while waiting for backend confirmation
    setIsWaitingForBackend(true);

    // Success animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Prepare complete seller data
    const completeSellerData: Seller = {
      ...sellerData,
      mode,
      kycStatus: stepCompletion.kyc ? 'verified' : kycStatus,
      isKycCompleted: stepCompletion.kyc,
      isBankDetailsCompleted: stepCompletion.bank,
      status: status || (mode === 'live' && stepCompletion.kyc && stepCompletion.bank ? 'active' : 'pending'),
    } as Seller;

    // Call onComplete with seller data
    // The developer's backend will handle actual seller creation
    // and should call a callback or update state when complete
    onComplete(completeSellerData);
  }, [sellerData, mode, status, kycStatus, stepCompletion, onComplete, validateStepData]);

  // This function would be called by the parent when backend confirms creation
  const handleBackendConfirmation = useCallback(() => {
    setIsWaitingForBackend(false);
    // The OnboardingComplete component will now show success state
  }, []);

  const getStepTitle = () => {
    const step = STEPS.find(s => s.id === currentStep);
    return step?.name || '';
  };

  const renderStep = () => {
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
              initialData={sellerData}
              onNext={(data) => handleNext(data)}
              errors={errors}
              setErrors={setErrors}
            />
          );
        case 2:
          return (
            <KYCVerification
              initialData={sellerData}
              mode={mode}
              kycStatus={kycStatus}
              onNext={(data) => handleNext(data)}
              onBack={handleBack}
            />
          );
        case 3:
          return (
            <BankDetails
              initialData={sellerData}
              mode={mode}
              onNext={(data) => handleNext(data)}
              onBack={handleBack}
            />
          );
        case 4:
          return (
            <OnboardingComplete
              sellerData={sellerData as Seller}
              mode={mode}
              status={status}
              kycStatus={kycStatus}
              isBankDetailsCompleted={stepCompletion.bank}
              isKycCompleted={stepCompletion.kyc}
              isBasicCompleted={stepCompletion.basic}
              onComplete={handleComplete}
              isWaitingForBackend={isWaitingForBackend}
              onBackendConfirmed={handleBackendConfirmation}
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
                {currentStep > 1 && currentStep < 4 && (
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
              
              {/* Logo Section - Now configurable */}
              <View style={styles.logoContainer}>
                <Avatar.Image 
                  size={40} 
                  source={DEFAULT_LOGO}
                  style={styles.avatar}
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
  avatar: {
    backgroundColor: '#ffffff',
  },
  logoContainer: {
    width: 16,
    height: 16,
    left: -24,
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
});

export default SellerOnboardingSheet;