
<template>
    <div class="pdf-viewer-container">
      <div class="pdf-header">
        <button class="back-button" @click="goBack">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>뒤로 가기</span>
        </button>
        <h2 class="pdf-title">{{ pdfName }}</h2>
        <div class="pdf-controls">
          <button class="control-button" @click="zoomIn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="11" y1="8" x2="11" y2="14"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </button>
          <button class="control-button" @click="zoomOut">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </button>
          <div class="page-controls">
            <button class="control-button" @click="prevPage" :disabled="currentPage <= 1">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
            <button class="control-button" @click="nextPage" :disabled="currentPage >= totalPages">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <div class="pdf-container" ref="pdfContainer">
        <div class="loading-indicator" v-if="loading">
          <svg class="spinner" width="40" height="40" viewBox="0 0 50 50">
            <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
          </svg>
          <span>PDF 로딩 중...</span>
        </div>
        <canvas ref="pdfCanvas" class="pdf-canvas"></canvas>
      </div>
    </div>
  </template>
   
  <script>
  import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
  export default {
    name: 'PdfViewer',
    
    setup() {
      const router = useRouter();
      const route = useRoute();
      
      const pdfContainer = ref(null);
      const pdfCanvas = ref(null);
      const pdfName = ref('');
      const currentPage = ref(1);
      const totalPages = ref(0);
      const loading = ref(true);
      const scale = ref(1.0);
      
      let pdfDoc = null;
      let pageRendering = false;
      let pageNumPending = null;
      
      const goBack = () => {
        router.push('/student/pdf');
      };
      
      const renderPage = (pageNum) => {
        pageRendering = true;
        
        pdfDoc.getPage(pageNum).then((page) => {
          const viewport = page.getViewport({ scale: scale.value });
          const canvas = pdfCanvas.value;
          const ctx = canvas.getContext('2d');
          
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          const renderContext = {
            canvasContext: ctx,
            viewport: viewport
          };
          
          const renderTask = page.render(renderContext);
          
          renderTask.promise.then(() => {
            pageRendering = false;
            if (pageNumPending !== null) {
              renderPage(pageNumPending);
              pageNumPending = null;
            }
            loading.value = false;
          });
        });

        currentPage.value = pageNum;
      };
      
      const queueRenderPage = (pageNum) => {
        if (pageRendering) {
          pageNumPending = pageNum;
        } else {
          renderPage(pageNum);
        }
      };
      
      const prevPage = () => {
        if (currentPage.value <= 1) return;
        queueRenderPage(currentPage.value - 1);
      };
      
      const nextPage = () => {
        if (currentPage.value >= totalPages.value) return;
        queueRenderPage(currentPage.value + 1);
      };
      
      const zoomIn = () => {
        scale.value += 0.2;
        queueRenderPage(currentPage.value);
      };
      
      const zoomOut = () => {
        if (scale.value > 0.4) {
          scale.value -= 0.2;
          queueRenderPage(currentPage.value);
        }
      };
      
const loadPDF = async (fileId) => {
  loading.value = true;
  
  try {
    const storedFile = localStorage.getItem(`pdfFile_${fileId}`);
    
    if (storedFile) {
      const fileInfo = JSON.parse(storedFile);
      pdfName.value = fileInfo.name || 'PDF 문서';
      
      const url = '/sqld.pdf'; //테스트용
      console.log('PDF 로드 시도:', url);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`PDF 파일을 불러올 수 없습니다 (상태: ${response.status})`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      console.log('PDF 데이터 로드 성공, PDF.js로 파싱 시작');
      
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      pdfDoc = await loadingTask.promise;
      console.log('PDF 파싱 성공, 총 페이지:', pdfDoc.numPages);
      
      totalPages.value = pdfDoc.numPages;
      renderPage(1);
    } else {
      const url = '/sqld.pdf';
      console.log('PDF 로드 시도 (기본 파일):', url);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`PDF 파일을 불러올 수 없습니다 (상태: ${response.status})`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      console.log('PDF 데이터 로드 성공, PDF.js로 파싱 시작');
      
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      pdfDoc = await loadingTask.promise;
      console.log('PDF 파싱 성공, 총 페이지:', pdfDoc.numPages);
      
      totalPages.value = pdfDoc.numPages;
      renderPage(1);
    }
  } catch (error) {
    console.error('PDF 로딩 중 오류 발생:', error);
    console.error('오류 상세:', error.message);
    console.error('스택 트레이스:', error.stack);
    loading.value = false;
    alert('PDF 로딩 중 오류가 발생했습니다: ' + error.message);
  }
};
      
      onMounted(() => {
        const fileId = route.params.fileId;
        loadPDF(fileId);
      });

      watch(() => route.params.fileId, (newId) => {
        if (newId) {
          loadPDF(newId);
        }
      });
      
      return {
        pdfContainer,
        pdfCanvas,
        pdfName,
        currentPage,
        totalPages,
        loading,
        goBack,
        prevPage,
        nextPage,
        zoomIn,
        zoomOut
      };
    }
  };
  </script>
  
  <style scoped>
  .pdf-viewer-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #f5f5f5;
  }
  
  .pdf-header {
    display: flex;
    align-items: center;
    padding: 15px;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: relative;
    z-index: 10;
  }
  
  .back-button {
    display: flex;
    align-items: center;
    background: none;
    border: none;
    color: #333;
    cursor: pointer;
    font-weight: 500;
    padding: 8px 12px;
    border-radius: 6px;
    transition: background-color 0.2s;
  }
  
  .back-button svg {
    margin-right: 8px;
  }
  
  .back-button:hover {
    background-color: #f0f0f0;
  }
  
  .pdf-title {
    flex: 1;
    margin: 0;
    font-size: 18px;
    text-align: center;
    color: #333;
    padding: 0 20px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .pdf-controls {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .control-button {
    background: none;
    border: 1px solid #ddd;
    border-radius: 6px;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    color: #555;
  }
  
  .control-button:hover {
    background-color: #f0f0f0;
    color: #333;
  }
  
  .control-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .page-controls {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-left: 10px;
  }
  
  .page-info {
    font-size: 14px;
    font-weight: 500;
    color: #666;
    min-width: 60px;
    text-align: center;
  }
  
  .pdf-container {
    flex: 1;
    overflow: auto;
    padding: 20px;
    display: flex;
    justify-content: center;
    position: relative;
  }
  
  .pdf-canvas {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    background-color: white;
  }
  
  .loading-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    color: #666;
  }
  
  .spinner {
    animation: rotate 2s linear infinite;
  }
  
  .spinner .path {
    stroke: #4d90fe;
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
  }
  
  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
  
  @keyframes dash {
    0% {
      stroke-dasharray: 1, 150;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -35;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -124;
    }
  }
  </style>