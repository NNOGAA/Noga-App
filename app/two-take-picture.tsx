import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Alert, Image, ActivityIndicator, AppState, StyleSheet } from "react-native";

// CAMERA
import { CameraView, useCameraPermissions } from "expo-camera";

// ICON
import FeatherIcon from "react-native-vector-icons/Feather";

// FUNCTION
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useRouter, useFocusEffect } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';

// API URL CONSTANT
const API_BASE_URL = 'https://main-be-933012768577.asia-southeast2.run.app/api';

export default function TwoTakePicture() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [photoCount, setPhotoCount] = useState(0);
  const [photoBase64, setPhotoBase64] = useState<string[]>([]);
  const [lastPhotoUri, setLastPhotoUri] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(false);
  
  const isProcessingRef = useRef(false);
  const appStateRef = useRef(AppState.currentState);
  const hasNavigatedRef = useRef(false);
  const previousPhotosRef = useRef<string[]>([]);
  const activeRequestRef = useRef<any>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const cameraRef = useRef<CameraView>(null);
  
  const isFocused = useIsFocused();

  // App state change handling
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
        resetAllState();
      }
      appStateRef.current = nextAppState;
    });

    return () => {
      subscription.remove();
      clearPollingInterval();
    };
  }, []);

  const clearPollingInterval = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  const resetAllState = () => {
    resetPhoto();
    setIsLoading(false);
    setLoadingMessage(false);
    isProcessingRef.current = false;
    hasNavigatedRef.current = false;
    previousPhotosRef.current = [];
    clearPollingInterval();
    
    if (activeRequestRef.current && typeof activeRequestRef.current.cancel === 'function') {
      activeRequestRef.current.cancel('Component unmounted');
    }
    activeRequestRef.current = null;
  };

  const resetPhoto = () => {
    setPhotoCount(0);
    setPhotoBase64([]);
    setLastPhotoUri("");
  };

  useFocusEffect(
    React.useCallback(() => {
      resetAllState();
      
      AsyncStorage.removeItem('pending_photo_process')
        .catch(err => console.error('Error removing pending photo process:', err));
      
      return () => {
        hasNavigatedRef.current = false;
        clearPollingInterval();
        
        if (activeRequestRef.current && typeof activeRequestRef.current.cancel === 'function') {
          activeRequestRef.current.cancel('Component unmounted');
        }
      };
    }, [])
  );

  const pollDataInformation = async (sessionId: string) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/data-information`,
        { "session_id": sessionId }
      );
      
      
      if (response.data.status === "success") {
        clearPollingInterval();
        
        if (response?.data?.data[0]?.nutrition_info) {
          await AsyncStorage.setItem('nutrition_info', JSON.stringify(response?.data?.data[0]?.nutrition_info));
        }

        if (response?.data?.data[0]?.ingredients) {
          await AsyncStorage.setItem('ingredients', JSON.stringify(response?.data?.data[0]?.ingredients));
        }
        
        if (isFocused) {
          setIsLoading(false);
          isProcessingRef.current = false;
          router.push("/type-ingredient");
        }
      }
    } catch (error) {
      console.error('Error polling data:', error);
    }
  };

  useEffect(() => {
    if (loadingMessage && isFocused) {
      AsyncStorage.getItem('sessionId')
        .then(sessionId => {
          if (sessionId) {
            pollDataInformation(sessionId);
            
            pollingIntervalRef.current = setInterval(() => {
              if (sessionId) pollDataInformation(sessionId);
            }, 5000); 
          }
        })
        .catch(err => console.error('Error getting session ID:', err));
    }
    
    requestPermission();
    
    AsyncStorage.getItem('pending_photo_process')
      .then(pendingProcess => {
        if (pendingProcess === 'true') {
          AsyncStorage.removeItem('pending_photo_process')
            .catch(err => console.error('Error removing pending process:', err));
        }
      })
      .catch(err => console.error('Error checking pending process:', err));
  }, [loadingMessage]);

  const uploadImages = async (photos: string[]) => {
    try {
      if (!isFocused || isProcessingRef.current || hasNavigatedRef.current) {
        console.log('Preventing duplicate processing');
        return;
      }
      
      isProcessingRef.current = true;
      previousPhotosRef.current = [...photos];
      
      await AsyncStorage.setItem('pending_photo_process', 'true');
      setIsLoading(true);
      
      const formData = new FormData();
      
      if (photos[0]) {
        formData.append('ingredients', {
          uri: `data:image/jpeg;base64,${photos[0]}`,
          name: 'composition.jpg',
          type: 'image/jpeg',
        } as any);
      }
  
      if (photos[1]) {
        formData.append('nutrition_info', {
          uri: `data:image/jpeg;base64,${photos[1]}`,
          name: 'nutrition_info.jpg',
          type: 'image/jpeg',
        } as any);
      }

      const sessionId = await AsyncStorage.getItem('sessionId');
      if (sessionId) {
        formData.append('sessionid', sessionId);
      }

      const CancelToken = axios.CancelToken;
      const source = CancelToken.source();
      activeRequestRef.current = source;
  
      const response = await axios.post(
        `${API_BASE_URL}/image/packaged-food`, 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json',
          },
          cancelToken: source.token
        }
      );
      
      if (!isFocused) return;
      console.log('Upload response:', response.data);
  
      if (response.data && response.data.status === 200) {
        hasNavigatedRef.current = true;
        await AsyncStorage.removeItem('pending_photo_process');
        
        // Start polling for data information
        if (sessionId) {
          setLoadingMessage(true);
          pollDataInformation(sessionId);
        } else {
          setIsLoading(false);
          resetPhoto();
          isProcessingRef.current = false;
          
          if (isFocused) {
            router.push("/type-ingredient");
          }
        }
      } else {
        throw new Error("API returned non-200 status");
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled:', error.message);
      } else {
        console.error("Error processing images:", error);
        Alert.alert("Error", "Failed to process images. Please try again.");
      }
      
      await AsyncStorage.removeItem('pending_photo_process');
      resetPhoto();
      setIsLoading(false);
      isProcessingRef.current = false;
      hasNavigatedRef.current = false;
    }
  };

  const takePicture = async () => {
    if (!cameraRef?.current) {
      Alert.alert("Error", "Camera is not ready");
      return;
    }

    try {
      if (typeof cameraRef.current.takePictureAsync !== "function") {
        Alert.alert("Error", "Camera does not support taking pictures");
        return;
      }

      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.8,
      });

      if (!photo || !photo.base64) {
        throw new Error("Failed to capture image or get base64 data");
      }

      const newPhotoBase64 = [...photoBase64, photo.base64];
      setPhotoBase64(newPhotoBase64);
      setLastPhotoUri(photo.uri);
      
      const newPhotoCount = photoCount + 1;
      setPhotoCount(newPhotoCount);

      if (newPhotoCount === 1) {
        Alert.alert(
          "Yay! Photo captured successfully",
          "You may choose to retake the picture or continue to the next step",
          [
            { text: "Continue" },
            { text: "Retake", onPress: () => resetPhoto() }
          ]
        );
      } else if (newPhotoCount === 2) {
        Alert.alert(
          "Yay! Photo captured successfully",
          "Click done to continue, you may also retake all pictures",
          [
            {
              text: "Done",
              onPress: () => uploadImages(newPhotoBase64)
            },
            {
              text: "Retake All",
              onPress: () => resetPhoto()
            }
          ]
        );
      }
    } catch (error) {
      console.error("Error taking picture:", error);
      Alert.alert("Error", "Failed to capture image");
    }
  };

  if (!permission) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>No access to camera</Text>
        <TouchableOpacity 
          className="mt-4 bg-blue-500 px-4 py-2 rounded-lg"
          onPress={() => requestPermission()}
        >
          <Text className="text-white">Request Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  if (isLoading) {
    return (
      <View className="flex-1 bg-black/75 justify-center items-center">
        <View className="bg-white p-6 rounded-xl items-center">
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text className="mt-4 text-lg font-medium">Processing your images...</Text>
          <Text className="mt-2 text-gray-500">This may take a few seconds</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View className="w-full flex-row justify-between items-center px-4 pt-12 pb-6 bg-white">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full flex justify-center items-center"
        >
          <FeatherIcon name="arrow-left" size={20} color="black" />
        </TouchableOpacity>

        <Text className="text-xl font-bold">Analysis</Text>

        <TouchableOpacity
          onPress={() => console.log("menu")}
          className="w-10 h-10 rounded-full flex justify-center items-center"
        >
          <FeatherIcon name="more-vertical" size={20} color="black" />
        </TouchableOpacity>
      </View>

      {/* Camera View */}
      <View className="flex-1 relative">
        <CameraView 
          ref={cameraRef} 
          style={StyleSheet.absoluteFill} 
          facing="back"
        />
        
        {/* Thumbnail Preview */}
        {lastPhotoUri ? (
          <View className="absolute top-4 right-4 rounded-md bg-gray-800">
            <Image
              source={{ uri: lastPhotoUri }}
              resizeMode="cover"
              className="w-20 h-20"
            />
          </View>
        ) : (
          <View className="absolute top-4 right-4 rounded-md bg-gray-800 w-20 h-20" />
        )}

        {/* Camera Guide */}
        <View className="absolute inset-0 flex items-center justify-center">
          <View className="w-72 h-72 border-2 border-white rounded-lg" />
        </View>

        {/* Photo Type Indicator */}
        <View className="absolute top-40 self-center bg-green-500 px-4 py-2 rounded-full">
          <Text className="text-white font-bold">
            {photoCount === 0 ? "Picture of Ingredients" : "Picture of Nutrition"}
          </Text>
        </View>

        {/* Action Buttons */}
        <View className="absolute bottom-0 left-0 right-0 mb-16">
          <TouchableOpacity
            className="bg-blue-800 py-3 items-center mx-10 rounded-lg mb-3"
            onPress={takePicture}
          >
            <Text className="text-white font-bold text-lg">
              Take Picture
            </Text>
          </TouchableOpacity>

          {photoCount > 0 && (
            <TouchableOpacity
              className="bg-red-500 py-3 items-center mx-10 rounded-lg mb-3"
              onPress={resetPhoto}
            >
              <Text className="text-white font-bold text-lg">Retake</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}