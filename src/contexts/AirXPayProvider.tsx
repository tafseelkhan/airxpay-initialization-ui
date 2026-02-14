import React, { createContext, useContext, useEffect } from "react";
import { AirXPayConfig } from "../types/type";

// Context with professional error handling
const AirXPayContext = createContext<AirXPayConfig | null>(null);
AirXPayContext.displayName = "AirXPayContext";

interface AirXPayProviderProps {
  config: AirXPayConfig;
  children: React.ReactNode;
  enableLogging?: boolean;
}

export const AirXPayProvider: React.FC<AirXPayProviderProps> = ({
  config,
  children,
  enableLogging = __DEV__,
}) => {
  // Validate configuration on mount
  useEffect(() => {
    const validationErrors: string[] = [];

    // Validate baseUrl
    if (!config.baseUrl) {
      validationErrors.push("baseUrl is required");
    } else {
      try {
        new URL(config.baseUrl);
      } catch {
        validationErrors.push(
          "baseUrl must be a valid URL (e.g., https://api.airxpay.com)",
        );
      }
    }

    // Validate publicKey
    if (!config.publicKey) {
      validationErrors.push("publicKey is required");
    } else if (typeof config.publicKey !== "string") {
      validationErrors.push("publicKey must be a string");
    } else if (config.publicKey.length < 20) {
      validationErrors.push(
        "publicKey appears to be invalid. Please check your API key.",
      );
    }

    // Throw error if validation fails
    if (validationErrors.length > 0) {
      const errorMessage = [
        "AirXPayProvider Configuration Error:",
        ...validationErrors.map((err) => `  • ${err}`),
        "",
        "Received config:",
        `  • baseUrl: ${config.baseUrl || "missing"}`,
        `  • publicKey: ${config.publicKey ? `${config.publicKey.substring(0, 8)}...` : "missing"}`,
      ].join("\n");

      if (enableLogging) {
        console.error("❌ AirXPay:", errorMessage);
      }

      throw new Error(errorMessage);
    }

    // Log success in development
    if (enableLogging) {
      console.log(
        "%c✅ AirXPay Provider Initialized",
        "color: #10b981; font-weight: bold;",
        {
          baseUrl: config.baseUrl,
          publicKey: `${config.publicKey.substring(0, 8)}...`,
        },
      );
    }
  }, [config, enableLogging]);

  return (
    <AirXPayContext.Provider value={config}>{children}</AirXPayContext.Provider>
  );
};

AirXPayProvider.displayName = "AirXPayProvider";

// Professional hook with clear error messages
export const useAirXPay = (): AirXPayConfig => {
  const context = useContext(AirXPayContext);

  if (!context) {
    const errorMessage = [
      "❌ useAirXPay: Hook must be used within an AirXPayProvider",
      "",
      "This error occurs when:",
      "  1. Your component tree is not wrapped in <AirXPayProvider>",
      "  2. You have multiple React roots in your application",
      "  3. The provider is conditionally rendered",
      "",
      "Solution:",
      "  • Wrap your root component with AirXPayProvider:",
      "",
      "    <AirXPayProvider",
      "      config={{",
      '        baseUrl: "https://api.airxpay.com",',
      '        publicKey: "your_public_key_here"',
      "      }}",
      "    >",
      "      <App />",
      "    </AirXPayProvider>",
      "",
      "  • Verify the provider is not inside a conditional or loop",
      `  • Component location: ${new Error().stack?.split("\n")[2]?.trim() || "unknown"}`,
    ].join("\n");

    // Log with styling in development
    if (__DEV__) {
      console.error(
        "%c❌ AirXPay Context Error",
        "color: #ef4444; font-size: 14px; font-weight: bold;",
        "\n" + errorMessage,
      );
    }

    throw new Error(errorMessage);
  }

  return context;
};

// Helper: Check if config exists without throwing
export const useAirXPaySafe = (): AirXPayConfig | null => {
  try {
    return useAirXPay();
  } catch {
    return null;
  }
};

// Helper: Access specific config value
export const useAirXPayConfig = <K extends keyof AirXPayConfig>(
  key: K,
): AirXPayConfig[K] | undefined => {
  const config = useAirXPaySafe();
  return config?.[key];
};

// Helper: Check if provider is properly configured
export const useIsAirXPayReady = (): boolean => {
  const config = useAirXPaySafe();
  return !!(config?.baseUrl && config?.publicKey);
};

// Export context consumer for advanced use cases
export const AirXPayConsumer = AirXPayContext.Consumer;

export default AirXPayProvider;
