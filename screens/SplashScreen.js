import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.heading}>MyWell</Text>
        <Text style={styles.secondary}>information system of Himachal springs for Vulnerability Assessment and Rejuvenation</Text>
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
       <Image
        source={require('../assets/images/satymev.jpg')}
         style={styles.image2}
      />
       <Text style={styles.imagetext}>Department of Water Resources,River Deveopment & Ganga Rejuventaion</Text>
      <Text style={styles.imagetext1}>Ministry of jal shakti,Government of India</Text>
      {/* Add more images or text here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',  // Align items to the start of the container
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingBottom:100,
  },
  textContainer: {
    alignItems: 'center',  // Center the text horizontally
    marginTop: 70,  // Add some top margin to push the text down
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,  // Reduce the bottom margin between the heading and secondary text
  },
  secondary: {
    fontSize: 16,
    color: 'red',
    marginBottom: 20,  // Add some bottom margin to push the image down
    textAlign: 'center',
    padding: 6,
  },
 image: {
  width: 200,
  height: 200,
  borderRadius: 360,
  alignSelf: 'center',
},

  image1: {
    width: 100,
    height: 100,
    borderRadius: 360,
    marginTop: 30,
  },
   image2: {
    width: 100,
    height: 168,
    // borderRadius: 360,
    marginTop: 30,
  },
  imagetext: {
    fontSize: 16,
    textAlign:'center',
  },
  imagetext1: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop:10,
  },
});

export default SplashScreen;
