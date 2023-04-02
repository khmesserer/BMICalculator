import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  ScrollView,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const key = '@MyApp:key';

export default class App extends Component {

  state = {
    height: '',
    weight: '',
    bmi: '',
  }
  constructor(props) {
    super(props);
    this.onLoad();
  }

  onLoad = async () => {
    try {
      const storedValue = await AsyncStorage.getItem(key);
      this.setState({ bmi: storedValue });
    } catch (error) {
      Alert.alert('Error', 'There was an error while loading the data');
    }
  }

  onCompute = async () => {
    if(isNaN(this.state.weight) || this.state.weight <= 0){
      Alert.alert("Weight must be a valid positive number");
    } else if(isNaN(this.state.height) || this.state.height <= 0){
      Alert.alert("Height must be valid positive number");
    }else{
      var result = ((this.state.weight / (this.state.height * this.state.height)) * 703).toFixed(2);
      
      try {
        await AsyncStorage.setItem(key, result);
      } catch (error) {
        Alert.alert('Error', 'There was an error while saving the data');
      }
      this.setState({ bmi: result });
    }
  }

  onWeightChange = (text) => {
    this.setState({ weight: text });
  }

  onHeightChange = (text) => {
    this.setState({ height: text });
  }

  render() {
    const { isValid, bmi } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>BMI Calculator</Text>
        </View>
        <ScrollView style={styles.contentContainer}>
          <TextInput
            style={styles.input}
            onChangeText={this.onWeightChange}
            placeholder="Weight in Pounds"
          />
          <TextInput
            style={styles.input}
            onChangeText={this.onHeightChange}
            placeholder="Height in Inches"
          />
          <TouchableOpacity onPress={this.onCompute} style={styles.button}>
            <Text style={styles.buttonText}>Compute BMI</Text>
          </TouchableOpacity>
          <SafeAreaView>
            <Text style={styles.result}>{ bmi != '' ? "Body Mass Index is " + bmi : "" }</Text>
          </SafeAreaView>
          <Text style={styles.assessingBMIHeader}>Assessing Your BMI</Text>
          <Text style={styles.assessingBMI}>Underweight: less than 18.5</Text>
          <Text style={styles.assessingBMI}>Healthy: 18.5 to 24.9</Text>
          <Text style={styles.assessingBMI}>Overweight: 25.0 to 29.9</Text>
          <Text style={styles.assessingBMI}>Obese: 30.0 or higher</Text>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#f4511e',
    width: '100%',
  },
  title: {
    paddingVertical: 15,
    fontSize: 28,
    color: "#fff",
    fontWeight: 'bold',
    textAlign: 'center',
  },
  contentContainer: {
    marginHorizontal: 5,
  },
  input: {
    backgroundColor: '#ecf0f1',
    borderRadius: 3,
    width: 400,
    height: 40,
    padding: 5,
    fontSize: 24,
    marginVertical: 5,
  },
  button: {
    backgroundColor: '#34495e',
    color: '#fff',
    padding: 10,
    borderRadius: 3,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
  },
  result: {
    fontSize: 28,
    marginVertical: 30,
    textAlign: 'center',
  },
  assessingBMIHeader: {
    fontSize: 20,
    color: '#000',
    marginLeft: 5,
  },
  assessingBMI: {
    fontSize: 20,
    color: '#000',
    marginLeft: 20,
  }
});