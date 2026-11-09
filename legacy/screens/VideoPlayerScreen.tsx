import supabase from '@/db/Supabase';
import { Entypo, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
// import { Video } from 'expo-av';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

type LessonContent = {
  id: string;
  lesson_id: string;
  type: 'video' | 'pdf' | 'text';
  url: string;
  title?: string;
  pdf_url?: string;
  order?: number;
  description?: string;
};

export default function VideoLessonsScreen() {
  const router = useRouter();
  const { id, title, description, duration, is_free } = useLocalSearchParams<{
    id?: string;
    title?: string;
    pdf_url?: string;
    description?: string;
    duration?: string;
    is_free?: string;
  }>();

  const [lessonContents, setLessonContents] = useState<LessonContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [videoLoading, setVideoLoading] = useState(true); // ✅ added
  const [sessionUser, setSessionUser] = useState(null);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);
  const [documents, setDocuments] = useState([]);

  // const videoRef = useRef<Video>(null);
  const player = useVideoPlayer(null, (player) => {
    player.loop = false;
  });

  // Update video when a lesson is selected
  useEffect(() => {
    if (!currentVideoUrl) return;

    setVideoLoading(true);

    player.replace({
      uri: buildMuxUrl(currentVideoUrl),
    });

    player.play();
  }, [currentVideoUrl, player]);

  // Monitor video loading status
  useEffect(() => {
    const subscription = player.addListener(
      'statusChange',
      (event) => {
        if (event.status === 'readyToPlay') {
          setVideoLoading(false);
        } else if (event.status === 'loading') {
          setVideoLoading(true);
        } else if (event.status === 'error') {
          setVideoLoading(false);
          Alert.alert('Error loading video.');
        }
      }
    );

    return () => subscription.remove();
  }, [player]);

  const fetchDocuments = async () => {
    const { data, error } = await supabase.from('documents').select('*');
    if (error) {
      console.error('Error fetching documents:', error.message);
    } else {
      setDocuments(data);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchDocuments();
      setLoading(false);
    };

    loadData();
  }, []);

  useEffect(() => {
    const loadContent = async () => {
      if (!id) {
        Alert.alert('Invalid lesson ID');
        setLoading(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;

      if (!user) {
        Alert.alert("Please log in to view content.");
        return;
      }

      setSessionUser(user);

      const { data: contents, error } = await supabase
        .from('lesson_contents')
        .select('*')
        .eq('lesson_id', id)
        .order('order', { ascending: true });

      if (error) {
        console.error("Error fetching contents:", error);
        Alert.alert("Couldn't fetch lesson content.");
        return;
      }

      setLessonContents(contents);

      const firstVideo = contents.find(item => item.type === 'video');
      if (firstVideo) {
        setCurrentVideoUrl(firstVideo.url);
      }

      setLoading(false);
    };

    loadContent();
  }, [id]);

  if (loading) return <Text style={{ color: 'white', padding: 16 }}>Loading...</Text>;

  const videoContents = lessonContents.filter(item => item.type === 'video');
  const pdfContents = lessonContents.filter(item => item.type === 'pdf');

  // ✅ Build Mux URL from playback ID
  const buildMuxUrl = (playbackId: string) => `https://stream.mux.com/${playbackId}.m3u8`;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Video Lessons</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity style={styles.activeTab}>
          <Text style={styles.activeTabText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.inactiveTab}>
          <Text style={styles.inactiveTabText}>Tips</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.inactiveTab}>
          <Text style={styles.inactiveTabText}>Strategies</Text>
        </TouchableOpacity>
      </View>

      {/* Main Video */}
      {currentVideoUrl ? (
        <View style={styles.mainVideoWrapper}>
          <View style={{ position: 'relative', width: '100%', height: 200 }}>
            {videoLoading && (
              <View style={styles.videoLoadingOverlay}>
                <ActivityIndicator size="large" color="#ffffff" />
                <Text style={{ color: 'white', marginTop: 8 }}>Loading video...</Text>
              </View>
            )}

            {/* <Video
              ref={videoRef}
              source={{ uri: buildMuxUrl(currentVideoUrl) }}
              useNativeControls
              resizeMode="cover"
              style={{ width: '100%', height: 200, borderRadius: 16 }}
              shouldPlay
              onLoadStart={() => setVideoLoading(true)}   // ✅ start loader
              onLoad={() => setVideoLoading(false)}       // ✅ hide loader
              onError={(e) => {
                console.error("Video error:", e);
                setVideoLoading(false);
                Alert.alert("Error loading video.");
              }}
            /> */}
            {/* Main Video */}
            {currentVideoUrl ? (
              <View style={styles.mainVideoWrapper}>
                <View style={{
                  position: 'relative',
                  width: '100%',
                  height: 200,
                }}>

                  {videoLoading && (
                    <View style={styles.videoLoadingOverlay}>
                      <ActivityIndicator size="large" color="#ffffff" />
                      <Text style={{ color: 'white', marginTop: 8 }}>
                        Loading video...
                      </Text>
                    </View>
                  )}

                  <VideoView
                    player={player}
                    style={{
                      width: '100%',
                      height: 200,
                      borderRadius: 16,
                    }}
                    nativeControls
                    contentFit="cover"
                  />

                </View>
              </View>
            ) : (
              <Text style={{ color: 'white', padding: 16 }}>
                No video available.
              </Text>
            )}
          </View>
        </View>
      ) : (
        <Text style={{ color: 'white', padding: 16 }}>No video available.</Text>
      )}

      {/* Description */}
      <View style={styles.description}>
        <Text style={styles.lessonTitle}>{title}</Text>
        <Text style={{ marginTop: 4, color: 'white' }}>{description}</Text>
        <Text style={styles.lessonSubtitle}>
          {duration} • {is_free === 'true' ? 'Free' : 'Paid'}
        </Text>
      </View>

      {/* More Lessons */}
      <View style={styles.moreLessons}>
        <Text style={styles.moreLessonsTitle}>More Contents</Text>

        {/* Other Videos */}
        {videoContents.slice(1).map((video, index) => (
          <TouchableOpacity
            key={`video-${index}`}
            style={styles.lessonCard}
            onPress={() => {
              videoRef.current?.pauseAsync();
              setVideoLoading(true); // ✅ show loader again when switching
              setCurrentVideoUrl(video.url);
            }}>
            <ImageBackground
              source={require('@/assets/images/placeholder.png')} 
              style={styles.thumbnail}
              imageStyle={{ borderRadius: 8 }}>
              <View style={styles.playButtonOverlay}>
                <FontAwesome5 name="play" size={41} color="black" style={{ marginTop: 18 }} />
              </View>
            </ImageBackground>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{video.title || `Lesson Video ${index + 2}`}</Text>
              <Text style={styles.cardSubtitle}>{video.description || 'Additional video content'}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* PDFs */}
        {pdfContents.map((document, index) => (
          <TouchableOpacity
            key={`pdf-${index}`}
            style={styles.lessonCard}
            onPress={() => router.push({
              pathname: '/(screens)/PDFViewer',
              params: { url: document.pdf_url, title: document.title || `PDF ${index + 1}` }
            })}>
            <MaterialIcons name="picture-as-pdf" size={80} color="#e74c3c" style={styles.thumbnail} />
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{document.title || `PDF ${index + 1}`}</Text>
              <Text style={styles.cardSubtitle}>Open PDF</Text>
            </View>
            <Entypo name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    flex: 1,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  iconButton: {
    padding: 8,
  },
  title: {
    flex: 1,
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingRight: 32,
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomColor: '#282839',
    borderBottomWidth: 1,
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#1313ec',
    paddingVertical: 12,
  },
  activeTabText: {
    color: '#1313ec',
    fontWeight: 'bold',
  },
  inactiveTab: {
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    paddingVertical: 12,
  },
  inactiveTabText: {
    color: '#9d9db9',
    fontWeight: 'bold',
  },
  mainVideoWrapper: {
    padding: 16,
  },
  videoLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    zIndex: 2,
  },
  description: {
    paddingHorizontal: 16,
  },
  lessonTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  lessonSubtitle: {
    color: '#9d9db9',
    fontSize: 14,
    marginTop: 4,
  },
  moreLessons: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  moreLessonsTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  thumbnail: {
    width: 100,
    height: 80,
    marginRight: 12,
  },
  playButtonOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cardSubtitle: {
    color: '#9d9db9',
    fontSize: 13,
    marginTop: 2,
  },
});
