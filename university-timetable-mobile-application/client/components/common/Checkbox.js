import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../config/theme';

const Checkbox = ({ value, onValueChange, label }) => {
  const theme = useTheme();

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onValueChange}
      activeOpacity={0.7}
    >
      <View style={[
        styles.checkbox, 
        { 
          borderColor: value ? theme.colors.primary : theme.colors.border,
          backgroundColor: value ? theme.colors.primary : 'transparent',
        }
      ]}>
        {value && (
          <MaterialIcons name="check" size={16} color={theme.colors.onPrimary} />
        )}
      </View>
      {label && (
        <Text style={[styles.label, { color: theme.colors.text }]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

// ... keep existing imports and component logic ...

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 0,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#FFFFFF',
    borderColor: '#000000',
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  label: {
    fontSize: 18,
    fontWeight: '900',
    textTransform: 'uppercase',
    color: '#000000',
  },
});

export default Checkbox;