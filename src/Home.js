import { FlatList, StyleSheet, Text, TextInput, View, TouchableOpacity, StatusBar } from 'react-native'
import React, { useState } from 'react'
import Header from '../components/Header'
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import FallBack from '../components/FallBack'

const Home = () => {
    const navigation = useNavigation();
    const [todoList, setTodoList] = useState([]);
    const [isEdit, setIsEdit] = useState(false)
    const [currentItem, setCurrentItem] = useState(null)
    const [searchText, setSearchText] = useState('');
    const [filteredTodoList, setFilteredTodoList] = useState([]);

    
    const filterTodoList = () => {
        const filteredList = todoList.filter(item =>
            item.task.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredTodoList(filteredList);
    };

    const handleSearchChange = text => {
        setSearchText(text);
        filterTodoList();
    };
    const clearSearch= ()=>{
        setSearchText('');
        setFilteredTodoList([]);
    }
    const handleSave = (task, description) => {
        if (task && description === '') {
            return;
        }
        setTodoList([...todoList,
        { task, description, date: new Date().getTime(), id: new Date() }])
        navigation.navigate('Home')
    }

    console.log("todoList", todoList, isEdit)

    const handleTextPress = (item) => {
        const { task, description, id } = item
        console.log("item from handleTextPress", item)
        setCurrentItem({ ...item })
        if (item.description) {
            navigation.navigate('TextList',
                { task, description, id, handleUpdates, isEdit: true })
        }
        setIsEdit(true)
    }

    const handleUpdates = (updatedTask, updatedDescription, id) => {
        const updateTodoList = todoList.map((item) => {
            if (item.id === id) {
                if (item.description) {
                    return { ...item, task: updatedTask, description: updatedDescription }
                }
            }
            return { ...item };
        })
        setTodoList(updateTodoList);
        setCurrentItem(null)
        setIsEdit(false)
        navigation.navigate('Home')
    }

    const handleDelete = (id) => {
        const updatedTodoList = todoList.filter((addToDo) => addToDo.id !== id)
        setTodoList(updatedTodoList)
    }

    const limitText = (text, maxLength) => {
        if (text.length <= maxLength) {
            return text;
        } else {
            return `${text.slice(0, maxLength)}...`;
        }
    };

    const sortTodoList = () => {
        const sortedList = [...todoList].sort((a, b) => b.date - a.date);
        return sortedList;
    };
    return (
        <View style={{ flex: 1, backgroundColor: '#202020'}}>
            <StatusBar backgroundColor={'#202020'}/>
            <Header />
            <View style={{flexDirection:'row',alignItems:'center',...styles.SearchContainer}}>
                <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'#524848',borderRadius:13,...styles.SearchContainer}}>
                <FontAwesome name="search" size={20} color="grey" />
                <TextInput
                    style={styles.SearchInput}
                    placeholder="Search notes..."
                    placeholderTextColor={'grey'}
                    value={searchText}
                    onChangeText={handleSearchChange}
                />
                {searchText.length > 0 && <AntDesign name="close" size={20} color="grey" onPress={clearSearch} />}
                </View>
            </View>
            <View>
                <FlatList
                    data={filteredTodoList.length > 0 ? filteredTodoList : sortTodoList()}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => {
                        return (
                            <View style={styles.RenderItem}>
                                {(item.checklists) && <AntDesign name="check" size={22} color="#C2C2C2" />}
                                <TouchableOpacity style={{ flex: 1 }} onPress={() => handleTextPress(item)}>
                                    <Text style={styles.RenderText}>{limitText(item.task, 15)}</Text>
                                    {item.description && <Text style={{ color: '#ecf0f1',fontSize:15 }}>{limitText(item.description, 50)}</Text>}
                                    <Text style={{ fontSize: 15, textAlign: 'right', color: 'grey' }}>{moment(item.date).format('MMMM Do YYYY, h:mm:ss a')}</Text>
                                </TouchableOpacity>
                                <MaterialIcons name="delete" size={25} color="#C2C2C2" onPress={() => handleDelete(item.id)} />
                            </View>
                        )
                    }}
                />
            </View>
            <View>
                {todoList.length == 0 && <FallBack />}
                <View style={styles.AddContainer}>
                    <TouchableOpacity>
                        <MaterialIcons name="add-circle" size={55} color="#93478F" onPress={()=>navigation.navigate('TextList', { handleSave, isEdit: false })}/>
                    </TouchableOpacity> 
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    AddContainer: {
        alignItems: 'center',
        marginTop: 15,
    },
    RenderItem: {
        backgroundColor: '#524848',
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginHorizontal: 20,
        marginTop: 12,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 3,
        elevation: 2,
        flexDirection: 'row',
    },
    RenderIcon: {
        flexDirection: 'row',
        gap: 10
    },
    RenderText: {
        flex: 1,
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold'
    },
    SearchContainer: {
        paddingHorizontal: 15,
        paddingTop: 5,
        paddingBottom: 8,
    },
    SearchInput: {
        backgroundColor: '#524848',
        borderRadius: 8,
        paddingVertical: 2,
        paddingHorizontal: 10,
        fontSize: 20,
        flex:1,
        color:'white'
    },
})

export default Home