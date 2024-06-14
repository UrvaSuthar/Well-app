import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    minWidth: 200,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  dropdown: {
    backgroundColor: '#fafafa',
  },
  dropdownContainer: {
    width: '100%',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  imagePicker: {
    marginBottom: 20,
  },
  uploadedImage: {
    width: 200,
    height: 200,
  },
  fileUploadContainer: {
    marginBottom: 20,
  },
  checkboxGroup: {
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cancelButton: {
    marginTop: 20,
  },
  cancelButtonText: {
    color: '#6a1b9a',
  },
  radioGroup: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
});
