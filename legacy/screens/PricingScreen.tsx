import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

const TermsScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Local PDF file
  // const pdfFile = require('@/assets/pdfs/Numecis-PriceGuide.pdf');
  const pdfFile = 'https://learnitfree.com/books.html#ai-books';

  // For Android, use Google Docs viewer; for iOS, WebView can directly open the file
  const source =
    Platform.OS === 'android'
      ? { uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdfFile)}` }
      : pdfFile;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="lightblue" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Back</Text>
      </View>

      {/* PDF Viewer */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="lightblue" />
            <Text style={styles.loadingText}>Loading Terms...</Text>
          </View>
        )}

        <WebView
          source={source}
          style={styles.webview}
          onLoadEnd={() => setLoading(false)}
        />
      </View>
    </SafeAreaView>
  );
};

export default TermsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#121212',
    paddingHorizontal: 10,
  },
  backButton: {
    padding: 8,
    marginRight: 10,
  },
  headerText: {
    color: 'lightblue',
    fontSize: 18,
  },
  webview: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
  loadingOverlay: {
    position: 'absolute',
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ccc',
    marginTop: 10,
  },
});
