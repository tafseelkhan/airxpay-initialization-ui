// components/steps/OnboardingComplete.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {
  Surface,
  IconButton,
  ActivityIndicator,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Seller, Mode, KYCStatus, SellerStatus } from '../../types/sellertypes';

interface OnboardingCompleteProps {
  sellerData: Seller;
  mode: Mode;
  status: SellerStatus;
  kycStatus: KYCStatus;
  isBankDetailsCompleted: boolean;
  isKycCompleted: boolean;
  isBasicCompleted: boolean;
  onComplete: () => void;
  isWaitingForBackend: boolean;
  onBackendConfirmed: () => void;
}

const OnboardingComplete: React.FC<OnboardingCompleteProps> = ({
  sellerData,
  mode,
  status,
  kycStatus,
  isBankDetailsCompleted,
  isKycCompleted,
  isBasicCompleted,
  onComplete,
  isWaitingForBackend,
  onBackendConfirmed,
}) => {
  const [backendConfirmed, setBackendConfirmed] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;

  // Simulate backend confirmation (in real app, this would come from props/context)
  useEffect(() => {
    if (isWaitingForBackend) {
      // This is where you'd listen for backend confirmation
      // For now, we'll simulate it with a timeout
      const timer = setTimeout(() => {
        setBackendConfirmed(true);
        onBackendConfirmed();
        
        // Animate success state
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
          }),
        ]).start();
      }, 3000); // Simulate 3 second backend processing

      return () => clearTimeout(timer);
    }
  }, [isWaitingForBackend]);

  const getStatusColor = (status: SellerStatus) => {
    switch (status) {
      case 'active':
        return '#10B981';
      case 'suspended':
        return '#F59E0B';
      case 'blocked':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getKYCStatusColor = (status: KYCStatus) => {
    switch (status) {
      case 'verified':
        return '#10B981';
      case 'pending':
        return '#F59E0B';
      case 'rejected':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = (status: SellerStatus) => {
    switch (status) {
      case 'active':
        return '✓';
      case 'suspended':
        return '⚠';
      case 'blocked':
        return '✗';
      default:
        return '•';
    }
  };

  const isFullyActive = status === 'active' && kycStatus === 'verified' && isBankDetailsCompleted;

  // Loading State
  if (isWaitingForBackend && !backendConfirmed) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#FFFFFF', '#F8F9FA']}
          style={styles.gradient}
        >
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
            
            <Text style={styles.loadingTitle}>Creating Your Account</Text>
            <Text style={styles.loadingSubtitle}>
              Please wait while we set up your seller account...
            </Text>

            {/* Step Status Indicators */}
            <Surface style={styles.statusCard}>
              <Text style={styles.statusTitle}>Progress Status</Text>
              
              <View style={styles.statusItem}>
                <View style={styles.statusLeft}>
                  <View style={[styles.statusDot, isBasicCompleted && styles.statusDotCompleted]}>
                    {isBasicCompleted && <Text style={styles.statusDotText}>✓</Text>}
                  </View>
                  <Text style={styles.statusText}>Basic Details</Text>
                </View>
                <Text style={[styles.statusValue, isBasicCompleted && styles.statusValueCompleted]}>
                  {isBasicCompleted ? 'Completed' : 'Pending'}
                </Text>
              </View>

              <View style={styles.statusItem}>
                <View style={styles.statusLeft}>
                  <View style={[styles.statusDot, isKycCompleted && styles.statusDotCompleted]}>
                    {isKycCompleted && <Text style={styles.statusDotText}>✓</Text>}
                  </View>
                  <Text style={styles.statusText}>KYC Verification</Text>
                </View>
                <Text style={[styles.statusValue, isKycCompleted && styles.statusValueCompleted]}>
                  {isKycCompleted ? 'Completed' : 'Pending'}
                </Text>
              </View>

              <View style={styles.statusItem}>
                <View style={styles.statusLeft}>
                  <View style={[styles.statusDot, isBankDetailsCompleted && styles.statusDotCompleted]}>
                    {isBankDetailsCompleted && <Text style={styles.statusDotText}>✓</Text>}
                  </View>
                  <Text style={styles.statusText}>Bank Details</Text>
                </View>
                <Text style={[styles.statusValue, isBankDetailsCompleted && styles.statusValueCompleted]}>
                  {isBankDetailsCompleted ? 'Completed' : 'Pending'}
                </Text>
              </View>

              <View style={styles.processingIndicator}>
                <ActivityIndicator size="small" color="#0066CC" />
                <Text style={styles.processingText}>Processing...</Text>
              </View>
            </Surface>
          </View>
        </LinearGradient>
      </View>
    );
  }

  // Success State
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
          <Animated.View
            style={[
              styles.headerCard,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            <Surface style={styles.headerCardSurface}>
              <View style={styles.headerIcon}>
                <LinearGradient
                  colors={isFullyActive ? ['#10B981', '#059669'] : ['#9CA3AF', '#6B7280']}
                  style={styles.successIcon}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.successIconText}>✓</Text>
                </LinearGradient>
              </View>
              <View style={styles.headerText}>
                <Text style={styles.title}>Onboarding Complete!</Text>
                <Text style={styles.subtitle}>
                  {isFullyActive 
                    ? 'Your seller account is fully active' 
                    : 'Your seller account has been created'}
                </Text>
              </View>
            </Surface>
          </Animated.View>

          {/* Progress Steps - All Completed */}
          <Surface style={styles.progressCard}>
            <View style={styles.progressContainer}>
              <View style={styles.progressStep}>
                <View style={[styles.progressDot, styles.progressDotCompleted]}>
                  <IconButton icon="check" size={10} iconColor="#FFFFFF" />
                </View>
                <Text style={styles.progressTextCompleted}>Basic</Text>
              </View>
              <View style={styles.progressLine} />
              <View style={styles.progressStep}>
                <View style={[styles.progressDot, isKycCompleted ? styles.progressDotCompleted : styles.progressDotPending]}>
                  {isKycCompleted ? (
                    <IconButton icon="check" size={10} iconColor="#FFFFFF" />
                  ) : (
                    <Text style={styles.progressDotText}>2</Text>
                  )}
                </View>
                <Text style={isKycCompleted ? styles.progressTextCompleted : styles.progressTextPending}>
                  KYC
                </Text>
              </View>
              <View style={styles.progressLine} />
              <View style={styles.progressStep}>
                <View style={[styles.progressDot, isBankDetailsCompleted ? styles.progressDotCompleted : styles.progressDotPending]}>
                  {isBankDetailsCompleted ? (
                    <IconButton icon="check" size={10} iconColor="#FFFFFF" />
                  ) : (
                    <Text style={styles.progressDotText}>3</Text>
                  )}
                </View>
                <Text style={isBankDetailsCompleted ? styles.progressTextCompleted : styles.progressTextPending}>
                  Bank
                </Text>
              </View>
            </View>
          </Surface>

          {/* Account Summary Card */}
          <Surface style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <IconButton icon="account-details" size={16} iconColor="#0066CC" />
              <Text style={styles.summaryTitle}>Account Summary</Text>
            </View>

            {/* Seller Info in Grid */}
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Name</Text>
                <Text style={styles.infoValue} numberOfLines={1}>
                  {sellerData.sellerName}
                </Text>
              </View>

              {sellerData.businessName && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Business</Text>
                  <Text style={styles.infoValue} numberOfLines={1}>
                    {sellerData.businessName}
                  </Text>
                </View>
              )}

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue} numberOfLines={1}>
                  {sellerData.sellerEmail}
                </Text>
              </View>

              {sellerData.sellerDID && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Seller ID</Text>
                  <Text style={styles.infoValue} numberOfLines={1}>
                    {sellerData.sellerDID.slice(0, 8)}...
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.divider} />

            {/* Status Badges - Compact Grid */}
            <View style={styles.badgesGrid}>
              {/* Mode Badge */}
              <View style={[
                styles.badge,
                mode === 'live' ? styles.liveBadge : styles.testBadge
              ]}>
                <Text style={[
                  styles.badgeText,
                  mode === 'live' ? styles.liveBadgeText : styles.testBadgeText
                ]}>
                  {mode === 'live' ? '🔴 LIVE' : '🧪 TEST'}
                </Text>
              </View>

              {/* KYC Status Badge */}
              <View style={[styles.badge, { backgroundColor: getKYCStatusColor(kycStatus) + '20' }]}>
                <Text style={[styles.badgeText, { color: getKYCStatusColor(kycStatus) }]}>
                  KYC: {kycStatus === 'verified' ? '✅' : kycStatus === 'pending' ? '⏳' : '❌'} {kycStatus}
                </Text>
              </View>

              {/* Bank Status Badge */}
              <View style={[
                styles.badge,
                isBankDetailsCompleted ? styles.bankCompletedBadge : styles.bankPendingBadge
              ]}>
                <Text style={[
                  styles.badgeText,
                  isBankDetailsCompleted ? styles.bankCompletedText : styles.bankPendingText
                ]}>
                  {isBankDetailsCompleted ? '🏦 Added' : '⏳ Pending'}
                </Text>
              </View>

              {/* Account Status Badge */}
              <View style={[styles.badge, { backgroundColor: getStatusColor(status) + '20' }]}>
                <Text style={[styles.badgeText, { color: getStatusColor(status) }]}>
                  {getStatusIcon(status)} {status}
                </Text>
              </View>
            </View>

            {/* Status Messages - Compact */}
            {mode === 'test' && (
              <View style={styles.testModeMessage}>
                <Text style={styles.testModeMessageText}>🧪 Test mode - No real transactions</Text>
              </View>
            )}

            {kycStatus === 'pending' && (
              <View style={styles.warningMessage}>
                <Text style={styles.warningMessageText}>⏳ KYC verification in progress</Text>
              </View>
            )}

            {isFullyActive && (
              <View style={styles.successMessage}>
                <Text style={styles.successMessageText}>✓ Fully active - Ready to accept payments</Text>
              </View>
            )}
          </Surface>

          {/* Next Steps - Compact */}
          <Surface style={styles.nextStepsCard}>
            <View style={styles.nextStepsHeader}>
              <IconButton icon="format-list-checks" size={16} iconColor="#0066CC" />
              <Text style={styles.nextStepsTitle}>Next Steps</Text>
            </View>
            
            <View style={styles.stepsList}>
              <View style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <Text style={styles.stepText}>Add products</Text>
              </View>
              
              <View style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <Text style={styles.stepText}>Payment settings</Text>
              </View>
              
              <View style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <Text style={styles.stepText}>Start selling</Text>
              </View>
            </View>
          </Surface>

          <Text style={styles.footerText}>
            Update info anytime from dashboard
          </Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    minHeight: 400,
  },
  loadingCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  loadingTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  loadingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusDotCompleted: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  statusDotText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 14,
    color: '#374151',
  },
  statusValue: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  statusValueCompleted: {
    color: '#10B981',
  },
  processingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  processingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6B7280',
  },
  headerCard: {
    marginBottom: 8,
  },
  headerCardSurface: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerIcon: {
    marginRight: 12,
  },
  successIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIconText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
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
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
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
  progressDotPending: {
    backgroundColor: '#E5E7EB',
  },
  progressDotText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  progressLine: {
    width: 24,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 4,
  },
  progressTextCompleted: {
    fontSize: 10,
    color: '#10B981',
    marginTop: 4,
    fontWeight: '500',
  },
  progressTextPending: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 4,
    fontWeight: '500',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  infoItem: {
    width: '50%',
    marginBottom: 6,
    paddingRight: 8,
  },
  infoLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 11,
    fontWeight: '500',
    color: '#111827',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 4,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '500',
  },
  liveBadge: {
    backgroundColor: '#FEE2E2',
  },
  liveBadgeText: {
    color: '#DC2626',
  },
  testBadge: {
    backgroundColor: '#FEF3C7',
  },
  testBadgeText: {
    color: '#D97706',
  },
  bankCompletedBadge: {
    backgroundColor: '#D1FAE5',
  },
  bankCompletedText: {
    color: '#059669',
  },
  bankPendingBadge: {
    backgroundColor: '#FEF3C7',
  },
  bankPendingText: {
    color: '#D97706',
  },
  testModeMessage: {
    padding: 6,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    marginTop: 4,
  },
  testModeMessageText: {
    color: '#92400E',
    fontSize: 10,
    textAlign: 'center',
  },
  warningMessage: {
    padding: 6,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    marginTop: 4,
  },
  warningMessageText: {
    color: '#92400E',
    fontSize: 10,
    textAlign: 'center',
  },
  successMessage: {
    padding: 6,
    backgroundColor: '#D1FAE5',
    borderRadius: 8,
    marginTop: 4,
  },
  successMessageText: {
    color: '#065F46',
    fontSize: 10,
    textAlign: 'center',
  },
  nextStepsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  nextStepsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  nextStepsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  stepsList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  stepNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#0066CC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  stepText: {
    fontSize: 9,
    color: '#374151',
    textAlign: 'center',
  },
  footerText: {
    fontSize: 9,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 16,
  },
});

export default OnboardingComplete;