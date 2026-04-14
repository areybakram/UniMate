import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity, 
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { 
  FadeIn, 
  FadeOut, 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing,
  runOnJS
} from 'react-native-reanimated';
import { AuthContext } from '@/Context/AuthContext';
import { generateSemesterStory, StorySlide } from '@/utils/storyGenerator';
import { getTasks } from '@/utils/taskService';
import { getUsageLogs } from '@/utils/usageService';

const { width, height } = Dimensions.get('window');

const SLIDE_DURATION = 5000; // 5 seconds per slide

export default function StoryModeScreen() {
  const { user } = useContext(AuthContext) || {};
  const [slides, setSlides] = useState<StorySlide[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const progress = useSharedValue(0);

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      try {
        const tasks = await getTasks(user.id);
        const logs = await getUsageLogs(user.id);
        const generatedSlides = generateSemesterStory(
          { name: user.name || "Student" },
          user.attendance_data || {},
          tasks,
          logs
        );
        setSlides(generatedSlides);
      } catch (err) {
        console.error("Error generating story:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  useEffect(() => {
    if (slides.length > 0 && !loading) {
      startProgress();
    }
  }, [currentSlideIndex, loading, slides]);

  const startProgress = () => {
    progress.value = 0;
    progress.value = withTiming(1, {
      duration: SLIDE_DURATION,
      easing: Easing.linear,
    }, (finished) => {
      if (finished) {
        runOnJS(goToNextSlide)();
      }
    });
  };

  const goToNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    } else {
      router.back();
    }
  };

  const goToPrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  };

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={styles.loaderText}>Generating your semester story...</Text>
      </View>
    );
  }

  const currentSlide = slides[currentSlideIndex];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent />
      
      <LinearGradient colors={currentSlide.gradient} style={StyleSheet.absoluteFill} />

      {/* Progress Bars */}
      <View style={styles.progressContainer}>
        {slides.map((_, index) => (
          <View key={index} style={styles.progressBarBackground}>
            <Animated.View 
              style={[
                styles.progressBarForeground,
                index === currentSlideIndex ? progressStyle : (index < currentSlideIndex ? { width: '100%' } : { width: '0%' })
              ]} 
            />
          </View>
        ))}
      </View>

      {/* Content */}
      <Animated.View 
        key={currentSlide.id}
        entering={FadeIn.duration(500)}
        exiting={FadeOut.duration(500)}
        style={styles.content}
      >
        <Text style={styles.emoji}>{currentSlide.emoji}</Text>
        <Text style={styles.title}>{currentSlide.title}</Text>
        <Text style={styles.storyText}>{currentSlide.content}</Text>
        {currentSlide.subContent && (
          <Text style={styles.subText}>{currentSlide.subContent}</Text>
        )}
      </Animated.View>

      {/* Tap Areas */}
      <View style={styles.tapAreas}>
        <TouchableOpacity style={styles.tapArea} onPress={goToPrevSlide} />
        <TouchableOpacity style={styles.tapArea} onPress={goToNextSlide} />
      </View>

      {/* Close Button */}
      <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
        <Ionicons name="close" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loaderText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  progressContainer: {
    flexDirection: 'row',
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 50,
    paddingHorizontal: 10,
    gap: 4,
  },
  progressBarBackground: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarForeground: {
    height: '100%',
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 10,
  },
  storyText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 42,
  },
  subText: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 20,
    fontWeight: '600',
  },
  tapAreas: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
  },
  tapArea: {
    flex: 1,
  },
  closeBtn: {
    position: 'absolute',
    top: StatusBar.currentHeight ? StatusBar.currentHeight + 20 : 60,
    right: 20,
    zIndex: 10,
  }
});
