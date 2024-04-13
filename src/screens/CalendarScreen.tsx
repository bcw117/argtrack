import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  SafeAreaView,
  Keyboard,
  ScrollView,
  Alert,
  Dimensions,
  Platform,
} from "react-native";
import moment from "moment";
import { Calendar } from "react-native-calendars";
import { auth, db } from "firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { KeyboardAvoidingView } from "react-native";

const CalendarScreen = () => {
  const [date, setDate] = useState("");
  const [text, setText] = useState("");

  const addLog = () => {
    Keyboard.dismiss();
    let tempDate = new Date(date);
    tempDate = new Date(
      tempDate.setMinutes(tempDate.getMinutes() + tempDate.getTimezoneOffset())
    );

    if (!text || !date) {
      return Alert.alert("You have not entered a reason/date");
    }

    addDoc(collection(db, "argumentLog"), {
      user_id: auth.currentUser.uid,
      reason: text,
      date: tempDate,
    })
      .then(() => {
        setText("");
        Alert.alert("Record Successfully Logged!");
      })
      .catch((error) => {
        Alert.alert(error);
      });
  };

  useEffect(() => {
    setDate(moment().format("YYYY-MM-DD"));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "position" : "height"}
      >
        <Text style={styles.title}>Calendar</Text>
        <View style={styles.calendarContainer}>
          <Calendar
            style={{
              paddingVertical: 20,
              width: Dimensions.get("window").width,
            }}
            theme={{
              calendarBackground: "#222",
              dayTextColor: "#fff",
              monthTextColor: "#fff",
              textMonthFontWeight: "bold",
              textDisabledColor: "#444",
            }}
            onDayPress={(day) => {
              setDate(moment(day.dateString).format("YYYY-MM-DD"));
            }}
            markedDates={{
              [date]: {
                selected: true,
                disableTouchEvent: true,
                selectedColor: "blue",
              },
            }}
          />
        </View>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.textBoxContainer}>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 17.5,
                padding: 5,
                marginBottom: 5,
              }}
            >
              Reason:
            </Text>
            <TextInput
              style={styles.textInputBox}
              multiline={true}
              placeholder="Type your problem here!"
              placeholderTextColor="#b7b8b6"
              onChangeText={(newText) => setText(newText)}
              defaultValue={text}
            />
            <Pressable style={styles.submitButton}>
              <Text style={styles.submitText} onPress={() => addLog()}>
                Submit
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
  title: {
    fontFamily: "Nexa-Bold",
    fontWeight: "bold",
    fontSize: 40,
    padding: 10,
  },
  calendarContainer: {
    alignItems: "flex-start",
    width: "100%",
  },
  textBoxContainer: {
    backgroundColor: "#ab69e0",
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  textInputBox: {
    alignItems: "center",
    backgroundColor: "white",
    borderColor: "#FFFCF1",
    borderWidth: 1,
    borderRadius: 10,
    textAlignVertical: "top",
    padding: 6,
    width: 350,
    height: 180,
  },
  submitButton: {
    width: 70,
    marginTop: 10,
    marginLeft: 3,
    padding: 5,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "white",
  },
  submitText: {
    fontFamily: "Proxima-Nova",
    textAlign: "center",
    fontSize: 16,
  },
});

export default CalendarScreen;
