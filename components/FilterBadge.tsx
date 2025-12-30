import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface FilterBadgeProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

const FilterBadge: React.FC<FilterBadgeProps> = ({ label, isActive, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.badge,
        isActive ? styles.activeBadge : styles.inactiveBadge,
      ]}
    >
      <Text
        style={[
          styles.text,
          isActive ? styles.activeText : styles.inactiveText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 100,
    borderWidth: 1,
    marginRight: 8,
  },
  activeBadge: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  inactiveBadge: {
    backgroundColor: 'white',
    borderColor: '#D1D5DB',
  },
  text: {
    fontSize: 14,
  },
  activeText: {
    color: '#2563EB',
  },
  inactiveText: {
    color: '#374151',
  },
});

export default FilterBadge;
