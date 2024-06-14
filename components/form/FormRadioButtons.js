import React from 'react';
import { View, Text } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { styles } from './styles';

const FormRadioButtons = ({ options, selectedValue, onValueChange, formData, setFormData, field }) => {
  const handleRadioChange = (value) => {
    onValueChange(value);
    setFormData({ ...formData, [field]: value });
  };

  return (
    <View style={styles.radioGroup}>
      {options.map((option, index) => (
        <View key={index} style={styles.radioButtonContainer}>
          <RadioButton
            value={option.value}
            status={selectedValue === option.value ? 'checked' : 'unchecked'}
            onPress={() => handleRadioChange(option.value)}
          />
          <Text style={styles.radioLabel}>{option.label}</Text>
        </View>
      ))}
    </View>
  );
};

export default FormRadioButtons;
