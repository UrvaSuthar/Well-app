import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Steps, Button } from "@ant-design/react-native";
import { firestore, auth, storage } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Checkbox, RadioButton } from "react-native-paper";
import DropDownPicker from "react-native-dropdown-picker";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import Modal from "react-native-modal";
import { CheckBox } from "react-native-elements";
// import { CheckBox } from "react-native-elements";
import indiaData from "../assets/indiaData.json";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const Step = Steps.Step;
const Stack = createStackNavigator();

const uploadData = async (formData) => {
  const userData = await new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      resolve(user);
    });
  });

  if (userData) {
    const docRef = collection(firestore, "springs");
    await addDoc(docRef, {
      ...formData,
      userId: userData.uid,
    });
  } else {
    const docRef = collection(firestore, "springs");
    console.log("called", formData);
    addDoc(docRef, {
      ...formData,
    }).then(() => {
      console.log("test data uploaded");
    });
    console.log("User not authenticated");
  }
};

const uploadImageAndGetUrl = async (imageFile, setImageUrl) => {
  const response = await fetch(imageFile.uri);
  const blob = await response.blob();
  const reference = ref(storage, "images/" + imageFile.name + Date.now());

  try {
    await uploadBytes(reference, blob);
    const url = await getDownloadURL(reference);
    setImageUrl(url);
    return url;
  } catch (error) {
    console.error("Error uploading image: ", error);
    return "";
  }
};

const pickAndHandleImageChange = async (
  setImage,
  setImageUrl,
  field,
  formData,
  setFormData
) => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled) {
    const pickedImageUri = result.assets[0].uri;
    setImage(pickedImageUri);

    const imageFile = {
      uri: pickedImageUri,
      name: result.assets[0].fileName,
      type: result.assets[0].mimeType,
    };
    const imageUrl = await uploadImageAndGetUrl(imageFile, setImageUrl);
    setFormData({ ...formData, [field]: imageUrl });
  }
};

const FormRadioButtons = ({
  options,
  selectedValue,
  onValueChange,
  formData,
  setFormData,
  field,
}) => (
  <View style={styles.containerRadio}>
    <View style={styles.radioGroup}>
      {options.map((option, index) => (
        <View key={index} style={styles.radioButton}>
          <RadioButton.Android
            value={option.value}
            status={selectedValue === option.value ? "checked" : "unchecked"}
            onPress={() => {
              onValueChange(option.value);
              setFormData({ ...formData, [field]: option.value });
            }}
            color="#007BFF"
          />
          <Text style={styles.radioLabel}>{option.label}</Text>
        </View>
      ))}
    </View>
  </View>
);

