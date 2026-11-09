import { fetchPackagesWithDocuments } from '@/controllers/helper';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  ListRenderItem,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  documents: Document[];
  currency: number;
}

interface Document {
  id: string;
  title: string;
  description: string;
  price: number;
  preview: string;
  pdf_url: string;
  currency: string;
}

const Packages: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const loadPackages = async () => {
    setLoading(true);
    const data = await fetchPackagesWithDocuments();
    setPackages(data);
    setLoading(false);
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const handleOpenPackage = (pkg: Package) => {
    // Show modal first
    setSelectedPackage(pkg);
    setModalVisible(true);
  };

  const handleConfirmEnrol = () => {
    setModalVisible(false);
    // Deny access and show alert
    Alert.alert(
      'PayGate Coming Soon',
      'The payment system is not available yet. Please check back soon!',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const renderItem: ListRenderItem<Package> = ({ item }) => (
    <View style={styles.card}>
      <FontAwesome name="archive" size={98} color="#ddd" style={styles.preview} />
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.price}>${item.price} | (R{item.currency})</Text>

      <TouchableOpacity
        style={[styles.button, styles.buttonActive]}
        onPress={() => handleOpenPackage(item)}>
        <Text style={styles.buttonText}>View Package</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#fff' }}>Loading Packages...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={packages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
      />

      {/* Bottom Sheet Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.bottomSheet}>
            <Text style={styles.modalTitle}>Confirm Purchase</Text>
            {selectedPackage && (
              <>
                <Text style={styles.modalText}>
                  Do you want to enrol the <Text style={{ fontWeight: '600' }}>{selectedPackage.name}</Text> package for{' '}
                  <Text style={{ fontWeight: '600' }}>${selectedPackage.price}</Text>?
                </Text>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setModalVisible(false)}>
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalButton, styles.confirmButton]}
                    onPress={handleConfirmEnrol}>
                    <Text style={styles.modalButtonText}>Enrol</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 20,
    paddingHorizontal: 14,
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

  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  bottomSheet: {
    backgroundColor: '#1e1e1e',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    color: '#ddd',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#444',
  },
  confirmButton: {
    backgroundColor: '#007bff',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default Packages;


// import supabase from '@/db/Supabase';
// import { FontAwesome } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';
// import React, { useEffect, useState } from 'react';
// import {
//   Alert,
//   FlatList,
//   Linking,
//   Modal,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';

// const Documents = () => {
//   const [documents, setDocuments] = useState([]);
//   const [purchasedDocs, setPurchasedDocs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedDoc, setSelectedDoc] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [users setUsers] = useState<User[]>([])

//   const router = useRouter();

//   const fetchDocuments = async () => {
//     const { data, error } = await supabase.from('documents').select('*');
//     if (error) {
//       console.error('Error fetching documents:', error.message);
//     } else {
//       setDocuments(data);
//     }
//   };

//   const fetchPurchases = async () => {
//     const {
//       data: { user },
//       error: userError,
//     } = await supabase.auth.getUser();

//     if (userError || !user) {
//       console.warn('User not found or error fetching user.');
//       return;
//     }

//     const { data, error } = await supabase
//       .from('purchases')
//       .select('document_id')
//       .eq('user_id', user.id);

//     if (error) {
//       console.error('Error fetching purchases:', error.message);
//     } else {
//       const purchasedIds = data.map((purchase) => purchase.document_id);
//       setPurchasedDocs(purchasedIds);
//     }
//   };

//   useEffect(() => {
//     const loadData = async () => {
//       setLoading(true);
//       await fetchDocuments();
//       await fetchPurchases();
//       setLoading(false);
//     };

//     loadData();
//   }, []);

//   const handleBuy = (document) => {
//     setSelectedDoc(document);
//     setModalVisible(true); // Show modal if not purchased
//   };

//   const handleConfirmPurchase = () => {
//     setModalVisible(false);
//     if (!selectedDoc) return;

//     router.navigate({
//       pathname: '/(screens)/OrderSummaryScreen',
//       params: {
//         id: selectedDoc.id,
//         title: selectedDoc.title,
//         description: selectedDoc.description,
//         price: selectedDoc.price,
//         preview: selectedDoc.preview,
//       },
//     });
//   };

//   const handleViewPdf = (pdfUrl) => {
//     if (!pdfUrl) {
//       Alert.alert('Error', 'PDF URL not found.');
//       return;
//     }
//     Linking.openURL(pdfUrl);
//   };

//   const renderItem = ({ item }) => {
//     const isPurchased = purchasedDocs.includes(item.id);

//     return (
//       <View style={styles.card}>
//         <FontAwesome name="file-pdf-o" size={98} color="#ddd" style={styles.preview} />
//         <Text style={styles.title}>{item.title}</Text>
//         <Text style={styles.description}>{item.description}</Text>
//         <Text style={styles.price}>R{item.price}</Text>

//         <TouchableOpacity
//           style={[styles.button, isPurchased ? styles.buttonView : styles.buttonActive]}
//           onPress={() => isPurchased ? handleViewPdf(item.pdf_url) : handleBuy(item)}
//         >
//           <Text style={styles.buttonText}>
//             {isPurchased ? 'View PDF' : 'Buy'}
//           </Text>
//         </TouchableOpacity>
//       </View>
//     );
//   };

//   if (loading) {
//     return (
//       <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
//         <Text style={{ color: '#fff' }}>Loading...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={documents}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id}
//         numColumns={2}
//         columnWrapperStyle={styles.row}
//         contentContainerStyle={styles.list}
//       />

//       {/* ✅ Modal for Confirming Purchase */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.modalBackdrop}>
//           <View style={styles.modalContainer}>
//             <Text style={styles.modalTitle}>Confirm Purchase</Text>
//             <Text style={styles.modalText}>
//               You haven't purchased "{selectedDoc?.title}". Would you like to buy it now?
//             </Text>

//             <TouchableOpacity
//               style={[styles.button, styles.buttonActive]}
//               onPress={handleConfirmPurchase}>
//               <Text style={styles.buttonText}>Yes, Purchase</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[styles.button, { backgroundColor: '#444', marginTop: 10 }]}
//               onPress={() => setModalVisible(false)}>
//               <Text style={styles.buttonText}>Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#121212',
//     paddingTop: 20,
//     paddingHorizontal: 14,
//   },
//   list: {
//     paddingBottom: 20,
//   },
//   row: {
//     justifyContent: 'space-between',
//     marginBottom: 16,
//   },
//   card: {
//     backgroundColor: '#1e1e1e',
//     flex: 1,
//     marginHorizontal: 5,
//     borderRadius: 12,
//     padding: 12,
//     alignItems: 'center',
//   },
//   preview: {
//     width: 100,
//     height: 100,
//     borderRadius: 8,
//     marginBottom: 10,
//     resizeMode: 'cover',
//   },
//   title: {
//     color: '#f7f7f7',
//     fontSize: 16,
//     fontWeight: '600',
//     textAlign: 'center',
//   },
//   description: {
//     fontSize: 12,
//     color: '#888',
//     textAlign: 'center',
//     marginVertical: 4,
//   },
//   price: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
//   btn: {
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 6,
//     marginTop: 4,
//     width: '100%',
//     alignItems: 'center',
//     backgroundColor: '#007bff',
//   },
//   button: {
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 6,
//     marginTop: 4,
//     width: '100%',
//     alignItems: 'center',
//   },
//   buttonActive: {
//     backgroundColor: '#007bff',
//   },
//   buttonView: {
//     backgroundColor: '#28a745',
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: '600',
//   },
//   modalBackdrop: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContainer: {
//     width: '85%',
//     backgroundColor: '#1e1e1e',
//     borderRadius: 12,
//     padding: 20,
//     alignItems: 'center',
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginBottom: 10,
//   },
//   modalText: {
//     fontSize: 14,
//     color: '#ccc',
//     textAlign: 'center',
//     marginBottom: 20,
//   },

// });

// export default Documents;
