import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import firebase from 'firebase/app';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { auth, firebaseConfig } from '../firebaseConfig'; // Ensure this path is correct for your project
import { getAuth, RecaptchaVerifier, signInWithCredential, PhoneAuthCredential , PhoneAuthProvider} from "firebase/auth";

const LoginScreen = ({ navigation }) => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [verificationId, setVerificationId] = useState(null);

  const recaptchaVerifier = useRef(null);
  const mobileAnim = useRef(new Animated.Value(0)).current;
  const passwordAnim = useRef(new Animated.Value(0)).current;

  const handleLogin = () => {
    if (validateInputs()) {
      sendVerification();
    }
  };

  const sendVerification = async () => {
    try {
      const phoneProvider = new PhoneAuthProvider(auth);
      const verificationId = await phoneProvider.verifyPhoneNumber(
        '+91' + mobile,
        recaptchaVerifier.current
      );
      setVerificationId(verificationId);
      Alert.alert('Verification code has been sent to your phone.', verificationId);
    } catch (err) {
      alert(err.message);
    }
  };

  const confirmCode = async () => {
    try {
      console.log(verificationId);
      const credential = new PhoneAuthCredential({
        verificationId: verificationId,
        verificationCode: verificationCode,
      });


      await signInWithCredential(auth,credential);
      navigation.replace('Home');
    } catch (err) {
      alert(err.message);
    }
  };

  const validateInputs = () => {
    let valid = true;

    if (mobile.length !== 10 || isNaN(mobile)) {
      setMobileError('Please enter a valid 10-digit mobile number');
      valid = false;
    } else {
      setMobileError('');
    }

    return valid;
  };

  const handleFocus = (animation) => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = (animation) => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const mobileLabelStyle = {
    transform: [
      {
        translateY: mobileAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -20],
        }),
      },
    ],
  };

  const passwordLabelStyle = {
    transform: [
      {
        translateY: passwordAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -20],
        }),
      },
    ],
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={firebaseConfig}
        />
        <View style={styles.textContainer}>
          <Text style={styles.heading}>MyWell</Text>
          <Text style={styles.secondary}>
            Information system of Himachal springs for Vulnerability Assessment and Rejuvenation
          </Text>
        </View>
        <Image
          source={require('../assets/images/7042444_41021.jpg')}
          style={styles.image}
        />
        <Image
          source={require('../assets/images/test-Photoroom.png')}
          style={styles.image1}
        />
        <Text style={styles.imagetext}>Developed by:</Text>
        <Text style={styles.imagetext1}>National Institute of Hydrology, Roorkee</Text>

        {/* Login Fields */}
        <View style={styles.inputContainer}>
          <Animated.Text style={[styles.label, mobileLabelStyle]}>Mobile Number</Animated.Text>
          <TextInput
            style={styles.input}
            onFocus={() => handleFocus(mobileAnim)}
            onBlur={() => handleBlur(mobileAnim)}
            onChangeText={setMobile}
            value={mobile}
            keyboardType="numeric"
            maxLength={10}
          />
          {mobileError ? <Text style={styles.error}>{mobileError}</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Verification Code"
            style={styles.input}
            onChangeText={setVerificationCode}
            value={verificationCode}
            keyboardType="number-pad"
          />
        </View>

        <TouchableOpacity id='btn-captcha' style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Send Verification Code</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={confirmCode}>
          <Text style={styles.buttonText}>Confirm Verification Code</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingBottom: 100,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 70,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  secondary: {
    fontSize: 16,
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
    padding: 6,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 360,
  },
  image1: {
    width: 100,
    height: 100,
    borderRadius: 360,
    marginTop: 30,
  },
  imagetext: {
    fontSize: 16,
    textAlign: 'center',
  },
  imagetext1: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  inputContainer: {
    width: '80%',
    marginVertical: 10,
  },
  label: {
    position: 'absolute',
    left: 10,
    top: 10,
    fontSize: 16,
    color: '#aaa',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginTop: 5,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default LoginScreen;
