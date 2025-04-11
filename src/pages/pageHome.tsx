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
} from "react-native"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RootStackParamList } from "../../routes/RootStackParamList" // Certifique-se de que este caminho está correto
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height
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

      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.titleNovosTalentos}>Novos Talentos</Text>
          <Text style={styles.textSlogan}>
            O melhor aplicativo para iniciantes encontrarem oportunidades de emprego
          </Text>
          <Image
            source={require('../../assets/pageHomeImage.png')}
            style={styles.image}
          />
        </View>

        {/* <View style={styles.illustrationContainer}>
          <View style={styles.illustrationCircle} />
        </View> */}

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.buttonPrimary} activeOpacity={0.8} onPress={irPageLogin}>
            <LinearGradient
              colors={["black", 'black']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <MaterialCommunityIcons name="account-circle" size={24} color="#FFFFFF" />
              <Text style={styles.buttonTextPrimary}>Entrar como candidato</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonSecondary} activeOpacity={0.8} onPress={irPageEntrarEmpresa}>
            <MaterialCommunityIcons name="office-building" size={24} color="#4A80F0" style={styles.buttonIcon} />
            <Text style={styles.buttonTextSecondary}>Entrar como empresa</Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity style={styles.buttonOutline} activeOpacity={0.8} onPress={irPageRegistro}>
            <MaterialCommunityIcons name="account-plus" size={24} color="#4A80F0" style={styles.buttonIcon} />
            <Text style={styles.buttonTextOutline}>Registrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  loader: {
    marginBottom: 12,
  },
  loadingText: {
    fontSize: 16,
    color: "#4A5568",
    fontWeight: "500",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "android" ? 40 : 20,
    paddingBottom: 40,
    justifyContent: "space-between",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  titleNovosTalentos: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#1A2138",
    marginBottom: 12,
    textAlign: "center",
  },
  textSlogan: {
    fontSize: 16,
    color: "#4A5568",
    textAlign: "center",
    lineHeight: 24,
    maxWidth: "80%",
  },
  illustrationContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    height: windowHeight * 0.25,
  },
  illustrationCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#F0F5FF",
    opacity: 0.8,
  },
  buttonsContainer: {
    width: "100%",
    marginTop: "auto",
  },
  buttonPrimary: {
    width: "100%",
    height: 56,
    borderRadius: 12,
    marginBottom: 16,
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
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  buttonSecondary: {
    width: "100%",
    height: 56,
    borderRadius: 12,
    backgroundColor: "#F0F5FF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  buttonOutline: {
    width: "100%",
    height: 56,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#4A80F0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonTextPrimary: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  buttonTextSecondary: {
    color: "#4A80F0",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  buttonTextOutline: {
    color: "#4A80F0",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  dividerText: {
    paddingHorizontal: 16,
    color: "#718096",
    fontSize: 14,
  },
  image: {
    width: 400,
    height: 400,
    resizeMode: 'contain',
    marginVertical: 20,
  },
})