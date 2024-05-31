// React imports
import React, { useMemo, useRef, useCallback, useState } from 'react';

// React Native imports
import { 
  StyleSheet, 
  SafeAreaView, 
  View, 
  Text, 
  TextInput, 
  Platform, 
  Button, 
  TouchableWithoutFeedback, 
  Keyboard,
  KeyboardAvoidingView 
} from 'react-native';

// Gesture handler imports
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';

// Gorhom BottomSheet imports
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';

// Local component imports
import Task from '@/components/Task';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

// Hook imports
import { useColorScheme } from '@/hooks/useColorScheme';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons';
import DateTimePicker from '@react-native-community/datetimepicker';


export default function TaskPage() {

  const tasks = new Array(5).fill({
    title: 'This is one of the tasks that needs to get done',
    date: 'Today'
  });

 

  const [task, setTask] = useState();
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  const [taskItems, setTaskItems] = useState([]);

  const todaysTasks = taskItems.filter(task => new Date(task.date).setHours(0,0,0,0) === new Date().setHours(0,0,0,0));
  const tomorrowsTasks = taskItems.filter(task => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return new Date(task.date).setHours(0,0,0,0) === tomorrow.setHours(0,0,0,0);
  });
  const futureTasks = taskItems.filter(task => {
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    return new Date(task.date).setHours(0,0,0,0) >= dayAfterTomorrow.setHours(0,0,0,0);
  });

  const handleOpenBottom = () => {
    bottomSheetRef.current?.expand();
    inputRef.current.focus();
  };

  const handleAddTask = () => {
    bottomSheetRef.current?.close();
    console.log(task);
    console.log(date);
    setTaskItems(prevTaskItems => [...prevTaskItems, { title: task, date: date }]);
    setTask(null);
  }

  const completeTask =(index) => {
    let itemsCopy = [...taskItems];
    itemsCopy.splice(index, 1);
    setTaskItems(itemsCopy);
  }
  
  const colorScheme = useColorScheme();

  const snapPoints = useMemo(() => ["50%"], []);
  const bottomSheetRef = useRef(null);
  const inputRef = useRef(null);


  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );
  return (   
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={[styles.container, {backgroundColor: colorScheme === 'dark' ? '#000' : '#fff'}]}>

        <View>
          {todaysTasks.length > 0 && (
            <ScrollView style={styles.tasksContainer}>
              <ThemedText type='title' style={styles.sectionTitle}>Today's Tasks</ThemedText>
              {todaysTasks.sort((a, b) => new Date(a.date) - new Date(b.date)).map((task, index) => (
                <Task key={index} title={task.title} date={task.date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })} completeTask={completeTask} index={index} />
              ))}
            </ScrollView>
          )}

          {tomorrowsTasks.length > 0 && (
            <ScrollView style={styles.tasksContainer}>
              <ThemedText type='title' style={styles.sectionTitle}>Tomorrow's Tasks</ThemedText>
              {tomorrowsTasks.sort((a, b) => new Date(a.date) - new Date(b.date)).map((task, index) => (
                <Task key={index} title={task.title} date={task.date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })} completeTask={completeTask} index={index} />
              ))}
            </ScrollView>
          )}

          {futureTasks.length > 0 && (
            <ScrollView style={styles.tasksContainer}>
              <ThemedText type='title' style={styles.sectionTitle}>Future Tasks</ThemedText>
              {futureTasks.sort((a, b) => new Date(a.date) - new Date(b.date)).map((task, index) => (
                <Task key={index} title={task.title} date={task.date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })} completeTask={completeTask} index={index} />
              ))}
            </ScrollView>
          )}
        </View>

        
        <View style={styles.absoluteContainer}>
          <TouchableOpacity onPress={handleOpenBottom} style={styles.addTaskWrapper}>
            <ThemedText type='title' style={{color: '#fff'}}>+</ThemedText>
          </TouchableOpacity>
        </View>
      
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          initialSnapIndex={-1} // This makes the sheet hidden at first
          backdropComponent={renderBackdrop}
          styles={styles.bottomContainer}
          handleIndicatorStyle={{ display: "none" }}
        >
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <View style={styles.writeTaskWrapper}>
              <TextInput 
                style={[styles.input, {backgroundColor: colorScheme === 'dark' ? '#000' : '#fff'}]} 
                placeholder={'Write a task'}
                onChangeText={text => setTask(text)}
                value={task}
                ref={inputRef}
              />

              <TouchableOpacity onPress={() => handleAddTask()}>
                <View style={styles.submitTask}>
                  <FontAwesomeIcon icon={faCaretUp} color="#fff" />
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.dateSelector}>
              <DateTimePicker
                value={date}
                mode={"date"}
                is24Hour={true}
                display="default"
                onChange={onChange}
              />
            </View>
              
          </KeyboardAvoidingView>
        </BottomSheet>

      </SafeAreaView>

    </TouchableWithoutFeedback> 
  );
}




// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  tasksContainer: {
    display: 'flex',
    padding: 14,
  },
  sectionTitle: {
  },
  task: {
    marginBottom: 8,
  },
  
  writeTaskWrapper: {
    flexDirection: 'row',
    paddingTop: 0,
    paddingRight: 24,
    paddingBottom: 0,
    paddingLeft: 8,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    flex: 1,
    borderRadius: 100,
    fontSize: 18,
  },
  dateSelector: {
    marginTop: 16,
    paddingLeft: 10,
    alignItems: 'flex-start',
  },
  submitTask: {
    color: 'white',
    backgroundColor: '#0a7ea4',
    justifyContent: 'center',
    width: 28,
    height: 28,
    alignItems: 'center',
    borderRadius: 100,
  },
  absoluteContainer: {
    position: 'absolute',
    bottom: 10, // Adjust these values as needed
    right: 10, // Adjust these values as needed
    width: 70, // Adjust these values as needed
    height: 70,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 30, // Adjust this value as needed for your layout
  },
  addTaskWrapper: {
    width: 70,
    height: 70,
    backgroundColor: '#0a7ea4',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: 'grey',
  },
  sheetContentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});
