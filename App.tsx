import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Alert, Share, ImageBackground, Clipboard, Linking, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import SelectDropdown from 'react-native-select-dropdown';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Array of quote categories
const DATA = [
  { id: 1, genre: "age" },
  { id: 2, genre: "alone" },
  { id: 3, genre: "amazing" },
  { id: 4, genre: "anger" },
  { id: 5, genre: "architecture" },
  { id: 6, genre: "art" },
  { id: 7, genre: "attitude" },
  { id: 8, genre: "beauty" },
  { id: 9, genre: "best" },
  { id: 10, genre: "birthday" },
  { id: 11, genre: "business" },
  { id: 12, genre: "car" },
  { id: 13, genre: "change" },
  { id: 14, genre: "communication" },
  { id: 15, genre: "computers" },
  { id: 16, genre: "cool" },
  { id: 17, genre: "courage" },
  { id: 18, genre: "dad" },
  { id: 19, genre: "dating" },
  { id: 20, genre: "death" },
  { id: 21, genre: "design" },
  { id: 22, genre: "dreams" },
  { id: 23, genre: "education" },
  { id: 24, genre: "environmental" },
  { id: 25, genre: "equality" },
  { id: 26, genre: "experience" },
  { id: 27, genre: "failure" },
  { id: 28, genre: "faith" },
  { id: 29, genre: "family" },
  { id: 30, genre: "famous" },
  { id: 31, genre: "fear" },
  { id: 32, genre: "fitness" },
  { id: 33, genre: "food" },
  { id: 34, genre: "forgiveness" },
  { id: 35, genre: "freedom" },
  { id: 36, genre: "friendship" },
  { id: 37, genre: "funny" },
  { id: 38, genre: "future" },
  { id: 39, genre: "god" },
  { id: 40, genre: "good" },
  { id: 41, genre: "government" },
  { id: 42, genre: "graduation" },
  { id: 43, genre: "great" },
  { id: 44, genre: "happiness" },
  { id: 45, genre: "health" },
  { id: 46, genre: "history" },
  { id: 47, genre: "home" },
  { id: 48, genre: "hope" },
  { id: 49, genre: "humor" },
  { id: 50, genre: "imagination" },
  { id: 51, genre: "inspirational" },
  { id: 52, genre: "intelligence" },
  { id: 53, genre: "jealousy" },
  { id: 54, genre: "knowledge" },
  { id: 55, genre: "leadership" },
  { id: 56, genre: "learning" },
  { id: 57, genre: "legal" },
  { id: 58, genre: "life" },
  { id: 59, genre: "love" },
  { id: 60, genre: "marriage" },
  { id: 61, genre: "medical" },
  { id: 62, genre: "men" },
  { id: 63, genre: "mom" },
  { id: 64, genre: "money" },
  { id: 65, genre: "morning" },
  { id: 66, genre: "movies" },
  { id: 67, genre: "success" },

];

const apiKey = 'TNgDki6oXSi4eguSUorhXw==7dfMvY9AFepEf9Y7';

