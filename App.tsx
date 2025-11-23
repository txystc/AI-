import React, { useState } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { Button } from './components/Button';
import { generateRoomWithRug } from './services/geminiService';
import { ImageState, AppStatus } from './types';
import { Wand2, Download, AlertCircle, Home, Layers } from 'lucide-react';

const App: React.FC = () => {
  const [scene, setScene] = useState<ImageState>({ file: null, previewUrl: null });
  const [rug, setRug] = useState<ImageState>({ file: null, previewUrl: null });
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSceneSelect = (file: File) => {
    setScene({ file, previewUrl: URL.createObjectURL(file) });
  };

  const handleRugSelect = (file: File) => {
    setRug({ file, previewUrl: URL.createObjectURL(file) });
  };

  const handleClearScene = () => setScene({ file: null, previewUrl: null });
  const handleClearRug = () => setRug({ file: null, previewUrl: null });

  const handleGenerate = async () => {
    if (!scene.file || !rug.file) return;

    setStatus(AppStatus.LOADING);
    setErrorMessage(null);
    setResultImage(null);

    try {
      const generatedImageBase64 = await generateRoomWithRug(scene.file, rug.file);
      setResultImage(generatedImageBase64);
      setStatus(AppStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setErrorMessage("生成失败，请稍后重试。");
      setStatus(AppStatus.ERROR);
    }
  };

  const handleDownload = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = `ai-rug-design-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const canGenerate = scene.file !== null && rug.file !== null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <Layers size={20} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              AI 软装搭配助手
            </h1>
          </div>
          <div className="text-sm text-slate-500 hidden sm:block">
            Powered by Gemini 2.5 Flash
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Inputs Section */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <Home className="text-indigo-500" size={20} />
                <h2 className="text-lg font-semibold text-slate-800">1. 上传场景</h2>
              </div>
              <div className="h-64">
                <ImageUploader
                  id="scene-upload"
                  label=""
                  subLabel="选择一张客厅或房间图片"
                  imagePreview={scene.previewUrl}
                  onImageSelected={handleSceneSelect}
                  onClear={handleClearScene}
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <Layers className="text-indigo-500" size={20} />
                <h2 className="text-lg font-semibold text-slate-800">2. 上传地毯</h2>
              </div>
              <div className="h-64">
                <ImageUploader
                  id="rug-upload"
                  label=""
                  subLabel="选择地毯纹理或平面图"
                  imagePreview={rug.previewUrl}
                  onImageSelected={handleRugSelect}
                  onClear={handleClearRug}
                />
              </div>
            </div>

            <Button
              className="w-full h-14 text-lg"
              disabled={!canGenerate}
              isLoading={status === AppStatus.LOADING}
              onClick={handleGenerate}
            >
              {status === AppStatus.LOADING ? '正在设计中...' : (
                <>
                  <Wand2 className="mr-2" size={20} />
                  开始生成搭配
                </>
              )}
            </Button>
            
            {status === AppStatus.ERROR && (
               <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
                  <AlertCircle size={20} className="mt-0.5 shrink-0" />
                  <p className="text-sm">{errorMessage}</p>
               </div>
            )}
          </div>

          {/* Result Section */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden h-full min-h-[600px] flex flex-col">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-slate-800">搭配效果预览</h2>
                {resultImage && (
                  <Button variant="secondary" onClick={handleDownload} className="py-2 px-4 text-sm h-10">
                    <Download size={16} className="mr-2" />
                    下载图片
                  </Button>
                )}
              </div>
              
              <div className="flex-grow bg-slate-100 relative flex items-center justify-center p-4">
                {status === AppStatus.LOADING && (
                  <div className="text-center">
                    <div className="inline-block relative w-20 h-20">
                      <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-200 rounded-full animate-pulse"></div>
                      <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <p className="mt-6 text-slate-600 font-medium">AI 正在分析空间结构并铺设地毯...</p>
                    <p className="mt-2 text-slate-400 text-sm">这可能需要几秒钟时间</p>
                  </div>
                )}

                {status === AppStatus.IDLE && !resultImage && (
                  <div className="text-center max-w-sm mx-auto p-8">
                    <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-300">
                      <Wand2 size={40} />
                    </div>
                    <h3 className="text-xl font-medium text-slate-700 mb-2">准备就绪</h3>
                    <p className="text-slate-500">
                      请在左侧上传场景图和地毯图，点击生成按钮查看 AI 设计效果。
                    </p>
                  </div>
                )}

                {resultImage && (
                  <img 
                    src={resultImage} 
                    alt="Generated Room" 
                    className="w-full h-full object-contain max-h-[800px] rounded-lg shadow-sm animate-fade-in"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;