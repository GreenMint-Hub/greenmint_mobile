import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#4CAF50',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20, // 기존 24에서 20으로 줄임
    fontWeight: 'bold',
    marginBottom: 30, // 간격을 더 넓힘
  },
  headerSubtitle: {
    color: '#fff',
    fontSize: 14, // 기존 18에서 14로 줄임
    fontWeight: 'bold',
  },
  ecoPointsBadge: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#388E3C',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  ecoPointsText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  contentArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 8, // 기존 20에서 8로 줄임
  },
  bottomSection: {
    // backgroundColor: '#fff', // 배경색 제거
    // paddingHorizontal: 20, // 패딩 제거
    // paddingVertical: 15, // 패딩 제거
    // borderTopWidth: 1, // 테두리 제거
    // borderTopColor: '#E0E0E0', // 테두리 제거
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 15, // 원래대로 복구
    paddingVertical: 10, // 원래대로 복구
  },
  analysisButton: {
    width: 50,
    height: 50,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  analysisIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  analysisText: {
    color: '#4CAF50',
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 2,
  },
  inputField: {
    flex: 1,
    fontSize: 16, 
    color: '#333',
    paddingVertical: 8, 
  },
  cameraButton: {
    width: 30,
    height: 30,
    backgroundColor: '#4CAF50',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  sendButton: {
    width: 30,
    height: 30,
    backgroundColor: '#4CAF50',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 8, 
  },
  messageBubble: {
    borderRadius: 16,
    padding: 12,
    marginVertical: 4,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#E8F5E9',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1F8E9',
  },
  messageText: {
    fontSize: 16,
    color: '#222',
  },
  loading: {
    fontSize: 16,
    color: '#666',
    marginVertical: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default styles;