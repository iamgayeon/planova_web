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
      <div class="pdf-page-container">
        <canvas ref="pdfCanvas" class="pdf-canvas"></canvas>
        <div ref="textLayer" class="textLayer"></div>
      </div>
    </div>
  </div>
</template>


<script>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
export default {
  name: 'PdfViewer',

  setup() {
    const router = useRouter();
    const route = useRoute();

    const pdfContainer = ref(null);
    const pdfCanvas = ref(null);
    const textLayer = ref(null);
    const pdfName = ref('');
    const currentPage = ref(1);
    const totalPages = ref(0);
    const loading = ref(true);
    const scale = ref(1.0);

    let pdfDoc = null;
    let pageRendering = false;
    let pageNumPending = null;
    let pdfjsLib = window.pdfjsLib;

    // PDF.js 워커 설정
    const setupPdfJs = () => {
      if (!pdfjsLib) {
        console.error('PDF.js 라이브러리가 로드되지 않았습니다.');
        return false;
      }

      // 워커 URL 설정
      pdfjsLib.GlobalWorkerOptions.workerSrc = 
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
      
      return true;
    };

    const goBack = () => {
      router.push('/student/pdf');
    };

    const renderPage = (pageNum) => {
      pageRendering = true;
      loading.value = true;

      pdfDoc.getPage(pageNum).then(function(page) {
        const viewport = page.getViewport({ scale: scale.value });
        const canvas = pdfCanvas.value;
        const canvasContext = canvas.getContext('2d');
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        // 텍스트 레이어 설정
        const textLayerDiv = textLayer.value;
        textLayerDiv.style.height = viewport.height + 'px';
        textLayerDiv.style.width = viewport.width + 'px';
        
        // 캔버스에 페이지 렌더링
        const renderContext = {
          canvasContext: canvasContext,
          viewport: viewport
        };
        
        const renderTask = page.render(renderContext);
        
        // 텍스트 내용 가져오기
        page.getTextContent().then(function(textContent) {
          // 텍스트 레이어 초기화
          textLayerDiv.innerHTML = '';
          
          // 텍스트 레이어 뷰포트 설정
          textLayerDiv.style.left = canvas.offsetLeft + 'px';
          textLayerDiv.style.top = canvas.offsetTop + 'px';
          textLayerDiv.style.height = canvas.height + 'px';
          textLayerDiv.style.width = canvas.width + 'px';
          
          // 텍스트 레이어 렌더링
          // 주의: pdfjsLib.renderTextLayer가 아닌 직접 구현함
          textContent.items.forEach(function(textItem) {
            const tx = pdfjsLib.Util.transform(
              viewport.transform,
              textItem.transform
            );
            
            const fontHeight = Math.sqrt((tx[2] * tx[2]) + (tx[3] * tx[3]));
            const angle = Math.atan2(tx[1], tx[0]);
            
            const textDiv = document.createElement('span');
            textDiv.textContent = textItem.str;
            
            // 스타일 적용
            const style = textDiv.style;
            style.left = tx[4] + 'px';
            style.top = (tx[5] - fontHeight) + 'px';
            style.fontSize = fontHeight + 'px';
            style.fontFamily = textItem.fontName;
            style.transform = 'rotate(' + angle + 'rad)';
            style.position = 'absolute';
            
            // 텍스트가 선택 가능하도록 중요 속성 설정
            style.color = 'transparent';
            style.cursor = 'text';
            style.whiteSpace = 'pre';
            
            textLayerDiv.appendChild(textDiv);
          });
        });
        
        renderTask.promise.then(function() {
          pageRendering = false;
          loading.value = false;
          
          if (pageNumPending !== null) {
            renderPage(pageNumPending);
            pageNumPending = null;
          }
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
      if (!setupPdfJs()) {
        alert('PDF.js 라이브러리를 로드할 수 없습니다.');
        return;
      }

      loading.value = true;

      try {
        if (!fileId) {
          alert('유효한 파일 ID가 없습니다.');
          loading.value = false;
          return;
        }

        const stored = localStorage.getItem(`pdfFile_${fileId}`);

        if (stored) {
          const fileInfo = JSON.parse(stored);
          pdfName.value = fileInfo.name;

          const base64Data = fileInfo.base64.split(',')[1]; // 헤더 제거
          const binary = atob(base64Data);
          const len = binary.length;
          const uint8Array = new Uint8Array(len);

          for (let i = 0; i < len; i++) {
            uint8Array[i] = binary.charCodeAt(i);
          }

          const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
          loadingTask.promise.then(function(pdfDocument) {
            pdfDoc = pdfDocument;
            totalPages.value = pdfDocument.numPages;
            renderPage(1);
          }, function(error) {
            console.error('PDF 로딩 에러:', error);
            alert('PDF를 표시할 수 없습니다: ' + error.message);
            loading.value = false;
          });
        } else {
          alert('PDF 정보를 찾을 수 없습니다.');
          loading.value = false;
        }
      } catch (err) {
        console.error('PDF 로딩 에러:', err);
        alert('PDF를 표시할 수 없습니다: ' + err.message);
        loading.value = false;
      }
    };

    onMounted(() => {
      // PDF.js 라이브러리가 로드됐는지 확인
      if (!window.pdfjsLib) {
        // PDF.js 라이브러리를 동적으로 로드
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js';
        script.onload = () => {
          pdfjsLib = window.pdfjsLib;
          const fileId = route.params.fileId;
          loadPDF(fileId);
        };
        script.onerror = () => {
          alert('PDF.js 라이브러리를 로드할 수 없습니다.');
          loading.value = false;
        };
        document.head.appendChild(script);
      } else {
        pdfjsLib = window.pdfjsLib;
        const fileId = route.params.fileId;
        loadPDF(fileId);
      }
    });

    watch(() => route.params.fileId, (newId) => {
      if (newId && pdfjsLib) {
        loadPDF(newId);
      }
    });
    
    onBeforeUnmount(() => {
      // 메모리 정리
      pdfDoc = null;
    });

    return {
      pdfContainer,
      pdfCanvas,
      textLayer,
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
  display: flex;
  justify-content: center; /* 가로 중앙 정렬 */
  align-items: flex-start; /* 위쪽부터 시작하도록 변경 */
  position: relative;
  padding: 20px;
}

.pdf-page-container {
  position: relative;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: white;
  /* 마진 제거 */
}

.pdf-canvas {
  position: relative; /* absolute 대신 relative 사용 */
  z-index: 1;
}

.textLayer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  opacity: 0.2;
  line-height: 1.0;
  z-index: 2;
  user-select: text;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
}

.textLayer > span {
  color: transparent;
  position: absolute;
  white-space: pre;
  cursor: text;
  transform-origin: 0% 0%;
}

/* 선택된 텍스트의 배경색 */
::selection {
  background: rgba(0, 100, 255, 0.3);
}

/* Chrome, Edge, Safari용 */
::-webkit-selection {
  background: rgba(0, 100, 255, 0.3);
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