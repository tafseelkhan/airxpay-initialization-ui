// components/common/CountryDropdown.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { IconButton } from 'react-native-paper';
import CountryPicker, {
  Country,
  CountryCode,
} from 'react-native-country-picker-modal';

interface CountryDropdownProps {
  value: string;
  onChange: (country: string, countryCode?: CountryCode) => void;
  withFlag?: boolean;
  withCallingCode?: boolean;
  withCountryNameButton?: boolean;
  withAlphaFilter?: boolean;
  withFilter?: boolean;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
}

const CountryDropdown: React.FC<CountryDropdownProps> = ({
  value,
  onChange,
  withFlag = true,
  withCallingCode = false,
  withCountryNameButton = true,
  withAlphaFilter = true,
  withFilter = true,
  placeholder = 'Select country',
  label = 'Country',
  error,
  disabled = false,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>();

  const onSelect = (country: Country) => {
    setSelectedCountry(country);
    onChange(country.name as string, country.cca2);
    setModalVisible(false);
  };

  const getDisplayValue = () => {
    if (!value) {
      return <Text style={styles.placeholder}>{placeholder}</Text>;
    }
    
    return (
      <View style={styles.selectedCountry}>
        {selectedCountry?.cca2 && withFlag && (
          <CountryPicker
            countryCode={selectedCountry.cca2}
            withFlag={true}
            withCountryNameButton={false}
            withCallingCode={false}
            withFilter={false}
            withAlphaFilter={false}
            visible={false}
          />
        )}
        <Text style={styles.selectedCountryName} numberOfLines={1}>
          {value}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      
      <TouchableOpacity
        style={[
          styles.dropdown,
          error && styles.dropdownError,
          disabled && styles.dropdownDisabled,
        ]}
        onPress={() => !disabled && setModalVisible(true)}
        activeOpacity={disabled ? 1 : 0.7}
        disabled={disabled}
      >
        {getDisplayValue()}
        
        <IconButton 
          icon="chevron-down" 
          size={20}
          iconColor={disabled ? "#9CA3AF" : "#6B7280"}
        />
      </TouchableOpacity>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <CountryPicker
        countryCode={(selectedCountry?.cca2 || 'US') as CountryCode}
        withFlag={withFlag}
        withCallingCode={withCallingCode}
        withCountryNameButton={withCountryNameButton}
        withAlphaFilter={withAlphaFilter}
        withFilter={withFilter}
        withEmoji={true}
        withModal={true}
        visible={modalVisible}
        onSelect={onSelect}
        onClose={() => setModalVisible(false)}
        containerButtonStyle={styles.hiddenPicker}
        preferredCountries={['IN', 'US', 'GB', 'CA', 'AU', 'SG', 'AE']}
        modalProps={{
          animationType: 'slide',
          presentationStyle: Platform.OS === 'ios' ? 'pageSheet' : 'overFullScreen',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    minHeight: 48,
  },
  dropdownError: {
    borderColor: '#EF4444',
    borderWidth: 1.5,
  },
  dropdownDisabled: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  selectedCountry: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedCountryName: {
    fontSize: 14,
    color: '#111827',
    marginLeft: 8,
    flex: 1,
  },
  placeholder: {
    fontSize: 14,
    color: '#9CA3AF',
    flex: 1,
  },
  hiddenPicker: {
    display: 'none',
  },
  errorText: {
    fontSize: 11,
    color: '#EF4444',
    marginTop: 4,
  },
});

export default CountryDropdown;