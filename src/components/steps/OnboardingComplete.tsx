// src/components/onboarding/OnboardingCompleteScreen.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import {
  Text,
  Surface,
  ActivityIndicator,
  IconButton
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useMerchantOnboarding } from '../../hooks/useMerchantOnboarding';
import { MerchantStatusResponse } from '../../types/merchantTypes';
import { UI_TEXTS } from '../../etc/constants';

interface OnboardingCompleteScreenProps {
  onContinue?: () => void;
  onLogout?: () => void;
  autoFetch?: boolean;
  merchantId?: string;
  onStatusFetched?: (status: MerchantStatusResponse) => void;
}

export const OnboardingCompleteScreen: React.FC<OnboardingCompleteScreenProps> = ({
  onContinue,
  onLogout,
  autoFetch = true,
  merchantId,
  onStatusFetched
}) => {
  const { loading, error, merchantStatus, fetchStatus, clearError, token } = useMerchantOnboarding();
  const [refreshing, setRefreshing] = useState(false);

  // ✅ Log token on mount (debug)
  useEffect(() => {
    console.log('🔑 Token available:', token ? token.substring(0, 10) + '...' : 'No token');
  }, [token]);

  // ✅ Auto-fetch status when screen loads
  useEffect(() => {
    if (autoFetch) {
      loadStatus();
    }
  }, []);

  // ✅ Handle errors
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error.userMessage);
      clearError();
    }
  }, [error]);

  const loadStatus = async () => {
    setRefreshing(true);
    try {
      console.log('🔍 Fetching merchant status with token...');
      const status = await fetchStatus();
      if (status && onStatusFetched) {
        onStatusFetched(status);
      }
      console.log('✅ Status fetched:', status);
    } catch (err) {
      console.error('❌ Failed to fetch status:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadStatus();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <View style={[styles.statusBadge, styles.activeBadge]}>
            <Text style={[styles.statusText, styles.activeText]}>ACTIVE</Text>
          </View>
        );
      case 'suspended':
        return (
          <View style={[styles.statusBadge, styles.suspendedBadge]}>
            <Text style={[styles.statusText, styles.suspendedText]}>SUSPENDED</Text>
          </View>
        );
      case 'blocked':
        return (
          <View style={[styles.statusBadge, styles.blockedBadge]}>
            <Text style={[styles.statusText, styles.blockedText]}>BLOCKED</Text>
          </View>
        );
      default:
        return (
          <View style={[styles.statusBadge, styles.pendingBadge]}>
            <Text style={[styles.statusText, styles.pendingText]}>PENDING</Text>
          </View>
        );
    }
  };

  const getKycBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <View style={[styles.kycBadge, styles.kycVerified]}>
            <IconButton icon="check-circle" size={16} iconColor="#059669" />
            <Text style={styles.kycVerifiedText}>Verified</Text>
          </View>
        );
      case 'pending':
        return (
          <View style={[styles.kycBadge, styles.kycPending]}>
            <IconButton icon="clock-outline" size={16} iconColor="#D97706" />
            <Text style={styles.kycPendingText}>Pending</Text>
          </View>
        );
      case 'rejected':
        return (
          <View style={[styles.kycBadge, styles.kycRejected]}>
            <IconButton icon="alert-circle" size={16} iconColor="#DC2626" />
            <Text style={styles.kycRejectedText}>Rejected</Text>
          </View>
        );
      default:
        return (
          <View style={[styles.kycBadge, styles.kycNotSubmitted]}>
            <IconButton icon="close-circle" size={16} iconColor="#6B7280" />
            <Text style={styles.kycNotSubmittedText}>Not Submitted</Text>
          </View>
        );
    }
  };

  if (loading && !merchantStatus) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={['#FFFFFF', '#F8F9FA']}
          style={styles.gradient}
        >
          <View style={styles.loadingContent}>
            <ActivityIndicator size="large" color="#0066CC" />
            <Text style={styles.loadingText}>Loading merchant status...</Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  if (!merchantStatus) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#FFFFFF', '#F8F9FA']}
          style={styles.gradient}
        >
          <View style={styles.emptyContainer}>
            <IconButton icon="alert-circle-outline" size={48} iconColor="#9CA3AF" />
            <Text style={styles.emptyTitle}>No Data Found</Text>
            <Text style={styles.emptySubtitle}>
              Unable to fetch merchant status
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFFFFF', '#F8F9FA']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Success Icon */}
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.successIcon}
            >
              <IconButton icon="check" size={40} iconColor="#FFFFFF" />
            </LinearGradient>
          </View>

          <Text style={styles.title}>{UI_TEXTS.ONBOARDING_COMPLETE.TITLE}</Text>
          <Text style={styles.subtitle}>{UI_TEXTS.ONBOARDING_COMPLETE.SUBTITLE}</Text>

          {/* Token Info (Optional - for debugging) */}
          {token && (
            <View style={styles.tokenContainer}>
              <Text style={styles.tokenLabel}>Token:</Text>
              <Text style={styles.tokenValue}>{token.substring(0, 20)}...</Text>
            </View>
          )}

          {/* Refresh Button */}
          <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh} disabled={refreshing}>
            <IconButton
              icon="refresh"
              size={20}
              iconColor={refreshing ? '#9CA3AF' : '#0066CC'}
            />
          </TouchableOpacity>

          {/* Merchant Info Card */}
          <Surface style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Merchant ID</Text>
              <Text style={styles.infoValue}>{merchantStatus.merchantId}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Business Name</Text>
              <Text style={styles.infoValue}>{merchantStatus.merchantName}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{merchantStatus.merchantEmail}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mode</Text>
              <View style={[
                styles.modeBadge,
                merchantStatus.mode === 'live' ? styles.liveBadge : styles.testBadge
              ]}>
                <Text style={[
                  styles.modeText,
                  merchantStatus.mode === 'live' ? styles.liveText : styles.testText
                ]}>
                  {merchantStatus.mode.toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status</Text>
              {getStatusBadge(merchantStatus.status)}
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Created</Text>
              <Text style={styles.infoValue}>
                {new Date(merchantStatus.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </Surface>

          {/* KYC Status Card */}
          <Surface style={styles.kycCard}>
            <View style={styles.kycHeader}>
              <IconButton icon="shield-account" size={20} iconColor="#0066CC" />
              <Text style={styles.kycTitle}>KYC Verification</Text>
            </View>
            
            <View style={styles.kycContent}>
              <View style={styles.kycRow}>
                <Text style={styles.kycLabel}>KYC Status</Text>
                {getKycBadge(merchantStatus.kycStatus)}
              </View>
              
              <View style={styles.kycRow}>
                <Text style={styles.kycLabel}>KYC Completed</Text>
                <View style={[
                  styles.completedBadge,
                  merchantStatus.kycCompleted ? styles.completedTrue : styles.completedFalse
                ]}>
                  <Text style={[
                    styles.completedText,
                    merchantStatus.kycCompleted ? styles.completedTrueText : styles.completedFalseText
                  ]}>
                    {merchantStatus.kycCompleted ? '✓ Yes' : '✗ No'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.kycRow}>
                <Text style={styles.kycLabel}>Bank Details</Text>
                <View style={[
                  styles.completedBadge,
                  merchantStatus.bankDetailsCompleted ? styles.completedTrue : styles.completedFalse
                ]}>
                  <Text style={[
                    styles.completedText,
                    merchantStatus.bankDetailsCompleted ? styles.completedTrueText : styles.completedFalseText
                  ]}>
                    {merchantStatus.bankDetailsCompleted ? '✓ Added' : '✗ Pending'}
                  </Text>
                </View>
              </View>
            </View>
          </Surface>

          {/* Action Buttons */}
          <TouchableOpacity
            style={styles.continueButton}
            onPress={onContinue}
          >
            <LinearGradient
              colors={['#0066CC', '#0099FF']}
              style={styles.continueButtonGradient}
            >
              <Text style={styles.continueButtonText}>
                {UI_TEXTS.ONBOARDING_COMPLETE.CONTINUE_BUTTON}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
            <Text style={styles.logoutButtonText}>
              {UI_TEXTS.ONBOARDING_COMPLETE.LOGOUT_BUTTON}
            </Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>
            {UI_TEXTS.ONBOARDING_COMPLETE.FOOTER}
          </Text>
        </View>
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
  loadingContainer: {
    flex: 1,
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  iconContainer: {
    marginBottom: 24,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  tokenContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  tokenLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
    marginRight: 4,
  },
  tokenValue: {
    fontSize: 12,
    color: '#059669',
    fontFamily: 'monospace',
  },
  refreshButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
  infoCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
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
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: '#D1FAE5',
  },
  suspendedBadge: {
    backgroundColor: '#FEF3C7',
  },
  blockedBadge: {
    backgroundColor: '#FEE2E2',
  },
  pendingBadge: {
    backgroundColor: '#F3F4F6',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeText: {
    color: '#059669',
  },
  suspendedText: {
    color: '#D97706',
  },
  blockedText: {
    color: '#DC2626',
  },
  pendingText: {
    color: '#6B7280',
  },
  kycCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
  },
  kycHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  kycTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  kycContent: {
    gap: 12,
  },
  kycRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kycLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  kycBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  kycVerified: {
    backgroundColor: '#D1FAE5',
  },
  kycPending: {
    backgroundColor: '#FEF3C7',
  },
  kycRejected: {
    backgroundColor: '#FEE2E2',
  },
  kycNotSubmitted: {
    backgroundColor: '#F3F4F6',
  },
  kycVerifiedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
    marginLeft: 4,
  },
  kycPendingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D97706',
    marginLeft: 4,
  },
  kycRejectedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#DC2626',
    marginLeft: 4,
  },
  kycNotSubmittedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 4,
  },
  completedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedTrue: {
    backgroundColor: '#D1FAE5',
  },
  completedFalse: {
    backgroundColor: '#F3F4F6',
  },
  completedText: {
    fontSize: 12,
    fontWeight: '600',
  },
  completedTrueText: {
    color: '#059669',
  },
  completedFalseText: {
    color: '#6B7280',
  },
  continueButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  continueButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  logoutButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 16,
  },
  logoutButtonText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#0066CC',
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});