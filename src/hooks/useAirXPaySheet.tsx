import React from 'react';
import MerchantOnboardingSheet from '../components/steps/onboarding/MerchantOnboarding';
import { useAirXPaySafe } from '../contexts/AirXPayProvider';
import { MerchantOnboardingProps } from '../types/merchantTypes';

export const useAirXPaySheet = (props: Partial<MerchantOnboardingProps>) => {
  const airXPay = useAirXPaySafe();
  if (!airXPay?.merchantData) return null;

  const merchantData = airXPay.merchantData;

  const defaultOnNext = (stepData: any, step: number) => {};
  const defaultOnBack = (currentStep: number) => {};
  const defaultOnComplete = (finalData: any) => {};

  return (
    <MerchantOnboardingSheet
      merchantId={merchantData.merchant.merchantId}
      mode={merchantData.merchant.mode}
      isKycCompleted={merchantData.merchant.isKycCompleted}
      isBankDetailsCompleted={merchantData.merchant.isBankDetailsCompleted}
      kycStatus={merchantData.merchant.kycStatus}
      status={merchantData.merchant.status}
      onNext={props.onNext || defaultOnNext}
      onBack={props.onBack || defaultOnBack}
      onComplete={props.onComplete || defaultOnComplete}
      initialStep={props.initialStep}
      loading={props.loading}
    />
  );
};
