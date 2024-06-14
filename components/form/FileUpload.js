import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { pickAndHandleImageChange } from "./utils";
import { styles } from "./styles";

const FileUpload = ({ formData, setFormData, field, label }) => {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const handleImageSelection = () => {
    pickAndHandleImageChange(setImage, setImageUrl, field, formData, setFormData);
  };

  return (
    <View style={styles.fileUploadContainer}>
      <Text>{label}</Text>
      <TouchableOpacity style={styles.imagePicker} onPress={handleImageSelection}>
        <Text>Choose Image</Text>
        {image && <Image source={{ uri: image }} style={styles.uploadedImage} />}
      </TouchableOpacity>
    </View>
  );
};

export default FileUpload;
