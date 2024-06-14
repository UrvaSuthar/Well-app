import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";

export const uploadImageAndGetUrl = async (imageFile, setImageUrl) => {
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

export const pickAndHandleImageChange = async (
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
