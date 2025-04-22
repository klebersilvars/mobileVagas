import { StyleSheet } from 'react-native';
import { getResponsiveFontSize, getResponsivePadding, getResponsiveMargin, getResponsiveBorderRadius } from '../../../utils/responsive';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FF',
    padding: 16,
  },
  vagaContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  vagaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  vagaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  vagaDate: {
    fontSize: 12,
    color: '#666',
  },
  vagaDescription: {
    fontSize: 14,
    color: '#444',
    marginBottom: 8,
    lineHeight: 20,
  },
  vagaRequirements: {
    fontSize: 14,
    color: '#444',
    marginBottom: 8,
    lineHeight: 20,
  },
  vagaSalary: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  vagaLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  vagaActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  candidaturaButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  candidaturaSuccess: {
    backgroundColor: '#4CAF50',
  },
  candidaturaButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  candidaturaButtonDisabled: {
    backgroundColor: '#81C784',
  },
  candidaturaButtonTextDisabled: {
    color: '#fff',
  },
  editButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: '#D32F2F',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
}); 