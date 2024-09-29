import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Alert, Share, ImageBackground, TouchableOpacity, Clipboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';

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
  { id: 67, genre: "success" }
];



const getRandomCategory = (): string => {
  const randomIndex = Math.floor(Math.random() * DATA.length);
  return DATA[randomIndex].genre;
};

const apiKey = 'TNgDki6oXSi4eguSUorhXw==7dfMvY9AFepEf9Y7';

// Home Screen Component
const HomeScreen = () => {
  const [quote, setQuote] = useState<string>('');
  const [author, setAuthor] = useState<string>('');

  const fetchQuote = async () => {
    const category = getRandomCategory();
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
    fetchQuote();
  }, []);

  return (
    <ImageBackground source={require('./resources/bc.jpg')} style={styles.backgroundImage}>
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.quoteContainer}>
            <Text style={styles.quoteText}>"{quote}"</Text>
            <Text style={styles.authorText}>— {author}</Text>
          </View>
          <View style={styles.buttonsContainer}>
            <Button title="New Quote" onPress={fetchQuote} />
            <Button title="Add to Favorites" onPress={addToFavorites} />
          </View>
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

  useEffect(() => {
    loadFavorites();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.favoritesTitle}>Your Favorite Quotes:</Text>
      {favorites.length === 0 ? (
        <Text style={styles.emptyText}>No favorite quotes added yet.</Text>
      ) : (
        favorites.map((fav, index) => (
          <View key={index} style={styles.favoriteQuoteContainer}>
            <Text style={styles.favoriteQuote}>"{fav.quote}" — {fav.author}</Text>
            <View style={styles.favButtonsContainer}>
              <Button title="Share" onPress={() => shareQuote(fav.quote)} />
              <Button title="Copy" onPress={() => copyToClipboard(fav.quote)} />
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

// Navigation Setup
const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen}
         
         options={
          { headerShown: false,
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Icon name="home-outline" color={color} size={size} />
          ),
        }}   />
        <Tab.Screen name="Favorites" component={FavoritesScreen} 
        options={{
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Icon name="star-outline" color={color} size={size} />
          ),
        }}  />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  container: {
    flexGrow: 1,
    padding: 16,
  },
  quoteContainer: {
    marginVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  quoteText: {
    fontSize: 28,
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#fff',
    marginBottom: 10,
  },
  authorText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#ccc',
  },
  buttonsContainer: {
    flex:1,
    flexDirection:'row',
    marginVertical: 140,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  favoritesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  favoriteQuoteContainer: {
    marginBottom: 20,
  },
  favoriteQuote: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  favButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default App;
