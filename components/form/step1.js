import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import FormRadioButtons from './FormRadioButtons';
import FileUpload from './FileUpload';
import { styles } from './styles';
import { Button } from '@ant-design/react-native';

const Step1 = ({ navigation, formData, setFormData }) => {
  const [selectedValueq1, setSelectedValueq1] = useState(formData.weather || 'option1');

  const [openState, setOpenState] = useState(false);
  const [valueState, setValueState] = useState(formData.state);
  const [itemsState, setItemsState] = useState([
    { label: 'State 1', value: 'state1' },
    { label: 'State 2', value: 'state2' },
  ]);

  const [openDistrict, setOpenDistrict] = useState(false);
  const [valueDistrict, setValueDistrict] = useState(formData.district);
  const [itemsDistrict, setItemsDistrict] = useState([
    { label: 'District 1', value: 'district1' },
    { label: 'District 2', value: 'district2' },
  ]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Step 1: Spring Description</Text>
      <Text style={styles.label}>Spring Id</Text>
      <TextInput
        style={styles.input}
        placeholder="Spring Id"
        value={formData.springId}
        onChangeText={(text) => setFormData({ ...formData, springId: text })}
      />
      <View style={styles.row}>
        <View>
          <Text style={styles.label}>Latitude</Text>
          <TextInput
            style={styles.input}
            placeholder="Latitude"
            value={formData.latitude}
            onChangeText={(text) => setFormData({ ...formData, latitude: text })}
          />
        </View>
        <View>
          <Text style={styles.label}>Longitude</Text>
          <TextInput
            style={styles.input}
            placeholder="Longitude"
            value={formData.longitude}
            onChangeText={(text) => setFormData({ ...formData, longitude: text })}
          />
        </View>
        <View>
          <Text style={styles.label}>Elevation</Text>
          <TextInput
            style={styles.input}
            placeholder="Elevation"
            value={formData.elevation}
            onChangeText={(text) => setFormData({ ...formData, elevation: text })}
          />
        </View>
      </View>
      <Text style={styles.label}>Spring Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Spring Name"
        value={formData.springName}
        onChangeText={(text) => setFormData({ ...formData, springName: text })}
      />
      <Text style={styles.label}>Weather</Text>
      <Text>(Please select only one option)</Text>
      <FormRadioButtons
        options={[
          { label: 'Clear', value: 'option1' },
          { label: 'Rainy', value: 'option2' },
        ]}
        selectedValue={selectedValueq1}
        onValueChange={setSelectedValueq1}
        formData={formData}
        setFormData={setFormData}
        field="weather"
      />
      <Text style={styles.label}>State</Text>
      <DropDownPicker
        open={openState}
        value={valueState}
        items={itemsState}
        setOpen={setOpenState}
        setValue={setValueState}
        setItems={setItemsState}
        style={styles.dropdown}
        containerStyle={styles.dropdownContainer}
      />
      <Text style={styles.label}>District</Text>
      <DropDownPicker
        open={openDistrict}
        value={valueDistrict}
        items={itemsDistrict}
        setOpen={setOpenDistrict}
        setValue={setValueDistrict}
        setItems={setItemsDistrict}
        style={styles.dropdown}
        containerStyle={styles.dropdownContainer}
      />
      <FileUpload formData={formData} setFormData={setFormData} field="springImage" label="Spring Photo" />
      <View style={styles.buttonContainer}>
        <Button type="primary" onPress={() => navigation.navigate('Step2')}>
          Next
        </Button>
      </View>
    </View>
  );
};

export default Step1;
