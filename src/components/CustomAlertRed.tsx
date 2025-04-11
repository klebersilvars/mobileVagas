import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface CustomAlertRedProps {
  visible: boolean;
  message: string;
  onClose: () => void;
}

const CustomAlertRed: React.FC<CustomAlertRedProps> = ({ visible, message, onClose }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);

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
          <MaterialIcons name="error-outline" size={24} color="red" style={styles.icon} />
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
    backgroundColor: '#ffebee',
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
    color: '#c62828',
    flex: 1,
    textAlign: 'left',
  },
});

export default CustomAlertRed; 