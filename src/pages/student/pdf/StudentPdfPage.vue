<template>
  <div class="student-pdf-container">
    <div class="top-container">
      <div class="tab-container">
        <button 
          class="tab-button" 
          :class="{ 'active': activeTab === 'personal' }"
          @click="activeTab = 'personal'"
        >
          개인
        </button>
        <button 
          class="tab-button" 
          :class="{ 'active': activeTab === 'team' }"
          @click="activeTab = 'team'"
        >
          팀
        </button>
      </div>
      
      <div class="action-icons">
        <button class="action-button" @click="toggleViewMode('list')">
          <img src="@/assets/images/studentpdf-list.png" alt="리스트 보기" class="action-icon">
        </button>
        <button class="action-button" @click="toggleSelectMode">
          <img src="@/assets/images/studentpdf-select.png" alt="선택 모드" class="action-icon">
        </button>
        <button class="action-button" @click="toggleOptionsMenu">
          <img src="@/assets/images/studentpdf-setting.png" alt="삭제 옵션" class="action-icon">
        </button>
      </div>
    </div>
    
    <div class="folder-grid" :class="{ 'list-view': viewMode === 'list' }">
      <div class="folder-item add-folder" @click="handleAddClick">
        <div class="add-icon">
          <span class="plus-icon">+</span>
        </div>
        <div class="folder-name">추가</div>
      </div>

      <div 
        v-for="folder in filteredFolders" 
        :key="folder.id" 
        class="folder-item" 
        :class="{ 'list-view': viewMode === 'list', 'selected': selectMode && selectedItems.includes(folder.id) }"
        @click="selectMode ? toggleItemSelection(folder.id) : openFolder(folder.id)"
      >
        <div class="item-checkbox" v-if="selectMode">
          <input 
            type="checkbox" 
            :checked="selectedItems.includes(folder.id)" 
            @click.stop="toggleItemSelection(folder.id)"
          >
        </div>
        <div class="folder-icon">
          <img src="@/assets/images/studentpdf-folder.png" alt="폴더" class="folder-image">
        </div>
        <div class="folder-name">{{ folder.name }}</div>
      </div>

      <div 
        v-for="file in filteredFiles" 
        :key="file.id" 
        class="folder-item file-item" 
        :class="{ 'list-view': viewMode === 'list', 'selected': selectMode && selectedItems.includes(file.id) }"
        @click="selectMode ? toggleItemSelection(file.id) : openFile(file.id)"
      >
        <div class="item-checkbox" v-if="selectMode">
          <input 
            type="checkbox" 
            :checked="selectedItems.includes(file.id)" 
            @click.stop="toggleItemSelection(file.id)"
          >
        </div>
        <div class="file-icon">
          <img src="@/assets/images/studentpdf-file.png" alt="파일" class="file-image">
        </div>
        <div class="folder-name">{{ file.name }}</div>
      </div>
    </div>

    <div class="folder-modal" v-if="showAddOptions">
      <div class="modal-content options-modal">
        <h3 class="options-title">추가하기</h3>
        <div class="option-buttons">
          <button @click="handleFileUpload" class="option-button">
            <div class="option-icon file-option">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="12" y1="18" x2="12" y2="12"></line>
                <line x1="9" y1="15" x2="15" y2="15"></line>
              </svg>
            </div>
            <div class="option-text">
              <span class="option-title">파일 업로드</span>
              <span class="option-desc">PDF 파일을 업로드합니다</span>
            </div>
          </button>
          <button @click="handleAddFolder" class="option-button">
            <div class="option-icon folder-option">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                <line x1="12" y1="11" x2="12" y2="17"></line>
                <line x1="9" y1="14" x2="15" y2="14"></line>
              </svg>
            </div>
            <div class="option-text">
              <span class="option-title">폴더 생성</span>
              <span class="option-desc">새 폴더를 만듭니다</span>
            </div>
          </button>
        </div>
        <button @click="cancelAddOptions" class="close-options-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>

    <div class="folder-modal" v-if="showFileUploadModal">
      <div class="modal-content upload-modal">
        <h3 class="modal-title">파일 업로드</h3>
        <div class="file-upload-area" :class="{ 'has-file': selectedFile }">
          <input 
            type="file" 
            id="fileUpload" 
            ref="fileInput"
            @change="onFileSelected"
            accept=".pdf"
            class="file-input"
          />
          <label for="fileUpload" class="file-upload-label">
            <div class="upload-icon">
              <svg v-if="!selectedFile" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
            </div>
            <div class="upload-text">
              <span class="upload-title">{{ selectedFile ? '파일이 선택됨' : '파일을 드래그하거나 선택하세요' }}</span>
              <span v-if="!selectedFile" class="upload-desc">PDF 파일만 가능합니다</span>
              <span v-else class="selected-file">{{ selectedFile.name }}</span>
            </div>
          </label>
        </div>
        <div class="modal-buttons">
          <button @click="cancelFileUpload" class="cancel-button">취소</button>
          <button @click="uploadFile" class="create-button" :disabled="!selectedFile">
            <svg v-if="!selectedFile" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <span>업로드</span>
          </button>
        </div>
        <button @click="cancelFileUpload" class="close-modal-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>

    <div class="folder-modal" v-if="showFolderModal">
      <div class="modal-content folder-create-modal">
        <h3 class="modal-title">새 폴더 생성</h3>
        <div class="folder-input-container">
          <div class="folder-icon-preview">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <input 
            type="text" 
            v-model="newFolderName" 
            placeholder="폴더 이름을 입력하세요"
            class="folder-input"
          />
        </div>
        <div class="modal-buttons">
          <button @click="cancelAddFolder" class="cancel-button">취소</button>
          <button @click="createFolder" class="create-button" :disabled="!newFolderName.trim()">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>생성</span>
          </button>
        </div>
        <button @click="cancelAddFolder" class="close-modal-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'StudentPdfPage',
  
  setup() {
    const router = useRouter();
    const activeTab = ref('personal');
    const showAddOptions = ref(false);
    const showFolderModal = ref(false);
    const showFileUploadModal = ref(false);
    const showOptionsMenu = ref(false);
    const newFolderName = ref('');
    const selectedFile = ref(null);
    const fileInput = ref(null);
    const viewMode = ref('grid');
    const selectMode = ref(false);
    const selectedItems = ref([]);
    
    const folders = ref([
      { id: 'school', name: '학교수업', type: 'personal' },
      { id: 'personal', name: '개인공부', type: 'personal' },
      { id: 'project', name: '프로젝트', type: 'personal' }
    ]);
    
    const files = ref([
      { id: 'file-1', name: '수학노트.pdf', type: 'personal' },
      { id: 'file-2', name: '영어과제.pdf', type: 'personal' },
      { id: 'sqld', name: 'SQLD_요약 서브노트.pdf', type: 'personal' }
    ]);

    const filteredFolders = computed(() => {
      return folders.value.filter(folder => folder.type === activeTab.value);
    });
    
    const filteredFiles = computed(() => {
      return files.value.filter(file => file.type === activeTab.value);
    });

    const handleAddClick = () => {
      showAddOptions.value = true;
    };
    
    const cancelAddOptions = () => {
      showAddOptions.value = false;
    };
    
    const handleFileUpload = () => {
      showAddOptions.value = false;
      showFileUploadModal.value = true;
    };

    const handleAddFolder = () => {
      showAddOptions.value = false;
      showFolderModal.value = true;
    };

    const cancelAddFolder = () => {
      showFolderModal.value = false;
      newFolderName.value = '';
    };

    const createFolder = () => {
      if (newFolderName.value.trim() !== '') {
        const newId = 'folder-' + Date.now();
        folders.value.push({
          id: newId,
          name: newFolderName.value.trim(),
          type: activeTab.value
        });
        newFolderName.value = '';
        showFolderModal.value = false;
      }
    };
    
    const onFileSelected = (event) => {
      const files = event.target.files;
      if (files.length > 0) {
        selectedFile.value = files[0];
      }
    };
    
    const cancelFileUpload = () => {
      showFileUploadModal.value = false;
      selectedFile.value = null;
      if (fileInput.value) {
        fileInput.value.value = '';
      }
    };
    
    const uploadFile = () => {
      if (selectedFile.value) {
        const newId = 'file-' + Date.now();
        files.value.push({
          id: newId,
          name: selectedFile.value.name,
          type: activeTab.value,
          data: selectedFile.value
        });
        
        showFileUploadModal.value = false;
        selectedFile.value = null;
        if (fileInput.value) {
          fileInput.value.value = '';
        }
      }
    };

    const toggleViewMode = (mode) => {
      viewMode.value = mode;
    };
    
    const toggleSelectMode = () => {
      selectMode.value = !selectMode.value;
      if (!selectMode.value) {
        selectedItems.value = [];
      }
    };
    
    const toggleOptionsMenu = () => {
      showOptionsMenu.value = !showOptionsMenu.value;
    };
    
    const toggleItemSelection = (itemId) => {
      const index = selectedItems.value.indexOf(itemId);
      if (index === -1) {
        selectedItems.value.push(itemId);
      } else {
        selectedItems.value.splice(index, 1);
      }
    };
    
    const deleteSelectedItems = () => {
      folders.value = folders.value.filter(folder => !selectedItems.value.includes(folder.id));
      files.value = files.value.filter(file => !selectedItems.value.includes(file.id));
      selectedItems.value = [];
      showOptionsMenu.value = false;
    };
    
    const openFolder = (folderId) => {
      console.log(`Opening folder: ${folderId}`);
    };
    
    const openFile = (fileId) => {
console.log(`Opening file: ${fileId}`);
const selectedFile = files.value.find(file => file.id === fileId);

if (selectedFile) {
  if (selectedFile.data) {
    localStorage.setItem(`pdfFile_${fileId}`, JSON.stringify({
      name: selectedFile.name,
      data: selectedFile.data
    }));
  }
  router.push(`/student/pdf/view/${fileId}`);
}
};

    return {
      activeTab,
      showAddOptions,
      showFolderModal,
      showFileUploadModal,
      newFolderName,
      selectedFile,
      fileInput,
      folders,
      files,
      filteredFolders,
      filteredFiles,
      handleAddClick,
      handleFileUpload,
      handleAddFolder,
      cancelAddOptions,
      cancelAddFolder,
      cancelFileUpload,
      createFolder,
      onFileSelected,
      uploadFile,
      openFolder,
      openFile,
      viewMode,
      selectMode,
      selectedItems,
      toggleViewMode,
      toggleSelectMode,
      toggleOptionsMenu,
      toggleItemSelection,
      deleteSelectedItems
    };
  }
};
</script>