// Home Screen Component
const HomeScreen = () => {
  const [quote, setQuote] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('success');

  const fetchQuote = async (category: string) => {
    try {
      const response = await axios.get(`https://api.api-ninjas.com/v1/quotes?category=${category}`, {
        headers: { 'X-Api-Key': apiKey }
      });
      if (response.data.length > 0) {
        setQuote(response.data[0].quote);
        setAuthor(response.data[0].author);
      }
    } catch (error) {
      console.error("Error fetching the quote:", error);
    }
  };

  const shareQuote = async (quote: string) => {
    try {
      await Share.share({
        message: quote,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share the quote.');
    }
  };

  const addToFavorites = async () => {
    const favorite = { quote, author };
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
      favorites.push(favorite);
      await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
      Alert.alert('Success', 'Quote added to favorites');
    } catch (error) {
      console.error('Error saving favorite:', error);
    }
  };

  useEffect(() => {
    fetchQuote(selectedGenre);
  }, [selectedGenre]);

  return (
    <ImageBackground source={require('./resources/bc.jpg')} style={styles.backgroundImage}>
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.quoteContainer}>
            <Text style={styles.quoteText}>"{quote}"</Text>
            <Text style={styles.authorText}>— {author}</Text>
          </View>
          <View style={styles.buttonsContainer}>
            <Button title="New Quote" onPress={() => fetchQuote(selectedGenre)} />
            <Text>  </Text>
            <Button title="Add to Favorites" onPress={addToFavorites} />
            <Text>  </Text>
            <Button title="Share" onPress={() => shareQuote(quote)} />
          </View>
          <SelectDropdown
            data={DATA.map(item => item.genre)}
            onSelect={(selectedItem) => {
              setSelectedGenre(selectedItem);
            }}
            renderButton={(selectedItem, index) => {
              return (
                <View style={styles.dropdownBtnStyle}>
                  <Text style={styles.dropdownBtnTxtStyle}>{selectedItem || "Select a genre"}</Text>
                </View>
              );
            }}
            renderItem={(item, index) => {
              return (
                <View style={styles.dropdownRowStyle}>
                  <Text style={styles.dropdownRowTxtStyle}>{item}</Text>
                </View>
              );
            }}
            dropdownStyle={styles.dropdownStyle}
          />
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

// Favorites Screen Component
const FavoritesScreen = () => {
  const [favorites, setFavorites] = useState<{ quote: string; author: string }[]>([]);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const copyToClipboard = (quote: string) => {
    Clipboard.setString(quote);
    Alert.alert('Copied', 'Quote copied to clipboard');
  };

  const shareQuote = async (quote: string) => {
    try {
      await Share.share({
        message: quote,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share the quote.');
    }
  };

  const removeFromFavorites = async (quoteToRemove: string) => {
    try {
      const updatedFavorites = favorites.filter(fav => fav.quote !== quoteToRemove);
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);
      Alert.alert('Removed', 'Quote removed from favorites');
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  return (
    <ImageBackground source={require('./resources/bc.jpg')} style={styles.backgroundImage}>
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.container}>
          {favorites.map((favorite, index) => (
            <View key={index} style={styles.quoteContainer}>
              <Text style={styles.quoteText}>"{favorite.quote}"</Text>
              <Text style={styles.authorText}>— {favorite.author}</Text>
              <View style={styles.buttonsContainer}>
                <Button title="Copy" onPress={() => copyToClipboard(favorite.quote)} />
                <Button title="Share" onPress={() => shareQuote(favorite.quote)} />
                <Button title="Remove" onPress={() => removeFromFavorites(favorite.quote)} />
              </View>
            </View>
          ))}
          <View style={styles.container}>
            <Text style={styles.heading}>About the App</Text>

            <Text style={styles.subheading}>Developed & Designed by Aakash Gupta</Text>
            <Text style={styles.paragraph}>
              Aakash Gupta is passionate about creating simple, intuitive apps that bring value to users. This app was developed with the goal of making it easy for people to access uplifting quotes anytime, anywhere.
            </Text>

            <Text style={styles.subheading}>Follow me on Social Media:</Text>

            <Text style={styles.link} onPress={() => Linking.openURL('https://www.linkedin.com/in/Aakashuuu')}>
              LinkedIn: Aakash Gupta
            </Text>

            <Text style={styles.link} onPress={() => Linking.openURL('mailto:itsAakashz@outlook.com')}>
              Email: itsAakashz@outlook.com
            </Text>

            <Text style={styles.link} onPress={() => Linking.openURL('https://www.instagram.com/itsAakashz')}>
              Instagram: @itsAakashz
            </Text>
            <Text style={styles.link} onPress={() => Linking.openURL('https://www.github.com/itsAakashz')}>
              Github: @itsAakashz
            </Text>

            <Text style={styles.paragraph}>
              For feedback and inquiries, feel free to reach out through social media or email.
            </Text>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{
        tabBarInactiveBackgroundColor: '#00061f',
        tabBarActiveBackgroundColor: '#803f03',
      }} >
        <Tab.Screen name="Home" component={HomeScreen}

          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Text>🏠</Text>
            ),

          }} />
        <Tab.Screen name="Favorites" component={FavoritesScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Text>💞</Text>
            ),

          }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  quoteContainer: {
    marginVertical: 20,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 10,
  },
  quoteText: {
    color: 'black',
    fontSize: 18,
    fontWeight: '400',
    fontStyle: 'italic',
    marginBottom: 10,
    textAlign: 'center',
  },
  authorText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  dropdownBtnStyle: {
    margin: 10,
    alignItems: 'center',
    width: '60%',
    height: 45,
    backgroundColor: '#444',
    borderRadius: 8,
  },
  dropdownBtnTxtStyle: {
    color: '#FFF',
    textAlign: 'center',
    marginTop: 11
  },
  dropdownStyle: {
    backgroundColor: '#444',
    height: 190,
  },
  dropdownRowStyle: {
    backgroundColor: '#444',
    borderBottomColor: '#C5C5C5',
  },
  dropdownRowTxtStyle: {
    color: '#FFF',
    textAlign: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  subheading: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginTop: 15,
    marginBottom: 5,
  },
  paragraph: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  link: {
    fontSize: 16,
    color: '#1DA1F2',
    marginBottom: 10,
    textDecorationLine: 'none'
  }
});

export default App;
