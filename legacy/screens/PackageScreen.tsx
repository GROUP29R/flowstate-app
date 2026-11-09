import supabase from '@/db/Supabase';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  ListRenderItem,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Document {
  id: string;
  title: string;
  description: string;
  price: number;
  preview: string;
  pdf_url: string;
  currency: number;
}

const width = Dimensions.get('window').width;

const PackageScreen = () => {
  const { id, name, description } = useLocalSearchParams();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchDocumentsInPackage = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('package_documents')
      .select(`
        documents (
          id,
          title,
          description,
          price,
          preview,
          pdf_url,
          currency,
        )
      `)
      .eq('package_id', id);

    if (error) {
      console.error('Error fetching package documents:', error.message);
    } else {
      setDocuments(data.map((d) => d.documents));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDocumentsInPackage();
  }, [id]);

  const renderItem: ListRenderItem<Document> = ({ item }) => (
    <View style={styles.card}>
      <FontAwesome name="file-pdf-o" size={98} color="#ddd" style={styles.preview} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.price}>${item.price} | R({item.currency})</Text>

      <TouchableOpacity
        style={[styles.button, styles.buttonActive]}
        onPress={() => router.push({
          pathname: '/(screens)/PDFViewer',
          params: { title: item.title, pdfUrl: item.pdf_url },
        })}>
        <Text style={styles.buttonText}>Open PDF</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#fff' }}>Loading documents...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="lightblue" />
        </TouchableOpacity>
        <Text style={styles.backText}>Back</Text>
      </View>

      <View style={{ padding: width * 0.04 }}>
        <Text style={styles.header}>{name}</Text>
        <Text style={styles.subHeader}>{description}</Text>
      </View>

      <ScrollView style={{ padding: width * 0.03, }}>
        <FlatList
          data={documents}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
        />
      </ScrollView>
      <StatusBar style='light' />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subHeader: {
    color: '#aaa',
    marginBottom: 16,
  },
  list: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#1e1e1e',
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  preview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  title: {
    color: '#f7f7f7',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  description: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginVertical: 4,
  },
  price: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginTop: 4,
    width: '100%',
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: '#007bff',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: width * 0.04,
  },
  backText: {
    color: 'lightblue',
    fontSize: 18,
    marginLeft: 10,
  },
});

export default PackageScreen;
