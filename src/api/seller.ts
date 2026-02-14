export interface SellerInitResponse {
  mode: "live" | "test";
  userId: string;
  isKycCompleted: boolean;
  isBankDetailsCompleted: boolean;
  kycStatus: string;
  status: string;
}

export const verifyPublicKey = async (
  baseUrl: string,
  publicKey: string,
): Promise<SellerInitResponse> => {
  const response = await fetch(`${baseUrl}/api/verify-public-key`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ publicKey }),
  });

  if (!response.ok) {
    throw new Error("Invalid public key or server error");
  }

  return await response.json();
};
