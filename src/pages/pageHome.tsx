import React, { useState } from "react"
import {
  View,
  StyleSheet,
  StatusBar,
  Text,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  Image,
  PixelRatio,
  ScrollView
} from "react-native"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RootStackParamList } from "../../routes/RootStackParamList" // Certifique-se de que este caminho está correto
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

// Responsive calculation functions
const widthPercentageToDP = (widthPercent: number) => {
  const screenWidth = SCREEN_WIDTH;
  return PixelRatio.roundToNearestPixel(screenWidth * widthPercent / 100);
};

const heightPercentageToDP = (heightPercent: number) => {
  const screenHeight = SCREEN_HEIGHT;
  return PixelRatio.roundToNearestPixel(screenHeight * heightPercent / 100);
};

// Scale based on screen size
const scale = SCREEN_WIDTH / 375; // based on iPhone 8 width
const normalize = (size: number) => {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};

type OnBoardingNavigationProp = StackNavigationProp<RootStackParamList>

export default function PageHome() {
  const navigation = useNavigation<OnBoardingNavigationProp>()

  // Redefinir o loading quando a tela ganhar o foco
  useFocusEffect(
    React.useCallback(() => {
      // setIsLoading(true) // Ativa o carregamento ao voltar para a tela
      const timer = setTimeout(() => {
        // setIsLoading(false) // Desativa o carregamento após 2 segundos
      }, 2000)

      return () => clearTimeout(timer) // Limpa o timeout ao sair da tela
    }, []),
  )

  function irPageLogin() {
    navigation.navigate("PageLogin")
  }

  function irPageEntrarEmpresa() {
    navigation.navigate("PageEntrarEmpresa")
  }

  function irPageRegistro() {
    navigation.navigate("PageRegistroOne")
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollViewContent}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.titleNovosTalentos}>Novos Talentos</Text>
            <Text style={styles.textSlogan}>
              O melhor aplicativo para iniciantes encontrarem oportunidades de emprego
            </Text>
            <Image
              source={require('../../assets/pageHomeImage.png')}
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.buttonPrimary} activeOpacity={0.8} onPress={irPageLogin}>
              <LinearGradient
                colors={["black", 'black']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <MaterialCommunityIcons name="account-circle" size={normalize(24)} color="#FFFFFF" />
                <Text style={styles.buttonTextPrimary}>Entrar como candidato</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonSecondary} activeOpacity={0.8} onPress={irPageEntrarEmpresa}>
              <MaterialCommunityIcons name="office-building" size={normalize(24)} color="#4A80F0" style={styles.buttonIcon} />
              <Text style={styles.buttonTextSecondary}>Entrar como empresa</Text>
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.divider} />
            </View>

            <TouchableOpacity style={styles.buttonOutline} activeOpacity={0.8} onPress={irPageRegistro}>
              <MaterialCommunityIcons name="account-plus" size={normalize(24)} color="#4A80F0" style={styles.buttonIcon} />
              <Text style={styles.buttonTextOutline}>Registrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  logoContainer: {
    width: widthPercentageToDP(20),
    height: widthPercentageToDP(20),
    borderRadius: widthPercentageToDP(5),
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: heightPercentageToDP(2.5),
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: normalize(32),
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  loader: {
    marginBottom: heightPercentageToDP(1.5),
  },
  loadingText: {
    fontSize: normalize(16),
    color: "#4A5568",
    fontWeight: "500",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: widthPercentageToDP(6),
    paddingTop: Platform.OS === "android" ? heightPercentageToDP(5) : heightPercentageToDP(2.5),
    paddingBottom: heightPercentageToDP(5),
    justifyContent: "space-between",
    minHeight: SCREEN_HEIGHT - (Platform.OS === "ios" ? 90 : 60), // Account for safe area
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: heightPercentageToDP(2.5),
    paddingTop: heightPercentageToDP(2),
  },
  titleNovosTalentos: {
    fontSize: normalize(36),
    fontWeight: "bold",
    color: "#1A2138",
    marginBottom: heightPercentageToDP(1.5),
    textAlign: "center",
  },
  textSlogan: {
    fontSize: normalize(16),
    color: "#4A5568",
    textAlign: "center",
    lineHeight: normalize(24),
    maxWidth: "90%",
    paddingHorizontal: widthPercentageToDP(2),
  },
  image: {
    width: widthPercentageToDP(90),
    height: heightPercentageToDP(40),
    marginVertical: heightPercentageToDP(2),
    alignSelf: 'center',
  },
  buttonsContainer: {
    width: "100%",
    marginTop: "auto",
    paddingBottom: heightPercentageToDP(2),
  },
  buttonPrimary: {
    width: "100%",
    height: heightPercentageToDP(7),
    minHeight: 50,
    borderRadius: normalize(12),
    marginBottom: heightPercentageToDP(2),
    shadowColor: "#4A80F0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: normalize(12),
    paddingHorizontal: widthPercentageToDP(4),
  },
  buttonSecondary: {
    width: "100%",
    height: heightPercentageToDP(7),
    minHeight: 50,
    borderRadius: normalize(12),
    backgroundColor: "#F0F5FF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: heightPercentageToDP(3),
  },
  buttonOutline: {
    width: "100%",
    height: heightPercentageToDP(7),
    minHeight: 50,
    borderRadius: normalize(12),
    borderWidth: 1.5,
    borderColor: "#4A80F0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonIcon: {
    marginRight: widthPercentageToDP(2),
  },
  buttonTextPrimary: {
    color: "#FFFFFF",
    fontSize: normalize(16),
    fontWeight: "600",
    marginLeft: widthPercentageToDP(2),
  },
  buttonTextSecondary: {
    color: "#4A80F0",
    fontSize: normalize(16),
    fontWeight: "600",
    marginLeft: widthPercentageToDP(2),
  },
  buttonTextOutline: {
    color: "#4A80F0",
    fontSize: normalize(16),
    fontWeight: "600",
    marginLeft: widthPercentageToDP(2),
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: heightPercentageToDP(3),
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  dividerText: {
    paddingHorizontal: widthPercentageToDP(4),
    color: "#718096",
    fontSize: normalize(14),
  },
})