<style scoped>
.student-pdf-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.top-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.tab-container {
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  width: fit-content;
}

.action-icons {
  display: flex;
  gap: 10px;
}

.action-button {
  display: flex;
  align-items: center;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 5px;
}

.action-icon {
  width: 40%;
  height: 40px;
  background-color: transparent;
}

.tab-button {
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.tab-button.active {
  background-color: #f8b163;
  color: white;
}

.tab-button:first-child {
  border-radius: 8px 0 0 8px;
}

.tab-button:last-child {
  border-radius: 0 8px 8px 0;
}

.folder-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.folder-grid:not(.list-view) {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
}

.folder-grid.list-view {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.file-type-select {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.folder-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
  width: 100px;
  margin: 0 auto;
  position: relative;
  padding: 8px;
  border-radius: 8px;
}

.folder-item:hover {
  transform: translateY(-3px);
  background-color: #f8f9ff;
}

.folder-item.selected {
  background-color: #e3f2fd;
  border: 1px solid #64b5f6;
}

.folder-item.list-view {
  flex-direction: row;
  width: 100%;
  padding: 10px 15px;
  margin: 0;
  justify-content: flex-start;
  align-items: center;
  gap: 15px;
}

.folder-item.list-view:hover {
  transform: none;
  background-color: #f8f9ff;
}

.folder-item.list-view .folder-name {
  text-align: left;
  font-size: 14px;
}

.item-checkbox {
  position: absolute;
  top: 5px;
  left: 5px;
  z-index: 1;
}

.folder-item.list-view .item-checkbox {
  position: static;
  margin-right: 10px;
}

.folder-icon, .file-icon {
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
}

.folder-image, .file-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.add-icon {
  width: 30px;
  height: 30px;
  background-color: #4d90fe;
  color: white;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
}

.plus-icon {
  font-size: 20px;
  font-weight: bold;
  line-height: 1;
}

.folder-name {
  font-size: 13px;
  text-align: center;
  color: #333;
  max-width: 90px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.folder-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
}

.folder-input {
  width: 100%;
  padding: 10px;
  margin: 15px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.options-modal {
  position: relative;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.options-title {
  text-align: center;
  font-size: 22px;
  margin-bottom: 25px;
  color: #333;
  font-weight: 600;
}

.option-buttons {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 15px 0;
}

.option-button {
  display: flex;
  align-items: center;
  padding: 16px;
  border: none;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  font-size: 16px;
  text-align: left;
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
}

.option-button:hover {
  background-color: #f8f9ff;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
}

.option-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  margin-right: 16px;
}

.file-option {
  background-color: #e3f2fd;
  color: #1976d2;
}

.folder-option {
  background-color: #fff8e1;
  color: #ffb300;
}

.option-icon svg {
  width: 24px;
  height: 24px;
}

.option-text {
  display: flex;
  flex-direction: column;
}

.option-title {
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 4px;
  color: #333;
}

.option-desc {
  font-size: 13px;
  color: #666;
}

.close-options-button {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  padding: 5px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s;
}

.close-options-button:hover {
  background-color: #f5f5f5;
  color: #333;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-button, .create-button {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.cancel-button {
  background-color: #f5f5f5;
  color: #666;
}

.cancel-button:hover {
  background-color: #e8e8e8;
  color: #333;
}

.create-button {
  background-color: #4d90fe;
  color: white;
  box-shadow: 0 2px 5px rgba(77, 144, 254, 0.2);
}

.create-button:hover {
  background-color: #3a7be0;
  box-shadow: 0 4px 8px rgba(77, 144, 254, 0.3);
  transform: translateY(-1px);
}

.create-button:disabled {
  background-color: #a0c3ff;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

/* 모달 공통 스타일 */
.modal-title {
  text-align: center;
  font-size: 22px;
  margin-bottom: 25px;
  color: #333;
  font-weight: 600;
}

.upload-modal, .folder-create-modal {
  position: relative;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.close-modal-button {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  padding: 5px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s;
}

.close-modal-button:hover {
  background-color: #f5f5f5;
  color: #333;
}

/* 파일 업로드 영역 스타일 */
.file-upload-area {
  margin: 20px 0 30px;
  border: 2px dashed #ddd;
  border-radius: 16px;
  padding: 30px;
  text-align: center;
  transition: all 0.3s ease;
}

.file-upload-area:hover {
  border-color: #4d90fe;
  background-color: #f8f9ff;
}

.file-upload-area.has-file {
  border-color: #4caf50;
  background-color: #f1f8e9;
}

.file-input {
  display: none;
}

.file-upload-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-icon {
  width: 60px;
  height: 60px;
  margin-bottom: 15px;
  color: #4d90fe;
}

.file-upload-area.has-file .upload-icon {
  color: #4caf50;
}

.upload-text {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upload-title {
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 6px;
  color: #333;
}

.upload-desc {
  font-size: 14px;
  color: #666;
}

.selected-file {
  margin-top: 10px;
  font-size: 14px;
  color: #4caf50;
  font-weight: 500;
  word-break: break-all;
  max-width: 280px;
}

/* 폴더 생성 스타일 */
.folder-input-container {
  display: flex;
  align-items: center;
  margin: 25px 0 30px;
  background-color: #f8f9ff;
  border-radius: 12px;
  padding: 5px;
  border: 1px solid #e0e0e0;
}

.folder-icon-preview {
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffb300;
  margin: 0 10px;
}

.folder-input {
  flex: 1;
  padding: 12px;
  border: none;
  background: transparent;
  font-size: 16px;
  outline: none;
}

.folder-input::placeholder {
  color: #aaa;
}


@media (max-width: 768px) {
  .folder-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
}
</style>