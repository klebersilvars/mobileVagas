import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface CustomAlertGreenProps {
  visible: boolean;
  message: string;
  onClose: () => void;
}

const CustomAlertGreen: React.FC<CustomAlertGreenProps> = ({ visible, message, onClose }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.alertBox}>  
          <MaterialIcons name="check-circle" size={24} color="#2e7d32" style={styles.icon} />
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  alertBox: {
    width: '90%',
    marginBottom: 40,
    padding: 20,
    backgroundColor: '#e8f5e9',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: 'row',
  },
  icon: {
    marginRight: 10,
  },
  message: {
    fontSize: 16,
    color: '#2e7d32',
    flex: 1,
    textAlign: 'left',
  },
});

export default CustomAlertGreen; 