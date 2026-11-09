import supabase from '@/db/Supabase';
import { Session } from '@supabase/supabase-js';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  is_free: boolean;
  thumbnail: string;
  price: string;
  currency: string;
}

const LessonContainer: React.FC = () => {
  const router = useRouter();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  // For bottom sheet
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      checkPurchase(data.session?.user.id);
    };
    getSession();
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    const { data, error } = await supabase.from<Lesson>('lessons').select('*');
    if (error) console.error(error);
    else setLessons(data || []);
    setLoading(false);
  };

  const checkPurchase = async (userId?: string) => {
    if (!userId) return;
    const { data, error } = await supabase
      .from('purchases')
      .select('purchased')
      .eq('user_id', userId)
      .single();
    if (error && error.code !== 'PGRST116') console.error(error);
    else setHasPurchased(data?.purchased ?? false);
  };

  const handlePlay = (lesson: Lesson) => {
    if (!lesson.is_free && !hasPurchased) {
      // Instead of starting PayPal, show confirmation modal
      setSelectedLesson(lesson);
      setModalVisible(true);
      return;
    }

    router.push({
      pathname: '/VideoPlayerScreen',
      params: {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        duration: lesson.duration,
        is_free: lesson.is_free,
      },
    });
  };

  const handleConfirmPurchase = () => {
    setModalVisible(false);
    Alert.alert(
      'PayGate Coming Soon',
      'Lesson payments are not yet available. Please check back soon!',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const renderLesson = ({ item }: { item: Lesson }) => (
    <TouchableOpacity style={styles.lessonRow} onPress={() => handlePlay(item)}>
      <View style={styles.thumbnailWrapper}>
        <Image source={{ uri: item.thumbnail }} style={styles.lessonImage} />
        <View style={styles.playOverlay}>
          <Text style={styles.playIcon}>▶</Text>
        </View>
      </View>
      <View style={styles.lessonContent}>
        <Text style={styles.lessonTitle}>{item.title}</Text>
        <Text style={styles.lessonDescription}>{item.description}</Text>
        <Text style={styles.lessonDuration}>
          {item.duration}
          {item.is_free ? ' | Free' : ''} | ${item.price} | R({item.currency})
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading)
    return <ActivityIndicator size="large" color="#fff" style={{ marginTop: 40 }} />;

  return (
    <View style={styles.lessonContainer}>
      <FlatList
        data={lessons}
        renderItem={renderLesson}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lessonList}
      />

      {/* Bottom Sheet Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.bottomSheet}>
            <Text style={styles.modalTitle}>Confirm Purchase</Text>
            {selectedLesson && (
              <>
                <Text style={styles.modalText}>
                  Do you want to purchase{' '}
                  <Text style={{ fontWeight: '600' }}>{selectedLesson.title}</Text> for{' '}
                  <Text style={{ fontWeight: '600' }}>${selectedLesson.price}</Text>?
                </Text>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setModalVisible(false)}>
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalButton, styles.confirmButton]}
                    onPress={handleConfirmPurchase}>
                    <Text style={styles.modalButtonText}>Purchase</Text>
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
  lessonContainer: {
    marginTop: 10,
    paddingHorizontal: 15,
    flex: 1,
    backgroundColor: '#121212',
  },
  lessonList: { paddingBottom: 20 },
  lessonRow: {
    flexDirection: 'row',
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  thumbnailWrapper: { position: 'relative' },
  lessonImage: { width: 100, height: 70, borderRadius: 8 },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 8,
  },
  playIcon: { fontSize: 24, color: '#fff' },
  lessonContent: { flex: 1, marginLeft: 12 },
  lessonTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4, color: '#fff' },
  lessonDescription: { fontSize: 13, color: '#888', marginBottom: 6 },
  lessonDuration: { fontSize: 12, color: '#f7f7f7', fontWeight: '500' },

  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
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

export default LessonContainer;
