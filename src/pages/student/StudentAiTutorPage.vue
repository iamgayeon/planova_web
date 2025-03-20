<template>
    <div class="student-ai-tutor-container">
      <div class="sidebar">
        <div class="search-bar">
          <div class="search-input-wrapper">
            <i class="search-icon">🔍</i>
            <input type="text" placeholder="대화 검색하기" class="search-input" />
          </div>
          <button class="new-chat-btn">
            <i class="new-chat-icon">✏️</i>
          </button>
        </div>
        
        <div class="history-section">
          <div class="today-section">
            <div class="section-title">오늘</div>
            <div class="menu-item active">
              <span class="item-text">1과목 3장 질문</span>
              <div class="item-actions">
                <span class="more-options">•••</span>
              </div>
            </div>
          </div>
          
          <div class="previous-section">
            <div class="section-title">어제</div>
            <div class="menu-item">
              <span class="item-text">1과목 3장 질문</span>
            </div>
            <div class="menu-item">
              <span class="item-text">1과목 3장 질문</span>
            </div>
            <div class="menu-item">
              <span class="item-text">1과목 3장 질문</span>
            </div>
          </div>
          
          <div class="last-week-section">
            <div class="section-title">지난 주</div>
            <div class="menu-item">
              <span class="item-text">1과목 3장 질문</span>
            </div>
            <div class="menu-item">
              <span class="item-text">1과목 3장 질문</span>
            </div>
            <div class="menu-item">
              <span class="item-text">1과목 3장 질문</span>
            </div>
            <div class="menu-item">
              <span class="item-text">1과목 3장 질문</span>
            </div>
            <div class="menu-item">
              <span class="item-text">1과목 3장 질문</span>
            </div>
            <div class="menu-item">
              <span class="item-text">1과목 3장 질문</span>
            </div>
          </div>
        </div>
      </div>

      <div class="main-content">
        <div class="greeting-header">
          <div class="greeting-text">
            <h1>안녕하세요! <span class="wave-emoji">👋</span></h1>
            <h2>어떤 도움이 필요하세요?</h2>
          </div>
        </div>

        <div class="quick-actions">
          <div class="quick-action-card">
            <div class="action-icon">📝</div>
            <div class="action-text">숙제 도움받기</div>
          </div>
          <div class="quick-action-card">
            <div class="action-icon">🧩</div>
            <div class="action-text">문제 풀이</div>
          </div>
          <div class="quick-action-card">
            <div class="action-icon">📚</div>
            <div class="action-text">개념 복습</div>
          </div>
          <div class="quick-action-card">
            <div class="action-icon">🔍</div>
            <div class="action-text">자료 찾기</div>
          </div>
        </div>
        
        <div class="input-section">
          <div class="file-upload-section">
            <div class="upload-header">
              <div class="upload-instructions">질문할 PDF를 선택해주세요...</div>
              <div class="supported-formats">지원 형식: PDF</div>
            </div>
            
            <div class="upload-area" @click="selectFile" @dragover.prevent @drop.prevent="handleFileDrop">
              <div class="upload-icon">📄</div>
              <div class="upload-text">여기에 파일을 끌어다 놓거나</div>
              <button class="upload-button">파일선택</button>
              <input ref="fileInput" type="file" class="file-input" @change="handleFileSelect" accept=".pdf" hidden />
            </div>
            
            <div class="question-input-area">
              <textarea 
                v-model="userQuestion" 
                class="question-input" 
                placeholder="질문을 입력하세요..."
                :rows="questionRows"
                @input="adjustTextareaHeight"
                ref="questionTextarea"
              ></textarea>
            </div>
            
            <div v-if="selectedFile" class="selected-file">
              <div class="file-preview">
                <div class="file-icon">📄</div>
                <div class="file-details">
                  <div class="file-name">{{ selectedFile.name }}</div>
                  <div class="file-size">{{ formatFileSize(selectedFile.size) }}</div>
                </div>
              </div>
              <button class="remove-file" @click.stop="removeFile">✕</button>
            </div>
            
            <div class="upload-actions">
              <div class="action-buttons">
                <button 
                  class="send-button" 
                  :class="{ active: userQuestion.trim() || selectedFile }" 
                  :disabled="!userQuestion.trim() && !selectedFile"
                  @click="sendQuestion"
                >
                  <span class="send-text">보내기</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="send-icon">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'StudentAiTutorPage',
    data() {
      return {
        selectedFile: null,
        userQuestion: '',
        questionRows: 1,
        minRows: 1,
        maxRows: 5
      }
    },
    methods: {
      selectFile() {
        this.$refs.fileInput.click();
      },
      handleFileSelect(event) {
        if (event.target.files.length > 0) {
          const file = event.target.files[0];
          
          if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
            this.selectedFile = file;
          } else {
            alert('PDF 파일만 업로드 가능합니다.');
            this.$refs.fileInput.value = '';
          }
        }
      },
      handleFileDrop(event) {
        event.preventDefault();
        if (event.dataTransfer.files.length > 0) {
          const file = event.dataTransfer.files[0];

          if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
            this.selectedFile = file;
          } else {
            alert('PDF 파일만 업로드 가능합니다.');
          }
        }
      },
      removeFile() {
        this.selectedFile = null;
        this.$refs.fileInput.value = '';
      },
      adjustTextareaHeight() {
        const textarea = this.$refs.questionTextarea;
        textarea.style.height = 'auto';
        
        const rowHeight = 24;
        const newRows = Math.min(
          this.maxRows, 
          Math.max(
            this.minRows, 
            Math.ceil(textarea.scrollHeight / rowHeight)
          )
        );
        
        this.questionRows = newRows;
        textarea.style.height = `${Math.min(textarea.scrollHeight, rowHeight * this.maxRows)}px`;
      },
      sendQuestion() {
        if (!this.userQuestion.trim() && !this.selectedFile) {
          return;
        }
        
        const formData = new FormData();
        if (this.selectedFile) {
          formData.append('file', this.selectedFile);
        }
        if (this.userQuestion.trim()) {
          formData.append('question', this.userQuestion.trim());
        }
        
        console.log('Sending question:', this.userQuestion);
        console.log('Uploading file:', this.selectedFile ? this.selectedFile.name : 'No file');
        
        // API 호출 예시
        // axios.post('/api/ask-question', formData)
        //   .then(response => {
        //     console.log('Question sent successfully', response);
        //     this.startConversation(response.data.conversationId);
        //   })
        //   .catch(error => {
        //     console.error('Failed to send question', error);
        //   });
        
        this.userQuestion = '';
        this.selectedFile = null;
        this.$refs.fileInput.value = '';
        this.questionRows = 1;
      },
      formatFileSize(size) {
        if (size < 1024) {
          return size + ' B';
        } else if (size < 1024 * 1024) {
          return (size / 1024).toFixed(1) + ' KB';
        } else {
          return (size / (1024 * 1024)).toFixed(1) + ' MB';
        }
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.adjustTextareaHeight();
      });
    }
  }
  </script>
  
  <style scoped>
  .student-ai-tutor-container {
    display: flex;
    height: 100vh;
    font-family: 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
    background-color: #f8f9fa;
    color: #333;
  }
  
  .sidebar {
    width: 260px;
    background-color: white;
    border-right: 1px solid #eaeaea;
    padding: 15px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.03);
    z-index: 10;
  }
  
  .search-bar {
    display: flex;
    margin-bottom: 20px;
    gap: 8px;
  }
  
  .search-input-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    background-color: #f5f5f7;
    border-radius: 8px;
    padding: 8px 12px;
  }
  
  .search-icon {
    margin-right: 8px;
    font-size: 14px;
  }
  
  .search-input {
    background: transparent;
    border: none;
    outline: none;
    font-size: 14px;
    width: 100%;
  }
  
  .new-chat-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background-color: #f5f5f7;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .new-chat-btn:hover {
    background-color: #eaeaea;
  }
  
  .history-section {
    flex: 1;
    overflow-y: auto;
    margin-bottom: 15px;
  }
  
  .section-title {
    font-size: 13px;
    font-weight: 600;
    margin: 15px 5px 10px;
    color: #666;
  }
  
  .menu-item {
    padding: 10px 12px;
    border-radius: 8px;
    font-size: 14px;
    color: #333;
    cursor: pointer;
    margin-bottom: 2px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.2s;
  }
  
  .menu-item:hover {
    background-color: #f5f5f7;
  }
  
  .menu-item.active {
    background-color: #fff1e6;
    color: #f1883c;
    font-weight: 500;
  }
  
  .item-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .item-actions {
    display: flex;
    align-items: center;
  }
  
  .more-options {
    color: #999;
    font-size: 12px;
    padding: 0 5px;
  }
  
  /* 메인 콘텐츠 스타일링 */
  .main-content {
    flex: 1;
    padding: 30px;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }
  
  .greeting-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30px;
  }
  
  .greeting-text h1 {
    font-size: 26px;
    color: #f1883c;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
  }
  
  .wave-emoji {
    display: inline-block;
    margin-left: 8px;
    animation: wave 1.5s infinite;
    transform-origin: 70% 70%;
  }
  
  @keyframes wave {
    0% { transform: rotate(0deg); }
    10% { transform: rotate(14deg); }
    20% { transform: rotate(-8deg); }
    30% { transform: rotate(14deg); }
    40% { transform: rotate(-4deg); }
    50% { transform: rotate(10deg); }
    60% { transform: rotate(0deg); }
    100% { transform: rotate(0deg); }
  }
  
  .greeting-text h2 {
    font-size: 28px;
    color: #f1883c;
    font-weight: 500;
  }
  
  .illustration-img {
    width: 140px;
    height: 140px;
  }
  
  /* 2x2 퀵 액션 버튼 스타일링 */
  .quick-actions {
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* 2x2 그리드 설정 */
    gap: 20px;
    margin-bottom: 40px;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .quick-action-card {
    background-color: white;
    border-radius: 16px;
    padding: 25px;
    display: flex;
    align-items: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transition: all 0.2s;
    cursor: pointer;
    height: 80px;
    width: 400px;
  }
  
  .quick-action-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    background-color: #fff8f2;
    border: 1px solid rgba(241, 136, 60, 0.2);
  }
  
  .action-icon {
    font-size: 36px;
    margin-right: 20px;
  }
  
  .action-text {
    font-size: 18px;
    font-weight: 500;
  }
  
  /* 질문 입력 영역 */
  .input-section {
    margin-top: auto;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .question-input-area {
    margin: 15px 0;
  }
  
  .question-input {
    width: 100%;
    border: none;
    outline: none;
    resize: none;
    font-size: 15px;
    line-height: 1.5;
    font-family: 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
    overflow: hidden;
    padding: 12px;
    border-radius: 8px;
    transition: all 0.2s;
    background-color: #f9f9f9;
  }
  
  .question-input:focus {
    background-color: #f5f5f5;
    box-shadow: 0 0 0 2px rgba(241, 136, 60, 0.2);
  }
  
  /* 파일 업로드 섹션 */
  .file-upload-section {
    background-color: white;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  }
  
  .upload-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }
  
  .upload-instructions {
    font-size: 16px;
    color: #333;
    font-weight: 500;
  }
  
  .supported-formats {
    font-size: 12px;
    color: #888;
  }
  
  .upload-area {
    border: 2px dashed #e0e0e0;
    border-radius: 12px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fafafa;
    transition: all 0.2s;
    margin-bottom: 15px;
    cursor: pointer;
  }
  
  .upload-area:hover {
    border-color: #f1883c;
    background-color: #fff8f2;
  }
  
  .upload-icon {
    font-size: 32px;
    margin-bottom: 12px;
    color: #888;
  }
  
  .upload-text {
    font-size: 14px;
    color: #666;
    margin-bottom: 15px;
  }
  
  .upload-button {
    background-color: #f5f5f7;
    border: none;
    border-radius: 8px;
    padding: 8px 16px;
    font-size: 14px;
    color: #333;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .upload-button:hover {
    background-color: #eaeaea;
  }
  
  .selected-file {
    background-color: #f5f5f7;
    border-radius: 10px;
    padding: 12px 16px;
    margin-bottom: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .file-preview {
    display: flex;
    align-items: center;
  }
  
  .file-icon {
    font-size: 20px;
    margin-right: 12px;
  }
  
  .file-name {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 4px;
  }
  
  .file-size {
    font-size: 12px;
    color: #888;
  }
  
  .remove-file {
    background: none;
    border: none;
    color: #888;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.2s;
  }
  
  .remove-file:hover {
    color: #f1883c;
  }
  
  .upload-actions {
    display: flex;
    justify-content: flex-end;
  }
  
  .action-buttons {
    display: flex;
    gap: 10px;
  }
  
  .send-button {
    display: flex;
    align-items: center;
    background-color: #f1883c;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 10px 20px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    opacity: 0.7;
  }
  
  .send-button.active {
    opacity: 1;
  }
  
  .send-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(241, 136, 60, 0.3);
  }
  
  .send-button:disabled {
    background-color: #ddd;
    cursor: not-allowed;
    opacity: 0.7;
    transform: none;
    box-shadow: none;
  }
  
  .send-text {
    margin-right: 8px;
  }
  
  .send-icon {
    width: 16px;
    height: 16px;
    fill: currentColor;
  }
  
  /* 스크롤바 스타일 */
  .history-section::-webkit-scrollbar {
    width: 6px;
  }
  
  .history-section::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .history-section::-webkit-scrollbar-thumb {
    background-color: #ddd;
    border-radius: 3px;
  }
  
  .history-section::-webkit-scrollbar-thumb:hover {
    background-color: #ccc;
  }
  
  .main-content::-webkit-scrollbar {
    width: 6px;
  }
  
  .main-content::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .main-content::-webkit-scrollbar-thumb {
    background-color: #ddd;
    border-radius: 3px;
  }
  
  .main-content::-webkit-scrollbar-thumb:hover {
    background-color: #ccc;
  }
  
  /* 반응형 디자인 */
  @media (max-width: 768px) {
    .student-ai-tutor-container {
      flex-direction: column;
    }
    
    .sidebar {
      width: 100%;
      height: auto;
      max-height: 40vh;
    }
    
    .greeting-header {
      flex-direction: column;
      text-align: center;
    }
    
    .greeting-illustration {
      display: none;
    }
    
    .quick-actions {
      grid-template-columns: repeat(2, 1fr); /* 모바일에서도 2x2 유지 */
      gap: 15px;
      max-width: 100%;
    }
    
    .quick-action-card {
      padding: 18px;
      height: 90px;
    }
    
    .action-icon {
      font-size: 28px;
    }
    
    .action-text {
      font-size: 16px;
    }
  }
  </style>