const Step1 = ({ navigation, formData, setFormData }) => {
  const [springImage, setSpringImage] = useState(null);
  const [springImageUrl, setSpringImageUrl] = useState("");
  const [selectedValueq1, setSelectedValueq1] = useState(formData.weather);
  const [selectedValueq2, setSelectedValueq2] = useState(formData.springType);

  const [selectedValueq4, setSelectedValueq4] = useState(formData.springNature);
  const [selectedValueq5, setSelectedValueq5] = useState(formData.newlyEmerged);
  const [selectedValueq6, setSelectedValueq6] = useState(formData.muddyWater);

  const [selectedValueq8, setSelectedValueq8] = useState(formData.cleanliness);
  const [selectedValueq9, setSelectedValueq9] = useState(formData.ownership);

  const [selectedValueq11, setSelectedValueq11] = useState(
    formData.storageTank
  );
  const [selectedValueq12, setSelectedValueq12] = useState(
    formData.pipeWaterSupply
  );
  const [selectedValueq13, setSelectedValueq13] = useState(
    formData.cleanlinessAround
  );

  // State dropdown
  const [openState, setOpenState] = useState(false);
  const [valueState, setValueState] = useState(formData.state);
  const [itemsState, setItemsState] = useState(indiaData.states);

  // District dropdown
  const [openDistrict, setOpenDistrict] = useState(false);
  const [valueDistrict, setValueDistrict] = useState(formData.district);
  const [itemsDistrict, setItemsDistrict] = useState([]);

  // Tehsil dropdown
  const [openTehsil, setOpenTehsil] = useState(false);
  const [valueTehsil, setValueTehsil] = useState(formData.tehsil);
  const [itemsTehsil, setItemsTehsil] = useState([]);

  // Language dropdown
  const [openLanguage, setOpenLanguage] = useState(false);
  const [valueLanguage, setValueLanguage] = useState(formData.language);
  const [itemsLanguage, setItemsLanguage] = useState(indiaData.languages);

  useEffect(() => {
    if (valueState) {
      setItemsDistrict(indiaData.districts[valueState] || []);
      setValueDistrict(null);
      setValueTehsil(null);
    }
  }, [valueState]);

  useEffect(() => {
    if (valueDistrict) {
      setItemsTehsil(indiaData.tehsils[valueDistrict] || []);
      setValueTehsil(null);
    }
  }, [valueDistrict]);

  const handleImageSelection = (field) => {
    console.log("as");
    pickAndHandleImageChange(
      setSpringImage,
      setSpringImageUrl,
      field,
      formData,
      setFormData
    );
  };
  const handleSetValue = (val) => {
    setValue(val);
    if (val !== null) {
      setFormData({ ...formData, language: val });
    }
    console.log();
  };

  return (
    <FlatList
      data={[{}]}
      renderItem={() => (
        <View style={styles.container}>
          <Text style={styles.title}>Step 1: Spring Description</Text>
          <Text style={styles.label}>Spring Id</Text>
          <TextInput
            style={styles.input}
            placeholder="Spring Id"
            value={formData.springId}
            onChangeText={(text) =>
              setFormData({ ...formData, springId: text })
            }
          />
          <View style={styles.row}>
            <View>
              <Text style={styles.label}>Latitude</Text>
              <TextInput
                style={styles.input}
                placeholder="Latitude"
                value={formData.latitude}
                onChangeText={(text) =>
                  setFormData({ ...formData, latitude: text })
                }
              />
            </View>
            <View>
              <Text style={styles.label}>Longitude</Text>
              <TextInput
                style={styles.input}
                placeholder="Longitude"
                value={formData.longitude}
                onChangeText={(text) =>
                  setFormData({ ...formData, longitude: text })
                }
              />
            </View>
            <View>
              <Text style={styles.label}>Elevation</Text>
              <TextInput
                style={styles.input}
                placeholder="Elevation"
                value={formData.elevation}
                onChangeText={(text) =>
                  setFormData({ ...formData, elevation: text })
                }
              />
            </View>
          </View>
          <Text style={styles.label}>Spring Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Spring Name"
            value={formData.springName}
            onChangeText={(text) =>
              setFormData({ ...formData, springName: text })
            }
          />
          <Text style={styles.label}>Weather</Text>
          <Text>(Please select only one option)</Text>
          <FormRadioButtons
            options={[
              { label: "Clear", value: "option1" },
              { label: "Rainy", value: "option2" },
            ]}
            selectedValue={selectedValueq1}
            onValueChange={setSelectedValueq1}
            formData={formData}
            setFormData={setFormData}
            field="weather"
          />
          <Text style={styles.label}>Select a language:</Text>
          <DropDownPicker
            open={openLanguage}
            value={valueLanguage}
            items={itemsLanguage}
            setOpen={setOpenLanguage}
            setValue={setValueLanguage}
            setItems={setItemsLanguage}
            style={styles.dropdown}
            containerStyle={styles.dropdownContainer}
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
          <Text style={styles.label}>Tehsil</Text>
          <DropDownPicker
            open={openTehsil}
            value={valueTehsil}
            items={itemsTehsil}
            setOpen={setOpenTehsil}
            setValue={setValueTehsil}
            setItems={setItemsTehsil}
            style={styles.dropdown}
            containerStyle={styles.dropdownContainer}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter municipal area"
            value={formData.mArea}
            onChangeText={(text) => setFormData({ ...formData, mArea: text })}
          />
          <Text style={styles.label}>Village</Text>
          <TextInput
            style={styles.input}
            placeholder="Village Name"
            value={formData.vName}
            onChangeText={(text) => setFormData({ ...formData, vName: text })}
          />
          <Text style={styles.label}>Spring Type</Text>
          <Text>(Please select only one option)</Text>
          <FormRadioButtons
            options={[
              { label: "FreeFlow", value: "option1" },
              { label: "Seep", value: "option2" },
            ]}
            selectedValue={selectedValueq2}
            onValueChange={setSelectedValueq2}
            formData={formData}
            setFormData={setFormData}
            field="springType"
          />
          <Text style={styles.label}>Spring Nature</Text>
          <Text>(Please select only one option)</Text>
          <FormRadioButtons
            options={[
              { label: "Perennial", value: "option1" },
              { label: "Seasonal", value: "option2" },
              { label: "Dried(spring existed in the past)", value: "option3" },
            ]}
            selectedValue={selectedValueq4}
            onValueChange={setSelectedValueq4}
            formData={formData}
            setFormData={setFormData}
            field="springNature"
          />
          <Text style={styles.label}>
            Whether this is a newly emerged spring (within last 10 years)
          </Text>
          <Text>(Please select only one option)</Text>
          <FormRadioButtons
            options={[
              { label: "Yes", value: "option1" },
              { label: "No", value: "option2" },
            ]}
            selectedValue={selectedValueq5}
            onValueChange={setSelectedValueq5}
            formData={formData}
            setFormData={setFormData}
            field="newlyEmerged"
          />
          <Text style={styles.label}>
            Whether spring discharges muddy water
          </Text>
          <Text>(Please select only one option)</Text>
          <FormRadioButtons
            options={[
              { label: "Yes", value: "option1" },
              { label: "No", value: "option2" },
            ]}
            selectedValue={selectedValueq6}
            onValueChange={setSelectedValueq6}
            formData={formData}
            setFormData={setFormData}
            field="muddyWater"
          />
          <Text style={styles.label}>Cleanliness in and around the spring</Text>
          <Text>(Please select only one option)</Text>
          <FormRadioButtons
            options={[
              { label: "Yes", value: "option1" },
              { label: "No", value: "option2" },
            ]}
            selectedValue={selectedValueq8}
            onValueChange={setSelectedValueq8}
            formData={formData}
            setFormData={setFormData}
            field="cleanliness"
          />
          <Text style={styles.label}>Spring ownership</Text>
          <Text>(Please select only one option)</Text>
          <FormRadioButtons
            options={[
              { label: "Public", value: "option1" },
              { label: "Private", value: "option2" },
            ]}
            selectedValue={selectedValueq9}
            onValueChange={setSelectedValueq9}
            formData={formData}
            setFormData={setFormData}
            field="ownership"
          />
          <Text style={styles.label}>
            Whether there is any storage tank on the spring?
          </Text>
          <Text>(Please select only one option)</Text>
          <FormRadioButtons
            options={[
              { label: "Yes", value: "option1" },
              { label: "No", value: "option2" },
            ]}
            selectedValue={selectedValueq11}
            onValueChange={setSelectedValueq11}
            formData={formData}
            setFormData={setFormData}
            field="storageTank"
          />
          <Text style={styles.label}>
            Whether there is any pipe water supply from spring?
          </Text>
          <Text>(Please select only one option)</Text>
          <FormRadioButtons
            options={[
              { label: "Yes", value: "option1" },
              { label: "No", value: "option2" },
            ]}
            selectedValue={selectedValueq12}
            onValueChange={setSelectedValueq12}
            formData={formData}
            setFormData={setFormData}
            field="pipeWaterSupply"
          />
          <Text style={styles.label}>Cleanliness in and around the spring</Text>
          <Text>(Please select only one option)</Text>
          <FormRadioButtons
            options={[
              { label: "Yes", value: "option1" },
              { label: "No", value: "option2" },
            ]}
            selectedValue={selectedValueq13}
            onValueChange={setSelectedValueq13}
            formData={formData}
            setFormData={setFormData}
            field="cleanlinessAround"
          />
          <Text>Spring Photo</Text>
          <TouchableOpacity
            style={styles.imagePicker}
            onPress={() => handleImageSelection('image1')}
          >
            <Text>Choose Spring Image</Text>
            {/* {springImage && (
              <Image
                source={{ uri: springImage }}
                style={{ width: 200, height: 200 }}
              />
            )} */}
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>Spring Photo</Text>
            <View style={styles.optionContainer}>
              {[
                { label: "Close-up shot", type: "closeup" },
                { label: "Wide angle shot", type: "wide" },
                { label: "Selfie", type: "selfie" },
              ].map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.option}
                  onPress={()=>{
                    handleImageSelection(option.type)
                  }}
                >
                  <Image
                    source={require("../assets/adaptive-icon.png")}
                    style={styles.icon}
                  />
                  <Text>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View>
            <Text style={styles.title}>Spring Video</Text>
            <View style={styles.optionContainer}>
              <TouchableOpacity
                style={styles.option}
                onPress={()=>handleImageSelection('video')}
              >
                <Image
                  source={require("../assets/adaptive-icon.png")}
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <Button type="primary" onPress={() => navigation.navigate("Step2")}>
              Next
            </Button>
          </View>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

const Step2 = ({ navigation, formData, setFormData }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(formData.language);
  const [items, setItems] = useState([
    { label: "Naula", value: "Naula" },
    { label: "JavaScript", value: "js" },
    { label: "Python", value: "python" },
    { label: "C++", value: "cpp" },
  ]);

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [isLeftModalVisible, setLeftModalVisible] = useState(false);
  const [selectedLeftMonths, setSelectedLeftMonths] = useState([]);
  const [isColorModalVisible, setColorModalVisible] = useState(false);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "oct",
    "nov",
    "dec",
  ];
  const colors = [
    "Normal",
    "Yellowish",
    "Reddish",
    "Brownish",
    "Greyish",
    "Greenish",
    "Other",
  ];
  const [selectedspringVariability, setSelectedspringVariability] = useState(
    formData.springVariability
  );
  const [selecteddischargeTend, setSelecteddischargeTend] = useState(
    formData.dischargeTend
  );
  const [selectedColor, setSelectedColor] = useState(formData.color);
  const [selectedSmell, setSelectedSmell] = useState(formData.smell);
  const [selectedTaste, setSelectedTaste] = useState(formData.smell);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const handleCheckboxChange = (month) => {
    setSelectedMonths((prevState) =>
      prevState.includes(month)
        ? prevState.filter((item) => item !== month)
        : [...prevState, month]
    );
    setFormData({ ...formData, selectedMonths: [...selectedMonths, month] });
  };

  const toggleLeftModal = () => {
    setLeftModalVisible(!isLeftModalVisible);
  };
  const handleMonthChange = (month) => {
    setSelectedLeftMonths((prevState) =>
      prevState.includes(month)
        ? prevState.filter((item) => item !== month)
        : [...prevState, month]
    );
    setFormData({
      ...formData,
      selectedLeftMonths: [...selectedLeftMonths, month],
    });
  };
  const toggleColorModal = () => {
    setColorModalVisible(!isColorModalVisible);
  };

  return (
    <FlatList
      data={[{}]}
      renderItem={() => (
        <View style={styles.container}>
          <Text style={styles.title}>
            General Physical Characteristics of Spring
          </Text>
          <Text>No. of spring outlets</Text>
          <TextInput
            style={styles.input}
            placeholder="noOutlet"
            value={formData.noOutlet}
            inputMode="decimal"
            onChangeText={(text) =>
              setFormData({ ...formData, noOutlet: text })
            }
          />
          <Text>Outlet 1 volume (l)</Text>
          <TextInput
            style={styles.input}
            placeholder="volume in liters"
            inputMode="decimal"
            value={formData.volume}
            onChangeText={(text) => setFormData({ ...formData, volume: text })}
          />
          <View style={styles.row}>
            <View>
              <Text>outlet1_duration</Text>

              <TextInput
                style={styles.input}
                inputMode="decimal"
                value={formData.od1}
                onChangeText={(text) => setFormData({ ...formData, od1: text })}
              />
            </View>
            <View>
              <Text></Text>
              <TextInput
                style={styles.input}
                placeholder="volume in liters"
                inputMode="decimal"
                value={formData.od2}
                onChangeText={(text) => setFormData({ ...formData, od2: text })}
              />
            </View>
          </View>
          <Text>Outlet 1 discharge (lpm)</Text>
          <TextInput
            style={styles.input}
            placeholder="discharge in liters"
            inputMode="decimal"
            value={formData.od3}
            onChangeText={(text) => setFormData({ ...formData, od3: text })}
          />
          <Text style={styles.label}>
            Seasonal variability (across the year)
          </Text>
          <Text>(Please select only one option)</Text>
          <FormRadioButtons
            options={[
              { label: "High", value: "High" },
              { label: "Low", value: "Low" },
            ]}
            selectedValue={selectedspringVariability}
            onValueChange={setSelectedspringVariability}
            formData={formData}
            setFormData={setFormData}
            field="springVariability"
          />

          <Text style={styles.label}>Peak month(s) of discharge</Text>
          <TouchableOpacity onPress={toggleModal} style={styles.button}>
            <Text style={styles.buttonText}>
              Selected: {selectedMonths.length}
            </Text>
          </TouchableOpacity>

          <Modal isVisible={isModalVisible}>
            <View style={styles.modalContent}>
              {months.map((month, index) => (
                <CheckBox
                  key={index}
                  title={month}
                  iconType=""
                  checkedIcon="checkbox-marked"
                  uncheckedIcon="checkbox-blank-outline"
                  checkedColor="red"
                  checked={selectedMonths.includes(month)}
                  onPress={() => handleCheckboxChange(month)}
                />
              ))}
              <Button title="Close" onPress={toggleModal}>
                Close
              </Button>
            </View>
          </Modal>
          <Text style={styles.label}>Lean month(s) of discharge</Text>

          <TouchableOpacity onPress={toggleLeftModal} style={styles.button}>
            <Text style={styles.buttonText}>
              Selected: {selectedLeftMonths.length}
            </Text>
          </TouchableOpacity>

          <Modal isVisible={isLeftModalVisible}>
            <View style={styles.modalContent}>
              {months.map((month, index) => (
                <CheckBox
                  key={index}
                  title={month}
                  iconRight={true}
                  checked={selectedLeftMonths.includes(month)}
                  onPress={() => handleMonthChange(month)}
                />
              ))}
              <Button title="Close" onPress={toggleLeftModal}>
                Close
              </Button>
            </View>
          </Modal>

          <Text style={styles.label}>Discharge tend in last 10 years</Text>
          <Text>(Please select only one option)</Text>
          <FormRadioButtons
            options={[
              { label: "Highly Decreased", value: "Highly Decreased" },
              { label: "Slightly decreased", value: "Slightly decreased" },
              { label: "No Change", value: "No Change" },
              { label: "Increased", value: "Increased" },
            ]}
            selectedValue={selecteddischargeTend}
            onValueChange={setSelecteddischargeTend}
            formData={formData}
            setFormData={setFormData}
            field="dischargeTend"
          />
          <Text style={styles.label}>color</Text>
          <TouchableOpacity onPress={toggleColorModal} style={styles.button}>
            <Text style={styles.buttonText}>Selected: {selectedColor}</Text>
          </TouchableOpacity>

          <Modal isVisible={isColorModalVisible}>
            <View style={styles.modalContent}>
              <FormRadioButtons
                options={colors.map((color, index) => ({
                  label: color,
                  value: color,
                }))}
                selectedValue={selectedColor}
                onValueChange={setSelectedColor}
                formData={formData}
                setFormData={setFormData}
                field="color"
              />
              <Button title="Close" onPress={toggleColorModal}>
                Close
              </Button>
            </View>
          </Modal>

          <Text style={styles.label}>Smell/Odour</Text>
          <Text>(Please select only one option)</Text>
          <FormRadioButtons
            options={[
              { label: "Agreeable", value: "Agreeable" },
              { label: "Non-agreeable", value: "Non-agreeable" },
            ]}
            selectedValue={selectedSmell}
            onValueChange={setSelectedSmell}
            formData={formData}
            setFormData={setFormData}
            field="smell"
          />
          <Text style={styles.label}>Taste</Text>
          <Text>(Please select only one option)</Text>
          <FormRadioButtons
            options={[
              { label: "Objectionable", value: "Objectionable" },
              { label: "Un-objectionable", value: "Un-objectionable" },
            ]}
            selectedValue={selectedTaste}
            onValueChange={setSelectedTaste}
            formData={formData}
            setFormData={setFormData}
            field="taste"
          />
          <View style={styles.row}>
            <View>
              <Text style={styles.label}>Electric Conductivity (uS/em)</Text>
              <TextInput
                style={styles.input}
                inputMode="decimal"
                value={formData.od2}
                onChangeText={(text) =>
                  setFormData({ ...formData, conductivity: text })
                }
              />
            </View>
            <View>
              <Text style={styles.label}>pH</Text>
              <TextInput
                style={styles.input}
                inputMode="decimal"
                value={formData.od2}
                onChangeText={(text) => setFormData({ ...formData, ph: text })}
              />
            </View>
          </View>
          <Text style={styles.label}>Water Temperature (°C)</Text>
          <TextInput
            style={styles.input}
            inputMode="decimal"
            value={formData.od2}
            onChangeText={(text) =>
              setFormData({ ...formData, temperature: text })
            }
          />
          <View style={styles.buttonContainer}>
            <Button onPress={() => navigation.goBack()}>Back</Button>
            <Button type="primary" onPress={() => navigation.navigate("Step3")}>
              Next
            </Button>
          </View>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

const Step3 = ({ navigation, formData, setFormData }) => {
  return (
    <FlatList
      data={[{}]}
      renderItem={() => (
        <View style={styles.container}>
          <Text style={styles.title}>Chemical characteristics of spring</Text>
          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Turbidity (NTU)</Text>
              <TextInput
                style={styles.input}
                inputMode="decimal"
                value={formData.turbidity}
                onChangeText={(text) =>
                  setFormData({ ...formData, turbidity: text })
                }
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Sodium (mg/l)</Text>
              <TextInput
                style={styles.input}
                inputMode="decimal"
                value={formData.sodium}
                onChangeText={(text) =>
                  setFormData({ ...formData, sodium: text })
                }
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Potassium (mg/l)</Text>
              <TextInput
                style={styles.input}
                inputMode="decimal"
                value={formData.potassium}
                onChangeText={(text) =>
                  setFormData({ ...formData, potassium: text })
                }
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>TSS (mg/l)</Text>
              <TextInput
                style={styles.input}
                inputMode="decimal"
                value={formData.tss}
                onChangeText={(text) => setFormData({ ...formData, tss: text })}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Alkalinity (mg/l)</Text>
              <TextInput
                style={styles.input}
                inputMode="decimal"
                value={formData.alkalinity}
                onChangeText={(text) =>
                  setFormData({ ...formData, alkalinity: text })
                }
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Calcium (mg/l)</Text>
              <TextInput
                style={styles.input}
                inputMode="decimal"
                value={formData.calcium}
                onChangeText={(text) =>
                  setFormData({ ...formData, calcium: text })
                }
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Magnesium (mg/l)</Text>
              <TextInput
                style={styles.input}
                inputMode="decimal"
                value={formData.magnesium}
                onChangeText={(text) =>
                  setFormData({ ...formData, magnesium: text })
                }
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Fluoride (mg/l)</Text>
              <TextInput
                style={styles.input}
                inputMode="decimal"
                value={formData.fluoride}
                onChangeText={(text) =>
                  setFormData({ ...formData, fluoride: text })
                }
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Sulphate (mg/l)</Text>
              <TextInput
                style={styles.input}
                inputMode="decimal"
                value={formData.sulphate}
                onChangeText={(text) =>
                  setFormData({ ...formData, sulphate: text })
                }
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nitrate (mg/l)</Text>
              <TextInput
                style={styles.input}
                inputMode="decimal"
                value={formData.nitrate}
                onChangeText={(text) =>
                  setFormData({ ...formData, nitrate: text })
                }
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Chloride (mg/l)</Text>
              <TextInput
                style={styles.input}
                inputMode="decimal"
                value={formData.chloride}
                onChangeText={(text) =>
                  setFormData({ ...formData, chloride: text })
                }
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Bi-carbonate (mg/l)</Text>
              <TextInput
                style={styles.input}
                inputMode="decimal"
                value={formData.biCarbonate}
                onChangeText={(text) =>
                  setFormData({ ...formData, biCarbonate: text })
                }
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Total Hardness</Text>
              <TextInput
                style={styles.input}
                inputMode="decimal"
                value={formData.chloride}
                onChangeText={(text) =>
                  setFormData({ ...formData, totalHardness: text })
                }
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Ca Hardness</Text>
              <TextInput
                style={styles.input}
                inputMode="decimal"
                value={formData.biCarbonate}
                onChangeText={(text) =>
                  setFormData({ ...formData, caHardness: text })
                }
              />
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <Button onPress={() => navigation.goBack()}>Back</Button>
            <Button type="primary" onPress={() => navigation.navigate("Step4")}>
              Next
            </Button>
          </View>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

const Step4 = ({ navigation, formData, setFormData }) => {
  const handleSubmit = () => {
    const date = new Date();
    formData.createdDate = date.getDate();
    formData.createdTime = date.getTime();
    // console.log(formData);
    uploadData(formData);
  };
  const [checked, setChecked] = useState({
    drinking: false,
    washing: false,
    cattle: false,
    irrigation: false,
    industrial: false,
    other: false,
  });
  const handleChange = (name) => {
    setChecked({ ...checked, [name]: !checked[name] });
  };
  const [isLandModalVisible, setIsLandModalVisible] = useState(false);
  const [selectedLand, setSelectedLand] = useState(formData.land);
  const toggleLandModal = () => {
    setIsLandModalVisible(!isLandModalVisible);
  };
  const [isLandModalVisible2, setIsLandModalVisible2] = useState(false);
  const [selectedLand2, setSelectedLand2] = useState(formData.land2);
  const toggleLandModal2 = () => {
    setIsLandModalVisible2(!isLandModalVisible2);
  };
  const [selectedThreatOption, setSelectedThreatOption] = useState(
    formData.threat
  );
  const [depType, setDepType] = useState(formData.depType);
  lands = ["Forest", "Agriculture", "Pasture", "Shrub", "Settlement"];

  const [checkedSupply, setCheckedSupply] = useState({
    supply: false,
    pump: false,
    dugwell: false,
    pond: false,
    other: false,
  });
  const handleSupplyChange = (name) => {
    setCheckedSupply({ ...checkedSupply, [name]: !checked[name] });
  };
  const [isUndergone, setIsUndergone] = useState(formData.isUndergone);
  const [isDemarcated, setIsDemarcated] = useState(formData.isDemarcated);
  const [measurementFrequency, setMeasurementFrequency] = useState(
    formData.measurementFrequency
  );
  const [dischargeImpact, setDischargeImpact] = useState(
    formData.dischargeImpact
  );
  const [dischargeLongevity, setDischargeLongevity] = useState(
    formData.dischargeLongevity
  );
  const [waterQuality, setWaterQuality] = useState(formData.waterQuality);
  const [springshed, setSpringshed] = useState(formData.springshed);
  const [cleanliness, setCleanliness] = useState(formData.cleanliness);

  return (
    <FlatList
      data={[{}]}
      renderItem={() => (
        <View style={styles.container}>
          <Text style={styles.title}>Other Information</Text>

          <Text style={styles.label}>
            Dominant land use land cover in spring upstream
          </Text>
          <TouchableOpacity onPress={toggleLandModal} style={styles.button}>
            <Text style={styles.buttonText}>Selected: {selectedLand}</Text>
          </TouchableOpacity>
          <Modal isVisible={isLandModalVisible}>
            <View style={styles.modalContent}>
              <Text>Dominant land use land cover in spring upstream</Text>
              <FormRadioButtons
                options={lands.map((land, index) => ({
                  label: land,
                  value: land,
                }))}
                selectedValue={selectedLand}
                onValueChange={setSelectedLand}
                formData={formData}
                setFormData={setFormData}
                field="land"
              />
              <Button title="Close" onPress={toggleLandModal}>
                Close
              </Button>
            </View>
          </Modal>
          <Text style={styles.label}>
            Land use land cover in and around Spring location
          </Text>
          <TouchableOpacity onPress={toggleLandModal2} style={styles.button}>
            <Text style={styles.buttonText}>Selected: {selectedLand2}</Text>
          </TouchableOpacity>
          <Modal isVisible={isLandModalVisible2}>
            <View style={styles.modalContent}>
              <Text>Land use land cover in and around Spring location</Text>
              <FormRadioButtons
                options={lands.map((land, index) => ({
                  label: land,
                  value: land,
                }))}
                selectedValue={selectedLand2}
                onValueChange={setSelectedLand2}
                formData={formData}
                setFormData={setFormData}
                field="land"
              />
              <Button title="Close" onPress={toggleLandModal2}>
                Close
              </Button>
            </View>
          </Modal>

          <Text style={styles.label}>Resource threat</Text>
          <Text>(Please select only one option)</Text>
          <FormRadioButtons
            options={[
              {
                label: "Yes",
                value: "yes",
              },
              {
                label: "No",
                value: "no",
              },
            ]}
            selectedValue={selectedThreatOption}
            onValueChange={setSelectedThreatOption}
            formData={formData}
            setFormData={setFormData}
            field="threat"
          />
          <Text style={styles.label}>Spring uses</Text>
          <Text style={styles.subtitle}>
            (Please select multiple options, if applicable)
          </Text>
          <View style={styles.checkboxContainer}>
            <Checkbox.Item
              label="Drinking/Cooking"
              status={checked.drinking ? "checked" : "unchecked"}
              onPress={() => handleChange("drinking")}
            />
            <Checkbox.Item
              label="Washing/Sanitation"
              status={checked.washing ? "checked" : "unchecked"}
              onPress={() => handleChange("washing")}
            />
            <Checkbox.Item
              label="Cattle"
              status={checked.cattle ? "checked" : "unchecked"}
              onPress={() => handleChange("cattle")}
            />
            <Checkbox.Item
              label="Irrigation"
              status={checked.irrigation ? "checked" : "unchecked"}
              onPress={() => handleChange("irrigation")}
            />
            <Checkbox.Item
              label="Industrial"
              status={checked.industrial ? "checked" : "unchecked"}
              onPress={() => handleChange("industrial")}
            />
            <Checkbox.Item
              label="Other"
              status={checked.other ? "checked" : "unchecked"}
              onPress={() => handleChange("other")}
            />
          </View>
          <Text style={styles.label}>Dependant Type</Text>
          <Text>(Please select only one option)</Text>
          <FormRadioButtons
            options={[
              {
                label: "Resident",
                value: "Resident",
              },
              {
                label: "Non-Resident",
                value: "Non-Resident",
              },
              { label: "Wild Animal", value: "Wild Animal" },
            ]}
            selectedValue={depType}
            onValueChange={setDepType}
            formData={formData}
            setFormData={setFormData}
            field="depType"
          />

          <Text>Total dependent villages</Text>
          <TextInput
            style={styles.input}
            value={formData.depCount}
            inputMode="decimal"
            onChangeText={(text) =>
              setFormData({ ...formData, depCount: text })
            }
          />
          <Text>Name of dependent villages</Text>
          <TextInput
            style={styles.input}
            value={formData.depVillage}
            inputMode="text"
            onChangeText={(text) =>
              setFormData({ ...formData, depVillage: text })
            }
          />
          <Text>Total dependent households</Text>
          <TextInput
            style={styles.input}
            value={formData.depHouseHolds}
            inputMode="text"
            onChangeText={(text) =>
              setFormData({ ...formData, depHouseHolds: text })
            }
          />
          <Text>Total dependent Population</Text>
          <TextInput
            style={styles.input}
            value={formData.depPopulation}
            inputMode="text"
            onChangeText={(text) =>
              setFormData({ ...formData, depPopulation: text })
            }
          />
          <Text>Total dependent livestock</Text>
          <TextInput
            style={styles.input}
            value={formData.livestock}
            inputMode="text"
            onChangeText={(text) =>
              setFormData({ ...formData, livestock: text })
            }
          />
          <Text style={styles.label}>Dependency</Text>
          <Text>(Please select only one option)</Text>
          <FormRadioButtons
            options={[
              {
                label: "Low",
                value: "Low",
              },
              {
                value: "Moderate",
                label: "Moderate",
              },
              { label: "High", value: "High" },
            ]}
            selectedValue={depType}
            onValueChange={setDepType}
            formData={formData}
            setFormData={setFormData}
            field="depType"
          />
          <Text style={styles.label}>Other available sources of water</Text>
          <Text>(Please select multiple options, if applicable)</Text>
          <View style={styles.checkboxContainer}>
            <Checkbox.Item
              label="Piped supply"
              status={checked.supply ? "checked" : "unchecked"}
              onPress={() => handleSupplyChange("supply")}
            />
            <Checkbox.Item
              label="Hand pump"
              status={checked.pump ? "checked" : "unchecked"}
              onPress={() => handleSupplyChange("pump")}
            />
            <Checkbox.Item
              label="Dugwell"
              status={checked.dugwell ? "checked" : "unchecked"}
              onPress={() => handleSupplyChange("dugwell")}
            />
            <Checkbox.Item
              label="Pond"
              status={checked.pond ? "checked" : "unchecked"}
              onPress={() => handleSupplyChange("pond")}
            />
            <Checkbox.Item
              label="Other"
              status={checked.other ? "checked" : "unchecked"}
              onPress={() => handleSupplyChange("other")}
            />
          </View>

          <Text style={styles.label}>
            Whether the spring has undergone any Springed Management Programme?
          </Text>
          <Text>(Please select only one option)</Text>
          <FormRadioButtons
            options={[
              {
                label: "Yes",
                value: "Yes",
              },
              {
                label: "No",
                value: "No",
              },
            ]}
            selectedValue={isUndergone}
            onValueChange={setIsUndergone}
            formData={formData}
            setFormData={setFormData}
            field="isUndergone"
          />

          <Text style={styles.label}>
            Whether the recharge area of the spring is demarcated?
          </Text>
          <Text>(Please select only one option)</Text>
          <FormRadioButtons
            options={[
              {
                label: "Yes",
                value: "Yes",
              },
              {
                label: "No",
                value: "No",
              },
            ]}
            selectedValue={isDemarcated}
            onValueChange={setIsDemarcated}
            formData={formData}
            setFormData={setFormData}
            field="isDemarcated"
          />
          <Text style={styles.label}>
            Whether the discharge of spring is being measured regularly?
          </Text>
          <Text>(Please select only one option)</Text>
          <FormRadioButtons
            options={[
              { label: "Daily", value: "Daily" },
              { label: "Weekly", value: "Weekly" },
              { label: "Bi-weekly", value: "Bi-weekly" },
              { label: "Monthly", value: "Monthly" },
              { label: "Seasonal", value: "Seasonal" },
              { label: "None", value: "None" },
            ]}
            selectedValue={measurementFrequency}
            onValueChange={setMeasurementFrequency}
            formData={formData}
            setFormData={setFormData}
            field="measurementFrequency"
          />
          <Text style={styles.label}>
            Impact of Springshed Management Programme
          </Text>
          <Text style={styles.label}>Discharge</Text>
          <Text>(Please select only one option)</Text>
          <FormRadioButtons
            options={[
              { label: "Increased", value: "Increased" },
              { label: "Decreased", value: "Decreased" },
              { label: "No change", value: "No change" },
            ]}
            selectedValue={dischargeImpact}
            onValueChange={setDischargeImpact}
            formData={formData}
            setFormData={setFormData}
            field="dischargeImpact"
          />
          <Text style={styles.label}>Longevity of spring discharge</Text>
          <Text>(Please select only one option)</Text>
          <FormRadioButtons
            options={[
              { label: "Increased", value: "Increased" },
              { label: "Decreased", value: "Decreased" },
              { label: "No change", value: "No change" },
            ]}
            selectedValue={dischargeLongevity}
            onValueChange={setDischargeLongevity}
            formData={formData}
            setFormData={setFormData}
            field="dischargeLongevity"
          />
          <Text style={styles.label}>Spring water quality</Text>
          <Text>(Please select only one option)</Text>
          <FormRadioButtons
            options={[
              { label: "Improved", value: "Improved" },
              { label: "Decreased", value: "Decreased" },
              { label: "No change", value: "No change" },
            ]}
            selectedValue={waterQuality}
            onValueChange={setWaterQuality}
            formData={formData}
            setFormData={setFormData}
            field="waterQuality"
          />
          <Text style={styles.label}>
            Whether local residents feel the need of springshed management
            programme?
          </Text>
          <Text>(Please select only one option)</Text>
          <FormRadioButtons
            options={[
              { label: "Yes", value: "Yes" },
              { label: "No", value: "No" },
            ]}
            selectedValue={springshed}
            onValueChange={setSpringshed}
            formData={formData}
            setFormData={setFormData}
            field="springshed"
          />
          <Text style={styles.label}>Cleanliness around spring</Text>
          <Text>(Please select only one option)</Text>
          <FormRadioButtons
            options={[
              { label: "Satisfactory", value: "Satisfactory" },
              { label: "Non-satisfactory", value: "Non-satisfactory" },
            ]}
            selectedValue={cleanliness}
            onValueChange={setCleanliness}
            formData={formData}
            setFormData={setFormData}
            field="cleanliness"
          />

          <Text>Any other information</Text>
          <TextInput
            style={styles.input}
            value={formData.otherInfo}
            inputMode="text"
            onChangeText={(text) =>
              setFormData({ ...formData, otherInfo: text })
            }
          />
          <Text>Name of information provider</Text>
          <TextInput
            style={styles.input}
            value={formData.infoProvider}
            inputMode="text"
            onChangeText={(text) =>
              setFormData({ ...formData, infoProvider: text })
            }
          />
          <Text>Mobile of information provider</Text>
          <TextInput
            style={styles.input}
            value={formData.infoProviderContact}
            inputMode="text"
            onChangeText={(text) =>
              setFormData({ ...formData, infoProviderContact: text })
            }
          />

          <Button type="primary" onPress={handleSubmit}>
            Submit
          </Button>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

const StepperForm = () => {
  const [formData, setFormData] = useState({
    springName: "",
    name: "",
    noOutlet: "",
    time: "",
    springId: "",
    latitude: "",
    longitude: "",
    elevation: "",
    weather: "option1",
    language: "",
    state: "",
    district: "",
    tehsil: "",
    mArea: "",
    vName: "",
    springType: "",
    springNature: "",
    newlyEmerged: "",
    muddyWater: "",
    cleanliness: "",
    ownership: "",
    storageTank: "",
    pipeWaterSupply: "",
    cleanlinessAround: "",
    springImage: "",
    volume: 1,
    od1: 0,
    od2: 0,
    springVariability: "",
    od3: 0,
    dischargeTend: "",
    smell: "",
    taste: "",
    noOutlet: 0,
    conductivity: 0,
    selectedMonths: [],
    selectedLeftMonths: [],
    temperature: 0,
    color: "",
    turbidity: "2.04",
    sodium: "",
    potassium: "",
    tss: "",
    alkalinity: "",
    calcium: "",
    magnesium: "25",
    fluoride: "0.5",
    sulphate: "0",
    nitrate: "0",
    totalHardness: "0",
    caHardness: "0",
    land: "",
    land2: "",
    threat: "",
    depType: "",
    depCount: 0,
    depVillage: "",
    depHouseHolds: "",
    depPopulation: "",
    livestock: "",
    isUndergone: "",
    isDemarcated: "",
    measurementFrequency: "",
    dischargeImpact: "",
    dischargeLongevity: "",
    waterQuality: "",
    springshed: "",
    cleanliness: "",
    otherInfo: "",
    infoProvider: "",
    infoProviderContact: "",
    createdDate: "",
    createdTime: "",
    status: "Pending",
  });

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Spring Survey</Text>
        </View>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Step1">
            {(props) => (
              <Step1 {...props} formData={formData} setFormData={setFormData} />
            )}
          </Stack.Screen>
          <Stack.Screen name="Step2">
            {(props) => (
              <Step2 {...props} formData={formData} setFormData={setFormData} />
            )}
          </Stack.Screen>
          <Stack.Screen name="Step3">
            {(props) => (
              <Step3 {...props} formData={formData} setFormData={setFormData} />
            )}
          </Stack.Screen>
          <Stack.Screen name="Step4">
            {(props) => (
              <Step4 {...props} formData={formData} setFormData={setFormData} />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 20,
  },
  header: {
    backgroundColor: "#6a1b9a",
    padding: 20,
    paddingTop: 40,
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    minWidth: 200,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  cancelButton: {
    marginTop: 20,
  },
  cancelButtonText: {
    color: "#6a1b9a",
  },
  containerRadio: {
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  radioGroup: {
    flexDirection: "column",
    alignItems: "flex-start",
    flexWrap: "wrap",
    marginTop: 5,
    borderRadius: 8,
    backgroundColor: "white",
    padding: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: 340,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioLabel: {
    marginLeft: 4,
    fontSize: 13,
    color: "#333",
  },
  imagePicker: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  dropdownContainer: {
    width: "100%",
    marginBottom: 20,
  },
  dropdown: {
    backgroundColor: "#fafafa",
  },
  dropdownStyle: {
    backgroundColor: "#fafafa",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  optionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  option: {
    alignItems: "center",
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: "#EDE7F6",
  },
  button: {
    backgroundColor: "#6200ea",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  checkboxContainer: {
    marginBottom: 10,
  },
});

export default StepperForm;
