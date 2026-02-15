import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

interface ButtonType {
  value: string;
  label: string;
  showSelectedCheck?: boolean;
}

interface CustomSegmentedButtonsProps {
  value: string;
  onValueChange: (value: string) => void;
  buttons: ButtonType[];
  style?: ViewStyle;
}

const styles = StyleSheet.create({
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 4,
  },
  segmentedButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: 'transparent',
  },
  segmentedButtonActive: {
    backgroundColor: '#6200ee',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  segmentedButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  segmentedButtonTextActive: {
    color: 'white',
  },
  segmentedButtonCheck: {
    color: 'white',
    marginLeft: 4,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

const CustomSegmentedButtons: React.FC<CustomSegmentedButtonsProps> = ({
  value,
  onValueChange,
  buttons,
  style,
}) => {
  return (
    <View style={[styles.segmentedContainer, style]}>
      {buttons.map((button: ButtonType) => (
        <TouchableOpacity
          key={button.value}
          style={[
            styles.segmentedButton,
            value === button.value && styles.segmentedButtonActive
          ]}
          onPress={() => onValueChange(button.value)}
        >
          <Text
            style={[
              styles.segmentedButtonText,
              value === button.value && styles.segmentedButtonTextActive
            ]}
          >
            {button.label}
          </Text>
          {button.showSelectedCheck && value === button.value && (
            <Text style={styles.segmentedButtonCheck}>✓</Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default CustomSegmentedButtons;